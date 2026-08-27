// ============================================================
//  L'ADVERSAIRE
//  Toutes les 0,7 seconde il prend UNE décision. Il ne triche
//  pas : il paie les mêmes prix et suit les mêmes règles que
//  le joueur. Sa difficulté ne change que son revenu et son
//  appétit (voir reglages.js).
//
//  Ce qui le rend « malin », ce n'est pas de deviner l'avenir,
//  c'est de regarder DEUX choses avant d'acheter :
//    1. de quoi est faite SON armée (lui manque-t-il des
//       tireurs ? un gros ?) ;
//    2. de quoi est faite celle d'EN FACE (que du corps à
//       corps ? beaucoup d'archers ?).
//  Il en déduit la troupe qui manque le plus, au lieu de
//  reprendre toujours la même.
// ============================================================

import { R, coutRevenu, coutDefense, coutReparation } from '../data/reglages.js';
import { AGES } from '../data/ages.js';
import { etat, autre } from './etat.js';
import { acheterUnite, ameliorerRevenu, evoluer, peutEvoluer, assezXpPourEvoluer,
         coutEvolution, lancerSpecial, coutSpecial,
         acheterTourelle, coutTourelle,
         ameliorerDefense, reparer } from './combat.js';

// `camp` est un paramètre pour qu'on puisse faire jouer l'IA des deux côtés
// quand on teste l'équilibrage en accéléré (voir docs/tests.md).
export function majIA(dt, camp = etat.camps.ennemi) {
  if (!camp) return;
  camp.iaTimer -= dt;
  if (camp.iaTimer > 0) return;
  camp.iaTimer = R.ia.reflexion;

  const info = analyser(camp);

  // 1. Changer d'âge : c'est toujours le meilleur coup possible.
  if (peutEvoluer(camp)) { evoluer(camp); return; }

  // 2. L'attaque spéciale, seulement quand elle est rentable.
  if (specialInteressante(camp, info) && lancerSpecial(camp)) return;

  // 3. Réparer quand le château est vraiment entamé. Payer pour rester debout
  //    passe avant tout le reste : un château à zéro, c'est la partie perdue.
  if (camp.pv < camp.pvMax * 0.55) {
    const marge = info.enDanger ? 1 : 1.5;   // sous pression on ne marchande pas
    if (camp.or >= coutReparation(camp) * marge && reparer(camp)) return;
  }

  if (camp.file.length >= R.fileMax) return;

  // 4. L'expérience est là mais pas l'or : on serre les dents et on économise.
  //    Chaque pièce mise de côté rapproche du changement d'âge, qui vaut bien
  //    plus qu'un fantassin de plus. On ne rouvre la bourse que si le château
  //    est vraiment menacé.
  if (assezXpPourEvoluer(camp) && camp.or < coutEvolution(camp)) {
    if (info.enDanger) {
      const index = choisirUnite(camp, info);
      if (index >= 0) acheterUnite(camp, index);
    }
    return;
  }

  // 5. Investir : le revenu, les murs, les tourelles.
  if (veutRevenu(camp, info)) { ameliorerRevenu(camp); return; }
  if (veutDefense(camp, info)) { ameliorerDefense(camp); return; }
  if (veutTourelle(camp, info)) { acheterTourelle(camp); return; }
  if (epargnePourTourelle(camp, info)) return;

  // 6. Ligne bloquée : on prépare une vraie vague.
  if (prepareUneVague(camp, info)) return;

  // 7. Composer son armée.
  const index = choisirUnite(camp, info);
  if (index >= 0) acheterUnite(camp, index);
}

// ------------------------------------------------------------
//  Les vagues
//  Deux armées équivalentes qui se touchent au milieu ne bougent
//  plus : chaque troupe envoyée seule meurt seule. La bonne
//  réponse est d'arrêter de nourrir la mêlée, de mettre de côté,
//  puis de lâcher quatre troupes d'un coup. C'est ce que fait un
//  joueur humain, et c'est ce qui débloque une partie.
//  Renvoie true tant qu'il faut économiser.
// ------------------------------------------------------------

function prepareUneVague(camp, info) {
  if (info.enDanger) { camp.assaut = 0; camp.blocage = 0; return false; }

  // Déjà en train d'économiser pour une vague ?
  if (camp.assaut > 0) {
    if (camp.or < camp.assaut) return true;    // pas encore : on serre la bourse
    camp.assaut = 0;                           // la vague part maintenant
    return false;
  }

  const bloque = !info.onPousse && info.menace >= 2
              && Math.abs(info.nos - info.menace) <= 2;
  camp.blocage = bloque ? camp.blocage + 1 : 0;

  // ~14 secondes de statu quo : on décroche pour préparer le paquet.
  if (camp.blocage >= 20 && camp.file.length === 0) {
    const u = AGES[camp.age].unites;
    camp.assaut = Math.round((u[2].cout + u[1].cout * 2) * camp.patience);
    camp.blocage = 0;
    return true;
  }
  return false;
}

// ------------------------------------------------------------
//  Regarder le terrain
// ------------------------------------------------------------

function analyser(camp) {
  const adverse = etat.camps[autre(camp.id)];
  const info = {
    nos: 0, menace: 0,
    proche: Infinity,        // distance du plus proche ennemi à NOTRE château
    avance: Infinity,        // distance de notre troupe la plus avancée à LEUR château
    nosParRole: [0, 0, 0],   // 0 = corps à corps, 1 = distance, 2 = lourde
    ennemiParRole: [0, 0, 0],
  };

  for (const u of etat.unites) {
    if (u.mort) continue;
    const role = u.def.role || 0;
    if (u.camp === camp.id) {
      info.nos++;
      info.nosParRole[role]++;
      info.avance = Math.min(info.avance, Math.abs(u.x - adverse.x));
    } else {
      info.menace++;
      info.ennemiParRole[role]++;
      info.proche = Math.min(info.proche, Math.abs(u.x - camp.x));
    }
  }
  // Les troupes encore à l'entraînement comptent déjà : sinon on commande
  // trois fois de suite la même chose en attendant qu'elle sorte.
  for (const f of camp.file) info.nosParRole[f.def.role || 0]++;

  info.enDanger = info.proche < 420 || camp.pv < camp.pvMax * 0.45;
  info.onPousse = info.avance < 380;
  return info;
}

// ------------------------------------------------------------
//  Choisir la troupe qui manque
// ------------------------------------------------------------

// La composition visée dépend de ce qu'il y a EN FACE, plus le tempérament
// que ce camp a tiré au sort au début de la partie.
function compositionVoulue(camp, info) {
  const e = info.ennemiParRole;
  const total = e[0] + e[1] + e[2];
  let voulu;
  if (total === 0)          voulu = [0.45, 0.35, 0.20];  // rien en face : on prépare une poussée
  else if (e[0] / total > 0.60) voulu = [0.35, 0.50, 0.15];  // que du corps à corps : on les fauche avant le contact
  else if (e[1] / total > 0.45) voulu = [0.45, 0.25, 0.30];  // beaucoup de tireurs : du gros pour encaisser
  else if (e[2] / total > 0.30) voulu = [0.30, 0.55, 0.15];  // du lourd en face : des tireurs pour l'user
  else                      voulu = [0.45, 0.40, 0.15];  // un mur, des tireurs derrière, un gros de temps en temps
  return voulu.map((v, i) => Math.max(0.05, v + camp.gout[i]));
}

function choisirUnite(camp, info) {
  const unites = AGES[camp.age].unites;
  const abordables = [];
  for (let i = 0; i < unites.length; i++) {
    if (unites[i].cout <= camp.or) abordables.push(i);
  }
  if (!abordables.length) return -1;

  // Débordé : on bouche le trou avec ce qui sort le plus vite, tant pis pour le plan.
  if (info.enDanger && info.menace > info.nos + 1) return abordables[0];

  // Terrain saturé : une troupe de plus ferait la queue sans jamais taper.
  // Mieux vaut garder l'or pour le revenu, une tourelle ou le prochain âge.
  if (info.nos >= R.ia.armeeMax && !info.enDanger) return -1;

  // Terrain calme : on attend d'avoir de quoi sortir un VRAI groupe
  // (un fantassin et un tireur) plutôt que d'envoyer les troupes une par une
  // se faire tuer isolées.
  if (info.menace === 0 && !info.onPousse && camp.file.length === 0
      && camp.or < (unites[0].cout + unites[1].cout) * camp.patience) return -1;

  const voulu = compositionVoulue(camp, info);
  const total = info.nosParRole[0] + info.nosParRole[1] + info.nosParRole[2];

  let choix = -1, plusGrandManque = -Infinity;
  for (const i of abordables) {
    const role = unites[i].role;
    const part = total ? info.nosParRole[role] / total : 0;
    const manque = voulu[role] - part;
    if (manque > plusGrandManque) { plusGrandManque = manque; choix = i; }
  }
  return choix;
}

// ------------------------------------------------------------
//  Les autres dépenses
// ------------------------------------------------------------

function specialInteressante(camp, info) {
  if (camp.specialRecharge > 0 || info.menace === 0) return false;
  if (camp.or < coutSpecial(camp)) return false;
  if (info.enDanger && info.menace >= 2) return true;          // pour se sauver
  return info.menace >= 3 && camp.or >= coutSpecial(camp) * 1.6;  // pour casser un paquet
}

function veutRevenu(camp, info) {
  if (camp.revenuNiveau >= 11) return false;
  const prix = coutRevenu(camp);
  if (camp.or < prix || info.enDanger) return false;
  if (camp.revenuNiveau < 4) return true;              // les premiers niveaux sont trop rentables pour les rater
  if (camp.or >= prix * 1.8) return true;              // assez riche pour investir ET produire
  return info.menace <= 1 && Math.random() < 0.6 / camp.agressivite;
}

function veutDefense(camp, info) {
  const prix = coutDefense(camp);
  if (prix === Infinity || camp.or < prix) return false;
  // Sous pression, épaissir les murs vaut n'importe quelle troupe.
  if (info.enDanger) return true;
  // Sinon c'est un luxe : seulement quand le revenu tourne et qu'on est à l'aise.
  return camp.revenuNiveau >= 3 && camp.or >= prix * 2;
}

function veutTourelle(camp, info) {
  const prix = coutTourelle(camp);
  if (prix === Infinity || camp.or < prix) return false;
  const posees = camp.tourelles.filter(Boolean).length;
  if (posees === 0) return true;                       // la première, toujours
  if (info.enDanger) return true;                      // on se fait pousser : il faut du mur
  if (info.menace >= 2 && camp.or >= prix * 1.3) return true;
  return camp.or >= prix * 1.8;
}

function epargnePourTourelle(camp, info) {
  const prix = coutTourelle(camp);
  if (prix === Infinity || info.enDanger) return false;
  const posees = camp.tourelles.filter(Boolean).length;
  return posees === 0 && camp.or >= prix * 0.6;        // on met de côté au lieu d'aligner une troupe de plus
}

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
  camp.iaTimer = camp.reflexion || R.ia.reflexion;

  const info = analyser(camp);

  // Le château est sur le point de tomber : on arrête d'économiser pour quoi
  // que ce soit. Une troupe qui sort MAINTENANT vaut mieux qu'un plan pour
  // dans trente secondes — sans ça, l'IA pouvait mourir la bourse pleine.
  const desespere = camp.pv < camp.pvMax * 0.3;

  // 1. Changer d'âge : c'est toujours le meilleur coup possible.
  if (peutEvoluer(camp)) { evoluer(camp); return; }

  // 2. L'attaque spéciale : c'est L'outil pour se sortir d'un mauvais pas.
  if (specialInteressante(camp, info) && lancerSpecial(camp)) return;

  // 3. Réparer quand le château est vraiment entamé. Payer pour rester debout
  //    passe avant tout le reste : un château à zéro, c'est la partie perdue.
  if (camp.pv < camp.pvMax * 0.55) {
    const marge = info.enDanger ? 1 : 1.5;   // sous pression on ne marchande pas
    if (camp.or >= coutReparation(camp) * marge && reparer(camp)) return;
  }

  // 4. Assiégé : une tourelle est le meilleur or dépensé. Elle tire tout de
  //    suite, elle ne peut pas mourir, et elle ne traverse pas le terrain.
  if (info.enDanger && veutTourelle(camp, info)) { acheterTourelle(camp); return; }

  // 5. Assiégé et la spéciale est chargée mais impayable : ON ÉCONOMISE POUR
  //    ELLE. C'est le cœur du problème d'avant — l'IA rachetait un fantassin
  //    à chaque décision, restait fauchée, et ne lançait donc jamais le sort
  //    qui l'aurait sauvée. Une troupe isolée ne change rien à un siège ; la
  //    spéciale nettoie le terrain d'un coup.
  if (!desespere && epargnePourSpecial(camp, info)) return;

  if (camp.file.length >= R.fileMax) return;

  // 6. L'expérience est là mais pas l'or : on serre les dents et on économise.
  //    Chaque pièce mise de côté rapproche du changement d'âge, qui vaut bien
  //    plus qu'un fantassin de plus.
  if (!desespere && assezXpPourEvoluer(camp)
      && camp.or < coutEvolution(camp) && !info.enDanger) return;

  // 7. Investir : le revenu, les murs, les tourelles.
  //    MAIS PAS SI LE TERRAIN D'EN FACE EST VIDE. Dans ce cas chaque troupe
  //    envoyée traverse tranquillement et va taper le château : c'est le
  //    meilleur or dépensé du jeu. Sans cette exception, l'ordinateur passait
  //    les trente premières secondes à empiler du revenu et des tourelles
  //    pendant qu'un joueur qui économisait aussi ne voyait rien se passer —
  //    et rester passif ne coûtait rien à personne.
  const occasion = info.menace === 0
                && (info.nos + camp.file.length) < R.ia.pousseeLibre;
  if (!occasion) {
    if (veutRevenu(camp, info)) { ameliorerRevenu(camp); return; }
    if (veutDefense(camp, info)) { ameliorerDefense(camp); return; }
    if (veutTourelle(camp, info)) { acheterTourelle(camp); return; }
    if (!desespere && epargnePourTourelle(camp, info)) return;
  }

  // 8. Assiégé : réunir de quoi contre-attaquer à plusieurs.
  if (!desespere && prepareUneRiposte(camp, info)) return;

  // 9. Ligne bloquée : on prépare une vraie vague.
  if (!desespere && prepareUneVague(camp, info)) return;

  // 10. Composer son armée.
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

  // Débordé : on prend ce qui sort le plus vite… sauf si ce qui nous écrase,
  // ce sont des TIREURS. Un fantassin envoyé seul meurt avant même de les
  // atteindre : dans ce cas on répond avec nos propres tireurs, qui tapent
  // d'aussi loin qu'eux.
  if (info.enDanger && info.menace > info.nos + 1) {
    const aDistance = info.ennemiParRole[1] + info.ennemiParRole[2];
    const auContact = info.ennemiParRole[0];
    if (aDistance > auContact && abordables.includes(1)) return 1;
    return abordables[0];
  }

  // Terrain saturé : une troupe de plus ferait la queue sans jamais taper.
  // Mieux vaut garder l'or pour le revenu, une tourelle ou le prochain âge.
  if (info.nos >= R.ia.armeeMax && !info.enDanger) return -1;

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

// Assiégé, la spéciale chargée mais trop chère : on ferme la bourse jusqu'à
// pouvoir la payer. Mieux vaut dix secondes sans rien acheter qu'un fantassin
// jeté dans la mêlée toutes les dix secondes.
function epargnePourSpecial(camp, info) {
  if (camp.specialRecharge > 0) return false;
  if (!info.enDanger || info.menace < 2) return false;
  return camp.or < coutSpecial(camp);
}

// Assiégé et en infériorité : on réunit de quoi sortir un vrai paquet
// (deux fantassins et un tireur) au lieu d'alimenter la mêlée un par un.
function prepareUneRiposte(camp, info) {
  if (!info.enDanger || info.menace <= info.nos) { camp.riposte = 0; return false; }

  if (camp.riposte > 0) {
    if (camp.or < camp.riposte) return true;   // on économise encore
    camp.riposte = 0;                          // la riposte part : on achète sans retenue
    return false;
  }
  // On ne relance une épargne que si le terrain est vide de notre côté :
  // sinon on couperait une contre-attaque déjà en cours.
  if (camp.file.length === 0 && info.nos <= 1) {
    const u = AGES[camp.age].unites;
    camp.riposte = Math.round(u[0].cout * 2 + u[1].cout);
    return true;
  }
  return false;
}

function veutRevenu(camp, info) {
  if (camp.revenuNiveau >= (camp.revenuMaxIA || R.ia.revenuMax)) return false;
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

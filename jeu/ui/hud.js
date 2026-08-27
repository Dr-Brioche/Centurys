// ============================================================
//  L'INTERFACE : barres du haut, bourse, file d'entraînement
//  et boutons du bas. Tout est en HTML/CSS (donc net et
//  redimensionné avec le reste), le canvas ne sert qu'au jeu.
//  Chaque bouton a sa touche clavier : jouable à la souris
//  OU au clavier, sans exception.
//
//  ⚠ PIÈGE DÉJÀ PAYÉ — ON NE RÉÉCRIT JAMAIS innerHTML À CHAQUE IMAGE.
//  Un bouton dont on remplace les enfants 60 fois par seconde PERD LES CLICS.
//  Le navigateur ne déclenche un clic que si l'appui et le relâchement
//  tombent sur le même élément ; or un joueur garde le doigt appuyé une
//  bonne centaine de millisecondes, soit une dizaine d'images. Si on appuie
//  sur le mot « Revenu » et que ce mot a été détruit et recréé entre-temps,
//  le clic est perdu. Mesuré : 0 clic sur 10 pris en compte au centre du
//  bouton (les bords, eux, touchent le <button> lui-même, qui ne bouge pas,
//  et marchaient — d'où l'impression que « ça marche une fois sur deux »).
//  → Les morceaux de chaque bouton sont construits UNE fois, puis on ne
//    change que leur TEXTE (voir preparerAction / ecrire plus bas).
// ============================================================

import { R, coutRevenu, revenuDe, coutDefense, coutReparation } from '../data/reglages.js';
import { AGES, xpPourEvoluer } from '../data/ages.js';
import { etat } from '../systems/etat.js';
import { t, nomDe } from '../systems/langue.js';
import { acheterUnite, ameliorerRevenu, evoluer, peutEvoluer, lancerSpecial,
         annulerDernier, acheterTourelle, coutTourelle,
         assezXpPourEvoluer, coutEvolution,
         ameliorerDefense, reparer } from '../systems/combat.js';
import { dessinerUnite } from '../rendu/unites.js';
import { basculerSon, sonCoupe } from '../core/sons.js';
import { message } from './messages.js';

const el = {};
const morceaux = {};   // les bouts de texte de chaque bouton, gardés d'une image à l'autre
let ageAffiche = -1;
let langueAffichee = '';

export function initHud() {
  const id = n => document.getElementById(n);
  Object.assign(el, {
    or: id('orTxt'), revenu: id('revenuTxt'),
    viePj: id('viePj'), viePjTxt: id('viePjTxt'),
    vieIa: id('vieIa'), vieIaTxt: id('vieIaTxt'),
    ageNom: id('ageNom'), xpBarre: id('xpBarre'), xpTxt: id('xpTxt'),
    unites: id('unites'), file: id('file'),
    btRevenu: id('btRevenu'), btDefense: id('btDefense'), btReparer: id('btReparer'),
    btTourelle: id('btTourelle'),
    btEvoluer: id('btEvoluer'), btSpecial: id('btSpecial'),
    btPause: id('btPause'), btSon: id('btSon'),
  });

  el.btRevenu.addEventListener('click', () => ameliorerRevenu(etat.camps.joueur));
  el.btDefense.addEventListener('click', () => ameliorerDefense(etat.camps.joueur));
  el.btReparer.addEventListener('click', () => reparer(etat.camps.joueur));
  el.btTourelle.addEventListener('click', () => acheterTourelle(etat.camps.joueur));
  el.btEvoluer.addEventListener('click', () => evoluer(etat.camps.joueur));
  el.btSpecial.addEventListener('click', () => lancerSpecial(etat.camps.joueur));
  el.btSon.addEventListener('click', () => {
    const coupe = basculerSon();
    message(coupe ? 'info.sonCoupe' : 'info.sonActif');
    majBoutonSon();
  });
  // Squelette de chaque bouton d'action : construit une fois pour toutes.
  morceaux.revenu   = preparerAction(el.btRevenu,   '4', '▲');
  morceaux.defense  = preparerAction(el.btDefense,  '5', '▦');
  morceaux.reparer  = preparerAction(el.btReparer,  'R', '✚');
  morceaux.tourelle = preparerAction(el.btTourelle, 'T', '♜');
  morceaux.evoluer  = preparerAction(el.btEvoluer,  'E', '✦');
  morceaux.special  = preparerAction(el.btSpecial,  'A', '☄');

  majBoutonSon();

  // Un changement de langue oblige à réécrire les boutons.
  document.addEventListener('langue-changee', () => { langueAffichee = ''; });
}

// Construit le squelette d'un bouton d'action et rend ses morceaux, pour
// qu'on n'ait plus jamais qu'à changer leur texte.
function preparerAction(bouton, touche, icone) {
  bouton.textContent = '';
  const mk = (balise, classe, texte) => {
    const e = document.createElement(balise);
    if (classe) e.className = classe;
    if (texte !== undefined) e.textContent = texte;
    return e;
  };
  const parts = {
    touche: mk('span', 'touche', touche),
    icone: mk('span', 'icone', icone),
    nom: mk('b', null, ''),
    prix: mk('span', 'prix', ''),
    bas: mk('small', null, ''),
    jauge: mk('span', 'recharge'),
  };
  parts.jauge.style.width = '0%';
  bouton.append(parts.touche, parts.icone, parts.nom, parts.prix, parts.bas, parts.jauge);
  return parts;
}

// N'écrit que si le texte a vraiment changé : on ne touche pas au DOM pour rien.
function ecrire(element, texte) {
  const valeur = String(texte);
  if (element.textContent !== valeur) element.textContent = valeur;
}

export function majBoutonSon() {
  if (el.btSon) el.btSon.textContent = sonCoupe() ? '✕' : '♪';
}

// ------------------------------------------------------------
//  Les trois boutons de troupes (reconstruits à chaque âge)
// ------------------------------------------------------------

function construireBoutonsUnites(camp) {
  el.unites.innerHTML = '';
  AGES[camp.age].unites.forEach((def, i) => {
    const b = document.createElement('button');
    b.className = 'unite';
    b.dataset.index = String(i);
    b.title = infobulle(def);

    const touche = document.createElement('span');
    touche.className = 'touche';
    touche.textContent = String(i + 1);

    const cv = document.createElement('canvas');
    cv.className = 'apercu';
    cv.width = 112; cv.height = 112;

    const nom = document.createElement('span');
    nom.className = 'nom';
    nom.textContent = nomDe(def);

    const prix = document.createElement('span');
    prix.className = 'prix';
    prix.textContent = def.cout;

    b.append(touche, cv, nom, prix);
    b.addEventListener('click', () => acheterUnite(etat.camps.joueur, i));
    el.unites.appendChild(b);
    dessinerApercu(cv, def);
  });
}

function infobulle(def) {
  const type = def.type === 'distance' ? t('stat.distance') : t('stat.corpsACorps');
  return nomDe(def) + ' (' + type + ')'
    + '\n' + t('stat.cout') + ' : ' + def.cout
    + '\n' + t('stat.pv') + ' : ' + def.pv
    + '\n' + t('stat.degats') + ' : ' + def.degats
    + '\n' + t('stat.portee') + ' : ' + Math.round(def.portee)
    + '\n' + t('stat.vitesse') + ' : ' + Math.round(def.vitesse);
}

function dessinerApercu(canvas, def) {
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const echelle = Math.min((canvas.width * 0.78) / def.largeur,
                           (canvas.height * 0.86) / def.hauteur);
  dessinerUnite(ctx, def, 'joueur', canvas.width / 2, canvas.height * 0.95,
                { echelle, phase: 0, ombre: false });
}

// ------------------------------------------------------------
//  Mise à jour, appelée à chaque image
// ------------------------------------------------------------

export function majHud() {
  const j = etat.camps.joueur, e = etat.camps.ennemi;
  if (!j || !e) return;

  if (j.age !== ageAffiche || langueAffichee !== document.documentElement.lang) {
    ageAffiche = j.age;
    langueAffichee = document.documentElement.lang;
    construireBoutonsUnites(j);
    for (const c of el.file.children) c.dataset.unite = '';   // bulles à retraduire
  }

  // Bourse
  el.or.textContent = Math.floor(j.or);
  el.revenu.textContent = '+' + revenuDe(j).toFixed(1) + '/s';

  // Châteaux
  el.viePj.style.width = (100 * j.pv / j.pvMax) + '%';
  el.viePjTxt.textContent = Math.ceil(j.pv) + ' / ' + j.pvMax;
  el.vieIa.style.width = (100 * e.pv / e.pvMax) + '%';
  el.vieIaTxt.textContent = Math.ceil(e.pv) + ' / ' + e.pvMax
                          + '  ·  ' + nomDe(AGES[e.age]);

  // Âge et expérience
  el.ageNom.textContent = nomDe(AGES[j.age]);
  const requis = xpPourEvoluer(j.age);
  if (requis === null) {
    el.xpBarre.style.width = '100%';
    el.xpTxt.textContent = t('hud.ageMax');
  } else {
    el.xpBarre.style.width = Math.min(100, 100 * j.xp / requis) + '%';
    el.xpTxt.textContent = t('hud.evolution') + ' : ' + Math.floor(j.xp) + ' / ' + requis;
  }

  // Boutons de troupes
  const unites = AGES[j.age].unites;
  for (const b of el.unites.children) {
    const def = unites[+b.dataset.index];
    b.disabled = (j.or < def.cout) || (j.file.length >= R.fileMax);
  }

  majBoutonRevenu(j);
  majBoutonDefense(j);
  majBoutonReparer(j);
  majBoutonTourelle(j);
  majBoutonEvoluer(j, requis);
  majBoutonSpecial(j);
  majFile(j);
}

function majBoutonRevenu(j) {
  const m = morceaux.revenu;
  const max = j.revenuNiveau >= R.revenuMax;
  const prix = coutRevenu(j);
  ecrire(m.nom, t('bouton.revenu'));
  ecrire(m.prix, max ? t('bouton.max') : prix);
  ecrire(m.bas, t('bouton.revenuNiv', { n: j.revenuNiveau + 1 }));
  el.btRevenu.disabled = max || j.or < prix;
  el.btRevenu.title = t('bouton.revenu') + ' : +' + R.revenuPas.toFixed(2) + '/s';
}

// Épaissir les murs : chaque niveau ajoute des PV maximum, et les donne
// tout de suite (la barre de vie monte d'autant).
function majBoutonDefense(j) {
  const m = morceaux.defense;
  const prix = coutDefense(j);
  const max = prix === Infinity;
  const gain = Math.round(R.pvChateau * R.defensePas);
  ecrire(m.nom, t('bouton.defense'));
  ecrire(m.prix, max ? t('bouton.max') : prix);
  ecrire(m.bas, t('bouton.revenuNiv', { n: j.defenseNiveau + 1 }));
  el.btDefense.disabled = max || j.or < prix;
  el.btDefense.title = t('bouton.defense') + '\n'
    + t('stat.pvMax') + ' : ' + j.pvMax + '\n' + t('stat.gainPv', { n: gain });
}

// Réparer : rend un quart des PV maximum. Le prix monte avec l'âge.
function majBoutonReparer(j) {
  const prix = coutReparation(j);
  const gain = Math.round(Math.min(j.pvMax - j.pv, j.pvMax * R.reparerPart));
  const intact = j.pv >= j.pvMax;
  const possible = !intact && j.or >= prix;
  const m = morceaux.reparer;
  ecrire(m.nom, t('bouton.reparer'));
  ecrire(m.prix, prix);
  ecrire(m.bas, t('stat.gainPv', { n: gain }));
  el.btReparer.disabled = !possible;
  // Le bouton s'allume en rouge quand le château est vraiment entamé :
  // c'est là qu'il faut y penser, pas avant.
  el.btReparer.classList.toggle('urgent', possible && j.pv < j.pvMax * 0.6);
  el.btReparer.title = t('bouton.reparer') + '\n'
    + t('stat.cout') + ' : ' + prix + '\n' + t('stat.gainPv', { n: gain });
}

function majBoutonTourelle(j) {
  const def = AGES[j.age].tourelle;
  const prix = coutTourelle(j);
  const posees = j.tourelles.filter(Boolean).length;
  const misAJour = posees >= R.tourellesMax && prix !== Infinity;
  const m = morceaux.tourelle;
  ecrire(m.nom, t(misAJour ? 'bouton.ameliorer' : 'bouton.tourelle'));
  ecrire(m.prix, prix === Infinity ? t('bouton.max') : prix);
  ecrire(m.bas, posees + ' / ' + R.tourellesMax);
  el.btTourelle.disabled = prix === Infinity || j.or < prix;
  el.btTourelle.title = nomDe(def)
    + '\n' + t('stat.degats') + ' : ' + def.degats
    + '\n' + t('stat.portee') + ' : ' + def.portee
    + '\n' + t('stat.cadence') + ' : ' + def.cadence + ' s'
    + (posees < R.tourellesMax
        ? '\n' + t('stat.emplacement', { n: posees + 1, max: R.tourellesMax })
        : '');
}

// Changer d'âge coûte de l'or ET de l'expérience : le bouton affiche le prix
// en or, et sous celui-ci l'expérience qu'il reste à gagner (ou le nom du
// prochain âge quand l'expérience est déjà là).
function majBoutonEvoluer(j, requis) {
  const dernier = requis === null;
  const prix = coutEvolution(j);
  const assezXp = assezXpPourEvoluer(j);
  const pret = peutEvoluer(j);
  const m = morceaux.evoluer;
  ecrire(m.nom, t('bouton.evoluer'));
  ecrire(m.prix, dernier ? t('bouton.max') : prix);
  ecrire(m.bas, dernier ? ''
      : (assezXp ? nomDe(AGES[j.age + 1])
                 : Math.floor(j.xp) + ' / ' + requis + ' ' + t('hud.xpCourt')));
  el.btEvoluer.disabled = !pret;
  el.btEvoluer.classList.toggle('pret', pret);
  el.btEvoluer.title = dernier ? t('hud.ageMax')
    : nomDe(AGES[j.age + 1]) + '\n' + prix + ' ' + t('hud.or').toLowerCase()
      + ' + ' + requis + ' ' + t('hud.xpCourt');
}

function majBoutonSpecial(j) {
  const sp = AGES[j.age].special;
  const chargee = j.specialRecharge <= 0;
  const pret = chargee && j.or >= sp.cout;
  const m = morceaux.special;
  ecrire(m.nom, nomDe(sp));
  ecrire(m.prix, sp.cout);
  ecrire(m.bas, chargee ? t('bouton.pret')
                        : t('hud.secondes', { n: Math.ceil(j.specialRecharge) }));
  m.jauge.style.width = chargee ? '0%'
    : (100 * (1 - j.specialRecharge / sp.recharge)) + '%';
  el.btSpecial.disabled = !pret;
  el.btSpecial.classList.toggle('pret', pret);
  el.btSpecial.title = nomDe(sp) + '\n' + t('stat.degats') + ' : ' + sp.degats
    + '\n' + t('stat.cout') + ' : ' + sp.cout;
}

// Même règle que pour les boutons : on ne reconstruit pas la file à chaque
// troupe qui sort, sinon un clic d'annulation tombe dans le vide. On ajuste
// juste le nombre de cases et on ne redessine une case que si elle change
// d'unité.
function majFile(j) {
  const cases = el.file.children;
  while (cases.length > j.file.length) el.file.removeChild(el.file.lastChild);
  while (cases.length < j.file.length) el.file.appendChild(creerCaseFile());

  j.file.forEach((entree, i) => {
    const c = cases[i];
    if (c.dataset.unite !== entree.def.id) {
      c.dataset.unite = entree.def.id;
      c.title = nomDe(entree.def);
      dessinerApercu(c.querySelector('canvas'), entree.def);
    }
    const barre = c.querySelector('.progres');
    barre.style.width = (i === 0 ? 100 * (1 - entree.restant / entree.total) : 0) + '%';
  });
}

function creerCaseFile() {
  const c = document.createElement('div');
  c.className = 'case';
  const cv = document.createElement('canvas');
  cv.width = 92; cv.height = 92;
  const progres = document.createElement('div');
  progres.className = 'progres';
  c.append(cv, progres);
  c.addEventListener('click', () => {
    // Cliquer la DERNIÈRE case annule et rembourse. On retrouve sa place au
    // moment du clic : la file a pu avancer depuis la création de la case.
    const joueur = etat.camps.joueur;
    const place = Array.prototype.indexOf.call(el.file.children, c);
    if (place === joueur.file.length - 1) annulerDernier(joueur);
  });
  return c;
}

// ============================================================
//  L'ÉTAT DE LA PARTIE — la « feuille de match » que tous les
//  autres fichiers lisent et modifient.
// ============================================================

import { R } from '../data/reglages.js';

export const etat = {
  ecran: 'menu',        // 'menu' | 'jeu' | 'fin'
  pause: false,
  difficulte: 'normal',
  temps: 0,             // secondes écoulées depuis le début de la partie
  horloge: 0,           // horloge d'ambiance : tourne même dans les menus
  camps: { joueur: null, ennemi: null },
  unites: [],
  projectiles: [],
  effets: [],
  fin: null,            // { victoire: true/false, ... }
};

export function autre(id) { return id === 'joueur' ? 'ennemi' : 'joueur'; }

// Un tirage au sort entre deux bornes.
export function entre(bornes) {
  return bornes[0] + Math.random() * (bornes[1] - bornes[0]);
}

export function creerCamp(id, options = {}) {
  return {
    id,
    sens: id === 'joueur' ? +1 : -1,          // direction de marche
    x: id === 'joueur' ? R.chateauJoueurX : R.chateauEnnemiX,
    or: R.orDepart,
    orTotal: R.orDepart,
    xp: 0,
    age: 0,
    revenuNiveau: 0,
    defenseNiveau: 0,
    pv: R.pvChateau,
    pvMax: R.pvChateau,
    file: [],                                  // [{ def, restant, total }]
    tourelles: new Array(R.tourellesMax).fill(null),  // [{ def, age, cd, anim } | null]
    specialRecharge: 0,
    bonusRevenu: options.bonusRevenu || 1,
    reflexion: options.reflexion || R.ia.reflexion,   // sa vitesse de réaction
    revenuMaxIA: options.revenuMax || R.ia.revenuMax, // jusqu'où il monte son revenu
    pousseeLibre: options.pousseeLibre || R.ia.pousseeLibre, // pression quand le terrain est vide
    aubaine: options.aubaine || null,      // ravitaillement surprise (difficulté)
    aubaineTimer: options.aubaine ? entre(options.aubaine.delai) : Infinity,
    agressivite: options.agressivite || 1,
    iaTimer: 0,
    // Tempérament, tiré au sort à chaque partie : sans ça l'adversaire
    // rejouerait exactement la même partie à chaque fois.
    gout: [(Math.random() - 0.5) * 0.16,      // penchant pour le corps à corps
           (Math.random() - 0.5) * 0.16,      // ... pour les tireurs
           (Math.random() - 0.5) * 0.12],     // ... pour les grosses unités
    patience: 0.8 + Math.random() * 0.7,      // taille du groupe qu'il attend avant d'attaquer
    specialsLances: 0,
    blocage: 0,        // depuis combien de décisions la ligne ne bouge plus
    riposte: 0,        // or à réunir avant de contre-attaquer quand on est assiégé
    assaut: 0,         // or à mettre de côté avant de lâcher une grosse vague
    tues: 0,
    perdues: 0,
    secousse: 0,                               // le château tremble quand il prend un coup
  };
}

// Position d'un emplacement de tourelle : posé sur le haut du MUR, pas sur le
// toit — sinon la tourelle s'emmêle avec la décoration propre à chaque âge.
export function positionTourelle(camp, i) {
  const ecarts = [0.33, 0.05, -0.23];
  return {
    x: camp.x + camp.sens * (ecarts[i] || 0) * R.chateauLargeur,
    y: R.solY - R.chateauHauteur + 20,
  };
}

// Bord du château tourné vers le terrain (la face qu'on vient frapper).
export function bordChateau(camp) {
  return camp.x + camp.sens * (R.chateauLargeur / 2);
}

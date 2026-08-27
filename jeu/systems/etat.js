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
    pv: R.pvChateau,
    pvMax: R.pvChateau,
    file: [],                                  // [{ def, restant, total }]
    tourelles: new Array(R.tourellesMax).fill(null),  // [{ def, age, cd, anim } | null]
    specialRecharge: 0,
    bonusRevenu: options.bonusRevenu || 1,
    agressivite: options.agressivite || 1,
    iaTimer: 0,
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

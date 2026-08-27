// ============================================================
//  RÉGLAGES GÉNÉRAUX — tous les chiffres d'équilibrage global.
//  C'est LE fichier à ouvrir pour rendre le jeu plus rapide,
//  plus dur ou plus riche. Les chiffres des unités, eux,
//  vivent dans ages.js.
// ============================================================

export const R = {
  // --- Taille logique de l'image (tout est dessiné là-dedans,
  //     puis mis à l'échelle pour remplir l'écran).
  largeur: 1280,
  hauteur: 720,

  // --- Le terrain
  solY: 545,               // hauteur de la ligne de sol (les pieds des unités)
  chateauJoueurX: 118,     // centre du château du joueur (à gauche)
  chateauEnnemiX: 1162,    // centre du château ennemi (à droite)
  chateauLargeur: 124,
  chateauHauteur: 186,
  pvChateau: 2200,        // points de vie d'un château

  // --- L'économie
  orDepart: 220,           // or au début de la partie
  revenuBase: 3.0,         // or par seconde, niveau 0
  revenuPas: 1.6,          // or par seconde gagné à chaque niveau
  revenuCout: 80,          // prix du 1er niveau de revenu
  revenuMult: 1.42,        // le prix est multiplié par ça à chaque niveau
  revenuMax: 12,           // niveau maximum

  // --- La file d'entraînement
  fileMax: 5,              // nombre d'unités qu'on peut mettre en attente

  // --- La défense du château (les murs)
  defenseMax: 8,           // niveaux d'épaississement possibles
  defenseCout: 160,        // prix du 1er niveau
  defenseMult: 1.5,        // le prix est multiplié par ça à chaque niveau
  defensePas: 0.12,        // chaque niveau ajoute 12 % des PV de départ

  // --- La réparation
  reparerPart: 0.25,       // remet un quart des PV maximum
  reparerBase: 220,        // prix à l'âge de pierre
  reparerParAge: 0.9,      // ... et il grimpe de 90 % du prix de base par âge

  // --- Les tourelles de château
  tourellesMax: 3,             // emplacements sur chaque château
  tourelleMult: [1, 1.5, 2.1], // l'emplacement n°2 puis n°3 coûtent plus cher
  tourelleMiseAJour: 0.8,      // remplacer une vieille tourelle coûte 80 % du prix

  // --- Le combat
  ecart: 8,                // espace laissé entre deux alliés qui se suivent
  degatsChateauMult: 1,    // multiplicateur de dégâts contre un château
  soinEvolution: 0.12,     // le château se répare de 12 % quand on change d'âge

  // --- L'adversaire (ordinateur)
  ia: {
    reflexion: 0.7,        // secondes entre deux décisions
    armeeMax: 14,          // au-delà, le terrain est plein : l'IA garde son or
    facile:    { revenu: 0.75, agressivite: 0.7 },
    normal:    { revenu: 1.0,  agressivite: 1.0 },
    difficile: { revenu: 1.35, agressivite: 1.3 },
  },
};

// Prix du prochain niveau de mur (Infinity quand on est au maximum).
export function coutDefense(camp) {
  if (camp.defenseNiveau >= R.defenseMax) return Infinity;
  return Math.round(R.defenseCout * Math.pow(R.defenseMult, camp.defenseNiveau));
}

// Prix d'une réparation. Il monte avec l'âge (c'est voulu : réparer doit
// rester un vrai choix, pas un réflexe gratuit) et avec la taille du château,
// puisqu'on répare un quart d'un mur devenu plus épais.
export function coutReparation(camp) {
  return Math.round(R.reparerBase * (1 + camp.age * R.reparerParAge)
                    * (camp.pvMax / R.pvChateau));
}

// Prix du prochain niveau de revenu pour un camp donné.
export function coutRevenu(camp) {
  if (camp.revenuNiveau >= R.revenuMax) return Infinity;
  return Math.round(R.revenuCout * Math.pow(R.revenuMult, camp.revenuNiveau));
}

// Or par seconde d'un camp.
export function revenuDe(camp) {
  return (R.revenuBase + camp.revenuNiveau * R.revenuPas) * (camp.bonusRevenu || 1);
}

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

  // --- La défense du château : TROIS niveaux de remparts.
  //     Chaque niveau fait trois choses d'un coup : il ajoute des points de
  //     vie, il DÉBLOQUE UN EMPLACEMENT DE TOURELLE, et il fait grandir un
  //     mur devant le château. C'est ce qui relie les deux boutons : sans
  //     remparts, on n'a qu'une seule tourelle.
  defenseMax: 3,           // trois niveaux de remparts
  defenseCout: 250,        // prix du 1er niveau
  defenseMult: 1.95,       // le prix est multiplié par ça à chaque niveau
  defensePas: 0.18,        // chaque niveau ajoute 18 % des PV de départ
  //     Le mur avance le bord du château : les assaillants s'arrêtent dessus.
  mur: [
    null,                            // niveau 0 : pas de mur
    { largeur: 44, hauteur: 48 },
    { largeur: 62, hauteur: 70 },
    { largeur: 82, hauteur: 92 },    // au 3e, une tourelle se pose dessus
  ],

  // --- La réparation
  reparerPart: 0.25,       // remet un quart des PV maximum
  reparerBase: 220,        // prix à l'âge de pierre
  reparerParAge: 0.9,      // ... et il grimpe de 90 % du prix de base par âge

  // --- Les tourelles de château
  tourellesMax: 4,                  // plafond : 1 au départ, +1 par niveau de mur
  tourelleMult: [1, 1.5, 2.1, 2.8], // chaque emplacement suivant coûte plus cher
  tourelleMiseAJour: 0.8,      // remplacer une vieille tourelle coûte 80 % du prix

  // --- Le combat
  ecart: 8,                // espace laissé entre deux alliés qui se suivent
  degatsChateauMult: 1,    // multiplicateur de dégâts contre un château
                           // (essayé à 1,35 pour raccourcir les parties : aucun
                           //  effet mesurable, les parties longues viennent de
                           //  troupes qui n'atteignent jamais les murs)
  soinEvolution: 0.12,     // le château se répare de 12 % quand on change d'âge

  // --- L'adversaire (ordinateur)
  ia: {
    reflexion: 0.7,        // secondes entre deux décisions (valeur par défaut)
    armeeMax: 14,          // au-delà, le terrain est plein : l'IA garde son or
    revenuMax: 11,         // plafond d'améliorations de revenu (valeur par défaut)
    pousseeLibre: 3,       // troupes qu'il garde en marche quand le terrain d'en face est VIDE
    // `aubaine` = ravitaillement surprise. C'est le bouton « rendre l'ennemi
    // plus coriace » sans changer une seule règle du jeu : il touche de temps
    // en temps l'équivalent de X secondes de son propre revenu, donc le bonus
    // reste proportionné à l'âge de la partie. En facile, il n'en reçoit pas.
    //   secondes : combien de secondes de revenu il empoche (tirage au sort)
    //   delai    : combien de temps entre deux ravitaillements (tirage au sort)
    //   revenu       : multiplie son or par seconde        ← LEVIER FORT
    //   aubaine      : ravitaillement surprise              ← LEVIER FORT
    //   pousseeLibre : troupes gardées en marche quand le terrain est vide
    //   revenuMax    : jusqu'où il monte son revenu (effet faible)
    //   agressivite  : plus haut = préfère les troupes à l'économie (effet faible)
    //
    //   ⚠ reflexion N'EST PAS un curseur « plus vite = plus fort ».
    //   Mesuré sur 30 parties par valeur : à 0,7 s l'ordinateur est au mieux ;
    //   à 0,45 s il perd 100 % de ses duels, à 1,1 s il en perd 93 %. Trop
    //   vite, il dépense son or au fur et à mesure et n'accumule jamais de
    //   quoi faire un vrai achat ; trop lent, il laisse passer les occasions.
    //   → On ne s'en sert donc QUE pour AFFAIBLIR (mode facile). En normal et
    //     en difficile il reste à 0,7. Cette erreur a déjà été commise deux
    //     fois : lire « Mesurer la difficulté » dans docs/tests.md avant d'y
    //     toucher.
    facile:    { revenu: 0.97, agressivite: 0.85, reflexion: 1.05, revenuMax: 8,
                 pousseeLibre: 3, aubaine: null },
    normal:    { revenu: 1.20, agressivite: 1.05, reflexion: 0.70, revenuMax: 11,
                 pousseeLibre: 4,
                 aubaine: { secondes: [34, 50], delai: [30, 48] } },
    difficile: { revenu: 1.40, agressivite: 1.30, reflexion: 0.70, revenuMax: 12,
                 pousseeLibre: 4,
                 aubaine: { secondes: [46, 70], delai: [20, 36] } },
  },
};

// Emplacements de tourelle actuellement disponibles : un au départ,
// puis un de plus par niveau de remparts.
export function tourellesDe(camp) {
  return Math.min(R.tourellesMax, 1 + camp.defenseNiveau);
}

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

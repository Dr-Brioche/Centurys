// ============================================================
//  LES ÂGES ET LEURS UNITÉS
//  Cinq âges, trois unités chacun. Chaque âge est environ deux
//  fois plus fort et deux fois plus cher que le précédent.
//
//  ⚠ PORTÉE DES TOURELLES : la portée écrite ici est la portée NORMALE,
//  mesurée depuis la tourelle. Elle peut être plus courte que celle d'une
//  troupe à distance, et c'est voulu : une règle à part (voir majTourelles
//  dans systems/combat.js) garantit qu'une troupe capable de frapper les murs
//  est TOUJOURS atteignable, même si elle tire de plus loin.
//  Ne pas « régler » ça en allongeant ces portées : essayé et mesuré, les
//  tourelles finissaient par couvrir 87 % du terrain, plus personne n'avançait
//  et 6 parties sur 20 finissaient en match nul (contre 1 sur 20 avec la
//  règle ciblée).
//
//  Chaque âge coûte de l'EXPÉRIENCE (xpRequis, gagnée uniquement en tuant)
//  ET de l'OR (orRequis) : il faut avoir combattu et avoir économisé.
//
//  Lecture d'une unité :
//    cout     = or à payer
//    pv       = points de vie
//    degats   = dégâts par coup
//    portee   = distance à laquelle elle peut frapper (en pixels)
//    vitesse  = pixels par seconde
//    cadence  = secondes entre deux coups (petit = tape vite)
//    or / xp  = récompense donnée à celui qui la tue
//    duree    = secondes d'entraînement avant qu'elle sorte du château
//    hauteur / largeur = taille à l'écran (largeur = encombrement)
//    aoe      = si présent, l'impact touche tout le monde dans ce rayon
//    role     = 0 corps à corps / 1 distance / 2 lourde. Sert à l'adversaire
//               pour composer une armée équilibrée plutôt que d'empiler
//               quinze fantassins.
// ============================================================

export const AGES = [

  // ---------------------------------------------------------- 1
  {
    id: 'pierre',
    nom: { fr: "Âge de pierre", en: "Stone Age" },
    xpRequis: 0,
    orRequis: 0,
    ciel: ['#9dc4e6', '#e6f0f6'],
    collines: ['#7f9a5a', '#94ac6b'],
    sol: '#77913f',
    pierre: '#8d8577',
    tourelle: {
      id: 'lanceur-rochers',
      nom: { fr: "Lanceur de rochers", en: "Rock chucker" },
      cout: 130, degats: 15, portee: 240, cadence: 1.6,
      projectile: 'rocher', arc: true, forme: 'bras',
    },
    special: {
      nom: { fr: "Pluie de météores", en: "Meteor shower" },
      cout: 120, degats: 70, recharge: 25, effet: 'meteore',
    },
    unites: [
      { id: 'gourdin',
        nom: { fr: "Homme au gourdin", en: "Clubman" },
        cout: 30, pv: 60, degats: 9, portee: 22, vitesse: 44, cadence: 0.85,
        or: 22, xp: 14, duree: 1.3, hauteur: 64, largeur: 28, type: 'melee',
        role: 0,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'humain', peau: '#cf9a63', tenue: '#8a6134', arme: 'gourdin' } },

      { id: 'lanceur',
        nom: { fr: "Lanceur de pierres", en: "Rock thrower" },
        cout: 60, pv: 45, degats: 13, portee: 200, vitesse: 36, cadence: 1.5,
        or: 43, xp: 24, duree: 2.0, hauteur: 64, largeur: 28, type: 'distance',
        role: 1,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'pierre',
        look: { corps: 'humain', peau: '#cf9a63', tenue: '#6f6157', arme: 'fronde' } },

      { id: 'mastodonte',
        nom: { fr: "Mastodonte", en: "Mastodon" },
        cout: 145, pv: 220, degats: 22, portee: 30, vitesse: 28, cadence: 1.4,
        or: 104, xp: 60, duree: 4.0, hauteur: 100, largeur: 95, type: 'melee',
        role: 2,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'bete', poil: '#7a5136', poil2: '#5d3d29', defense: '#efe6cf' } },
    ],
  },

  // ---------------------------------------------------------- 2
  {
    id: 'antiquite',
    nom: { fr: "Antiquité", en: "Antiquity" },
    xpRequis: 250,
    orRequis: 170,
    ciel: ['#7fb2dd', '#f3e6c8'],
    collines: ['#8a935a', '#a3a874'],
    sol: '#a8925c',
    pierre: '#cbbb92',
    tourelle: {
      id: 'baliste',
      nom: { fr: "Baliste", en: "Ballista" },
      cout: 300, degats: 36, portee: 275, cadence: 1.5,
      projectile: 'carreau', arc: false, forme: 'baliste',
    },
    special: {
      nom: { fr: "Volée de javelots", en: "Javelin volley" },
      cout: 250, degats: 150, recharge: 25, effet: 'javelot',
    },
    unites: [
      { id: 'legionnaire',
        nom: { fr: "Légionnaire", en: "Legionary" },
        cout: 70, pv: 130, degats: 18, portee: 24, vitesse: 46, cadence: 0.80,
        or: 50, xp: 30, duree: 1.6, hauteur: 72, largeur: 30, type: 'melee',
        role: 0,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#a33b2c', arme: 'glaive',
                casque: '#c8a44a', bouclier: '#a33b2c' } },

      { id: 'archer',
        nom: { fr: "Archer", en: "Archer" },
        cout: 120, pv: 85, degats: 26, portee: 235, vitesse: 38, cadence: 1.35,
        or: 86, xp: 48, duree: 2.3, hauteur: 72, largeur: 30, type: 'distance',
        role: 1,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'fleche',
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#5f7c4a', arme: 'arc' } },

      { id: 'char',
        nom: { fr: "Char de guerre", en: "War chariot" },
        cout: 280, pv: 430, degats: 42, portee: 32, vitesse: 34, cadence: 1.2,
        or: 202, xp: 118, duree: 4.6, hauteur: 92, largeur: 102, type: 'melee',
        role: 2,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'attelage', poil: '#8a6134', caisse: '#8d6a3a', metal: '#c8a44a' } },
    ],
  },

  // ---------------------------------------------------------- 3
  {
    id: 'medieval',
    nom: { fr: "Âge médiéval", en: "Middle Ages" },
    xpRequis: 650,
    orRequis: 430,
    ciel: ['#6f8ba8', '#cdd6dc'],
    collines: ['#5f7248', '#71875a'],
    sol: '#6d7a4a',
    pierre: '#9aa0a6',
    tourelle: {
      id: 'trebuchet',
      nom: { fr: "Trébuchet", en: "Trebuchet" },
      cout: 600, degats: 78, portee: 330, cadence: 2.1,
      projectile: 'rocher', arc: true, aoe: 55, forme: 'trebuchet',
    },
    special: {
      nom: { fr: "Pluie de flèches", en: "Arrow rain" },
      cout: 520, degats: 320, recharge: 25, effet: 'fleches',
    },
    unites: [
      { id: 'chevalier',
        nom: { fr: "Chevalier", en: "Knight" },
        cout: 150, pv: 270, degats: 36, portee: 26, vitesse: 48, cadence: 0.78,
        or: 108, xp: 62, duree: 1.9, hauteur: 78, largeur: 32, type: 'melee',
        role: 0,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#9aa3ad', arme: 'epee',
                casque: '#b7c0ca', bouclier: '#3f5fa8' } },

      { id: 'arbaletrier',
        nom: { fr: "Arbalétrier", en: "Crossbowman" },
        cout: 250, pv: 175, degats: 52, portee: 255, vitesse: 38, cadence: 1.3,
        or: 180, xp: 100, duree: 2.6, hauteur: 75, largeur: 31, type: 'distance',
        role: 1,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'carreau',
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#6b4a7a', arme: 'arbalete' } },

      { id: 'catapulte',
        nom: { fr: "Catapulte", en: "Catapult" },
        cout: 560, pv: 800, degats: 95, portee: 300, vitesse: 24, cadence: 2.3,
        or: 403, xp: 235, duree: 5.2, hauteur: 100, largeur: 110, type: 'distance',
        role: 2,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'rocher', aoe: 60,
        look: { corps: 'engin', caisse: '#7d5a34', metal: '#8b8b8b', canon: 'bras' } },
    ],
  },

  // ---------------------------------------------------------- 4
  {
    id: 'moderne',
    nom: { fr: "Âge moderne", en: "Modern Age" },
    xpRequis: 1300,
    orRequis: 950,
    ciel: ['#5d6b7a', '#b9b2a4'],
    collines: ['#4d5645', '#5e6853'],
    sol: '#6a6558',
    pierre: '#8e8e8e',
    tourelle: {
      id: 'mitrailleuse',
      nom: { fr: "Mitrailleuse", en: "Machine gun" },
      cout: 1200, degats: 58, portee: 300, cadence: 0.5,
      projectile: 'balle', arc: false, forme: 'mitrailleuse',
    },
    special: {
      nom: { fr: "Frappe d'artillerie", en: "Artillery strike" },
      cout: 1050, degats: 650, recharge: 25, effet: 'obus',
    },
    unites: [
      { id: 'fusilier',
        nom: { fr: "Fusilier", en: "Rifleman" },
        cout: 300, pv: 520, degats: 68, portee: 160, vitesse: 50, cadence: 0.70,
        or: 216, xp: 128, duree: 2.0, hauteur: 78, largeur: 32, type: 'distance',
        role: 0,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'balle',
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#4f5b41', arme: 'fusil',
                casque: '#59614a' } },

      { id: 'sniper',
        nom: { fr: "Tireur d'élite", en: "Sniper" },
        cout: 500, pv: 340, degats: 115, portee: 340, vitesse: 38, cadence: 1.6,
        or: 360, xp: 205, duree: 2.9, hauteur: 78, largeur: 32, type: 'distance',
        role: 1,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'balle',
        look: { corps: 'humain', peau: '#d3a06a', tenue: '#3c4636', arme: 'longfusil' } },

      { id: 'tank',
        nom: { fr: "Char d'assaut", en: "Battle tank" },
        cout: 1150, pv: 1650, degats: 175, portee: 270, vitesse: 28, cadence: 1.9,
        or: 828, xp: 470, duree: 5.8, hauteur: 88, largeur: 122, type: 'distance',
        role: 2,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'obus', aoe: 55,
        look: { corps: 'engin', caisse: '#4a553d', metal: '#39422f', canon: 'tube' } },
    ],
  },

  // ---------------------------------------------------------- 5
  {
    id: 'futur',
    nom: { fr: "Âge futuriste", en: "Future Age" },
    xpRequis: 2400,
    orRequis: 2100,
    ciel: ['#241d3d', '#6d4c86'],
    collines: ['#2c2547', '#3b3260'],
    sol: '#3a3355',
    pierre: '#7c74a8',
    tourelle: {
      id: 'canon-plasma',
      nom: { fr: "Canon à plasma", en: "Plasma cannon" },
      cout: 2400, degats: 320, portee: 390, cadence: 1.4,
      projectile: 'plasma', arc: true, aoe: 70, forme: 'plasma',
    },
    special: {
      nom: { fr: "Frappe orbitale", en: "Orbital strike" },
      cout: 2000, degats: 1400, recharge: 25, effet: 'orbital',
    },
    unites: [
      { id: 'cyborg',
        nom: { fr: "Cyborg", en: "Cyborg" },
        cout: 600, pv: 1000, degats: 140, portee: 30, vitesse: 56, cadence: 0.62,
        or: 432, xp: 265, duree: 2.2, hauteur: 84, largeur: 35, type: 'melee',
        role: 0,   // 0 = corps à corps, 1 = distance, 2 = lourde
        look: { corps: 'humain', peau: '#9fb4c6', tenue: '#31405c', arme: 'lame',
                casque: '#5fd7ff', neon: '#5fd7ff' } },

      { id: 'laser',
        nom: { fr: "Fantassin laser", en: "Laser trooper" },
        cout: 950, pv: 700, degats: 225, portee: 370, vitesse: 40, cadence: 1.35,
        or: 684, xp: 420, duree: 3.1, hauteur: 80, largeur: 34, type: 'distance',
        role: 1,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'laser',
        look: { corps: 'humain', peau: '#9fb4c6', tenue: '#453465', arme: 'laser',
                casque: '#c07bff', neon: '#c07bff' } },

      { id: 'meca',
        nom: { fr: "Méca de siège", en: "Siege mech" },
        cout: 2300, pv: 3200, degats: 360, portee: 300, vitesse: 30, cadence: 1.7,
        or: 1656, xp: 1000, duree: 6.5, hauteur: 132, largeur: 100, type: 'distance',
        role: 2,   // 0 = corps à corps, 1 = distance, 2 = lourde
        projectile: 'plasma', aoe: 70,
        look: { corps: 'meca', metal: '#5a6480', metal2: '#39415a', neon: '#5fd7ff' } },
    ],
  },
];

// XP à payer pour passer de l'âge `i` à l'âge suivant (null = déjà au maximum).
export function xpPourEvoluer(i) {
  return (i + 1 < AGES.length) ? AGES[i + 1].xpRequis : null;
}

# Tester Centurys — à lire AVANT tout test visuel

La règle : **on ne traverse pas une partie entière pour vérifier un visuel.**
Une bataille dure une dizaine de minutes ; attendre l'âge futuriste pour
regarder un méca est une perte de temps.

## Les pages de test

| Page | Ce qu'elle montre |
|---|---|
| `outils/test-unites.html` | **Toutes** les troupes et tourelles des cinq âges, dans les deux camps, avec marche et attaque animées. C'est la page à ouvrir dès qu'on touche à `jeu/rendu/unites.js` ou au dessin des tourelles. |
| `outils/test-equilibrage.html` | Le **banc d'essai** : bataille en miroir (justice du moteur) et simulation de dix parties en accéléré (durée, âges atteints, répartition des victoires). Deux boutons, aucun réglage. |

En créer une nouvelle pour un autre écran est presque toujours plus rapide
que de jouer jusqu'à lui.

## Lancer un serveur

Le jeu utilise des modules JavaScript : ouvrir le fichier directement
(`file://`) **ne marche pas**, le navigateur refuse les imports.

```bash
cd Centurys
python3 -m http.server 8000
```

## Raccourcis pour tester en jeu

Ouvrir la console du navigateur (F12) pendant une partie :

```js
const { etat } = await import('./jeu/systems/etat.js');

etat.camps.joueur.or = 99999;          // riche
etat.camps.joueur.xp = 99999;          // l'expérience pour évoluer (il faut AUSSI l'or)
etat.camps.joueur.age = 4;             // directement à l'âge futuriste
etat.camps.joueur.specialRecharge = 0; // attaque spéciale prête (touche A)
etat.camps.joueur.tourelles.fill(null); // vider les emplacements de tourelles
etat.camps.joueur.pv = 500;            // château entamé (le bouton Réparer s'allume en rouge)
etat.camps.joueur.defenseNiveau = 0;   // remettre les murs à leur épaisseur de départ
etat.camps.ennemi.pv = 40;             // fin de partie en quelques coups
etat.camps.ennemi.bonusRevenu = 0;     // l'adversaire n'achète plus rien
etat.unites.length = 0;                // vider le terrain
```

Attention : changer `age` à la main ne redessine les boutons qu'à l'image
suivante, c'est normal.

## Vérifier l'équilibrage sans jouer

On peut faire jouer le jeu **contre lui-même en accéléré** : on appelle
`majJeu(0.05)` en boucle au lieu d'attendre les images, et `majIA(0.05, camp)`
pour **les deux camps** (`majIA` prend le camp en paramètre exprès). Une partie
de dix minutes se simule en quelques secondes. C'est comme ça que la durée des
parties, les âges atteints et les niveaux de revenu ont été réglés.

## ⚠ Le test le plus important : la bataille en miroir

Le joueur est **toujours** le camp de gauche. Si le moteur avantage un côté,
le jeu est injuste et personne ne s'en rend compte.

Le test : poser deux armées **rigoureusement symétriques** autour du centre du
terrain (x = 640), faire tourner `majJeu` et regarder qui reste debout. La
bonne réponse est **zéro survivant des deux côtés**. Le bouton
« Bataille en miroir » de `outils/test-equilibrage.html` le fait pour six
formations différentes et donne le verdict.

Ce test a déjà attrapé un vrai bug : les troupes étaient traitées l'une après
l'autre, celle traitée en second voyait son adversaire déjà avancé, entrait à
portée une image plus tôt et frappait la première. Le camp de droite gagnait
alors **7 parties sur 10** à armées égales. La correction (positions figées en
début d'image + tous les coups portés ensemble) est dans `majUnites`
(`jeu/systems/combat.js`). **Toute modification du combat doit refaire ce
test.**

## Pièges déjà payés

- **Ouvrir `index.html` en `file://`** → écran noir, imports refusés. Serveur obligatoire.
- **Une page dans `outils/`** doit remonter d'un cran dans ses imports
  (`../jeu/...`), sinon rien ne se charge.
- **Modifier une taille de troupe** change aussi son encombrement (`largeur`) :
  c'est lui qui décide de l'espacement dans la file de bataille, pas le dessin.
- **La portée d'une troupe se mesure de bord à bord**, pas de centre à centre.
  Une portée de 30 sur une troupe large de 100 laisse un vrai espace visible.
- **Le camp se reconnaît à la couleur du bandeau et de l'ombre au sol**
  (bleu = joueur, rouge = ennemi). Une nouvelle silhouette doit recevoir sa
  pièce aux couleurs du camp, sinon on ne distingue plus les deux armées.
- **Une tourelle ne tire pas sur un château** : pour la voir tirer il faut une
  troupe adverse à moins de sa portée du château (240 px à l'âge de pierre),
  donc bien plus près que le milieu du terrain. Vider le terrain et faire
  sortir une seule troupe adverse est le moyen le plus rapide.
- **⚠ NE JAMAIS réécrire `innerHTML` d'un bouton à chaque image.** Le bug a
  déjà été payé : les boutons du bas se reconstruisaient 60 fois par seconde,
  et **0 clic sur 10 était pris en compte quand on visait le centre du bouton**
  (les bords marchaient, d'où l'impression que « ça marche une fois sur
  deux »). Le navigateur ne déclenche un clic que si l'appui et le relâchement
  tombent sur le même élément ; un joueur garde le doigt appuyé une bonne
  centaine de millisecondes, soit une dizaine d'images. → construire les
  morceaux **une fois**, puis ne changer que leur `textContent`
  (`preparerAction` / `ecrire` dans `jeu/ui/hud.js`).
  Pour le retester : viser le **centre** d'un bouton, appuyer, attendre
  ~130 ms, relâcher. Un clic instantané ne reproduit pas le bug.
- **Vérifier les deux langues** avant de clore une tâche : un libellé anglais
  plus long peut déborder d'un bouton.

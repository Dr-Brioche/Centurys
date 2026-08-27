# Centurys — concept

> Ce document est **la référence du design**. À chaque modification du
> gameplay, il faut l'analyser et le mettre à jour dans le même mouvement :
> c'est lui qui survit si la conversation est effacée.

## 1. Le pitch

Deux châteaux se font face sur un terrain plat, vus **de côté**. Chacun
produit des troupes qui marchent vers l'autre et se battent quand elles se
rencontrent. Le premier qui détruit le château adverse gagne.

La tension du jeu tient à **un seul arbitrage, répété en boucle** :

> l'or que je dépense maintenant en troupes, c'est de l'or que je n'investis
> pas dans mon revenu — et donc dans l'armée que j'aurai dans deux minutes.

C'est le cœur de la boucle addictive. Tout le reste (âges, attaque spéciale,
file d'entraînement) sert à rythmer cet arbitrage.

## 2. Les trois ressources

| Ressource | D'où elle vient | À quoi elle sert |
|---|---|---|
| **Or** | revenu continu + butin des troupes tuées | troupes, revenu, tourelles, **changement d'âge**, **attaque spéciale** |
| **Expérience** | uniquement en tuant des troupes | changer d'âge (en plus de l'or) |
| **Points de vie du château** | 2200 au départ ; +12 % à chaque évolution ; épaississables et réparables (§ 6) | c'est la barre de défaite |

**Tout se paie avec la même bourse** : des troupes maintenant, du revenu pour
plus tard, des tourelles pour tenir, le changement d'âge, l'attaque spéciale.
C'est cette bourse unique qui fait la partie — chaque pièce dépensée quelque
part est une pièce qui manque ailleurs.

L'expérience, elle, ne s'achète pas : **il faut se battre pour progresser**.
Un joueur qui se contenterait d'empiler de l'or n'évoluerait jamais.

L'expérience ne s'achète pas : **il faut se battre pour progresser**. Un
joueur qui se contente d'accumuler de l'or n'évoluera jamais.

## 3. Les cinq âges

| # | Âge | Prix d'entrée | Corps à corps | Distance | Lourde |
|---|---|---|---|---|---|
| 1 | Âge de pierre | — | Homme au gourdin | Lanceur de pierres | Mastodonte |
| 2 | Antiquité | 250 XP + 170 or | Légionnaire | Archer | Char de guerre |
| 3 | Âge médiéval | 650 XP + 430 or | Chevalier | Arbalétrier | Catapulte |
| 4 | Âge moderne | 1 300 XP + 950 or | Fusilier | Tireur d'élite | Char d'assaut |
| 5 | Âge futuriste | 2 400 XP + 2 100 or | Cyborg | Fantassin laser | Méca de siège |

Changer d'âge coûte **les deux** : de l'expérience (il faut avoir combattu) et
de l'or (il faut avoir économisé). C'est ce qui crée le meilleur arbitrage du
jeu — « j'évolue maintenant, ou je m'achète le char que je peux enfin me
payer ? » — et ce qui empêche de monter les cinq âges en restant passif.

Chaque âge est environ **deux fois plus cher et deux fois plus fort** que le
précédent. Les trois rôles sont volontairement toujours les mêmes, pour que
le joueur n'ait jamais à réapprendre l'interface :

- **corps à corps** — pas cher, sort vite, sert de mur ;
- **distance** — tire par-dessus le mur, fragile si on l'atteint ;
- **lourde** — chère et lente, mais casse une ligne à elle seule.

Changer d'âge répare aussi le château de 12 % : c'est ce qui laisse une
chance de remonter quand on est mené, sans annuler l'avance de l'adversaire.

Le décor change à chaque âge (ciel, collines, sol, silhouette du château) :
la progression doit **se voir**, pas seulement se lire dans un chiffre.

## 4. L'attaque spéciale

Une par âge (pluie de météores, volée de javelots, pluie de flèches, frappe
d'artillerie, frappe orbitale). Elle frappe **toutes les troupes adverses
présentes sur le terrain**, coûte de l'**or** (120 à 2 000 selon l'âge) et se
recharge en **25 secondes**.

Le vrai frein est le prix, pas l'attente : c'est un outil qu'on paie au moment
où on en a besoin, pas un minuteur qu'on subit. Son rôle : **casser les
blocages**. Sans elle, deux armées équivalentes s'annulent au milieu du terrain
et la partie s'enlise. Elle ne touche jamais un château : ce n'est pas une arme
de finition, c'est un tournevis.

## 5. Les tourelles de château

Chaque château a **trois emplacements**, vides au départ. Une tourelle :

- se construit avec de l'or, à l'âge où on se trouve (une tourelle par âge :
  lanceur de rochers, baliste, trébuchet, mitrailleuse, canon à plasma) ;
- **tire toute seule** sur la troupe adverse la plus proche à sa portée ;
- **ne vise jamais un château** : c'est une arme de défense, pas de finition ;
- **ne peut pas être détruite** : la barre de vie du château est la seule
  barre de défaite, et le joueur n'a donc rien à réparer.

Le premier emplacement coûte le prix de base, le deuxième ×1,5, le troisième
×2,1 : chaque tourelle supplémentaire vaut moins que la précédente. Quand les
trois emplacements sont pris, le même bouton **remplace automatiquement la
tourelle la plus dépassée** par une du modèle courant, pour 80 % du prix — il
n'y a jamais de choix à faire entre trois emplacements identiques, donc jamais
de clic inutile à demander au joueur.

Leur rôle dans la boucle : c'est le **troisième usage de l'or**, à côté des
troupes et du revenu. Une tourelle ne gagne pas la partie, elle rend une
poussée adverse beaucoup plus chère — et elle transforme une défaite qui
s'annonce en contre-attaque, parce que chaque troupe qu'elle tue rapporte de
l'or et de l'expérience.

## 6. Les murs : épaissir et réparer

La barre de vie du château est la seule barre de défaite. Deux boutons agissent
dessus, et tous les deux se paient avec la même bourse que les troupes :

- **Défense** — épaissit les murs : +12 % des PV de départ par niveau, huit
  niveaux au maximum, prix ×1,5 à chaque fois (160, 240, 360, 540…). Le gain
  est ajouté **aussi aux PV actuels** : sinon épaissir ses murs creuserait un
  trou dans sa propre barre de vie, ce qui n'a aucun sens pour le joueur.
- **Réparer** — rend **un quart des PV maximum**, d'un coup. Le prix monte
  avec l'âge (220 à l'âge de pierre, plus de 1 000 à l'âge futuriste) et avec
  l'épaisseur des murs, puisqu'on répare un quart d'un château devenu plus
  gros. Le bouton est éteint quand le château est intact, et **s'allume en
  rouge** en dessous de 60 % de vie : c'est là qu'il faut y penser, pas avant.

Leur rôle : offrir une **porte de sortie quand ça va mal**. Sans elles, une
mauvaise vague se paie jusqu'à la fin de la partie et le joueur mené sait
qu'il a perdu dix minutes trop tôt — c'est le meilleur moyen de lui faire
fermer le jeu. Avec elles, il peut racheter son erreur en or, donc en temps.

Le garde-fou est le prix : réparer, c'est de l'or qui ne devient pas des
troupes. Un joueur qui se contente de réparer n'attaque jamais, et perd
lentement. C'est voulu — **la défense achète du temps, elle ne gagne pas**.

## 7. La file d'entraînement

Une troupe achetée n'apparaît pas tout de suite : elle rejoint une file (5
places maximum) et sort après son temps d'entraînement (1,3 s pour un homme
au gourdin, 6,5 s pour un méca). Cliquer sur la dernière case, ou appuyer sur
Retour arrière, annule et rembourse.

Son rôle : empêcher d'acheter dix troupes d'un coup et de tout gagner sur un
seul pic d'or. Elle transforme l'or en **flux** plutôt qu'en **stock**.

## 8. Le combat, en détail

- **Tout le monde joue en même temps.** À chaque image, on fige d'abord la
  position de toutes les troupes, puis chacune décide (qui je vise, suis-je à
  portée) sur ces positions figées, et enfin tous les coups partent ensemble.
  C'est une règle de **justice**, pas de confort : sans elle, la troupe traitée
  en second voyait son adversaire déjà avancé, entrait à portée une image plus
  tôt et frappait la première — et le camp de droite gagnait systématiquement,
  même à armées rigoureusement égales. Toute modification du combat doit
  préserver cette simultanéité (voir `docs/tests.md`, bataille en miroir).
- Toutes les troupes marchent sur **une seule ligne**, vers l'adversaire.
- Une troupe **ne traverse jamais un allié** : elle fait la queue derrière.
  C'est ce qui crée les « murs » de corps à corps derrière lesquels les
  tireurs s'abritent.
- Elle s'arrête et attaque dès que l'ennemi le plus proche devant elle est
  à portée. Plus personne devant → elle tape le château.
- Les troupes à distance tirent un projectile ; catapulte, char d'assaut et
  méca font des **dégâts de zone** à l'impact.
- Tuer une troupe rapporte à peu près **72 % de son prix** en or, plus son
  expérience. Deux armées qui s'annulent ne s'appauvrissent donc pas
  complètement : la partie continue d'avancer.

## 9. L'adversaire

Un joueur artificiel qui suit les mêmes règles que le joueur — il ne triche
pas. Toutes les 0,7 seconde il prend **une** décision, dans cet ordre :

1. évoluer si c'est possible ;
2. lancer l'attaque spéciale s'il peut se la payer et qu'il y a assez de
   cibles, ou s'il est en danger ;
3. **réparer** son château dès qu'il tombe sous 55 % de vie ;
4. assiégé : poser une **tourelle** — elle tire tout de suite, elle ne meurt
   pas, et elle n'a pas à traverser le terrain ;
5. assiégé : **économiser pour l'attaque spéciale** si elle est chargée mais
   trop chère (voir « Se sortir d'un siège » plus bas) ;
6. **économiser** s'il a l'expérience pour évoluer mais pas l'or ;
7. investir : le revenu, puis les murs, puis une tourelle ;
8. assiégé : réunir de quoi **contre-attaquer à plusieurs** ;
9. **préparer une vague** si la ligne est bloquée ;
10. sinon acheter la troupe qui manque à son armée.

Une seule règle passe avant tout : si son château est **sous 30 % de vie**, il
arrête d'économiser pour quoi que ce soit et dépense immédiatement ce qu'il a.
Une troupe qui sort maintenant vaut mieux qu'un plan pour dans trente
secondes — sans ce garde-fou, il pouvait mourir la bourse pleine.

### Il compose une armée, il n'empile pas des fantassins

Chaque troupe porte un **rôle** (`role` dans `ages.js`) : 0 corps à corps,
1 distance, 2 lourde. Avant d'acheter, l'adversaire regarde deux choses :
de quoi est faite **son** armée (troupes vivantes **et** celles encore à
l'entraînement), et de quoi est faite **celle d'en face**. Il vise alors une
composition, et achète le rôle le plus en retard :

| Ce qu'il voit en face | Ce qu'il vise (mêlée / distance / lourde) | Pourquoi |
|---|---|---|
| rien | 45 / 35 / 20 | il prépare une poussée |
| surtout du corps à corps | 35 / 50 / 15 | ses tireurs les fauchent avant le contact |
| beaucoup de tireurs | 45 / 25 / 30 | il faut du lourd pour encaisser et arriver au contact |
| du lourd | 30 / 55 / 15 | des tireurs pour l'user à distance |
| mélangé | 45 / 40 / 15 | un mur, des tireurs derrière, un gros de temps en temps |

Comme les troupes font la queue sans se traverser, viser cette composition
produit tout seul la formation classique : **des fantassins devant, des
archers derrière**. Débordé, il oublie le plan et prend ce qui sort le plus
vite. Le terrain saturé (14 troupes), il arrête d'acheter : une troupe de plus
ferait la queue sans jamais taper, autant garder l'or.

### Il attaque par vagues

Deux armées équivalentes qui se touchent au milieu ne bougent plus, et chaque
troupe envoyée seule meurt seule. Après une quinzaine de secondes de statu quo,
l'adversaire **décroche** : il arrête de nourrir la mêlée, met de côté, puis
lâche quatre troupes d'un coup. C'est ce qui débloque une partie — sans cette
règle, deux adversaires identiques se neutralisaient pendant trente minutes.

### Se sortir d'un siège

C'était son plus gros défaut : quand des troupes s'accumulaient devant son
château, il rachetait **le fantassin le moins cher toutes les 0,7 seconde**.
Chacun mourait avant même d'atteindre les tireurs d'en face, et comme il
dépensait tout au fur et à mesure il n'avait jamais les 250 pièces de son
attaque spéciale — celle qui aurait nettoyé le terrain d'un coup. Un cercle
vicieux : fauché parce qu'il gaspillait, il gaspillait parce qu'il était
fauché.

Trois règles cassent ce cercle :

- **il ferme la bourse pour payer la spéciale** plutôt que d'alimenter la
  mêlée au compte-gouttes ;
- **il ne sort plus une troupe seule** : il réunit de quoi en lâcher trois
  ensemble (deux fantassins et un tireur) ;
- **il répond aux tireurs par des tireurs.** Si ce qui l'écrase tire de loin,
  un fantassin meurt sans jamais arriver au contact : il achète alors ses
  propres archers, qui tapent d'aussi loin.

### Il a un tempérament

À chaque partie il tire au sort un léger penchant (un peu plus de tireurs, un
peu plus de gros) et une **patience** (la taille du paquet qu'il attend avant
d'attaquer). Sans ça il rejouerait exactement la même partie à chaque fois.

### La difficulté

Elle ne change **aucune règle** : l'ordinateur paie les mêmes prix et suit les
mêmes lois que le joueur. Elle joue sur quatre curseurs seulement.

| | Facile | Normal | Difficile |
|---|---|---|---|
| Revenu | ×0,70 | ×1,00 | ×1,30 |
| Réaction (secondes entre deux décisions) | 1,2 | 0,7 | 0,5 |
| Revenu maximum | niveau 5 | niveau 9 | niveau 12 |
| **Ravitaillement surprise** | aucun | 26 à 42 s de revenu, toutes les 34 à 58 s | 34 à 55 s de revenu, toutes les 24 à 44 s |

Le **ravitaillement** est le curseur qui rend l'adversaire vraiment coriace :
de temps en temps, il empoche l'équivalent de X secondes de son propre revenu.
Comme le bonus est proportionnel à son revenu, il reste juste dosé à tous les
âges. Il est **annoncé au joueur** (« Convoi ennemi : +171 or ») et un chiffre
doré monte de son château : un bonus caché passerait pour de la triche.

Résultat mesuré, 14 parties par mode, l'ordinateur affrontant la même cervelle
mais sans aucun bonus : il gagne **~20 %** en facile, **~64 %** en normal,
**~86 %** en difficile. Attention si on retouche ces chiffres : `agressivite`
tirait autrefois dans le mauvais sens et rendait le mode facile plus fort que
le mode normal.

## 10. Contraintes permanentes

- **Souris ET clavier** pour toute action, sans exception (ça prépare la manette).
- **Bilingue FR/EN** en permanence : une fonctionnalité livrée dans une seule
  langue est une fonctionnalité non terminée.
- **Zéro dépendance externe** : pas de serveur, pas de bibliothèque, pas de
  fichier image ou son. Le jeu doit rester emballable en `.exe` sans travail.
- **Simultanéité du combat** : personne ne joue avant l'autre (voir § 7).
- **Coins arrondis partout** pour l'interface (`--rayon` en CSS,
  `cheminArrondi` sur le canvas).
- Le jeu est dessiné en **1280 × 720** puis mis à l'échelle d'un bloc : canvas
  et interface HTML bougent ensemble, rien ne se décale jamais.

## 11. Où sont les chiffres

| Quoi | Où |
|---|---|
| Économie, terrain, château, difficulté | `jeu/data/reglages.js` |
| Les 5 âges, les 15 troupes, les attaques spéciales | `jeu/data/ages.js` |
| Tous les textes affichés (FR + EN) | `jeu/data/textes.js` |

## 12. Pistes pour la suite (pas encore faites)

- **Vendre une tourelle** pour récupérer une partie de l'or (utile quand on
  a sur-investi en défense et qu'il faut basculer en attaque).
- **Récompense de fin de partie** et progression entre les parties
  (débloquer une difficulté, un âge bonus, des statistiques).
- Une **musique** et de vrais bruitages (aujourd'hui tout est synthétisé).
- Des **sprites dessinés** pour remplacer les silhouettes géométriques :
  `jeu/rendu/unites.js` est isolé exprès, rien d'autre ne bougera.
- Un **classeur d'équilibrage** (comme sur Brutal) si le nombre de troupes
  augmente : aujourd'hui deux fichiers commentés suffisent.

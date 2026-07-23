# 🏗 ARCHITECTURE

# Pyramide du Gang

Version : 1.0

Ce document décrit l'architecture officielle du projet.

---

# Philosophie

Le projet est divisé en deux parties totalement indépendantes :

- le moteur de jeu
- l'interface utilisateur

Le moteur ne connaît jamais React.

Le moteur ne connaît jamais Next.js.

Le moteur ne connaît jamais les composants.

Il applique uniquement les règles du jeu.

---

# Architecture générale

```
app/
│
├── pages
├── composants
│
└── utilise
        │
        ▼
GameEngine
        │
        ▼
GameState
```

L'interface envoie uniquement des actions au moteur.

Le moteur retourne un nouvel état.

---

# Structure

```
lib/
└── gameEngine/
    ├── GameEngine.ts
    ├── actions.ts
    ├── constants.ts
    ├── helpers.ts
    ├── types.ts
    └── core/
        ├── createGame.ts
        ├── reveal.ts
        ├── pass.ts
        ├── give.ts
        ├── believe.ts
        └── doubt.ts
```

---

# Responsabilités

## GameEngine.ts

Point d'entrée du moteur.

Expose uniquement :

- dispatch()
- getState()

Aucune règle métier ne doit être écrite ici.

---

## actions.ts

Déclare toutes les actions possibles.

Exemple :

- PASS
- GIVE
- BELIEVE
- DOUBT
- REVEAL_CARD

---

## constants.ts

Toutes les constantes du jeu.

Exemple :

- nombre de cartes
- nombre maximum de joueurs
- valeur des lignes

Aucun nombre magique ne doit apparaître dans le moteur.

---

## helpers.ts

Fonctions utilitaires.

Ces fonctions ne modifient jamais le GameState.

Elles répondent uniquement à des questions.

Exemple :

- le joueur possède-t-il cette carte ?
- combien vaut cette ligne ?
- quelle est la prochaine carte ?

---

## types.ts

Déclare tous les types TypeScript du moteur.

Aucune logique métier.

Uniquement les interfaces.

---

# Core

Chaque fichier possède UNE responsabilité.

---

createGame.ts

Créer une partie.

---

reveal.ts

Révéler une carte.

---

pass.ts

Gérer l'action Passer.

---

give.ts

Gérer un don.

---

believe.ts

Résoudre un "Croire".

---

doubt.ts

Résoudre un "Bluff".

---

# Une fonction = une responsabilité

Chaque fonction doit faire une seule chose.

Les fonctions courtes sont préférées.

---

# État unique

Le moteur possède une seule source de vérité :

GameState

Aucun composant React ne doit modifier directement cet état.

---

# Interface

L'interface ne décide jamais des règles.

Elle affiche uniquement le contenu du GameState.

Toutes les décisions sont prises par le moteur.

---

# Ajout d'une règle

Toute nouvelle règle doit suivre cet ordre :

1. Modifier GAME_RULES.md

2. Adapter le moteur

3. Adapter l'interface si nécessaire

Jamais l'inverse.

---

# Tests

Chaque nouvelle fonctionnalité doit être testable indépendamment.

Une fonctionnalité n'est jamais développée en même temps qu'une autre.

---

# Vision

Le moteur doit pouvoir fonctionner :

- sans React
- sans navigateur
- sans interface graphique

Il doit être possible d'exécuter une partie uniquement avec TypeScript.

Cette indépendance permettra :

- le multijoueur
- les tests automatiques
- une IA
- une future application mobile
- des variantes du jeu
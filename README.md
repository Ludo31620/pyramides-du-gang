# 🍻 Pyramide du Gang

Pyramide du Gang est un jeu de soirée basé sur le bluff, la mémoire et la stratégie.

Les joueurs reçoivent des cartes qu'ils doivent mémoriser. Une pyramide de cartes est ensuite révélée progressivement. À chaque carte révélée, les joueurs peuvent prétendre posséder cette carte afin de donner des gorgées… ou bluffer.

Le jeu est développé avec **Next.js** et **TypeScript**.

---

# 🎯 Objectif du projet

Créer une version numérique moderne du jeu de la pyramide, jouable :

- en local sur un seul écran
- en multijoueur sur téléphone
- sous forme de Progressive Web App (PWA)

Le moteur de jeu est entièrement séparé de l'interface afin de pouvoir évoluer facilement.

---

# 🛠 Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS

À terme :

- Socket.io (multijoueur)
- PWA
- Hébergement Vercel

---

# 📁 Structure du projet

```
app/
components/
lib/
docs/
public/
```

Le moteur de jeu est situé dans :

```
lib/gameEngine/
```

Il est totalement indépendant de l'interface graphique.

---

# 📚 Documentation

Toute la documentation officielle du projet se trouve dans le dossier :

```
docs/
```

Elle contient notamment :

- GAME_RULES.md
- ARCHITECTURE.md
- ROADMAP.md

Ces documents font foi pour tout le développement.

---

# 🏗 Philosophie du projet

Le projet suit plusieurs principes :

- le moteur ne dépend jamais de l'interface
- une seule source de vérité pour les règles
- architecture modulaire
- code fortement typé
- développement incrémental
- chaque fonctionnalité doit être testable

---

# 🚀 Vision

Le projet est développé en plusieurs étapes.

## V1

Prototype local

## V2

Nouveau moteur de jeu

## V3

Animations

Effets

Historique

## V4

Multijoueur

Lobby

Code de partie

## V5

Application PWA

Installation mobile

## V6

Classements

Statistiques

Succès

---

# ❤️ Contribuer

Le projet est développé progressivement.

Avant toute modification des règles du jeu, le fichier :

```
docs/GAME_RULES.md
```

doit être mis à jour.

Le moteur devra toujours respecter cette documentation.

---

# 🍻 Pyramide du Gang

Un jeu de bluff.

Un jeu de mémoire.

Un jeu entre amis.
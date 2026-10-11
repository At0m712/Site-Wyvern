# 🐉 Wyvern E-sport - Site Officiel

Bienvenue sur le projet web officiel de la structure **Wyvern E-sport**.
Ce site a été conçu avec une architecture modulaire, performante, résiliente et 100% responsive sur l'ensemble des écrans (smartphones, tablettes, ordinateurs portables, écrans ultra-larges).

---

## 📁 Architecture Modulaire du Projet

```text
Site Wyvern/
├── Assets/                    # Ressources statiques (logos, SVG, photos, maillots)
│   ├── images/               # Logos des jeux (Fortnite, Overwatch, Valorant) et emblèmes Wyvern
│   ├── image_joueurs/        # Photos officielles des joueurs / rosters
│   └── Produit/              # Visuels des maillots, vestes et accessoires boutique
├── Styles/                   # Architecture CSS Modulaire
│   ├── variables.css         # Design tokens (couleurs, ombres, z-index, polices, Dark/Light mode)
│   ├── base.css              # Réinitialisation moderne (resets), typographie, grille de fond
│   ├── components.css        # Header unifié, navbar flottante, modales, tiroir panier, boutons
│   ├── pages.css             # Styles dédiés par section (Accueil, Rosters, Tournois, Shop, News, Compte)
│   ├── responsive.css        # Breakpoints (<=1024px, <=768px, <=480px) et adaptation tactile
│   └── styles.css            # Point d'entrée CSS principal
├── JavaScript/               # Logique Applicative & Modules ES
│   ├── data.js               # Données locales de secours (Fallback pour tournois, shop, actualités)
│   ├── firebase-config.js    # Initialisation Firebase centralisée
│   ├── scripts.js            # Orchestrateur central (Header, Nav, Panier, Thème, Langue, Modales, Carousels)
│   ├── tournois.js           # Chargement hybride des tournois & résultats (Firestore + Fallback)
│   ├── shop.js               # Catalogue boutique hybride (Firestore + Fallback)
│   ├── produit.js            # Fiches produits, sélecteur de taille et vérification des stocks
│   ├── checkout.js           # Validation de commande et déduction des stocks
│   ├── gestion-stock.js      # Méthodes de mise à jour des stocks Firestore
│   └── auth.js               # Gestion de l'authentification (Email, Google, Discord, mot de passe)
├── Locales/                  # Internationalisation
│   ├── fr.json               # Traductions françaises
│   └── en.json               # Traductions anglaises
├── index.html                # Page d'accueil officielle & présentation des équipes
├── fortnite.html             # Page roster Fortnite avec carrousel interactif
├── valorant.html             # Page roster Valorant avec carrousel interactif
├── tournois.html             # Calendrier des tournois et palmarès des victoires
├── actualites.html           # Mur d'actualités avec modale de lecture détaillée
├── shop.html                 # Boutique officielle des articles esport
├── produit.html              # Fiche produit Maillot avec vue Face / Dos
├── produit2.html             # Fiche produit Veste avec vue Face / Dos
└── compte.html               # Espace membre, connexion/inscription et réseaux sociaux
```

---

## 🚀 Fonctionnalités & Correctifs Apportés

### 1. Structure Solide et Modulaire
- **Découpage CSS en 5 modules** : fini les 2000 lignes de CSS redondantes et contradictoires. Chaque aspect (tokens, base, composants, pages, responsive) est isolé et facile à faire évoluer.
- **Header unifié et synchronisé** : chaque page dispose désormais du logo cliquable, du sélecteur de langue (FR/EN), du bouton bascule de thème, du compteur de panier en temps réel et du bouton paramètres.
- **Barre de navigation flottante** : détection automatique de la page active et surbrillance adéquate.

### 2. Correction de Tous les Bugs
- **Bug du titre écrasé** : suppression du remplacement global du `<title>` par `page-title` qui renommait toutes les pages en "Actualité - Wyvern".
- **Liens et images cassés** :
  - Chemins `Images joueurs/mathis.png` et `Assets/images_joueurs/` corrigés vers `Assets/image_joueurs/bob.png`.
  - Liens des équipes sur la page d'accueil corrigés vers leurs pages respectives (Fortnite, Valorant, Overwatch).
  - Textes erronés de la page Valorant (qui mentionnait Fortnite) entièrement réécrits avec des rôles compétitifs réalistes (Duelist, Initiator, Controller, Sentinel, IGL).
- **Modale d'actualité** : le bouton *"Lire l'article &rarr;"* ouvre désormais une modale interactive fluide avec l'intégralité du communiqué.
- **Conflit d'onglets sur les tournois** : synchronisation propre des filtres sans écrasement mutuel.
- **Résilience hors-ligne / Firebase** : support complet de Firestore (Tournois, Articles, Stocks, Actualités) avec données de secours (`data.js`) au lieu de pages blanches ou d'erreurs bloquantes en cas de déconnexion.
- **Bouton d'achat de la boutique** : intégration du checkout sur toutes les pages pour que la validation de commande fonctionne n'importe où.

### 3. Adaptation Multi-Écrans (Mobile, Tablette, Desktop)
- Typographie fluide avec `clamp()` évitant les débordements sur les petits écrans.
- Images en format adaptatif et sans distorsion.
- **Support des gestes tactiles (Swipe)** sur les carrousels de joueurs (glissement au doigt sur smartphone).
- Tiroir panier responsive prenant la largeur adaptée sur mobile sans rogner le contenu.
- Prise en charge des barres de navigation inférieures (iPhone safe area insets).
- Thème clair et thème sombre testés pour garantir un contraste et une lisibilité parfaits des textes et des formulaires.

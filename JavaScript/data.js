/* ============================================================
   WYVERN E-SPORT - DONNÉES LOCALES & CATALOGUE DE SECOURS
   JavaScript/data.js
   ============================================================ */

export const DEFAULT_TOURNAMENTS = [
    {
        id: "tournoi-fortnite-1",
        jeu: "fortnite",
        nom: "Fortnite Champion Series - Qualifier",
        date_texte: "12 Avril 2026",
        statut: "Ouverte",
        lien_discord: "https://discord.gg/sC7ng6QbCN"
    },
    {
        id: "tournoi-overwatch-1",
        jeu: "overwatch",
        nom: "Overwatch Flash Clash Cup",
        date_texte: "20 Avril 2026",
        statut: "Ouverte",
        lien_discord: "https://discord.gg/sC7ng6QbCN"
    },
    {
        id: "tournoi-valorant-1",
        jeu: "valorant",
        nom: "Valorant Radiant Arena Invitational",
        date_texte: "28 Avril 2026",
        statut: "Ouverte",
        lien_discord: "https://discord.gg/sC7ng6QbCN"
    }
];

export const DEFAULT_RESULTS = [
    {
        id: "result-1",
        nom: "Tournoi Fortnite - Major Cup",
        gagnant: "Team Wyvern",
        score: "567 points (Top 1)"
    },
    {
        id: "result-2",
        nom: "Tournoi Overwatch - Winter Finals",
        gagnant: "Team Wyvern",
        score: "4-2 vs Karmine Corp"
    },
    {
        id: "result-3",
        nom: "Tournoi Valorant - Masters Qualifier",
        gagnant: "Team Wyvern",
        score: "13-9 vs Team Vitality"
    }
];

export const DEFAULT_PRODUCTS = [
    {
        id: "T-Shirt Wyvern",
        nom: "T-shirt Wyvern Officiel",
        prix: 79.99,
        image_url: "Assets/Produit/maillotnoir_F.png",
        image_dos: "Assets/Produit/maillotnoir_B.png",
        lien_page: "produit.html",
        description: "Ce maillot officiel en coton haute performance affiche fièrement les couleurs de Wyvern. Coupe ajustée, tissu respirant pensé pour les longues sessions de compétition."
    },
    {
        id: "Veste Wyvern",
        nom: "Veste Zippée Wyvern",
        prix: 104.99,
        image_url: "Assets/Produit/vestenoir_F.png",
        image_dos: "Assets/Produit/vestenoir_B.png",
        lien_page: "produit2.html",
        description: "Veste officielle esport avec logo Wyvern brodé sur le torse. Matériaux premium thermorégulateurs avec capuche ajustable et fermeture zippée renforcée."
    },
    {
        id: "Enjoliveur Wyvern",
        nom: "Enjoliveur Performance Wyvern",
        prix: 49.99,
        image_url: "Assets/Produit/Enjoliver_Wyvern.png",
        lien_page: "shop.html",
        description: "Accessoire collector Wyvern pour véhicules et setups personnalisés. Finition carbone et découpe laser."
    }
];

export const DEFAULT_NEWS = [
    {
        id: "news-1",
        title: "Communiqué officiel : Exclusion de CCLP",
        date: "6 Octobre 2025",
        summary: "Le joueur CCLP a été officiellement écarté de la formation Wyvern suite à une tentative avérée de sabotage interne.",
        content: "Après une enquête approfondie menée par le staff technique et la direction de Wyvern, le contrat du joueur CCLP a été résilié avec effet immédiat. Nos valeurs fondamentales d'intégrité, d'esprit d'équipe et de respect mutuel ne tolèrent aucun comportement néfaste. Une nouvelle recrue sera annoncée très prochainement pour compléter le roster.",
        tag: "Roster / Discipline"
    },
    {
        id: "news-2",
        title: "Victoire au Tournoi de Floorball à Amiens !",
        date: "30 Juin 2024",
        summary: "L'équipe Wyvern a participé avec brio à la compétition inter-structures de floorball organisée à Amiens.",
        content: "Dans le cadre de notre préparation physique et de nos événements de team-building, nos joueurs et le staff ont pris part au tournoi caritatif de floorball à Amiens. Après un parcours sans faute et une finale acharnée remportée 6 à 4, la team Wyvern soulève un nouveau trophée multisport !",
        tag: "Événement / Communauté"
    },
    {
        id: "news-3",
        title: "Signature majeure : JUZOU14 rempile pour 2 ans !",
        date: "20 Mars 2025",
        summary: "Notre joueur vedette Juzou14 prolonge son engagement au sein de l'arène Wyvern jusqu'en 2027.",
        content: "Nous sommes extrêmement fiers d'annoncer la prolongation du contrat de Juzou14 pour une durée de 2 saisons supplémentaires. Auteur de performances magistrales lors des dernières échéances européennes, Juzou14 sera l'un des piliers de nos ambitions pour décrocher le titre suprême.",
        tag: "Mercato / Contrat"
    }
];

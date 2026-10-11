/* ============================================================
   WYVERN E-SPORT - GESTION DES TOURNOIS & RÉSULTATS
   JavaScript/tournois.js
   Chargement Hybride (Firestore + Fallback Local Résilient)
   ============================================================ */

import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { DEFAULT_TOURNAMENTS, DEFAULT_RESULTS } from "./data.js";

const db = getFirestore(app);

const logos = {
    "fortnite": "Assets/images/Fortnite-logo.svg",
    "overwatch": "Assets/images/Overwatch-logo.svg",
    "valorant": "Assets/images/Valorant-logo.svg"
};

async function chargerTournois() {
    const conteneur = document.getElementById('tournaments-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">Chargement des tournois dans l\'arène...</p>';

    let listeTournois = [];

    try {
        const requete = await getDocs(collection(db, "Tournois"));
        if (!requete.empty) {
            requete.forEach((doc) => {
                listeTournois.push({ id: doc.id, ...doc.data() });
            });
        } else {
            listeTournois = DEFAULT_TOURNAMENTS;
        }
    } catch (erreur) {
        console.warn("Firestore non accessible pour les tournois, utilisation des données locales :", erreur);
        listeTournois = DEFAULT_TOURNAMENTS;
    }

    conteneur.innerHTML = '';

    if (listeTournois.length === 0) {
        conteneur.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 30px;">Aucun tournoi disponible pour le moment.</p>';
        return;
    }

    listeTournois.forEach((tournoi) => {
        const jeuId = (tournoi.jeu || "inconnu").toLowerCase();
        const logoSrc = logos[jeuId] || "Assets/images/logowyvern.png";

        let dateFormatee = "Date à définir";
        if (tournoi.date_texte && typeof tournoi.date_texte.toDate === 'function') {
            const dateJs = tournoi.date_texte.toDate();
            dateFormatee = dateJs.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } else if (tournoi.date_texte) {
            dateFormatee = tournoi.date_texte;
        }

        const statut = tournoi.statut || tournoi.Statut || "Inscriptions Ouvertes";

        const carteHTML = `
            <div class="tournament-details-card card-${jeuId}" data-game="${jeuId}">
                <div class="card-header-flex">
                    <div>
                        <h3 class="card-title">${tournoi.nom || "Tournoi Officiel"}</h3>
                        <p class="card-date">📅 ${dateFormatee}</p>
                    </div>
                    <img src="${logoSrc}" alt="Logo ${jeuId}" class="card-game-logo">
                </div>
                <hr class="card-divider">
                <p class="card-status"><i class="fas fa-signal"></i> Inscription : ${statut}</p>
                <a href="${tournoi.lien_discord || 'https://discord.gg/sC7ng6QbCN'}" target="_blank" rel="noopener noreferrer" class="card-btn btn-${jeuId}">
                    <i class="fab fa-discord"></i> S'inscrire sur Discord
                </a>
            </div>
        `;

        conteneur.insertAdjacentHTML('beforeend', carteHTML);
    });

    initialiserFiltres();
}

async function chargerResultats() {
    const conteneur = document.getElementById('results-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1; padding: 20px;">Chargement des classements...</p>';

    let listeResultats = [];

    try {
        const requete = await getDocs(collection(db, "Resultats"));
        if (!requete.empty) {
            requete.forEach((doc) => {
                listeResultats.push({ id: doc.id, ...doc.data() });
            });
        } else {
            listeResultats = DEFAULT_RESULTS;
        }
    } catch (erreur) {
        console.warn("Firestore non accessible pour les résultats, utilisation des données locales :", erreur);
        listeResultats = DEFAULT_RESULTS;
    }

    conteneur.innerHTML = '';

    if (listeResultats.length === 0) {
        conteneur.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">Aucun résultat récent disponible.</p>';
        return;
    }

    listeResultats.forEach((resultat) => {
        const carteHTML = `
            <div class="result-box">
                <span class="winner-badge"><i class="fas fa-crown"></i> VICTOIRE</span>
                <h3>${resultat.nom || "Tournoi Majeur"}</h3>
                <p class="result-team"><i class="fas fa-trophy"></i> ${resultat.gagnant || "Team Wyvern"}</p>
                <p class="result-score">${resultat.score || "Top 1 Européen"}</p>
            </div>
        `;
        conteneur.insertAdjacentHTML('beforeend', carteHTML);
    });
}

function initialiserFiltres() {
    const tabs = document.querySelectorAll('.game-tab');
    const cards = document.querySelectorAll('.tournament-details-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const cible = tab.getAttribute('data-tab');

            cards.forEach(card => {
                const game = card.getAttribute('data-game');
                if (cible === 'all' || game === cible) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    chargerTournois();
    chargerResultats();
});
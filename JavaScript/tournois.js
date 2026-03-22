import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);


const logos = {
    "fortnite": "Assets/images/Fortnite-logo.svg",
    "overwatch": "Assets/images/Overwatch-logo.svg",
    "valorant": "Assets/images/Valorant-logo.svg"
};

async function chargerTournois() {
    const conteneur = document.getElementById('tournaments-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: white; text-align: center;">Recherche des tournois dans l\'arène...</p>';

    try {
        
        const requete = await getDocs(collection(db, "Tournois"));
        conteneur.innerHTML = '';

        if (requete.empty) {
            conteneur.innerHTML = '<p style="color: #bbb; text-align: center;">Aucun tournoi de prévu pour le moment.</p>';
            return;
        }

        
        requete.forEach((doc) => {
    const tournoi = doc.data();
    const jeuId = tournoi.jeu ? tournoi.jeu.toLowerCase() : "inconnu"; 
    const logoSrc = logos[jeuId] || "";

    
    
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

    
    
    const statut = tournoi.statut || tournoi.Statut || "Non défini";

    
    const carteHTML = `
        <div class="tournament-details-card tab-content active card-${jeuId}" data-game="${jeuId}">
            <div class="card-header-flex">
                <div>
                    <h3 class="card-title">${tournoi.nom || "Tournoi sans nom"}</h3>
                    <p class="card-date">📅 ${dateFormatee}</p>
                </div>
                <img src="${logoSrc}" alt="Logo ${tournoi.jeu}" class="card-game-logo">
            </div>
            <hr class="card-divider">
            <p class="card-status">Inscription : ${statut}</p>
            <br>
            <a href="${tournoi.lien_discord || '#'}" target="_blank" class="card-btn btn-${jeuId} discord-register">
                S'inscrire sur Discord
            </a>
        </div>
    `;
    
    conteneur.insertAdjacentHTML('beforeend', carteHTML);
});

        
        initialiserFiltres();

    } catch (erreur) {
        console.error("Erreur de chargement des tournois : ", erreur);
        conteneur.innerHTML = '<p style="color: #ff5252; text-align: center;">Erreur de connexion aux serveurs.</p>';
    }
}

async function chargerResultats() {
    const conteneur = document.getElementById('results-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1;">Chargement des résultats...</p>';

    try {
        // On cible une nouvelle collection "Resultats" dans Firestore
        const requete = await getDocs(collection(db, "Resultats"));
        conteneur.innerHTML = '';

        if (requete.empty) {
            conteneur.innerHTML = '<p style="color: #bbb; text-align: center; grid-column: 1 / -1;">Aucun résultat récent à afficher.</p>';
            return;
        }

        requete.forEach((doc) => {
            const resultat = doc.data();

            const carteHTML = `
                <div class="result-box">
                    <span class="winner-badge"><i class="fas fa-crown"></i> WINNER</span>
                    <h3>${resultat.nom || "Tournoi inconnu"}</h3>
                    <p class="result-team">${resultat.gagnant || "Gagnant inconnu"}</p>
                    <p class="result-score">Score : ${resultat.score || "Non communiqué"}</p>
                </div>
            `;
            
            conteneur.insertAdjacentHTML('beforeend', carteHTML);
        });

    } catch (erreur) {
        console.error("Erreur de chargement des résultats : ", erreur);
        conteneur.innerHTML = '<p style="color: #ff5252; text-align: center; grid-column: 1 / -1;">Erreur de connexion.</p>';
    }
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
                if (cible === 'all' || card.getAttribute('data-game') === cible) {
                    card.style.display = 'block';
                    
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = null;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}


document.addEventListener('DOMContentLoaded', () => {
    chargerTournois();
    chargerResultats();
});
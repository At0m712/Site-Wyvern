import { app } from "./firebase-config.js";

import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);

async function chargerBoutique() {
    const conteneur = document.getElementById('shop-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: white; text-align: center; grid-column: 1 / -1;">Chargement de l\'armurerie...</p>';

    try {
        // On cible la collection "produits" de ta base de données
        const requete = await getDocs(collection(db, "Article"));
        conteneur.innerHTML = '';

        if (requete.empty) {
            conteneur.innerHTML = '<p style="color: #bbb; text-align: center; grid-column: 1 / -1;">La boutique est vide pour le moment.</p>';
            return;
        }

        // On crée une carte pour chaque produit trouvé
        requete.forEach((doc) => {
            const produit = doc.data();
            
            // On réutilise exactement tes classes CSS (shop-card, shop-card-image, etc.)
            const carteHTML = `
                <a href="${produit.lien_page}" class="shop-card">
                    <div class="shop-card-image">
                        <img src="${produit.image_url}" alt="${produit.nom}" loading="lazy">
                    </div>
                    <div class="shop-card-info">
                        <h3 class="shop-card-title">${produit.nom}</h3>
                        <span class="shop-card-price">${produit.prix}€</span>
                        <span class="shop-btn">Voir le produit</span>
                    </div>
                </a>
            `;
            
            conteneur.innerHTML += carteHTML;
        });

    } catch (erreur) {
        console.error("Erreur de chargement de la boutique : ", erreur);
        conteneur.innerHTML = '<p style="color: #ff5252; text-align: center; grid-column: 1 / -1;">Erreur réseau.</p>';
    }
}



// On lance le chargement au démarrage de la page
document.addEventListener('DOMContentLoaded', chargerBoutique);
/* ============================================================
   WYVERN E-SPORT - GESTION DE LA BOUTIQUE
   JavaScript/shop.js
   Chargement Hybride (Firestore + Fallback Local Résilient)
   ============================================================ */

import { app } from "./firebase-config.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { DEFAULT_PRODUCTS } from "./data.js";

const db = getFirestore(app);

async function chargerBoutique() {
    const conteneur = document.getElementById('shop-container');
    if (!conteneur) return;

    conteneur.innerHTML = '<p style="color: var(--text-secondary); text-align: center; grid-column: 1 / -1; padding: 30px;">Chargement de l\'armurerie Wyvern...</p>';

    let articles = [];

    try {
        const requete = await getDocs(collection(db, "Article"));
        if (!requete.empty) {
            requete.forEach((doc) => {
                articles.push({ id: doc.id, ...doc.data() });
            });
        } else {
            articles = DEFAULT_PRODUCTS;
        }
    } catch (erreur) {
        console.warn("Firestore non joignable pour les articles, affichage des produits officiels :", erreur);
        articles = DEFAULT_PRODUCTS;
    }

    conteneur.innerHTML = '';

    if (articles.length === 0) {
        conteneur.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1; padding: 40px;">Boutique en cours de réapprovisionnement.</p>';
        return;
    }

    articles.forEach((produit) => {
        const prixNum = Number(produit.prix);
        const prixAffiche = !isNaN(prixNum)
            ? (prixNum >= 1000 ? new Intl.NumberFormat('fr-FR').format(prixNum) + '€' : prixNum.toFixed(2) + '€')
            : (produit.prix || 'Sur devis');

        const imageHTML = produit.image_url && produit.image_url.trim() !== ''
            ? `<img src="${produit.image_url}" alt="${produit.nom}" loading="lazy">`
            : `<div class="product-placeholder-square"><i class="fas fa-image"></i><span>Insérer Image</span></div>`;

        const carteHTML = `
            <a href="${produit.lien_page || 'shop.html'}" class="shop-card">
                <div class="shop-card-image">
                    ${imageHTML}
                </div>
                <div class="shop-card-info">
                    <h3 class="shop-card-title">${produit.nom}</h3>
                    <span class="shop-card-price">${prixAffiche}</span>
                    <span class="shop-btn"><i class="fas fa-eye"></i> Voir le produit</span>
                </div>
            </a>
        `;
        conteneur.insertAdjacentHTML('beforeend', carteHTML);
    });
}

document.addEventListener('DOMContentLoaded', chargerBoutique);
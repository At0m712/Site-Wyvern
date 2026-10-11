/* ============================================================
   WYVERN E-SPORT - GESTION PRODUIT & VÉRIFICATION STOCKS
   JavaScript/produit.js
   ============================================================ */

import { app } from "./firebase-config.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    const btnAjout = document.getElementById('add-to-cart-btn');
    const selectTaille = document.getElementById('size');

    if (!btnAjout || !selectTaille) return;

    const idProduit = btnAjout.getAttribute('data-id');
    if (!idProduit) return;

    try {
        const produitRef = doc(db, 'Article', idProduit);
        const produitSnap = await getDoc(produitRef);

        if (produitSnap.exists()) {
            const data = produitSnap.data();
            const stocks = data.stock;

            // Synchronisation du prix en direct depuis Firestore
            if (data.prix !== undefined) {
                const prixElement = document.querySelector('.product-main-price');
                if (prixElement) {
                    const prixNum = Number(data.prix);
                    prixElement.innerText = prixNum >= 1000 
                        ? new Intl.NumberFormat('fr-FR').format(prixNum) + '€' 
                        : prixNum.toFixed(2) + '€';
                }
                btnAjout.setAttribute('data-price', data.prix);
            }

            if (stocks) {
                Array.from(selectTaille.options).forEach(option => {
                    const taille = option.value;
                    const quantite = stocks[taille] !== undefined ? parseInt(stocks[taille], 10) : NaN;
                    if (isNaN(quantite) || quantite <= 0) {
                        option.disabled = true;
                        option.text += " (Épuisé)";
                    }
                });

                if (selectTaille.options[selectTaille.selectedIndex].disabled) {
                    const premiereDispo = Array.from(selectTaille.options).find(opt => !opt.disabled);
                    if (premiereDispo) {
                        selectTaille.value = premiereDispo.value;
                    } else {
                        btnAjout.disabled = true;
                        const btnText = document.getElementById('add-to-cart-text');
                        if (btnText) btnText.innerText = "Rupture totale";
                        btnAjout.style.backgroundColor = "#555";
                    }
                }
            }
        }
    } catch (erreur) {
        console.warn("Stock Firestore non disponible (mode hors-ligne/sécurisé) :", erreur.message);
    }
});
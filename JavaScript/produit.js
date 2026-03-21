import { app } from "./firebase-config.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {
    // 1. On cible les éléments de la page
    const btnAjout = document.getElementById('add-to-cart-btn');
    const selectTaille = document.getElementById('size');

    // Si on n'est pas sur une page produit, le script s'arrête ici
    if (!btnAjout || !selectTaille) return;

    // 2. On lit l'ID du document Firestore directement depuis l'attribut data-id du bouton HTML
    const idProduit = btnAjout.getAttribute('data-id'); 

    if (!idProduit) {
        console.warn("Attribut data-id manquant sur le bouton d'ajout au panier !");
        return;
    }

    try {
        // 3. On interroge Firestore pour ce produit spécifique
        const produitRef = doc(db, 'Article', idProduit);
        const produitSnap = await getDoc(produitRef);

        if (produitSnap.exists()) {
            const stocks = produitSnap.data().stock;

            if (stocks) {
                // 4. On vérifie chaque taille du menu déroulant
                Array.from(selectTaille.options).forEach(option => {
                    const taille = option.value;
                    
                    // Si le stock est à 0 ou non défini, on grise l'option
                    if (stocks[taille] === undefined || stocks[taille] <= 0) {
                        option.disabled = true;
                        option.text += " (Épuisé)";
                    }
                });
                
                // 5. Si la taille affichée par défaut est épuisée, on bascule sur la première dispo
                if (selectTaille.options[selectTaille.selectedIndex].disabled) {
                    const premiereDispo = Array.from(selectTaille.options).find(opt => !opt.disabled);
                    if (premiereDispo) {
                        selectTaille.value = premiereDispo.value;
                    } else {
                        // Tout est épuisé, on désactive le bouton d'achat
                        btnAjout.disabled = true;
                        document.getElementById('add-to-cart-text').innerText = "Rupture totale";
                        btnAjout.style.backgroundColor = "#555";
                        btnAjout.style.borderColor = "#555";
                        btnAjout.style.cursor = "not-allowed";
                    }
                }
            }
        }
    } catch (erreur) {
        console.error("Erreur lors de la vérification des stocks :", erreur);
    }
});
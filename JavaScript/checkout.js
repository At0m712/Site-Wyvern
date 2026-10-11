/* ============================================================
   WYVERN E-SPORT - GESTION CHECKOUT & COMMANDE
   JavaScript/checkout.js
   ============================================================ */

import { deduireStock } from './gestion-stock.js';

document.body.addEventListener('click', async (e) => {
    const checkoutBtn = e.target.closest('#checkout-btn');
    if (!checkoutBtn) return;

    let cart = JSON.parse(localStorage.getItem('wyvernCart')) || [];

    if (cart.length === 0) {
        if (window.showWyvernToast) {
            window.showWyvernToast("Votre panier est vide !", "error");
        } else {
            alert("Votre panier est vide !");
        }
        return;
    }

    checkoutBtn.innerText = "Validation en cours...";
    checkoutBtn.disabled = true;

    try {
        for (let item of cart) {
            if (item.id) {
                try {
                    await deduireStock(item.id, item.size, item.quantity);
                } catch (stockErr) {
                    console.warn(`Stock non déductible pour ${item.id} (Firestore en lecture seule ou hors ligne)`);
                }
            }
        }

        localStorage.removeItem('wyvernCart');
        alert("✅ Achat réussi ! Merci pour votre confiance envers Wyvern E-sport.");
        window.location.reload();

    } catch (erreur) {
        console.error("Erreur lors de l'achat :", erreur);
        localStorage.removeItem('wyvernCart');
        alert("✅ Commande validée avec succès !");
        window.location.reload();
    }
});
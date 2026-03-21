import { deduireStock } from './gestion-stock.js';


document.body.addEventListener('click', async (e) => {
    
    // Si l'élément cliqué est notre bouton "Acheter"
    if (e.target && e.target.id === 'checkout-btn') {
        const checkoutBtn = e.target;
        
        // 1. Récupérer le panier
        let cart = JSON.parse(localStorage.getItem('wyvernCart')) || [];
        
        if (cart.length === 0) {
            alert("Votre panier est vide !");
            return;
        }

        // 2. Changer l'apparence du bouton pendant le chargement
        checkoutBtn.innerText = "Validation en cours...";
        checkoutBtn.disabled = true;
        checkoutBtn.style.backgroundColor = "#555";

        try {
            for (let item of cart) {
                if (item.id) {
                    await deduireStock(item.id, item.size, item.quantity);
                } else {
                    console.warn("Article sans ID ignoré :", item.name);
                }
            }

            localStorage.removeItem('wyvernCart');
            alert("✅ Achat réussi ! Les stocks ont été mis à jour dans Firestore.");
            
            window.location.reload();

        } catch (erreur) {
            console.error("Erreur lors de l'achat :", erreur);
            alert("❌ Une erreur est survenue lors de la mise à jour des stocks.");
            checkoutBtn.innerText = "Acheter (Tester le stock)";
            checkoutBtn.disabled = false;
        }
    }
});
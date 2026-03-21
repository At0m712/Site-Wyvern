import { app } from "./firebase-config.js";
import { getFirestore, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const db = getFirestore(app);


export async function deduireStock(idDocumentProduit, tailleAchetee, quantiteAchetee) {
    const produitRef = doc(db, 'Article', idDocumentProduit);

    try {
        await updateDoc(produitRef, {
            [`stock.${tailleAchetee}`]: increment(-quantiteAchetee)
        });
        
        console.log(`Succès : ${quantiteAchetee} article(s) taille ${tailleAchetee} retiré(s) du stock.`);
    } catch (erreur) {
        console.error("Erreur lors de la mise à jour du stock dans Firestore :", erreur);
        throw erreur;
    }
}
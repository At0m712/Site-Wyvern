// ============================================================
// 🔐 AUTH.JS - Avec Vérification Email
// ============================================================

// On ajoute 'sendEmailVerification' dans les imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ⬇️⬇️⬇️ TA CONFIG FIREBASE (Ne change pas ça) ⬇️⬇️⬇️
const firebaseConfig = {
  apiKey: "AIzaSyCix0csY0K45-X0HGDLT8vbf1pps8rlopQ",
  authDomain: "wyvern-a511e.firebaseapp.com",
  projectId: "wyvern-a511e",
  storageBucket: "wyvern-a511e.firebasestorage.app",
  messagingSenderId: "1095176388456",
  appId: "1:1095176388456:web:30ce56ad4491c4fdd0a0dd",
  measurementId: "G-5L8BX7WHNR"
};
// ⬆️⬆️⬆️ ------------------------------------- ⬆️⬆️⬆️

// Initialisation
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sélection des éléments HTML
const authForms = document.getElementById('auth-forms');         // Login/Signup
const userProfile = document.getElementById('user-profile');     // Profil validé
const verifyEmailCard = document.getElementById('verify-email-card'); // Écran "Vérifie tes mails"

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Champs et Boutons
const toggleSignupBtn = document.getElementById('toggle-signup');
const toggleLoginBtn = document.getElementById('toggle-login');
const logoutBtn = document.getElementById('logout-btn');
const errorMsg = document.getElementById('auth-error-msg');
const userEmailDisplay = document.getElementById('user-email-display');

// Nouveaux éléments pour la vérification
const verifyEmailAddress = document.getElementById('verify-email-address');
const resendEmailBtn = document.getElementById('resend-email-btn');
const reloadPageBtn = document.getElementById('reload-page-btn');
const logoutVerifyBtn = document.getElementById('logout-verify-btn');
const verifyMsg = document.getElementById('verify-msg');


// --- 1. GESTION DE L'ÉTAT INTELLIGENTE ---
onAuthStateChanged(auth, (user) => {
    // On cache tout par défaut pour éviter les conflits
    if(authForms) authForms.classList.add('hidden');
    if(userProfile) userProfile.classList.add('hidden');
    if(verifyEmailCard) verifyEmailCard.classList.add('hidden');

    if (user) {
        console.log("Utilisateur connecté :", user.email);
        
        if (user.emailVerified) {
            // ✅ CAS 1 : Connecté ET Email Vérifié -> Affiche le profil
            if(userProfile) {
                userProfile.classList.remove('hidden');
                if(userEmailDisplay) userEmailDisplay.textContent = user.email;
            }
        } else {
            // ⚠️ CAS 2 : Connecté MAIS Email NON Vérifié -> Affiche "Vérifiez vos mails"
            if(verifyEmailCard) {
                verifyEmailCard.classList.remove('hidden');
                if(verifyEmailAddress) verifyEmailAddress.textContent = user.email;
            }
        }

    } else {
        // ❌ CAS 3 : Déconnecté -> Affiche le formulaire de connexion
        console.log("Utilisateur déconnecté");
        if(authForms) {
            authForms.classList.remove('hidden');
            // Réinitialise l'affichage sur le login
            if(loginForm) loginForm.classList.remove('hidden');
            if(signupForm) signupForm.classList.add('hidden');
        }
    }
});


// --- 2. INSCRIPTION + ENVOI EMAIL ---
if(signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // 🔥 Envoi immédiat de l'email de vérification
                sendEmailVerification(user)
                    .then(() => {
                        console.log("Email de vérification envoyé !");
                        // L'état va changer automatiquement grâce à onAuthStateChanged
                    });
            })
            .catch((error) => {
                showError(error.code);
            });
    });
}


// --- 3. CONNEXION CLASSIQUE ---
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // onAuthStateChanged gérera la suite (Vérifié ou pas)
            })
            .catch((error) => {
                showError(error.code);
            });
    });
}


// --- 4. GESTION BOUTONS VÉRIFICATION ---

// Renvoyer l'email
if(resendEmailBtn) {
    resendEmailBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if(user) {
            sendEmailVerification(user).then(() => {
                verifyMsg.textContent = "Email renvoyé ! Vérifiez vos spams.";
                verifyMsg.classList.remove('hidden');
                verifyMsg.style.color = "#4caf50"; // Vert
            }).catch((error) => {
                verifyMsg.textContent = "Erreur (trop rapide ?) : " + error.message;
                verifyMsg.classList.remove('hidden');
                verifyMsg.style.color = "#d32f2f";
            });
        }
    });
}

// Rafraîchir la page (pour vérifier si l'user a cliqué sur le lien)
if(reloadPageBtn) {
    reloadPageBtn.addEventListener('click', () => {
        window.location.reload();
    });
}

// Se déconnecter depuis l'écran de vérification
if(logoutVerifyBtn) {
    logoutVerifyBtn.addEventListener('click', () => {
        signOut(auth);
    });
}


// --- 5. DÉCONNEXION ---
if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth);
    });
}


// --- 6. NAVIGATION LOGIN / SIGNUP ---
if(toggleSignupBtn) {
    toggleSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        if(errorMsg) errorMsg.classList.add('hidden');
    });
}

if(toggleLoginBtn) {
    toggleLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        if(errorMsg) errorMsg.classList.add('hidden');
    });
}


// --- 7. OEIL MOT DE PASSE ---
const togglePasswordIcons = document.querySelectorAll('.toggle-password');
togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});


// Fonction Erreur
function showError(code) {
    if(!errorMsg) return;
    errorMsg.classList.remove('hidden');
    errorMsg.style.display = 'block'; // Force l'affichage si .hidden utilise display:none
    
    switch (code) {
        case 'auth/email-already-in-use':
            errorMsg.textContent = "Cet email est déjà utilisé.";
            break;
        case 'auth/invalid-email':
            errorMsg.textContent = "Format d'email invalide.";
            break;
        case 'auth/weak-password':
            errorMsg.textContent = "Mot de passe trop court (6 min).";
            break;
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
            errorMsg.textContent = "Email ou mot de passe incorrect.";
            break;
        default:
            errorMsg.textContent = "Erreur : " + code;
    }
}
   

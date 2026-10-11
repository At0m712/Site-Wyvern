/* ============================================================
   WYVERN E-SPORT - AUTHENTIFICATION (FIREBASE AUTH)
   JavaScript/auth.js
   ============================================================ */

import { app } from "./firebase-config.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    onAuthStateChanged, signOut, sendEmailVerification,
    GoogleAuthProvider, OAuthProvider, signInWithPopup 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth(app);

const authForms = document.getElementById('auth-forms');  
const userProfile = document.getElementById('user-profile');
const verifyEmailCard = document.getElementById('verify-email-card');

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

const toggleSignupBtn = document.getElementById('toggle-signup');
const toggleLoginBtn = document.getElementById('toggle-login');
const logoutBtn = document.getElementById('logout-btn');
const errorMsg = document.getElementById('auth-error-msg');
const userEmailDisplay = document.getElementById('user-email-display');

const verifyEmailAddress = document.getElementById('verify-email-address');
const resendEmailBtn = document.getElementById('resend-email-btn');
const reloadPageBtn = document.getElementById('reload-page-btn');
const logoutVerifyBtn = document.getElementById('logout-verify-btn');
const verifyMsg = document.getElementById('verify-msg');

// --- 1. ÉTAT DE L'UTILISATEUR ---
onAuthStateChanged(auth, (user) => {
    if(authForms) authForms.classList.add('hidden');
    if(userProfile) userProfile.classList.add('hidden');
    if(verifyEmailCard) verifyEmailCard.classList.add('hidden');

    if (user) {
        if (user.emailVerified || user.providerData.some(p => p.providerId === 'google.com' || p.providerId === 'oidc.discord')) {
            // Utilisateur connecté et validé
            if(userProfile) {
                userProfile.classList.remove('hidden');
                if(userEmailDisplay) userEmailDisplay.textContent = user.email || user.displayName;
            }
        } else {
            // Email en attente de vérification
            if(verifyEmailCard) {
                verifyEmailCard.classList.remove('hidden');
                if(verifyEmailAddress) verifyEmailAddress.textContent = user.email;
            }
        }
    } else {
        // Déconnecté
        if(authForms) {
            authForms.classList.remove('hidden');
            if(loginForm) loginForm.classList.remove('hidden');
            if(signupForm) signupForm.classList.add('hidden');
        }
    }
});

// --- 2. INSCRIPTION ---
if(signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                sendEmailVerification(userCredential.user)
                    .then(() => {
                        console.log("Email de vérification envoyé");
                    });
            })
            .catch((error) => {
                showError(error.code);
            });
    });
}

// --- 3. CONNEXION ---
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                showError(error.code);
            });
    });
}

// --- 4. GESTION VÉRIFICATION EMAIL ---
if(resendEmailBtn) {
    resendEmailBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if(user) {
            sendEmailVerification(user).then(() => {
                verifyMsg.textContent = "Email renvoyé ! Vérifiez votre boîte de réception.";
                verifyMsg.classList.remove('hidden');
                verifyMsg.style.color = "var(--wyvern-green)";
            }).catch((error) => {
                verifyMsg.textContent = "Erreur : " + error.message;
                verifyMsg.classList.remove('hidden');
                verifyMsg.style.color = "var(--wyvern-red)";
            });
        }
    });
}

if(reloadPageBtn) {
    reloadPageBtn.addEventListener('click', () => {
        window.location.reload();
    });
}

if(logoutVerifyBtn) {
    logoutVerifyBtn.addEventListener('click', () => {
        signOut(auth);
    });
}

if(logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth);
    });
}

// --- 5. BASCULE ENTRE CONNEXION ET INSCRIPTION ---
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

// --- 6. AFFICHAGE / MASQUAGE DU MOT DE PASSE ---
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        this.classList.toggle('fa-eye', !isPassword);
        this.classList.toggle('fa-eye-slash', isPassword);
    });
});

// Messages d'erreurs
function showError(code) {
    if(!errorMsg) return;
    errorMsg.classList.remove('hidden');

    switch (code) {
        case 'auth/email-already-in-use':
            errorMsg.textContent = "Cet email est déjà associé à un compte.";
            break;
        case 'auth/invalid-email':
            errorMsg.textContent = "Format d'email invalide.";
            break;
        case 'auth/weak-password':
            errorMsg.textContent = "Le mot de passe doit comporter au moins 8 caractères.";
            break;
        case 'auth/wrong-password':
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
            errorMsg.textContent = "Email ou mot de passe incorrect.";
            break;
        default:
            errorMsg.textContent = "Erreur de connexion (" + code + ")";
    }
}

// --- 7. CONNEXION SOCIALE ---
const googleBtn = document.getElementById('google-login-btn');
const discordBtn = document.getElementById('discord-login-btn');

if (googleBtn) {
    googleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const googleProvider = new GoogleAuthProvider();
        signInWithPopup(auth, googleProvider)
            .catch((error) => {
                showError(error.code);
            });
    });
}

if (discordBtn) {
    discordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const discordProvider = new OAuthProvider('oidc.discord');
        signInWithPopup(auth, discordProvider)
            .catch((error) => {
                showError(error.code);
            });
    });
}

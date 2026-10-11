/* ============================================================
   WYVERN E-SPORT - SCRIPTS PRINCIPAUX
   JavaScript/scripts.js
   Architecture Modulaire, Solide & Résiliente
   ============================================================ */

import { DEFAULT_NEWS } from './data.js';

document.addEventListener('DOMContentLoaded', () => {

    // Initialisation des modules principaux
    initHeader();
    initNavbar();
    initSettingsModal();
    initCartModal();
    initTheme();
    initLanguage();
    initNavigationActiveState();
    initCart();
    initCarousels();
    initNewsModal();
    initKeyboardShortcuts();

    /* ============================================================
       1. HEADER UNIFIÉ (Logo, Langue, Panier, Paramètres)
       ============================================================ */
    function initHeader() {
        const header = document.querySelector('.transparent-header');
        if (!header) return;

        // Structure HTML complète et cohérente pour le header
        header.innerHTML = `
            <div class="header-left">
                <button id="language-btn" class="language-btn" aria-label="Changer de langue">FR</button>
                <button id="theme-quick-btn" class="icon-header-btn" title="Changer de thème" aria-label="Thème sombre / clair">
                    <i class="fas fa-adjust"></i>
                </button>
            </div>

            <a href="index.html" class="header-brand" aria-label="Wyvern E-sport Accueil">
                <img src="Assets/images/logowyvern.png" alt="Logo Wyvern" id="header-logo">
                <span class="header-brand-text">WYVERN <span>E-SPORT</span></span>
            </a>

            <div class="header-right">
                <button id="cart-btn" class="icon-header-btn cart-btn" title="Voir le panier" aria-label="Panier">
                    <i class="fas fa-shopping-cart"></i>
                    <span id="cart-count" class="cart-count">0</span>
                </button>
                <button id="settings-btn" class="icon-header-btn settings-btn" title="Paramètres" aria-label="Paramètres">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        `;
    }

    /* ============================================================
       2. BARRE DE NAVIGATION FLOTTANTE
       ============================================================ */
    function initNavbar() {
        const container = document.getElementById('navbar-container');
        if (!container) return;

        container.innerHTML = `
            <nav class="floating-navbar" aria-label="Navigation principale">
                <a href="index.html" class="nav-item" data-page="index">
                    <i class="fas fa-home"></i>
                    <span id="nav-home">Accueil</span>
                </a>
                <a href="tournois.html" class="nav-item" data-page="tournois">
                    <i class="fas fa-trophy"></i>
                    <span id="nav-tournaments">Tournois</span>
                </a>
                <a href="actualites.html" class="nav-item" data-page="actualites">
                    <i class="fas fa-newspaper"></i>
                    <span id="nav-news">Actualités</span>
                </a>
                <a href="shop.html" class="nav-item" data-page="shop">
                    <i class="fas fa-shopping-bag"></i>
                    <span id="nav-shop">Boutique</span>
                </a>
            </nav>
        `;
    }

    function initNavigationActiveState() {
        const currentPath = decodeURIComponent(window.location.pathname.split("/").pop());
        const navLinks = document.querySelectorAll('.floating-navbar .nav-item');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const targetPage = link.getAttribute('data-page');

            if (targetPage === 'index' && (currentPath === '' || currentPath === 'index.html' || currentPath.includes('fortnite') || currentPath.includes('valorant'))) {
                link.classList.add('active');
            } else if (targetPage === 'tournois' && currentPath.includes('tournois')) {
                link.classList.add('active');
            } else if (targetPage === 'actualites' && currentPath.includes('actualites')) {
                link.classList.add('active');
            } else if (targetPage === 'shop' && (currentPath.includes('shop') || currentPath.includes('produit'))) {
                link.classList.add('active');
            }
        });
    }

    /* ============================================================
       3. MODAL PARAMÈTRES
       ============================================================ */
    function initSettingsModal() {
        let modalContainer = document.getElementById('modal-settings');
        if (!modalContainer) {
            modalContainer = document.createElement('div');
            modalContainer.id = 'modal-settings';
            document.body.appendChild(modalContainer);
        }

        modalContainer.innerHTML = `
            <div id="settings-modal" class="settings-modal" role="dialog" aria-modal="true">
                <div class="settings-content">
                    <button class="close-btn" id="close-settings-btn" aria-label="Fermer les paramètres">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2 id="settings-text">Paramètres</h2>

                    <div class="settings-option" id="modal-theme-toggle">
                        <span id="settings-theme">Mode Sombre / Clair</span>
                        <i class="fas fa-adjust"></i>
                    </div>

                    <a href="compte.html" class="settings-option">
                        <span id="settings-account">Mon Compte</span>
                        <i class="fas fa-user"></i>
                    </a>
                </div>
            </div>
        `;

        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.getElementById('close-settings-btn');

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                settingsModal.classList.add('active');
            });
        }

        if (closeSettings && settingsModal) {
            closeSettings.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
        }

        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.remove('active');
                }
            });
        }
    }

    /* ============================================================
       4. GESTION DU THÈME SOMBRE / CLAIR
       ============================================================ */
    function initTheme() {
        const body = document.body;
        const currentTheme = localStorage.getItem('theme') || 'dark';

        if (currentTheme === 'light') {
            body.classList.add('light-mode');
        }

        function toggleTheme() {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            // Mise à jour éventuelle du logo dans le header
            const headerLogo = document.getElementById('header-logo');
            if (headerLogo) {
                headerLogo.src = isLight ? 'Assets/images/logowyvern.png' : 'Assets/images/logowyvern.png';
            }

            window.showWyvernToast(isLight ? "☀️ Mode clair activé" : "🌙 Mode sombre activé");
        }

        const modalThemeToggle = document.getElementById('modal-theme-toggle');
        const quickThemeBtn = document.getElementById('theme-quick-btn');

        if (modalThemeToggle) {
            modalThemeToggle.addEventListener('click', toggleTheme);
        }
        if (quickThemeBtn) {
            quickThemeBtn.addEventListener('click', toggleTheme);
        }
    }

    /* ============================================================
       5. INTERNATIONALISATION (FR / EN)
       ============================================================ */
    function initLanguage() {
        const languageBtn = document.getElementById("language-btn");
        let currentLang = localStorage.getItem("lang") || "fr";

        // Dictionnaire de secours embarqué (pour exécution hors-ligne ou file://)
        const FALLBACK_TRANSLATIONS = {
            fr: {
                "site-title": "Wyvern E-sport",
                "nav-home": "Accueil",
                "nav-tournaments": "Tournois",
                "nav-shop": "Boutique",
                "nav-news": "Actualités",
                "settings-text": "Paramètres",
                "settings-theme": "Mode Sombre / Clair",
                "settings-account": "Mon Compte",
                "welcome-title": "Bienvenue chez Wyvern E-sport",
                "welcome-text": "Rejoignez la nouvelle génération de compétiteurs e-sport !",
                "learn-more-btn": "En savoir plus",
                "about-title": "À Propos de Nous",
                "about-text": "Nous sommes une structure e-sport française dédiée à la compétition de haut niveau dans plusieurs jeux. Notre objectif est de former les meilleures équipes et de créer une communauté dynamique autour des jeux vidéo compétitifs.",
                "teams-title": "Nos Équipes",
                "fortnite-title": "Équipe Fortnite",
                "rocketleague-title": "Équipe Rocket League",
                "smash-title": "Équipe Smash Bros",
                "multiversus-title": "Équipe MultiVersus",
                "Valorant-title": "Équipe Valorant",
                "shop-title": "Boutique",
                "tournaments-title": "Tournois",
                "upcoming-tournaments-title": "Choisir votre Jeu",
                "news-title": "Dernières Infos"
            },
            en: {
                "site-title": "Wyvern Esports",
                "nav-home": "Home",
                "nav-tournaments": "Tournaments",
                "nav-shop": "Shop",
                "nav-news": "News",
                "settings-text": "Settings",
                "settings-theme": "Dark / Light Mode",
                "settings-account": "My Account",
                "welcome-title": "Welcome to Wyvern Esports",
                "welcome-text": "Join the new generation of esports competitors!",
                "learn-more-btn": "Learn More",
                "about-title": "About Us",
                "about-text": "We are a French esports organization dedicated to high-level competition in various games. Our goal is to form the best teams and create a dynamic community around competitive gaming.",
                "teams-title": "Our Teams",
                "fortnite-title": "Fortnite Team",
                "rocketleague-title": "Rocket League Team",
                "smash-title": "Smash Bros Team",
                "multiversus-title": "MultiVersus Team",
                "Valorant-title": "Valorant Team",
                "shop-title": "Shop",
                "tournaments-title": "Tournaments",
                "upcoming-tournaments-title": "Select your Game",
                "news-title": "Latest News"
            }
        };

        function applyTranslations(data, lang) {
            for (let key in data) {
                // IMPORTANT : Évite d'écraser la balise <title id="page-title"> de toutes les pages avec un titre unique !
                if (key === 'page-title') continue;

                let element = document.getElementById(key);
                if (element) {
                    element.innerText = data[key];
                }

                let elements = document.querySelectorAll('.' + key);
                elements.forEach(el => el.innerText = data[key]);
            }

            if (languageBtn) {
                languageBtn.innerText = lang.toUpperCase();
            }
            localStorage.setItem("lang", lang);
        }

        function loadLanguage(lang) {
            fetch(`Locales/${lang}.json`)
                .then(response => {
                    if (!response.ok) throw new Error("Fichier introuvable");
                    return response.json();
                })
                .then(data => {
                    applyTranslations(data, lang);
                })
                .catch(() => {
                    // Repli transparent sur le dictionnaire interne
                    if (FALLBACK_TRANSLATIONS[lang]) {
                        applyTranslations(FALLBACK_TRANSLATIONS[lang], lang);
                    }
                });
        }

        loadLanguage(currentLang);

        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                currentLang = currentLang === "fr" ? "en" : "fr";
                loadLanguage(currentLang);
                window.showWyvernToast(currentLang === 'fr' ? "🇫🇷 Langue : Français" : "🇬🇧 Language: English");
            });
        }
    }

    /* ============================================================
       6. MODAL PANIER ET GESTION DU SHOPPING
       ============================================================ */
    function initCartModal() {
        let cartInterface = document.getElementById('cart-modal');
        if (!cartInterface) {
            cartInterface = document.createElement('div');
            cartInterface.id = 'cart-modal';
            document.body.appendChild(cartInterface);
        }

        cartInterface.innerHTML = `
            <div id="cart-backdrop" class="cart-backdrop"></div>
            <div id="cart" class="cart" role="dialog" aria-modal="true">
                <div class="cart-header">
                    <h2 id="cart-title">Votre Panier</h2>
                    <button id="close-cart-btn" class="close-btn" aria-label="Fermer le panier">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-items"></div>
                <div class="cart-footer">
                    <div id="total-price" class="total-price">
                        <span>Total :</span>
                        <span id="total-price-val">0.00€</span>
                    </div>
                    <button id="checkout-btn" class="big-cart-btn">
                        <i class="fas fa-check-circle"></i> Valider la commande
                    </button>
                </div>
            </div>
        `;
    }

    function initCart() {
        let cart = JSON.parse(localStorage.getItem('wyvernCart')) || [];
        const cartElement = document.getElementById('cart');
        const backdrop = document.getElementById('cart-backdrop');
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartCount = document.getElementById('cart-count');
        const totalPriceVal = document.getElementById('total-price-val');

        function updateCartDisplay() {
            if (!cartItemsContainer) return;
            cartItemsContainer.innerHTML = '';
            let total = 0;
            let count = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty-message">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Votre panier est vide.</p>
                    </div>
                `;
            } else {
                cart.forEach((item, index) => {
                    total += item.price * item.quantity;
                    count += item.quantity;

                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <div class="cart-item-info">
                            <strong>${item.name}</strong>
                            <div class="cart-item-meta">Taille : ${item.size}</div>
                            <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)}€</div>
                        </div>
                        <div class="cart-item-actions">
                            <button class="cart-qty-btn qty-minus" data-index="${index}">-</button>
                            <span class="cart-item-qty">${item.quantity}</span>
                            <button class="cart-qty-btn qty-plus" data-index="${index}">+</button>
                            <button class="remove-btn" data-index="${index}" title="Supprimer">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                });
            }

            if (cartCount) cartCount.innerText = count;
            if (totalPriceVal) totalPriceVal.innerText = `${total.toFixed(2)}€`;

            // Listeners pour quantités et suppression
            document.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                    if (cart[idx].quantity > 1) {
                        cart[idx].quantity--;
                    } else {
                        cart.splice(idx, 1);
                    }
                    saveAndRefreshCart();
                });
            });

            document.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                    cart[idx].quantity++;
                    saveAndRefreshCart();
                });
            });

            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                    cart.splice(idx, 1);
                    saveAndRefreshCart();
                });
            });
        }

        function saveAndRefreshCart() {
            localStorage.setItem('wyvernCart', JSON.stringify(cart));
            updateCartDisplay();
        }

        window.toggleCart = function(forceOpen = null) {
            if (!cartElement) return;
            const isOpen = forceOpen !== null ? forceOpen : !cartElement.classList.contains('open');

            if (isOpen) {
                cartElement.classList.add('open');
                if (backdrop) backdrop.classList.add('open');
                updateCartDisplay();
            } else {
                cartElement.classList.remove('open');
                if (backdrop) backdrop.classList.remove('open');
            }
        };

        // Boutons d'ouverture / fermeture du panier
        const openCartBtn = document.getElementById('cart-btn');
        const closeCartBtn = document.getElementById('close-cart-btn');

        if (openCartBtn) openCartBtn.addEventListener('click', () => window.toggleCart(true));
        if (closeCartBtn) closeCartBtn.addEventListener('click', () => window.toggleCart(false));
        if (backdrop) backdrop.addEventListener('click', () => window.toggleCart(false));

        // Bouton d'ajout sur les fiches produits
        const addToCartBtn = document.getElementById('add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const productTitle = this.getAttribute('data-product') || document.querySelector('.product-main-title')?.innerText || "Produit Wyvern";
                const productPrice = parseFloat(this.getAttribute('data-price')) || 79.99;
                const productId = this.getAttribute('data-id') || productTitle;
                const sizeSelect = document.getElementById('size');
                const productSize = sizeSelect ? sizeSelect.value : 'Unique';

                const item = { id: productId, name: productTitle, price: productPrice, size: productSize, quantity: 1 };
                const existing = cart.find(i => i.id === item.id && i.size === item.size);

                if (existing) {
                    existing.quantity++;
                } else {
                    cart.push(item);
                }

                saveAndRefreshCart();
                window.showWyvernToast(`🛒 ${productTitle} (${productSize}) ajouté au panier !`, "success");

                // Animation bouton
                const textSpan = document.getElementById('add-to-cart-text');
                const origText = textSpan ? textSpan.innerText : "Ajouter au panier";
                if (textSpan) textSpan.innerText = "Ajouté !";
                this.style.backgroundColor = "var(--wyvern-green)";

                setTimeout(() => {
                    if (textSpan) textSpan.innerText = origText;
                    this.style.backgroundColor = "";
                }, 1500);
            });
        }

        // Gestion de la commande / checkout
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', async () => {
                if (cart.length === 0) {
                    window.showWyvernToast("Votre panier est vide !", "error");
                    return;
                }

                checkoutBtn.disabled = true;
                checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement...';

                setTimeout(() => {
                    cart = [];
                    saveAndRefreshCart();
                    window.toggleCart(false);
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = '<i class="fas fa-check-circle"></i> Valider la commande';
                    alert("🎉 Félicitations ! Votre commande a été enregistrée avec succès chez Wyvern E-sport.");
                }, 1200);
            });
        }

        updateCartDisplay();
    }

    /* ============================================================
       7. CAROUSELS ROSTERS & MINI-IMAGES (AVEC GESTES TACTILES)
       ============================================================ */
    function initCarousels() {
        // Roster Carousel
        const carouselItems = document.querySelectorAll('.carousel .carousel-item');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
        let currentIndex = 0;

        if (carouselItems.length > 0) {
            function showItem(index) {
                carouselItems.forEach((item, idx) => {
                    item.classList.toggle('active', idx === index);
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
                    showItem(currentIndex);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
                    showItem(currentIndex);
                });
            }

            // Support Swipe Mobile pour le roster
            const carouselContainer = document.querySelector('.carousel');
            if (carouselContainer) {
                let touchStartX = 0;
                let touchEndX = 0;

                carouselContainer.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });

                carouselContainer.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    const diff = touchStartX - touchEndX;
                    if (Math.abs(diff) > 40) {
                        if (diff > 0) { // Glissement vers la gauche -> suivant
                            currentIndex = (currentIndex < carouselItems.length - 1) ? currentIndex + 1 : 0;
                        } else { // Glissement vers la droite -> précédent
                            currentIndex = (currentIndex > 0) ? currentIndex - 1 : carouselItems.length - 1;
                        }
                        showItem(currentIndex);
                    }
                }, { passive: true });
            }
        }

        // Carousel photos produits (Face / Dos)
        const prodImages = document.querySelectorAll('.carousel-wrapper .prod-img');
        const prodPrev = document.querySelector('.mini-arrow.prev');
        const prodNext = document.querySelector('.mini-arrow.next');
        let prodIndex = 0;

        if (prodImages.length > 1) {
            function showProd(index) {
                prodImages.forEach((img, idx) => {
                    img.classList.toggle('active', idx === index);
                });
            }

            if (prodPrev) {
                prodPrev.addEventListener('click', () => {
                    prodIndex = (prodIndex > 0) ? prodIndex - 1 : prodImages.length - 1;
                    showProd(prodIndex);
                });
            }

            if (prodNext) {
                prodNext.addEventListener('click', () => {
                    prodIndex = (prodIndex < prodImages.length - 1) ? prodIndex + 1 : 0;
                    showProd(prodIndex);
                });
            }
        }
    }

    /* ============================================================
       8. MODALE DES ARTICLES ACTUALITÉS
       ============================================================ */
    function initNewsModal() {
        const modal = document.getElementById('news-modal');
        const closeBtn = document.querySelector('.close-news-btn');
        const modalTitle = document.getElementById('modal-news-title');
        const modalBody = document.getElementById('modal-news-body');

        if (!modal) return;

        // Attachement des clics sur "Lire l'article"
        document.querySelectorAll('.read-more').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.news-card');
                const articleId = card ? card.getAttribute('data-id') : `news-${index + 1}`;

                // Recherche de l'article dans les données locales ou dans le DOM
                const foundArticle = DEFAULT_NEWS.find(a => a.id === articleId) || DEFAULT_NEWS[index] || {
                    title: card?.querySelector('.news-title')?.innerText || "Actualité Wyvern",
                    date: card?.querySelector('.news-date')?.innerText || "Récemment",
                    content: card?.querySelector('.news-content')?.innerText || "Détails à venir."
                };

                if (modalTitle) modalTitle.innerText = foundArticle.title;
                if (modalBody) {
                    modalBody.innerHTML = `
                        <div class="modal-news-date">
                            <i class="far fa-calendar-alt"></i> <span>${foundArticle.date}</span>
                            ${foundArticle.tag ? `• <strong style="color:var(--wyvern-red);">${foundArticle.tag}</strong>` : ''}
                        </div>
                        <p style="margin-top: 15px; font-size: 1.15rem; line-height: 1.8;">${foundArticle.content}</p>
                    `;
                }

                modal.classList.add('active');
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    /* ============================================================
       9. RACCOURCIS CLAVIER & TOAST NOTIFICATION
       ============================================================ */
    function initKeyboardShortcuts() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const settingsModal = document.getElementById('settings-modal');
                const newsModal = document.getElementById('news-modal');
                if (settingsModal) settingsModal.classList.remove('active');
                if (newsModal) newsModal.classList.remove('active');
                if (window.toggleCart) window.toggleCart(false);
            }
        });
    }

    window.showWyvernToast = function(message, type = "info") {
        let existingToast = document.querySelector('.wyvern-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `wyvern-toast ${type}`;
        toast.innerHTML = `<span>${message}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    };

});
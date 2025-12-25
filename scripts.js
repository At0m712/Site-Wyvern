document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. GESTION DE LA NAVIGATION & PAGE ACTIVE
    // ============================================================
    const currentPath = decodeURIComponent(window.location.pathname.split("/").pop());
    const navLinks = document.querySelectorAll('.floating-navbar .nav-item');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');

        if (linkHref === currentPath) {
            link.classList.add('active');
        } else if ((currentPath === '' || currentPath === 'index.html') && (linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // ============================================================
    // 2. GESTION DU THÈME (CORRIGÉE)
    // ============================================================
    const themeButtons = document.querySelectorAll('#bottom-theme-toggle, #toggleTheme');
    const body = document.body;

    // Fonction pour mettre à jour les icônes (Soleil / Lune)
    function updateThemeIcons(isLight) {
        themeButtons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (icon) {
                // Change l'icône FontAwesome
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon'; // Soleil en mode clair, Lune en mode sombre
            } else {
                // Si c'est un bouton texte (ancien sidebar)
                btn.textContent = isLight ? 'Mode Sombre' : 'Mode Clair';
            }
        });
    }

    // Chargement initial
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        updateThemeIcons(true);
    } else {
        updateThemeIcons(false);
    }

    // Clic sur le bouton
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeIcons(isLight);
        });
    });


    // ============================================================
    // 3. GESTION DE LA LANGUE (VOTRE ANCIEN SYSTÈME)
    // ============================================================
    const languageBtn = document.getElementById("language-btn");
    let currentLang = localStorage.getItem("lang") || "fr";

    function loadLanguage(lang) {
        // Essaie de charger le fichier JSON correspondant
        fetch(`${lang}.json`)
            .then(response => {
                if (!response.ok) throw new Error("Fichier langue introuvable");
                return response.json();
            })
            .then(data => {
                for (let key in data) {
                    let element = document.getElementById(key);
                    if (element) {
                        element.innerText = data[key];
                    }
                }
                if (languageBtn) languageBtn.innerText = lang.toUpperCase();
                localStorage.setItem("lang", lang);
            })
            .catch(error => {
                console.warn("Impossible de charger la langue (vérifiez que fr.json/en.json existent) :", error);
            });
    }

    // Chargement au démarrage
    loadLanguage(currentLang);

    // Clic sur le bouton langue
    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            currentLang = currentLang === "fr" ? "en" : "fr";
            loadLanguage(currentLang);
        });
    }


    // ============================================================
    // 4. SYSTÈME PANIER (AJOUT VERT + COCHE SEULEMENT)
    // ============================================================
    let cart = JSON.parse(localStorage.getItem('wyvernCart')) || [];
    const cartElement = document.getElementById('cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceElement = document.getElementById('total-price');

    // Mise à jour de l'affichage
    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; 
        let total = 0;
        let count = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p id="cart-empty-text" style="text-align:center; color:#888;">Le panier est vide.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;

                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #333; padding-bottom: 10px;';

                itemElement.innerHTML = `
                    <div style="text-align: left;">
                        <strong style="color: white;">${item.name}</strong> <span style="font-size: 0.9em; color: #ccc;">(${item.size})</span><br>
                        <span style="color:#d32f2f;">${item.price}€</span> <span style="color:#888;">x ${item.quantity}</span>
                    </div>
                    <button class="remove-btn" data-index="${index}" style="background:none; border:none; color:#666; cursor:pointer; font-size: 1.2em;">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }

        if (cartCount) cartCount.innerText = count;
        if (totalPriceElement) totalPriceElement.innerText = `Total : ${total.toFixed(2)}€`;

        // Suppression
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartDisplay();
            });
        });
        localStorage.setItem('wyvernCart', JSON.stringify(cart));
    }

    // Fonction globale pour le bouton Panier (Ouverture/Fermeture)
    window.toggleCart = function() {
        if (cartElement) cartElement.classList.toggle('open');
    };

    updateCartDisplay(); // Init


    // ============================================================
    // 5. INTERACTION BOUTON "AJOUTER" (TEXTE DISPARAIT, COCHE BLANCHE)
    // ============================================================
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            // 1. Ajout des données
            const productTitle = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const sizeSelect = document.getElementById('size');
            const productSize = sizeSelect ? sizeSelect.value : 'Taille Unique';

            const item = { name: productTitle, price: productPrice, size: productSize, quantity: 1 };
            
            // Logique d'ajout au panier
            const existingItem = cart.find(i => i.name === item.name && i.size === item.size);
            if (existingItem) existingItem.quantity++;
            else cart.push(item);
            updateCartDisplay();

            // 2. MODIFICATION VISUELLE DU BOUTON (DEMANDÉE)
            const btnTextSpan = document.getElementById('add-to-cart-text');
            const icon = this.querySelector('i');
            
            // Sauvegarde de l'état original
            const originalIconClass = icon ? icon.className : '';
            
            // Changement d'état : Succès
            this.style.backgroundColor = '#28a745'; // Vert
            this.style.borderColor = '#28a745';
            
            // On cache le texte
            if (btnTextSpan) btnTextSpan.style.display = 'none';
            
            // On change l'icône en coche blanche
            if (icon) {
                icon.className = 'fas fa-check';
                icon.style.color = 'white';
                icon.style.marginLeft = '0'; // On centre l'icône
            }

            // 3. Retour à la normale après 2 secondes
            setTimeout(() => {
                this.style.backgroundColor = ''; // Retour couleur CSS (rouge)
                this.style.borderColor = '';
                
                // Réafficher le texte
                if (btnTextSpan) btnTextSpan.style.display = 'inline';
                
                // Remettre l'icône originale
                if (icon) {
                    icon.className = 'fas fa-plus'; // Ou originalIconClass
                    icon.style.color = ''; 
                    icon.style.marginLeft = '';
                }
            }, 2000);
        });
    }

    // Événements Panier (Header & Croix)
    const cartBtns = document.querySelectorAll('#cart-btn, #close-cart-btn');
    cartBtns.forEach(btn => btn.addEventListener('click', window.toggleCart));


    // ============================================================
    // 6. GESTION DES ONGLETS (Tournois)
    // ============================================================
    const tabs = document.querySelectorAll('.tab');
    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab, .tab-content').forEach(el => el.classList.remove('active'));
                tab.classList.add('active');
                const content = document.getElementById(tab.getAttribute('data-tab'));
                if (content) content.classList.add('active');
            });
        });
    }

});


document.addEventListener('DOMContentLoaded', () => {
    
    // --- A. DONNÉES DES ARTICLES (Pour remplir ton HTML vide) ---
    const newsData = [
        {
            id: 1,
            date: "12 Nov 2024",
            title: "Lancement de la Saison 5",
            excerpt: "Découvrez les nouvelles maps, les skins exclusifs et le passe de combat...",
            fullContent: `
                <p>Soldats, la Saison 5 est enfin là ! Nous avons écouté vos retours et repensé totalement l'équilibrage.</p>
                <h4>Nouveautés majeures :</h4>
                <ul>
                    <li><strong>Nouvelle Map :</strong> "Ruines Antiques"</li>
                    <li><strong>Nouvel Agent :</strong> Viper</li>
                    <li><strong>Battle Pass :</strong> 100 niveaux de récompenses.</li>
                </ul>
                <p>Rendez-vous en jeu pour découvrir tout ça !</p>
            `
        },
        {
            id: 2,
            date: "10 Nov 2024",
            title: "Résultats Tournoi Octobre",
            excerpt: "L'équipe Alpha a dominé la compétition ce week-end avec un score parfait...",
            fullContent: `
                <p>Quel spectacle ! Le tournoi Wyvern d'Octobre restera dans les annales.</p>
                <p>Victoire écrasante de la <strong>Wyvern Alpha</strong> (3-0) en finale.</p>
                <h4>Classement final :</h4>
                <ol>
                    <li>🥇 Wyvern Alpha</li>
                    <li>🥈 Shadow Gaming</li>
                    <li>🥉 Team Delta</li>
                </ol>
            `
        },
        {
            id: 3,
            date: "05 Nov 2024",
            title: "Promos Black Friday",
            excerpt: "Préparez-vous pour des réductions massives sur toute la boutique Wyvern...",
            fullContent: `
                <p>Le Black Friday arrive chez Wyvern dès le 25 novembre !</p>
                <ul>
                    <li>-50% sur tous les maillots.</li>
                    <li>-30% sur les accessoires.</li>
                </ul>
                <p>C'est le moment de vous équiper aux couleurs de l'équipe.</p>
            `
        }
    ];

    // --- B. REMPLISSAGE DU HTML (Injection des données) ---
    // On boucle sur les données pour remplir les IDs news-1-title, news-1-content, etc.
    newsData.forEach((news, index) => {
        const i = index + 1; // Car tes IDs commencent à 1 (news-1)
        
        const dateEl = document.getElementById(`news-${i}-date`);
        const titleEl = document.getElementById(`news-${i}-title`);
        const contentEl = document.getElementById(`news-${i}-content`);

        if (dateEl) dateEl.innerText = news.date;
        if (titleEl) titleEl.innerText = news.title;
        if (contentEl) contentEl.innerText = news.excerpt;
    });


    // --- C. GESTION DE LA MODALE ---
    const newsModal = document.getElementById('news-modal');
    const modalTitle = document.getElementById('modal-news-title');
    const modalBody = document.getElementById('modal-news-body');
    const closeBtn = document.querySelector('.close-news-btn');
    
    // Sélectionne tous les liens "Lire l'article"
    const readMoreLinks = document.querySelectorAll('.read-more');

    if (newsModal && readMoreLinks.length > 0) {
        
        readMoreLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche le lien de remonter en haut de page

                // On récupère les données complètes grâce à l'index (0, 1, 2)
                const data = newsData[index];

                // On remplit la modale
                modalTitle.innerText = data.title;
                modalBody.innerHTML = data.fullContent;

                // On affiche la modale
                newsModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Bloque le scroll
            });
        });

        // Fermeture avec la croix
        closeBtn.addEventListener('click', () => {
            newsModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });

        // Fermeture en cliquant à l'extérieur
        window.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                newsModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.game-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // 1. Gérer l'état actif des onglets
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. Gérer l'affichage des cartes
            contents.forEach(card => {
                if (target === 'all') {
                    card.classList.add('active'); // On montre tout
                } else {
                    if (card.id === target) {
                        card.classList.add('active'); // On montre l'ID sélectionné
                    } else {
                        card.classList.remove('active'); // On cache les autres
                    }
                }
            });
        });
    });
});


    // ============================================================
    // GESTION DU CAROUSEL (UNIVERSEL POUR TOUTES LES PAGES JEUX)
    // ============================================================
    
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev'); // Classe générique
    const nextBtn = document.querySelector('.next'); // Classe générique
    let currentIndex = 0;

    // On vérifie si un carousel existe sur la page avant de lancer le script
    if (carouselItems.length > 0 && prevBtn && nextBtn) {
        
        function showItem(index) {
            // Cache tout le monde
            carouselItems.forEach(item => {
                item.classList.remove('active');
            });
            // Montre l'élu
            carouselItems[index].classList.add('active');
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = carouselItems.length - 1; // Retour à la fin
            }
            showItem(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < carouselItems.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0; // Retour au début
            }
            showItem(currentIndex);
        });
    }
    
        // ============================================================
    // GESTION DES PARAMÈTRES (MODALE)
    // ============================================================
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.querySelector('.close-settings');
    const modalThemeToggle = document.getElementById('modal-theme-toggle');

    // Ouvrir la modale
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
        });
    }

    // Fermer la modale
    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }

    // Fermer en cliquant à l'extérieur
    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Bouton Thème DANS la modale (optionnel, si tu veux doubler la fonction)
    if (modalThemeToggle) {
        modalThemeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            // Mettre à jour les autres icônes du site
            const themeIcons = document.querySelectorAll('#bottom-theme-toggle i, #toggleTheme i');
            themeIcons.forEach(icon => {
                icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
            });
        });
    }
    
        // ============================================================
    // GESTION DU STATUT DE CONNEXION (DANS PARAMÈTRES)
    // ============================================================
    
    function updateAuthStatus() {
        const authStatusDiv = document.getElementById('auth-status');
        
        if (authStatusDiv) {
            // EXEMPLE : On vérifie si un email est stocké dans le navigateur
            // À remplacer par ta vraie logique de connexion si tu en as une
            const userEmail = localStorage.getItem('userEmail'); 

            if (userEmail) {
                // CAS 1 : CONNECTÉ
                authStatusDiv.textContent = `Connecté en tant que : ${userEmail}`;
                authStatusDiv.classList.add('logged-in');
            } else {
                // CAS 2 : PAS CONNECTÉ
                authStatusDiv.textContent = "Pas connecté";
                authStatusDiv.classList.remove('logged-in');
            }
        }
    }

    // On lance la vérification à chaque fois qu'on ouvre la modale
    const settingsBtnForAuth = document.getElementById('settings-btn');
    if (settingsBtnForAuth) {
        settingsBtnForAuth.addEventListener('click', updateAuthStatus);
    }
    
    // On lance aussi une fois au chargement de la page pour être sûr
    updateAuthStatus();
    
        // 

    // ============================================================
    // MINI CAROUSEL PRODUIT (FACE / DOS)
    // ============================================================
    
    const prodImages = document.querySelectorAll('.prod-img');
    const prodPrevBtn = document.querySelector('.mini-arrow.prev');
    const prodNextBtn = document.querySelector('.mini-arrow.next');
    let prodIndex = 0;

    if (prodImages.length > 0 && prodPrevBtn && prodNextBtn) {
        
        function showProdImage(index) {
            // On retire la classe active partout
            prodImages.forEach(img => img.classList.remove('active'));
            // On l'ajoute sur l'image demandée
            prodImages[index].classList.add('active');
        }

        // Flèche Gauche (<)
        prodPrevBtn.addEventListener('click', () => {
            prodIndex--;
            if (prodIndex < 0) {
                prodIndex = prodImages.length - 1; // Boucle vers la fin
            }
            showProdImage(prodIndex);
        });

        // Flèche Droite (>)
        prodNextBtn.addEventListener('click', () => {
            prodIndex++;
            if (prodIndex >= prodImages.length) {
                prodIndex = 0; // Boucle vers le début
            }
            showProdImage(prodIndex);
        });
    }
    
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GESTION DE LA NAVIGATION & PAGE ACTIVE ---
    const currentPath = decodeURIComponent(window.location.pathname.split("/").pop());
    const navLinks = document.querySelectorAll('.floating-navbar .nav-item');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath || ((currentPath === '' || currentPath === 'index.html') && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- 2. GESTION DU THÈME ---
    const modalThemeToggle = document.getElementById('modal-theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    if (modalThemeToggle) {
        modalThemeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // --- 3. GESTION DE LA LANGUE ---
    const languageBtn = document.getElementById("language-btn");
    let currentLang = localStorage.getItem("lang") || "fr";

    function loadLanguage(lang) {
        fetch(`${lang}.json`)
            .then(response => {
                if (!response.ok) throw new Error("Fichier langue introuvable");
                return response.json();
            })
            .then(data => {
                for (let key in data) {
                    let element = document.getElementById(key);
                    if (element) element.innerText = data[key];
                }
                if (languageBtn) languageBtn.innerText = lang.toUpperCase();
                localStorage.setItem("lang", lang);
            })
            .catch(error => console.warn(error));
    }

    loadLanguage(currentLang);

    if (languageBtn) {
        languageBtn.addEventListener('click', () => {
            currentLang = currentLang === "fr" ? "en" : "fr";
            loadLanguage(currentLang);
        });
    }

    // --- 4. SYSTÈME PANIER ---
    let cart = JSON.parse(localStorage.getItem('wyvernCart')) || [];
    const cartElement = document.getElementById('cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceElement = document.getElementById('total-price');

    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = ''; 
        let total = 0; let count = 0;

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

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cart.splice(e.currentTarget.getAttribute('data-index'), 1);
                updateCartDisplay();
            });
        });
        localStorage.setItem('wyvernCart', JSON.stringify(cart));
    }

    window.toggleCart = function() {
        if (cartElement) cartElement.classList.toggle('open');
    };

    updateCartDisplay();

    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productTitle = this.getAttribute('data-product');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const sizeSelect = document.getElementById('size');
            const productSize = sizeSelect ? sizeSelect.value : 'Taille Unique';
            const item = { name: productTitle, price: productPrice, size: productSize, quantity: 1 };
            
            const existingItem = cart.find(i => i.name === item.name && i.size === item.size);
            if (existingItem) existingItem.quantity++; else cart.push(item);
            updateCartDisplay();

            const btnTextSpan = document.getElementById('add-to-cart-text');
            const icon = this.querySelector('i');
            this.style.backgroundColor = '#28a745'; 
            this.style.borderColor = '#28a745';
            if (btnTextSpan) btnTextSpan.style.display = 'none';
            if (icon) { icon.className = 'fas fa-check'; icon.style.color = 'white'; icon.style.marginLeft = '0'; }

            setTimeout(() => {
                this.style.backgroundColor = ''; 
                this.style.borderColor = '';
                if (btnTextSpan) btnTextSpan.style.display = 'inline';
                if (icon) { icon.className = 'fas fa-plus'; icon.style.color = ''; icon.style.marginLeft = ''; }
            }, 2000);
        });
    }

    document.querySelectorAll('#cart-btn, #close-cart-btn').forEach(btn => btn.addEventListener('click', window.toggleCart));

    // --- 5. GESTION DES ONGLETS (JEUX) ---
    const tabs = document.querySelectorAll('.game-tab, .tab');
    const contents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(card => {
                    if (target === 'all') {
                        card.classList.add('active');
                    } else {
                        if (card.id === target) card.classList.add('active');
                        else card.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- 6. GESTION DES MODALES (PARAMÈTRES & NEWS) ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.querySelector('.close-settings');

    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
    }
    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
    }

    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    });

    // --- 7. CAROUSELS ---
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    if (carouselItems.length > 0 && prevBtn && nextBtn) {
        function showItem(index) {
            carouselItems.forEach(item => item.classList.remove('active'));
            carouselItems[index].classList.add('active');
        }
        prevBtn.addEventListener('click', () => {
            currentIndex = currentIndex > 0 ? currentIndex - 1 : carouselItems.length - 1;
            showItem(currentIndex);
        });
        nextBtn.addEventListener('click', () => {
            currentIndex = currentIndex < carouselItems.length - 1 ? currentIndex + 1 : 0;
            showItem(currentIndex);
        });
    }

    const prodImages = document.querySelectorAll('.prod-img');
    const prodPrevBtn = document.querySelector('.mini-arrow.prev');
    const prodNextBtn = document.querySelector('.mini-arrow.next');
    let prodIndex = 0;

    if (prodImages.length > 0 && prodPrevBtn && prodNextBtn) {
        function showProdImage(index) {
            prodImages.forEach(img => img.classList.remove('active'));
            prodImages[index].classList.add('active');
        }
        prodPrevBtn.addEventListener('click', () => {
            prodIndex = prodIndex < 0 ? prodImages.length - 1 : prodIndex - 1;
            showProdImage(prodIndex);
        });
        prodNextBtn.addEventListener('click', () => {
            prodIndex = prodIndex >= prodImages.length ? 0 : prodIndex + 1;
            showProdImage(prodIndex);
        });
    }

    // --- 8. SYSTÈME D'ACTUALITÉS ---
    // (J'ai conservé ta logique de newsData ici)
    const newsData = [
        { id: 1, date: "12 Nov 2024", title: "Lancement de la Saison 5", excerpt: "Découvrez les nouvelles maps...", fullContent: "<p>Soldats, la Saison 5 est enfin là !</p>" },
        { id: 2, date: "10 Nov 2024", title: "Résultats Tournoi Octobre", excerpt: "L'équipe Alpha a dominé...", fullContent: "<p>Victoire écrasante de la Wyvern Alpha.</p>" },
        { id: 3, date: "05 Nov 2024", title: "Promos Black Friday", excerpt: "Préparez-vous pour des réductions...", fullContent: "<p>Le Black Friday arrive chez Wyvern !</p>" }
    ];

    newsData.forEach((news, index) => {
        const i = index + 1;
        const dateEl = document.getElementById(`news-${i}-date`);
        const titleEl = document.getElementById(`news-${i}-title`);
        const contentEl = document.getElementById(`news-${i}-content`);
        if (dateEl) dateEl.innerText = news.date;
        if (titleEl) titleEl.innerText = news.title;
        if (contentEl) contentEl.innerText = news.excerpt;
    });

    const newsModal = document.getElementById('news-modal');
    const modalTitle = document.getElementById('modal-news-title');
    const modalBody = document.getElementById('modal-news-body');
    const closeBtn = document.querySelector('.close-news-btn');
    const readMoreLinks = document.querySelectorAll('.read-more');

    if (newsModal && readMoreLinks.length > 0) {
        readMoreLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                modalTitle.innerText = newsData[index].title;
                modalBody.innerHTML = newsData[index].fullContent;
                newsModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        });
        closeBtn.addEventListener('click', () => {
            newsModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
        window.addEventListener('click', (e) => {
            if (e.target === newsModal) {
                newsModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
});
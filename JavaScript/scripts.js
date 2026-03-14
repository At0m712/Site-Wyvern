document.addEventListener('DOMContentLoaded', () => {

    
    initNavbar(); 
    initSettings(); 
    initCartModal();          
    initNavigation();        
    initTheme();             
    initLanguage();          
    initCart();              
    initTabs();              
    initModals();            
    initCarousels();         
    
    
    function initNavbar() {
        const container = document.getElementById('navbar-container');
        if (!container) return; 

        container.innerHTML = `
            <nav class="floating-navbar">
                <a href="index.html" class="nav-item">
                    <i class="fas fa-home"></i><span id="nav-home">Accueil</span>
                </a>
                <a href="tournois.html" class="nav-item">
                    <i class="fas fa-trophy"></i><span id="nav-tournaments">Tournois</span>
                </a>
                <a href="actualites.html" class="nav-item">
                    <i class="fas fa-newspaper"></i><span id="nav-news">Actualités</span>
                </a>
                <a href="shop.html" class="nav-item">
                    <i class="fas fa-shopping-bag"></i><span id="nav-shop">Boutique</span>
                </a>
            </nav>
        `;
    }


    function initSettings() {
        const modalSettings = document.getElementById('modal-settings');
        if (!modalSettings) return; 

        modalSettings.innerHTML = `
            <div id="settings-modal" class="settings-modal">
                <div class="settings-content">
                    <span class="close-btn" ><i class="fas fa-times"></i></span>
                    <h2 id="settings-text">Paramètres</h2>
        
                    <div class="settings-option" id="modal-theme-toggle">
                        <span id="settings-theme">Mode Sombre/Clair</span>
                        <i class="fas fa-adjust"></i>
                    </div>
                    
                    <a href="compte.html" style="text-decoration:none; color:white;">
                        <div class="settings-option">
                            <span id="settings-account">Mon Compte</span>
                            <i class="fas fa-user"></i>
                        </div>
                    </a>
                </div>
            </div>
        `;
    }

    function initCartModal() {
        const cartInterface = document.getElementById('cart-modal');
        if (!cartInterface) return; 

        cartInterface.innerHTML = `
            <div id="cart" class="cart">
                <div class="cart-header">
                    <h2 id="cart-title">Votre Panier</h2>
                    <button id="close-btn" class="close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-items">
                    </div>
                <p id="total-price" class="total-price"></p>
            </div>
        `;
    }
    
    
    function initNavigation() {
        const currentPath = decodeURIComponent(window.location.pathname.split("/").pop());
        const navLinks = document.querySelectorAll('.floating-navbar .nav-item');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPath || ((currentPath === '' || currentPath === 'index.html') && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    
    
    
    function initTheme() {
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
    }

    
    
    
    function initLanguage() {
        const languageBtn = document.getElementById("language-btn");
        let currentLang = localStorage.getItem("lang") || "fr";

        function loadLanguage(lang) {
            fetch(`Locales/${lang}.json`)
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
    }

    
    
    
    function initCart() {
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
                            <span style="color:#d32f2f;">${item.price.toFixed(2)}€</span> <span style="color:#888;">x ${item.quantity}</span>
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

        document.querySelectorAll('#cart-btn, #close-btn').forEach(btn => btn.addEventListener('click', window.toggleCart));
    }

    
    
    
    function initTabs() {
        const tabs = document.querySelectorAll('.game-tab, .tab');
        const contents = document.querySelectorAll('.tab-content');

        if (tabs.length === 0) return;

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

    
    function initModals() {
        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.querySelector('.close-btn');

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
        }
        if (closeSettings && settingsModal) {
            closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');
        }

        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) settingsModal.style.display = 'none';
        });
    }

    
    
    
    function initCarousels() {
        
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
                prodIndex = prodIndex <= 0 ? prodImages.length - 1 : prodIndex - 1;
                showProdImage(prodIndex);
            });
            prodNextBtn.addEventListener('click', () => {
                prodIndex = prodIndex >= prodImages.length - 1 ? 0 : prodIndex + 1;
                showProdImage(prodIndex);
            });
        }
    }
})
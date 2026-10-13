  const mysqlStructure = `
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(100),
            phone VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL
        );
        
        CREATE TABLE user_sessions (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;

      
        const products = [
            {
                id: 1,
                name: "Органические помидоры",
                description: "Свежие помидоры с фермы в Краснодарском крае",
                price: 350,
                category: "vegetables",
                icon: "fas fa-carrot"
            },
            {
                id: 2,
                name: "Авокадо Хасс",
                description: "Спелые авокадо из Израиля",
                price: 280,
                category: "vegetables",
                icon: "fas fa-leaf"
            },
            {
                id: 3,
                name: "Бананы органические",
                description: "Сладкие бананы из Эквадора",
                price: 120,
                category: "fruits",
                icon: "fas fa-apple-alt"
            },
            {
                id: 4,
                name: "Клубника",
                description: "Сезонная клубника из местных теплиц",
                price: 420,
                category: "fruits",
                icon: "fas fa-stroopwafel"
            },
            {
                id: 5,
                name: "Молоко фермерское",
                description: "Натуральное молоко от коров свободного выпаса",
                price: 180,
                category: "dairy",
                icon: "fas fa-wine-bottle"
            },
            {
                id: 6,
                name: "Сыр Гауда",
                description: "Натуральный сыр из Голландии",
                price: 650,
                category: "dairy",
                icon: "fas fa-cheese"
            },
            {
                id: 7,
                name: "Хлеб цельнозерновой",
                description: "Свежий хлеб из цельного зерна",
                price: 120,
                category: "bakery",
                icon: "fas fa-bread-slice"
            },
            {
                id: 8,
                name: "Круассаны",
                description: "Свежие круассаны с шоколадом",
                price: 85,
                category: "bakery",
                icon: "fas fa-cookie"
            }
        ];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        document.addEventListener('DOMContentLoaded', function() {
            renderProducts(products);
            initCategoryFilters();
            updateCartCount();
            initCart();
            initAuth();
            updateUserInterface();
            document.getElementById('start-subscription').addEventListener('click', function() {
                if (!currentUser) {
                    showAuthModal();
                    return;
                }
            });
            document.getElementById('checkout-btn').addEventListener('click', function() {
                if (!currentUser) {
                    showAuthModal();
                    return;
                }
                alert('Оформление заказа будет в полной версии');
            });
        });
        function initAuth() {
            const authModal = document.getElementById('auth-modal');
            const closeAuthModal = document.getElementById('close-auth-modal');
            const userInfo = document.getElementById('user-info');
            const switchToRegister = document.getElementById('switch-to-register');
            const switchToLogin = document.getElementById('switch-to-login');
            userInfo.addEventListener('click', function() {
                if (currentUser) {
                    showUserMenu();
                } else {
                    showAuthModal();
                }
            });
            closeAuthModal.addEventListener('click', function() {
                hideAuthModal();
            });
            switchToRegister.addEventListener('click', function() {
                switchTab('register');
            });
            
            switchToLogin.addEventListener('click', function() {
                switchTab('login');
            });
            document.querySelectorAll('.tab-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const tab = this.getAttribute('data-tab');
                    switchTab(tab);
                });
            });
            document.querySelectorAll('.toggle-password').forEach(button => {
                button.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    const input = document.getElementById(targetId);
                    const icon = this.querySelector('i');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });
            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                loginUser();
            });
            document.getElementById('register-form').addEventListener('submit', function(e) {
                e.preventDefault();
                registerUser();
            });
            authModal.addEventListener('click', function(e) {
                if (e.target === authModal) {
                    hideAuthModal();
                }
            });
        }
        function showAuthModal() {
            document.getElementById('auth-modal').style.display = 'flex';
            switchTab('login');
        }
        function hideAuthModal() {
            document.getElementById('auth-modal').style.display = 'none';
            clearForms();
        }
        function switchTab(tabName) {
            // Обновляем активные кнопки
            document.querySelectorAll('.tab-btn').forEach(button => {
                if (button.getAttribute('data-tab') === tabName) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                if (content.id === `${tabName}-tab`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        }
        function clearForms() {
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            document.getElementById('register-name').value = '';
            document.getElementById('register-email').value = '';
            document.getElementById('register-phone').value = '';
            document.getElementById('register-address').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('register-confirm-password').value = '';
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
                el.textContent = '';
            });
            
            document.querySelectorAll('.form-input').forEach(el => {
                el.classList.remove('error');
            });
        }
        
        function showError(inputId, message) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(`${inputId}-error`);
            
            input.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        function clearError(inputId) {
            const input = document.getElementById(inputId);
            const errorElement = document.getElementById(`${inputId}-error`);
            
            input.classList.remove('error');
            errorElement.style.display = 'none';
        }
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function validatePhone(phone) {
            const re = /^(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
            return re.test(phone);
        }
        
        function loginUser() {
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            // Валидация
            let isValid = true;
            
            if (!email) {
                showError('login-email', 'Введите email');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('login-email', 'Введите корректный email');
                isValid = false;
            } else {
                clearError('login-email');
            }
            
            if (!password) {
                showError('login-password', 'Введите пароль');
                isValid = false;
            } else if (password.length < 6) {
                showError('login-password', 'Пароль должен содержать не менее 6 символов');
                isValid = false;
            } else {
                clearError('login-password');
            }
            
            if (!isValid) return;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserInterface();
                hideAuthModal();
                showNotification('Вход выполнен успешно!');
            } else {
                showError('login-password', 'Неверный email или пароль');
            }
        }
        
        function registerUser() {
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const phone = document.getElementById('register-phone').value.trim();
            const address = document.getElementById('register-address').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            let isValid = true;
            
            if (!name) {
                showError('register-name', 'Введите имя');
                isValid = false;
            } else {
                clearError('register-name');
            }
            
            if (!email) {
                showError('register-email', 'Введите email');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('register-email', 'Введите корректный email');
                isValid = false;
            } else {
                clearError('register-email');
            }
            
            if (!phone) {
                showError('register-phone', 'Введите телефон');
                isValid = false;
            } else if (!validatePhone(phone)) {
                showError('register-phone', 'Введите корректный телефон');
                isValid = false;
            } else {
                clearError('register-phone');
            }
            
            if (!address) {
                showError('register-address', 'Введите адрес доставки');
                isValid = false;
            } else {
                clearError('register-address');
            }
            
            if (!password) {
                showError('register-password', 'Введите пароль');
                isValid = false;
            } else if (password.length < 6) {
                showError('register-password', 'Пароль должен содержать не менее 6 символов');
                isValid = false;
            } else {
                clearError('register-password');
            }
            
            if (!confirmPassword) {
                showError('register-confirm-password', 'Подтвердите пароль');
                isValid = false;
            } else if (password !== confirmPassword) {
                showError('register-confirm-password', 'Пароли не совпадают');
                isValid = false;
            } else {
                clearError('register-confirm-password');
            }
            
            if (!isValid) return;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                showError('register-email', 'Пользователь с таким email уже существует');
                return;
            }
            const newUser = {
                id: Date.now(), 
                name: name,
                email: email,
                phone: phone,
                address: address,
                password: password, 
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            document.getElementById('success-message').style.display = 'block';
            setTimeout(() => {
                switchTab('login');
                document.getElementById('login-email').value = email;
                document.getElementById('success-message').style.display = 'none';
            }, 2000);
        }
        
        function logoutUser() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserInterface();
            showNotification('Вы вышли из системы');
        }
        
        function showUserMenu() {
            const menu = confirm(`Привет, ${currentUser.name}!\n\n1. Мой профиль\n2. Мои заказы\n3. Выйти`);
            
            if (menu) {
                if (menu) {
                    if (menu) {
                        logoutUser();
                    }
                }
            }
        }
        
        function updateUserInterface() {
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            
            if (currentUser) {
                userAvatar.innerHTML = currentUser.name.charAt(0).toUpperCase();
                userName.textContent = currentUser.name;
            } else {
                userAvatar.innerHTML = '<i class="fas fa-user"></i>';
                userName.textContent = 'Войти';
            }
        }
        function renderProducts(productsToRender) {
            const grid = document.getElementById('products-grid');
            grid.innerHTML = '';
            
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <i class="${product.icon}"></i>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">
                            <span class="price">${product.price} ₽</span>
                            <button class="add-to-cart" data-id="${product.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(productCard);
            });
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }
        function initCategoryFilters() {
            document.querySelectorAll('.category-btn').forEach(button => {
                button.addEventListener('click', function() {
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    
                    const category = this.getAttribute('data-category');
                    filterProducts(category);
                });
            });
        }
        
        function filterProducts(category) {
            if (category === 'all') {
                renderProducts(products);
            } else {
                const filteredProducts = products.filter(product => product.category === category);
                renderProducts(filteredProducts);
            }
        }
        
        function initCart() {
            const cartIcon = document.getElementById('cart-icon');
            const cartModal = document.getElementById('cart-modal');
            const closeCart = document.getElementById('close-cart');
            
            cartIcon.addEventListener('click', function() {
                cartModal.style.display = 'block';
                updateCartModal();
            });
            
            closeCart.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
            
            window.addEventListener('click', function(event) {
                if (event.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        }
        
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${product.name} добавлен в корзину`);
        }
        
        function updateCartCount() {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = totalItems;
        }
        
        function updateCartModal() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--light-text);">Корзина пуста</p>';
                cartTotalElement.textContent = '0 ₽';
                return;
            }
            
            let total = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} ₽ × ${item.quantity} = ${itemTotal} ₽</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            
            cartTotalElement.textContent = `${total} ₽`;
            
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const isIncrease = this.classList.contains('increase');
                    updateCartItemQuantity(productId, isIncrease);
                });
            });
        }
        
        function updateCartItemQuantity(productId, isIncrease) {
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex === -1) return;
            
            if (isIncrease) {
                cart[itemIndex].quantity++;
            } else {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else {
                    cart.splice(itemIndex, 1);
                }
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartModal();
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: var(--primary-green);
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1003;
                font-weight: 500;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            setTimeout(() => {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
        const registerUserQuery = `
        INSERT INTO users (email, password_hash, first_name, phone, address, created_at)
        VALUES (?, ?, ?, ?, ?, NOW());
        `;
        
        console.log("SQL запрос для регистрации:", registerUserQuery);

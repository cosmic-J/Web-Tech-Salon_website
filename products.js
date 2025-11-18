// Products data - fetched from MongoDB
let productsData = [];
let currentProduct = null;
let currentQuantity = 1;

// Sample product data structure for reference
const sampleProductsStructure = [
    {
        _id: "1",
        name: "HydraGlow Day Cream",
        price: 29.99,
        originalPrice: null,
        category: "moisturizer",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
        rating: 4.8,
        description: "A lightweight day cream that provides 24-hour hydration with a natural glow finish.",
        benefits: ["24-hour hydration", "Non-comedogenic", "SPF 30 protection"],
        ingredients: "Hyaluronic Acid, Vitamin E, Green Tea Extract",
        usage: "Apply every morning to clean face and neck"
    },
    {
        _id: "2", 
        name: "RoseSilk Nourishing Cream",
        price: 31.99,
        originalPrice: 39.99,
        category: "moisturizer",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        rating: 4.9,
        description: "Rich nourishing cream with rose extract for sensitive skin.",
        benefits: ["Soothes sensitive skin", "Intense nourishment", "Rose fragrance"],
        ingredients: "Rose Extract, Shea Butter, Ceramides",
        usage: "Use morning and evening for best results"
    },
    {
        _id: "3",
        name: "Velvet Dew Gel Moisturizer", 
        price: 27.99,
        originalPrice: null,
        category: "moisturizer",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop",
        rating: 4.7,
        description: "Lightweight gel formula that absorbs quickly without greasy residue.",
        benefits: ["Oil-free formula", "Quick absorption", "Matte finish"],
        ingredients: "Aloe Vera, Cucumber Extract, Glycerin",
        usage: "Apply to damp skin for enhanced absorption"
    },
    {
        _id: "4",
        name: "Radiance Repair Night Cream",
        price: 36.99,
        originalPrice: 44.99,
        category: "moisturizer",
        image: "https://images.unsplash.com/photo-1590439471364-0beb3c5d1c76?w=400&h=300&fit=crop",
        rating: 4.9,
        description: "Overnight repair cream that works while you sleep for morning radiance.",
        benefits: ["Overnight repair", "Boosts radiance", "Anti-aging"],
        ingredients: "Retinol, Peptides, Niacinamide",
        usage: "Apply every evening before bedtime"
    }
];

document.addEventListener("DOMContentLoaded", async () => {
    const productsGrid = document.getElementById('products-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productModal = document.getElementById('product-modal');
    const closeModal = document.getElementById('close-modal');
    const addToCartModal = document.getElementById('add-to-cart-modal');
    const decreaseQuantityBtn = document.getElementById('decrease-quantity');
    const increaseQuantityBtn = document.getElementById('increase-quantity');
    const quantityDisplay = document.getElementById('quantity-display');
    
    // Cart elements
    const productsCartToggle = document.getElementById('products-cart-toggle');
    const productsCartPanel = document.getElementById('products-cart-panel');
    const closeProductsCart = document.getElementById('close-products-cart');
    const checkoutProducts = document.getElementById('checkout-products');
    const clearProductsCart = document.getElementById('clear-products-cart');

    // Fetch products from MongoDB
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            productsData = await response.json();
        } else {
            throw new Error('Failed to fetch products');
        }
        displayProducts(productsData);
    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to sample data for demonstration
        productsData = sampleProductsStructure;
        displayProducts(productsData);
        productsGrid.innerHTML += '<p class="text-center text-gray-500 col-span-full text-sm">Using demo data - API connection failed</p>';
    }

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            if (filter === 'all') {
                displayProducts(productsData);
            } else {
                const filtered = productsData.filter(p => p.category === filter);
                displayProducts(filtered);
            }
        });
    });

    // Quantity functionality
    decreaseQuantityBtn.addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityDisplay.textContent = currentQuantity;
        }
    });

    increaseQuantityBtn.addEventListener('click', () => {
        currentQuantity++;
        quantityDisplay.textContent = currentQuantity;
    });

    // Modal functionality
    closeModal.addEventListener('click', () => {
        productModal.classList.add('hidden');
        resetQuantity();
    });

    addToCartModal.addEventListener('click', () => {
        if (currentProduct) {
            addProductToCart(currentProduct, currentQuantity);
            productModal.classList.add('hidden');
            resetQuantity();
        }
    });

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
            resetQuantity();
        }
    });

    // Cart functionality
    productsCartToggle.addEventListener('click', () => {
        productsCartPanel.classList.toggle('hidden');
    });

    closeProductsCart.addEventListener('click', () => {
        productsCartPanel.classList.add('hidden');
    });

    checkoutProducts.addEventListener('click', () => {
        const cart = getProductsCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Store cart data and redirect to purchase page
        localStorage.setItem('checkoutProducts', JSON.stringify(cart));
        window.location.href = 'purchase.html';
    });

    clearProductsCart.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            clearProductsCartData();
            updateProductsCartDisplay();
        }
    });

    function resetQuantity() {
        currentQuantity = 1;
        quantityDisplay.textContent = currentQuantity;
    }

    function getProductsCart() {
        return JSON.parse(localStorage.getItem('productsCart') || '[]');
    }

    function saveProductsCart(cart) {
        localStorage.setItem('productsCart', JSON.stringify(cart));
    }

    function clearProductsCartData() {
        localStorage.removeItem('productsCart');
    }

    function addProductToCart(product, quantity) {
        const cart = getProductsCart();
        const existingItemIndex = cart.findIndex(item => item._id === product._id);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        saveProductsCart(cart);
        updateProductsCartDisplay();
        showNotification(`${quantity} ${product.name}(s) added to cart!`);
    }

    function removeProductFromCart(productId) {
        const cart = getProductsCart();
        const updatedCart = cart.filter(item => item._id !== productId);
        saveProductsCart(updatedCart);
        updateProductsCartDisplay();
    }

    function updateProductsCartDisplay() {
        const cart = getProductsCart();
        const cartList = document.getElementById('products-cart-list');
        const emptyCartMessage = document.getElementById('empty-products-cart-message');
        const cartCount = document.getElementById('products-cart-count');
        const subtotalEl = document.getElementById('products-cart-subtotal');
        const totalEl = document.getElementById('products-cart-total');

        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }

        // Update cart list
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartList.innerHTML = '';
            cartList.appendChild(emptyCartMessage);
            subtotalEl.textContent = '$0.00';
            totalEl.textContent = '$0.00';
            return;
        }

        emptyCartMessage.classList.add('hidden');
        
        let subtotal = 0;
        cartList.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'border-b pb-3 mb-3';
            cartItem.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div class="flex-1">
                        <h4 class="font-semibold text-sm">${item.name}</h4>
                        <p class="text-xs text-gray-500">Qty: ${item.quantity}</p>
                        <p class="text-sm font-semibold price-color">$${itemTotal.toFixed(2)}</p>
                    </div>
                    <button class="remove-product text-red-500 hover:text-red-700" data-id="${item._id}">
                        <i data-feather="x" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
            cartList.appendChild(cartItem);
        });

        const shipping = 5.00;
        const total = subtotal + shipping;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;

        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeProductFromCart(productId);
            });
        });

        feather.replace();
    }

    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function displayProducts(products) {
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full py-8">No products found in this category.</p>';
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-pink-100 product-card';
            productCard.innerHTML = `
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" />
                    ${product.originalPrice ? `<span class="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">Sale</span>` : ''}
                </div>
                <div class="p-4">
                    <span class="text-xs text-gray-500 uppercase tracking-wide font-medium">${formatCategory(product.category)}</span>
                    <h3 class="text-lg font-semibold mb-2 line-clamp-2 h-12">${product.name}</h3>
                    <div class="flex items-center mb-3">
                        ${generateStarRating(product.rating)}
                        <span class="text-xs text-gray-500 ml-1">(${product.rating.toFixed(1)})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="price-color font-bold text-lg">$${product.price.toFixed(2)}</span>
                            ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="view-product-btn btn-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-[#6B2A2A] transition-colors flex items-center" data-product-id="${product._id}">
                            <i data-feather="eye" class="mr-1 w-3 h-3"></i> View
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
        
        feather.replace();

        // Add event listeners to "View" buttons
        document.querySelectorAll('.view-product-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.getAttribute('data-product-id');
                const product = productsData.find(p => p._id === productId);
                if (product) openProductModal(product);
            });
        });
    }

    function formatCategory(category) {
        const categories = {
            'moisturizer': 'MOISTURIZER',
            'sunscreen': 'SUNSCREEN', 
            'serum': 'SERUM',
            'cleanser': 'CLEANSER',
            'hair': 'HAIR CARE'
        };
        return categories[category] || category.toUpperCase();
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i data-feather="star" class="w-3 h-3 fill-yellow-400 text-yellow-400"></i>';
        }

        if (hasHalfStar) {
            stars += '<i data-feather="star" class="w-3 h-3 fill-yellow-400 text-yellow-400"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i data-feather="star" class="w-3 h-3 text-yellow-400"></i>';
        }
        return stars;
    }

    function openProductModal(product) {
        currentProduct = product;
        document.getElementById('modal-title').textContent = product.name;
        const modalImage = document.getElementById('modal-image');
        modalImage.src = product.image;
        modalImage.alt = product.name;
        document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
        document.getElementById('modal-description').textContent = product.description;
        document.getElementById('modal-ingredients').textContent = product.ingredients || '';
        document.getElementById('modal-usage').textContent = product.usage || '';

        const benefitsList = document.getElementById('modal-benefits');
        benefitsList.innerHTML = '';
        if (product.benefits && product.benefits.length) {
            product.benefits.forEach(b => {
                const li = document.createElement('li');
                li.textContent = b;
                benefitsList.appendChild(li);
            });
        }

        const ratingElement = document.getElementById('modal-rating');
        ratingElement.innerHTML = generateStarRating(product.rating) + `<span class="text-gray-600 ml-2">${product.rating.toFixed(1)}/5</span>`;

        productModal.classList.remove('hidden');
        feather.replace();
    }

    // Initialize cart display
    updateProductsCartDisplay();
});
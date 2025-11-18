let servicesData = [];

document.addEventListener("DOMContentLoaded", async () => {
    const servicesGrid = document.getElementById('services-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceModal = document.getElementById('service-modal');
    const closeModal = document.getElementById('close-modal');
    const addToCartModal = document.getElementById('add-to-cart-modal');
    const bookNowBtn = document.getElementById('book-now-btn');
    const serviceQtyEl = document.getElementById('service-qty');
    const decreaseQtyBtn = document.getElementById('decrease-qty');
    const increaseQtyBtn = document.getElementById('increase-qty');
    const variationsSection = document.getElementById('variations-section');
    const variationsContainer = document.getElementById('variations-container');

    let selectedQuantity = 1;
    let selectedVariation = null;
    let currentService = null;

    // Fetch services from backend API
    try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        servicesData = await response.json();
        displayServices(servicesData);
    } catch (error) {
        console.error(error);
        servicesGrid.innerHTML = '<p class="text-center text-gray-500 py-8">Unable to load services right now.</p>';
    }

    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            if (filter === 'all') {
                displayServices(servicesData);
            } else {
                const filtered = servicesData.filter(s => s.category === filter);
                displayServices(filtered);
            }
        });
    });

    // Close modal handler
    closeModal.addEventListener('click', () => serviceModal.classList.add('hidden'));

    // Quantity controls
    decreaseQtyBtn.addEventListener('click', () => {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            serviceQtyEl.textContent = selectedQuantity;
        }
    });

    increaseQtyBtn.addEventListener('click', () => {
        selectedQuantity++;
        serviceQtyEl.textContent = selectedQuantity;
    });

    // Add to booking (cart)
    addToCartModal.addEventListener('click', () => {
        if (!currentService) return;

        let cart = JSON.parse(localStorage.getItem('selectedServices') || '[]');
        const price = selectedVariation ? selectedVariation.price : currentService.price;
        const variationName = selectedVariation ? selectedVariation.name : null;

        // Check if service with same variation is already in cart
        const existingIndex = cart.findIndex(item => item.id === currentService.id && item.variation === variationName);

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += selectedQuantity;
        } else {
            cart.push({
                id: currentService.id,
                name: currentService.name,
                price: price,
                variation: variationName,
                quantity: selectedQuantity
            });
        }

        localStorage.setItem('selectedServices', JSON.stringify(cart));
        showNotification('Service added to booking!');
        serviceModal.classList.add('hidden');
        updateCartDisplay();
    });

    // Book Now button - redirect to contact with service data
    bookNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentService) return;

        // Add current service to cart before redirecting
        const price = selectedVariation ? selectedVariation.price : currentService.price;
        const variationName = selectedVariation ? selectedVariation.name : null;
        
        const serviceToBook = {
            id: currentService.id,
            name: currentService.name,
            price: price,
            variation: variationName,
            quantity: selectedQuantity
        };

        // Store service for contact page
        localStorage.setItem('serviceToBook', JSON.stringify(serviceToBook));
        window.location.href = 'contact.html';
    });

    function displayServices(services) {
        servicesGrid.innerHTML = '';
        if (services.length === 0) {
            servicesGrid.innerHTML = '<p class="text-center text-gray-500 py-8">No services found in this category.</p>';
            return;
        }

        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition p-4 variation-option';
            card.innerHTML = `
                <img src="${service.image}" alt="${service.name}" class="w-full h-56 object-cover rounded-md mb-4" />
                <h3 class="font-semibold text-lg mb-1">${service.name}</h3>
                <div class="flex items-center mb-2">
                    ${generateStarRating(service.rating)}
                    <span class="ml-2 text-sm text-gray-500">${service.rating.toFixed(1)}</span>
                </div>
                <p class="text-[#8B3A3A] font-bold text-xl mb-2">$${service.price.toFixed(2)}</p>
                <p class="text-gray-600 line-clamp-3">${service.description}</p>
            `;

            card.addEventListener('click', () => openServiceModal(service));
            servicesGrid.appendChild(card);
        });

        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i data-feather="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i>';
        }
        if (hasHalfStar) {
            stars += '<i data-feather="star" class="w-4 h-4 fill-yellow-400 text-yellow-400"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i data-feather="star" class="w-4 h-4 text-yellow-400"></i>';
        }
        return stars;
    }

    function openServiceModal(service) {
        currentService = service;
        selectedQuantity = 1;
        selectedVariation = null;
        serviceQtyEl.textContent = selectedQuantity;

        document.getElementById('modal-title').textContent = service.name;
        document.getElementById('modal-image').src = service.image;
        document.getElementById('modal-image').alt = service.name;
        document.getElementById('modal-price').textContent = `$${service.price.toFixed(2)}`;
        document.getElementById('modal-description').textContent = service.description;
        document.getElementById('modal-duration').textContent = service.duration || '';

        // Benefits list
        const benefitsList = document.getElementById('modal-benefits');
        benefitsList.innerHTML = '';
        if (service.benefits && service.benefits.length) {
            service.benefits.forEach(b => {
                const li = document.createElement('li');
                li.textContent = b;
                benefitsList.appendChild(li);
            });
        }

        // Render variations if present
        if (service.variations && service.variations.length > 0) {
            variationsSection.classList.remove('hidden');
            variationsContainer.innerHTML = '';
            service.variations.forEach((variation) => {
                const varDiv = document.createElement('div');
                varDiv.className = 'variation-option border rounded-lg p-3 cursor-pointer';

                varDiv.innerHTML = `
                    <h5 class="font-semibold">${variation.name} - $${variation.price.toFixed(2)}</h5>
                    <p class="text-sm text-gray-500">${variation.description}</p>
                `;

                varDiv.addEventListener('click', () => {
                    // Remove previous selection highlight
                    variationsContainer.querySelectorAll('.variation-option').forEach(v => v.classList.remove('selected'));
                    varDiv.classList.add('selected');
                    selectedVariation = variation;
                    document.getElementById('modal-price').textContent = `$${variation.price.toFixed(2)}`;
                });

                variationsContainer.appendChild(varDiv);
            });
        } else {
            variationsSection.classList.add('hidden');
            selectedVariation = null;
        }

        serviceModal.classList.remove('hidden');
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Update cart display function
    function updateCartDisplay() {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices') || '[]');
        const servicesList = document.getElementById('selected-services-list');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        
        // Update cart count
        if (selectedServices.length > 0) {
            cartCount.textContent = selectedServices.length;
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }
        
        // Update services list
        if (selectedServices.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            servicesList.innerHTML = '';
            servicesList.appendChild(emptyCartMessage);
            cartTotal.textContent = '$0.00';
            return;
        }
        
        emptyCartMessage.classList.add('hidden');
        
        let total = 0;
        servicesList.innerHTML = '';
        
        selectedServices.forEach((service, index) => {
            total += service.price * service.quantity;
            
            const serviceElement = document.createElement('div');
            serviceElement.className = 'border-b pb-3 mb-3';
            serviceElement.innerHTML = `
                <div class="flex justify-between">
                    <div class="flex-1">
                        <h4 class="font-semibold">${service.name}</h4>
                        ${service.variation ? `<p class="text-sm text-gray-500">${service.variation}</p>` : ''}
                        <p class="text-sm text-gray-500">Qty: ${service.quantity}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-[#8B3A3A]">$${(service.price * service.quantity).toFixed(2)}</p>
                        <button class="remove-service text-red-500 text-sm mt-1" data-index="${index}">
                            <i data-feather="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
            servicesList.appendChild(serviceElement);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-service').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeServiceFromCart(index);
            });
        });
        
        // Refresh feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    // Remove service from cart
    function removeServiceFromCart(index) {
        const selectedServices = JSON.parse(localStorage.getItem('selectedServices') || '[]');
        selectedServices.splice(index, 1);
        localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
        updateCartDisplay();
    }

    // Initialize cart display
    updateCartDisplay();
});
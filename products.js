// Products data - fetched from MongoDB
let productsData = [];

document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.getElementById('products-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productModal = document.getElementById('product-modal');
  const closeModal = document.getElementById('close-modal');
  const addToCartModal = document.getElementById('add-to-cart-modal');

  // Fetch products from MongoDB
  try {
    const response = await fetch('/api/products');
    productsData = await response.json();

    displayProducts(productsData);
  } catch (error) {
    console.error('Error fetching products:', error);
    productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">Failed to load products. Please try again later.</p>';
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

  // Modal functionality
  closeModal.addEventListener('click', () => productModal.classList.add('hidden'));
  addToCartModal.addEventListener('click', () => {
    alert('Product added to cart!');
    productModal.classList.add('hidden');
  });
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) productModal.classList.add('hidden');
  });

  function displayProducts(products) {
    productsGrid.innerHTML = '';
    if (products.length === 0) {
      productsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">No products found in this category.</p>';
      return;
    }
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105 product-card';
      productCard.innerHTML = `
        <div class="relative">
          <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover" />
          ${product.originalPrice ? `<span class="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-full text-sm font-semibold">Sale</span>` : ''}
        </div>
        <div class="p-6">
          <span class="text-sm text-gray-500 uppercase tracking-wide">${product.category}</span>
          <h3 class="text-xl font-semibold mb-2">${product.name}</h3>
          <div class="flex items-center mb-3">
            ${generateStarRating(product.rating)}
            <span class="text-sm text-gray-500 ml-2">(${product.rating.toFixed(1)})</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-pink-500 font-bold text-xl">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="text-gray-400 line-through text-sm">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="view-product-btn text-pink-500 hover:text-pink-600 flex items-center" data-product-id="${product._id}">
              <i data-feather="eye" class="mr-2 w-4 h-4"></i> View
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

  function openProductModal(product) {
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
});

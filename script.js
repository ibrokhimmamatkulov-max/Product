let cart = [];
let products = [];

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function displayProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card product-card">
                <img src="${product.image || 'https://via.placeholder.com/300x200'}" class="card-img-top product-image">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="h5 mb-0">${product.price} руб.</span>
                        <button class="btn btn-success" onclick="addToCart('${product.id}')">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        alert(`${product.name} добавлен в корзину!`);
    }
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Telegram Web App integration
    if (window.Telegram?.WebApp) {
        Telegram.WebApp.expand();
        Telegram.WebApp.enableClosingConfirmation();
    }
});
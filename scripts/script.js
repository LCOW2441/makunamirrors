document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
    fetchProducts();
    loadCart();
});

function showSection(id) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const sectionToShow = document.getElementById(id);
    if (sectionToShow) {
        sectionToShow.classList.add('active');
    }
}

function fetchProducts() {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" />
                    <h3><center>${product.name}</center></h3>
                    <p>${product.description}</p>
                    <p>$${product.price.toFixed(2)}</p>
                    <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        });
}

function addToCart(productId, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        const product = { id: productId, name: name, price: price, quantity: 1 };
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div style="display: block"><h3>${item.name} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</h3></div>
            <div><button onclick="removeFromCart('${item.id}')">Remove</button></div>
        `;
        cartItems.appendChild(cartItem);
    });

    const tax = subtotal * 0.13;
    const grandTotal = subtotal + tax;

    document.getElementById('subtotal').textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `Tax (13%): $${tax.toFixed(2)}`;
    document.getElementById('grand-total').textContent = `Grand Total: $${grandTotal.toFixed(2)}`;
}

function loadCart() {
    updateCart();
}

function checkout() {
    alert('Proceeding to checkout...');
    // Implement checkout process
}

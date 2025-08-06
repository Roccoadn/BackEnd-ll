import { api } from './constants/environments.js'
const { apiUrl, productsEndpoint, logoImage } = api;

let currentPage = 1;
const limit = 6;
let currentSort = "";

async function getProducts(page, sort = "") {
    const container = document.querySelector('#products-container');
    if (!container) return;
    try {
        let url = `${apiUrl + productsEndpoint}?page=${page}&limit=${limit}`;
        if (sort) {
            url += `&sort=${sort}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        renderProducts(data.payload);

        document.getElementById("pageInfo").textContent = `Página ${data.page} de ${data.totalPages}`;
        document.getElementById("prevPage").disabled = !data.hasPrevPage;
        document.getElementById("nextPage").disabled = !data.hasNextPage;
        document.getElementById("prevPage").onclick = () => getProducts(data.prevPage, currentSort);
        document.getElementById("nextPage").onclick = () => getProducts(data.nextPage, currentSort);
        currentPage = data.page;
    } catch (e) {
        console.error("Error al cargar productos:", e);
    }
}

const sortSelect = document.getElementById("sort-select");
if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
        currentSort = event.target.value;
        getProducts(1, currentSort);
    });
}

function renderProducts(data) {
    const container = document.querySelector('#products-container');
    if (!container) return;
    container.innerHTML = '';

    data.forEach(product => {
        const discount = (product.price * 0.85).toFixed(2);
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h1>${product.title}</h1>
            <h3>${product.description}</h3>
            <div>
                <p>$${product.price}</p>
                <span>$${discount}</span>
            </div>  
            <a href="/api/products/productsDetail/${product._id}">Ver Detalles</a>  
        `;
        const addCartButton = document.createElement('button');
        addCartButton.classList.add('add-cart-button');
        addCartButton.innerText = 'Agregar al carrito';

        div.appendChild(addCartButton);
        container.appendChild(div);
    });
    addToCart();

};

function addToCart() {
    const addCartButtons = document.getElementsByClassName("add-cart-button");
    Array.from(addCartButtons).forEach((button, idx) => {
        button.addEventListener('click', async () => {
            let productId = null;

            const productCard = button.closest('.product-card');
            if (productCard) {
                const productLink = productCard.querySelector('a[href^="/api/products/productsDetail/"]');
                if (productLink) {
                    productId = productLink.getAttribute('href').split('/').pop();
                }
            }

            // Si no se encontró con el link, intenta extraerlo desde la URL actual
            if (!productId) {
                const urlParts = window.location.pathname.split('/');
                const lastSegment = urlParts[urlParts.length - 1];
                if (lastSegment && lastSegment.length > 10) { // asumiendo que el ID es tipo Mongo (_id largo)
                    productId = lastSegment;
                }
            }
            const cartId = '67ca2b7d13c9804b87109f34'; // tu carrito real
            const token = localStorage.getItem('token'); // JWT token

            if (!productId) {
                Toastify({
                    text: "No se pudo identificar el producto",
                    gravity: "bottom",
                    duration: 3000
                }).showToast();
                return;
            }

            const url = `/api/carts/${cartId}/product/${productId}`; // nota singular 'product'

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ quantity: 1 })
                });

                if (response.ok) {
                    Toastify({
                        text: "Producto agregado al carrito",
                        gravity: "bottom",
                        duration: 1500,
                        style: {
                            background: "#FFCC1A",
                            color: "#020202",
                        }
                    }).showToast();
                    await loadCart();
                } else {
                    const errorData = await response.json();
                    Toastify({
                        text: `Error: ${errorData.message || 'No se pudo agregar'}`,
                        gravity: "bottom",
                        duration: 3000
                    }).showToast();
                }
            } catch (error) {
                Toastify({
                    text: "Error al conectar con el servidor",
                    gravity: "bottom",
                    duration: 3000
                }).showToast();
                console.error('Error en la solicitud:', error);
            }
        });
    });
}



document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById("cart-container");
    const cartButton = document.getElementById("cart-button");

    cartButton.addEventListener("click", async () => {
        if (cartContainer.classList.contains("hidden")) {
            cartContainer.classList.remove("hidden", "animate__fadeOutRight", "animate__faster");
            cartContainer.classList.add("animate__animated", "animate__fadeInRight", "animate__faster");

            // Activar listener para cierre por click externo
            setTimeout(() => {
                document.addEventListener("click", handleClickOutsideCart);
            }, 0);
        } else {
            closeCart();
        }

        await loadCart();
    });


    function handleClickOutsideCart(e) {
        const isClickInside = cartContainer.contains(e.target) || cartButton.contains(e.target);
        if (!isClickInside) {
            closeCart();
        }
    }

    function closeCart() {
        cartContainer.classList.remove("animate__fadeInRight", "animate__faster");
        cartContainer.classList.add("animate__fadeOutRight", "animate__faster");

        cartContainer.addEventListener("animationend", () => {
            cartContainer.classList.add("hidden");
            document.removeEventListener("click", handleClickOutsideCart);
        }, { once: true });
    }
});



async function loadCart() {
    try {
        const response = await fetch("/api/carts/67ca2b7d13c9804b87109f34");
        if (!response.ok) throw new Error("Error al obtener el carrito");

        const data = await response.json();
        const cart = data.payload;

        const cartContainer = document.getElementById("cart-container");
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");

        if (cartContainer) {
            cartItems.innerHTML = "";
            let total = 0;

            cart.products.filter(item => item.product).forEach(item => {
                total += item.quantity * item.product.price;

                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
          <h3>${item.product.title}</h3>
          <p>Cantidad: ${item.quantity}</p>
          <p>Precio: $${item.product.price}</p>
          <button class="decrease-quantity" data-id="${item.product._id}">×</button>
        `;
                cartItems.appendChild(div);
            });

            cartTotal.textContent = total;

            document.querySelectorAll(".decrease-quantity").forEach(button => {
                button.addEventListener("click", async (event) => {
                    const productId = event.target.dataset.id;
                    await decreaseProductQuantity(productId);
                    await loadCart();
                });
            });
        }
    } catch (error) {
        console.error("Error al cargar el carrito:", error);
    }
}

document.getElementById("clear-cart").addEventListener("click", async () => {
    await clearCart();
    await loadCart();
});



async function decreaseProductQuantity(productId) {
    try {
        const response = await fetch(`/api/carts/67ca2b7d13c9804b87109f34/product/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: 'decrease' })
        });

        if (!response.ok) throw new Error("Error al reducir la cantidad del producto");

        await loadCart();
    } catch (error) {
        console.error("Error al reducir cantidad:", error);
    }
}

async function clearCart() {
    try {
        const response = await fetch(`/api/carts/67ca2b7d13c9804b87109f34`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Error al vaciar el carrito");

        await loadCart();
    } catch (error) {
        console.error("Error al vaciar carrito:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getProducts(currentPage);
    loadCart();
    addToCart();
});

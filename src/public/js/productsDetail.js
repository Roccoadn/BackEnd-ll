const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function getProductDetail() {
    if (!productId) {
        console.error("No se proporciono el ID del producto");
        return;
    }

    try {
        const response = await fetch(`/api/products/productsDetail/${productId}`);
        if (!response.ok) {
            throw new Error(`Error al obtener el producto: ${response.status}`);
        }
        const product = await response.json();
        document.getElementById("product-title").textContent = product.title;
        document.getElementById("product-img").src = product.thumbnail;
        document.getElementById("product-img").alt = product.title;
        document.getElementById("product-description").textContent = product.description;
        document.getElementById("product-price").textContent = `$${product.price}`;
        document.getElementById("product-stock").textContent = `Stock: ${product.stock}`;
    } catch (error) {
        console.error("Error al cargar los detalles del producto:", error);
    }
}
getProductDetail();

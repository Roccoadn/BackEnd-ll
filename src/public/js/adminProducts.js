const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '/login'; // Si no hay token, redirige a login
} else {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.user.role !== 'admin') {
      window.location.href = '/'; // Si no es admin, redirige a home
    }
  } catch (error) {
    console.error('Error leyendo el token:', error);
    window.location.href = '/login'; // Si el token está corrupto o mal formado
  }
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

async function fetchProducts() {
  try {
    const res = await fetch('/api/products', { headers });
    if (!res.ok) throw new Error('Error al obtener productos');
    const data = await res.json();
    renderProducts(data.payload);
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }
}

function renderProducts(products) {
  const container = document.getElementById('productsContainer');
  container.innerHTML = '';

  products.forEach(prod => {
    const div = document.createElement('div');
    div.classList.add('product-card');
    div.innerHTML = `
      <h3>${prod.title}</h3>
      <p>${prod.description}</p>
      <p>$${prod.price}</p>
      <button onclick="deleteProduct('${prod._id}')">Eliminar</button>
      <button onclick="editProduct('${prod._id}', '${prod.title}', '${prod.description}', ${prod.price}, ${prod.stock}, '${prod.thumbnail}')">Editar</button>
    `;
    container.appendChild(div);
  });
}

document.getElementById('createForm').addEventListener('submit', async e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Error al crear producto');
    Swal.fire('Producto creado con éxito', '', 'success');
    e.target.reset();
    fetchProducts();
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }
});

async function deleteProduct(id) {
  try {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) throw new Error('Error al eliminar producto');
    Swal.fire('Producto eliminado', '', 'success');
    fetchProducts();
  } catch (error) {
    Swal.fire('Error', error.message, 'error');
  }
}

function editProduct(id, title, description, price, stock, thumbnail) {
  Swal.fire({
    title: 'Editar producto',
    html: `
      <input id="sw-title" value="${title}" class="swal2-input" />
      <input id="sw-desc" value="${description}" class="swal2-input" />
      <input id="sw-price" type="number" value="${price}" class="swal2-input" />
      <input id="sw-stock" type="number" value="${stock}" class="swal2-input" />
      <input id="sw-thumb" value="${thumbnail}" class="swal2-input" />
    `,
    confirmButtonText: 'Guardar',
    focusConfirm: false,
    preConfirm: async () => {
      const updated = {
        title: document.getElementById('sw-title').value,
        description: document.getElementById('sw-desc').value,
        price: Number(document.getElementById('sw-price').value),
        stock: Number(document.getElementById('sw-stock').value),
        thumbnail: document.getElementById('sw-thumb').value
      };
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updated)
        });
        if (!res.ok) throw new Error('Error al actualizar producto');
        Swal.fire('Actualizado correctamente', '', 'success');
        fetchProducts();
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', fetchProducts);

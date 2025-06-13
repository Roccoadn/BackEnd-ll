document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(e.target));

  const res = await fetch('/api/sessions/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.status === 'success') {
    Swal.fire({
      background: '#FFCC1A',
      color: '#020202',
      icon: 'success',
      iconColor: '#020202',
      title: '¡Usuario registrado!',
      text: 'Redirigiendo al login...',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => location.href = '/login', 2000);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: result.message || 'Error al registrar el usuario'
    });
  }
});

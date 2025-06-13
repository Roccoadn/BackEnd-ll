document.getElementById('resetForm').addEventListener('submit', async e => {
  e.preventDefault();

  const token = window.location.pathname.split('/').pop();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm').value;

  if (password !== confirm) {
    return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
  }

  try {
    const res = await fetch(`/api/reset/password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const result = await res.json();

    if (res.ok) {
      Swal.fire('Listo', result.message, 'success').then(() => {
        window.location.href = '/login';
      });
    } else {
      Swal.fire('Error', result.message || 'Algo salió mal', 'error');
    }
  } catch (err) {
    Swal.fire('Error', 'No se pudo completar la solicitud', 'error');
  }
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/sessions/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem('token', data.token);

    Swal.fire({
      background: '#FFCC1A',
      color: '#020202',
      icon: 'success',
      iconColor: '#020202',
      title: '¡Login exitoso!',
      showConfirmButton: false,
      timer: 1500
    });

    setTimeout(() => location.href = '/', 1500);
  } else {
    Swal.fire({
      background: '#FFCC1A',
      color: '#020202',
      iconColor: '#020202',
      icon: 'error',
      title: 'Error',
      text: data.message || 'Credenciales incorrectas'
    });
  }
});

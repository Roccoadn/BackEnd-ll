document.getElementById('forgot-password-link').addEventListener('click', async (e) => {
  e.preventDefault();

  const { value: email } = await Swal.fire({
    title: 'Restablecer contraseña',
    input: 'email',
    inputLabel: 'Ingresá tu correo electrónico',
    inputPlaceholder: 'ejemplo@email.com',
    confirmButtonText: 'Enviar',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value) return 'Debes ingresar un correo válido';
    }
  });

  if (email) {
    try {
      const res = await fetch('/api/reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire('Correo enviado', 'Hemos enviado un link a tu correo para reestablecer la contraseña.', 'success');
      } else {
        Swal.fire('Error', result.message || 'No se pudo enviar el correo.', 'error');
      }
    } catch (err) {
      console.error('Error en la solicitud de restablecimiento de contraseña:', err);
      Swal.fire('Error', 'Hubo un problema en el servidor.', 'error');
    }
  }
});

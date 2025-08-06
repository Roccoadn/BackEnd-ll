const { text } = require("express");

document.getElementById('forgot-password-link').addEventListener('click', async (e) => {
  e.preventDefault();

  const { value: email } = await Swal.fire({
    background: '#FFCC1A',
    color: '#020202',
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
        Swal.fire({
          title: 'Correo enviado',
          text: 'Hemos enviado un link a tu correo para reestablecer la contraseña.',
          icon: 'success',
          background: '#FFCC1A',
          color: '#020202',
          iconColor: '#020202',
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: result.message,
          background: '#FFCC1A',
          color: '#020202',
          iconColor: '#020202',
          icon: 'error'
        }
          || {
          title: 'Error',
          text: 'No se pudo enviar el correo',
          background: '#FFCC1A',
          color: '#020202',
          iconColor: '#020202',
          icon: 'error'
        });
      }
    } catch (err) {
      console.error('Error en la solicitud de restablecimiento de contraseña:', err);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema en el servidor',
        icon: 'error',
        background: '#FFCC1A',
        color: '#020202',
        iconColor: '#020202',
      });
    }
  }
});

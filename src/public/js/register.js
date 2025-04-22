document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            first_name: document.getElementById('first-name').value,
            last_name: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value),
            password: document.getElementById('password').value
        };
    
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error:', errorText);
            alert('Error al registrarse: ' + errorText);
            return;
        }
    
        const data = await response.json();
        console.log(data);
        alert('Usuario registrado correctamente!');
    });
});
  
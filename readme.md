# Proyecto para el curso de BackEnd II

## Descripción

Este proyecto tiene como objetivo mejorar la arquitectura del servidor desarrollado durante el curso de BackEnd II. Se enfoca en la implementación de patrones de diseño, manejo adecuado de roles y autorización, así como en la mejora de la lógica de negocio de un sistema ecommerce. Incluye la refactorización del código aplicando una arquitectura más profesional, el uso de DTOs para proteger datos sensibles, y la implementación de un sistema de recuperación de contraseñas con medidas de seguridad adicionales.

---

## Tecnologías utilizadas

- Node.js  
- Express.js  
- MongoDB
- JWT (JSON Web Token)  
- Nodemailer  
- dotenv  

---

## Uso

- Autenticarse para obtener un token JWT almacenado de forma segura.
- Acceder a rutas protegidas dependiendo del rol del usuario:
  - **Administrador**: puede crear, actualizar y eliminar productos.
  - **Usuario**: puede agregar productos a su carrito y realizar compras.
- Utilizar la ruta `/current` para obtener información del usuario actual a través de un DTO sin datos sensibles.
- En caso de olvido de contraseña, solicitar un correo con enlace de recuperación, el cual expira después de una hora y no permite reutilizar la contraseña anterior.


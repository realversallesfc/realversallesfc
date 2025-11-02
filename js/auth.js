// auth.js
// Archivo en que se manejara toda la logica referente a la autenticacion
// Incluye: login, registro, recuperar contraseña y cerrar sesion
// Se busca centrar la logica de la autenticacion en un solo archivo

const API_URL = 'https://real-versalles.onrender.com/api';

// Función para manejar el inicio de sesión
function setupLoginForm() {
    const loginForm = document.getElementById("formulario-login");
    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Obtener credenciales
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    try {
        // Hacer petición al backend
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, contrasena })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar datos de usuario en sessionStorage
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('usuario', JSON.stringify(data.usuario));

            // Mostrar mensaje de éxito y redirigir
                mostrarMensaje(data.message, false);
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 500);
        } else {
            // Mostrar mensaje de error del servidor
                mostrarMensaje(data.message, true);
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        mostrarMensaje('Error de conexión con el servidor', true);
    }
});
}

// Función para manejar la recuperación de contraseña
function setupRecoveryForm() {
    const recoveryForm = document.getElementById('form-recuperar');
    const emailInput = document.getElementById('correo-recuperar');

    if (!recoveryForm || !emailInput) return;

    recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();

        try {
            const response = await fetch(`${API_URL}/usuarios/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo: email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // Mostrar mensaje de éxito
            mostrarMensaje(data.message, false);
            
            // Cerrar el modal después de 2 segundos
            setTimeout(() => {
                recoveryForm.reset();
                const modal = document.getElementById('modal-recuperar');
                if (modal) modal.style.display = 'none';
            }, 2000);

        } catch (error) {
            // Mostrar mensaje de error
            mostrarMensaje(error.message, true);
        }
    });
}

// // Función para cerrar sesión
// async function cerrarSesion() {
//   try {
//     const response = await fetch(`${API_URL}/usuarios/logout`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.ok) {
//       // Limpiar datos de sesión
//       sessionStorage.removeItem('loggedIn');
//       sessionStorage.removeItem('usuario');

//       // Redirigir al login
//       window.location.href = 'index.html';
//     } else {
//       const data = response.json();
//       throw new Error(data.message || 'Error al cerrar sesión');
//     }
//   } catch (error) {
//     console.error('Error al cerrar sesión:', error);
//     alert('Error al cerrar sesión. Intente nuevamente.');
//   }
// }

// Inicializar los formularios cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupRecoveryForm();
    // setupLogoutForm(); // Descomentar cuando esté implementado
});


// modal.js
// Archivo en que se manejara toda la logica referente a los modales
// Se busca centrar la logica de los modales en un solo archivo

// Función para abrir un modal por su ID
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Función para cerrar un modal por su ID
function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Inicializar todos los modales
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos para los botones de abrir modal
    document.querySelectorAll('[id^="abrir-modal-"]').forEach(button => {
        const modalId = button.id.replace('abrir-', ''); // Convierte 'abrir-modal-xxx' a 'modal-xxx'
        button.addEventListener('click', (e) => {
            e.preventDefault();
            abrirModal(modalId);
        });
    });

    // Configurar eventos para los botones de cerrar modal
    document.querySelectorAll('[id^="cerrar-modal-"]').forEach(button => {
        const modalId = button.id.replace('cerrar-', ''); // Convierte 'cerrar-modal-xxx' a 'modal-xxx'
        button.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarModal(modalId);
        });
    });

    // Cerrar modal al hacer clic fuera del contenido
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal(this.id);
            }
        });
    });

    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'flex') {
                    cerrarModal(modal.id);
                }
            });
        }
    });
});

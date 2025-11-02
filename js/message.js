// message.js
// Archivo en que se manejara toda la logica referente a los mensajes
// Se busca centrar la logica de los mensajes en un solo archivo

// Función para mostrar mensajes en los formularios
function mostrarMensaje(mensaje, esError = true) {
    const mensajeElement = document.getElementById("mensaje");
    mensajeElement.textContent = mensaje;

    // Limpiar clases existentes
    mensajeElement.classList.remove('error', 'success');

    // Agregar la clase correspondiente
    mensajeElement.classList.add(esError ? 'error' : 'success');

    // Mostrar el mensaje
    mensajeElement.style.display = 'block';

    // Limpiar el mensaje después de 5 segundos
    if (mensaje) {
        setTimeout(() => {
            mensajeElement.style.display = 'none';
            mensajeElement.textContent = '';
        }, 1000);
    }
}
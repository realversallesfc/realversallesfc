// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = sessionStorage.getItem('loggedIn');
  const userData = sessionStorage.getItem('usuario');

  if (!isLoggedIn || !userData) {
    // Si no hay sesión activa, redirigir al login
    window.location.href = 'index.html';
    return;
  }

  // Si la sesión es válida, cargar los jugadores y plantillas
  await mostrarJugadores();
  await mostrarPlantillas();
  await actualizarContadorJugadores();
  await actualizarContadorPlantillas();
});

const API_URL = 'https://real-versalles.onrender.com/api';


/*
+-------------------------------------------+
|                                           |
|               PLANTILLAS                  |
|                                           |
+-------------------------------------------+
*/

// Funcion para guardar plantillas
async function guardarPlantilla() {
  const mensaje = document.getElementById("mensaje");
  const archivoInput = document.getElementById("archivoPlantilla");

  // 🧾 Limpiar mensaje anterior
  mensaje.textContent = "";

  // 🧩 Validar que haya archivo y nombre
  if (!archivoInput.files.length) {
    mensaje.textContent = "Debes completar todos los campos.";
    return;
  }

  // 🧱 Crear formData para enviar el archivo
  const formData = new FormData();
  formData.append("archivo", archivoInput.files[0]);

  try {
    // 📡 Petición al backend
    const respuesta = await fetch(`${API_URL}/plantillas`, {
      method: "POST",
      body: formData
    });

    // 📥 Procesar respuesta
    const data = await respuesta.json();

    if (!respuesta.ok) {
      // ❌ Si el backend responde con error (status 4xx o 5xx)
      mensaje.textContent = data.error;
      return;
    }

    // ✅ Si se subió correctamente
    mensaje.textContent = data.message;

    // 🧹 Limpiar formulario
    archivoInput.value = "";
    // Actualizar el contador de plantillas
    await actualizarContadorPlantillas();

  } catch (error) {
    // Error de red o fetch
    mensaje.textContent = "Error de conexión con el servidor.";
  }
}

// Función para actualizar el contador de plantillas
async function actualizarContadorPlantillas() {
  try {
    const response = await fetch(`${API_URL}/plantillas`);
    const plantillas = await response.json();
    const contador = document.getElementById('contador-plantillas-span');
    if (contador) {
      contador.textContent = plantillas.length;
    }
    return plantillas.length;
  } catch (error) {
    console.error('Error al actualizar contador de plantillas:', error);
    const contador = document.getElementById('contador-plantillas-span');
    if (contador) {
      contador.textContent = '0';
    }
    return 0;
  }
}

// Función para mostrar las plantillas
async function mostrarPlantillas() {
  try {
    const response = await fetch(`${API_URL}/plantillas`);
    const plantillas = await response.json();
    
    // Actualizar el contador
    const contador = document.getElementById('contador-plantillas-span');
    if (contador) {
      contador.textContent = plantillas.length;
    }
    
    const plantillasContainer = document.querySelector('.plantillas-list-container');
    
    if (!plantillas || plantillas.length === 0) {
      plantillasContainer.innerHTML = '<p>No hay plantillas disponibles</p>';
      return;
    }

    const plantillasHTML = plantillas.map(plantilla => `
      <div class="plantilla-card">
        <div class="plantilla-info">
        <h3>${plantilla.nombre_archivo}</h3>
        <p>Subido: ${new Date(plantilla.fecha_subida).toLocaleDateString()}</p>
        </div>
        <div class="plantilla-actions">
          <a href="${API_URL}${plantilla.ruta_archivo}" target="_blank" class="btn-descargar">
            <i class="fas fa-download"></i> Descargar
          </a>
        </div>
      </div>
    `).join('');
    
    plantillasContainer.innerHTML = plantillasHTML;
    
  } catch (error) {
    console.error('Error al cargar las plantillas:', error);
    const plantillasContainer = document.querySelector('.plantillas-list-container');
    plantillasContainer.innerHTML = '<p>Error al cargar las plantillas. Intente recargar la página.</p>';
  }
}


// Función para obtener las plantillas
async function obtenerPlantillas() {
  try {
    const response = await fetch(`${API_URL}/plantillas`);
    const data = await response.json();

    // Actualizar el contador de plantillas
    const contadorPlantillas = document.getElementById('contador-plantillas-span');
    if (contadorPlantillas) {
      contadorPlantillas.textContent = data.length;
    }

    return data;
  } catch (error) {
    console.error('Error al obtener plantillas:', error);

    // Mostrar 0 en caso de error
    const contadorPlantillas = document.getElementById('contador-plantillas-span');
    if (contadorPlantillas) {
      contadorPlantillas.textContent = '0';
    }

    return [];
  }
}

// Mostrar nombre del archivo seleccionado
document.getElementById('archivoJugador').addEventListener('change', function (e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'Ningún archivo seleccionado';
  document.getElementById('previewArchivo').textContent = fileName;
});

// 

/*
+-------------------------------------------+
|                                           |
|               JUGADORES                   |
|                                           |
+-------------------------------------------+
*/

// Función para guardar un nuevo jugador
async function guardarJugador() {
  const docJugador = document.getElementById('docJugador').value.trim();
  const nombreJugador = document.getElementById('nombreJugador').value.trim();
  const archivoInput = document.getElementById('archivoJugador');
  const mensajeJugador = document.getElementById('mensajeJugador');

  // Validar campos requeridos
  if (!docJugador || !nombreJugador || !archivoInput.files[0]) {
    mensajeJugador.textContent = 'Por favor complete todos los campos';
    mensajeJugador.style.color = 'red';
    return;
  }

  const formData = new FormData();
  formData.append('documento', docJugador);
  formData.append('nombre', nombreJugador);
  formData.append('archivo', archivoInput.files[0]);

  try {
    const response = await fetch(`${API_URL}/jugadores`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      mensajeJugador.textContent = 'Jugador guardado exitosamente';
      mensajeJugador.style.color = 'green';

      // Limpiar el formulario
      document.getElementById('formJugador').reset();
      document.getElementById('previewArchivo').textContent = '';

      // Cerrar el modal después de 1.5 segundos
      setTimeout(() => {
        document.getElementById('modal-jugador').style.display = 'none';
        // Recargar la lista de jugadores
        document.querySelector('.jugadores-grid-container').innerHTML = '';
        mostrarJugadores();
      }, 1500);
    } else {
      throw new Error(data.message || 'Error al guardar el jugador');
    }
  } catch (error) {
    console.error('Error:', error);
    mensajeJugador.textContent = error.message || 'Error al conectar con el servidor';
    mensajeJugador.style.color = 'red';
  }
}

// Función para obtener los jugadores
async function obtenerJugadores() {
  try {
    const response = await fetch(`${API_URL}/jugadores`);
    let data = await response.json();
    
    // Mapear los datos para usar 'archivo' en lugar de 'archivo_hoja_vida'
    data = data.map(jugador => ({
      ...jugador,
      archivo: jugador.archivo_hoja_vida  // Mapear archivo_hoja_vida a archivo
    }));
    
    console.log('Jugadores con archivos mapeados:', data);

    // Actualizar el contador de jugadores
    const contadorJugadores = document.getElementById('contador-jugadores-span');
    if (contadorJugadores) {
      contadorJugadores.textContent = data.length;
    }

    return data;
  } catch (error) {
    console.error('Error al obtener jugadores:', error);

    // Mostrar 0 en caso de error
    const contadorJugadores = document.getElementById('contador-jugadores-span');
    if (contadorJugadores) {
      contadorJugadores.textContent = '0';
    }

    return [];
  }
}

// Función para buscar jugadores
async function buscarJugadores() {
  const searchInput = document.getElementById('searchJugador');
  const searchTerm = searchInput.value.trim();
  const container = document.querySelector('.jugadores-grid-container');

  if (!searchTerm) {
    container.innerHTML = '';
    await mostrarJugadores();
    return;
  }

  // Validar que el documento tenga exactamente 10 dígitos
  if (searchTerm.length !== 10) {
    mostrarMensaje('El documento debe tener exactamente 10 dígitos', true);
    return;
  }

  // Validar que solo contenga números
  if (!/^\d+$/.test(searchTerm)) {
    mostrarMensaje('El documento solo puede contener números', true);
    return;
  }

  try {
    container.innerHTML = '';
    // Mostrar mensaje de búsqueda
    mostrarMensaje('Buscando jugador...', false);

    const response = await fetch(`${API_URL}/jugadores/${searchTerm}`);

    if (!response.ok) {
      // Si el error es 404, mostramos un mensaje específico
      if (response.status === 404) {
        mostrarMensaje(`No se encontró ningún jugador con el documento: ${searchTerm}`, true);
        return; // Salir de la función después de mostrar el mensaje
      }

      // Para otros errores, intentamos obtener el mensaje del servidor
      try {
        const errorData = await response.json();
        mostrarMensaje(errorData.message, true);
      } catch (e) {
        mostrarMensaje('Error al procesar la respuesta del servidor', true);
      }
      return; // Salir de la función después de manejar el error
    }

    let data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No se encontró información para el jugador con documento: ${searchTerm}`);
    }

    // Mapear el campo archivo_hoja_vida a archivo para consistencia
    data = {
      ...data,
      archivo: data.archivo_hoja_vida
    };

    console.log('Datos del jugador encontrado:', data);

    const primeraLetra = data.nombre.charAt(0).toUpperCase();
    const nombre = data.nombre;
    const documento = data.documento;
    const archivoNombre = data.archivo ? 'Ver documento' : 'Sin archivo';
    
    // Construir la URL de Cloudinary para el archivo
    let archivoUrl = '#';
    if (data.archivo) {
      const fileId = data.archivo.split('/').pop();
      archivoUrl = `https://res.cloudinary.com/dee5ygh4k/image/upload/v1762113142/real_versalles/jugadores/${fileId}`;
      if (fileId.toLowerCase().endsWith('.pdf')) {
        archivoUrl += '?force_download=true';
      }
    }
    const archivoLink = data.archivo ? `<a href="${archivoUrl}" target="_blank" class="archivo-link">${archivoNombre}</a>` : `<span class="sin-archivo">${archivoNombre}</span>`;
    
    // Mostrar el jugador encontrado
    container.innerHTML = `
      <div class="jugador-avatar">${primeraLetra}</div>
      <div class="jugador-info">
        <h3>${nombre}</h3>
        <p><strong>Documento:</strong> ${documento}</p>
        <p><strong>Hoja de vida:</strong> ${archivoLink}</p>
      </div>
    `;

    // Mostrar mensaje de éxito
    mostrarMensaje('Jugador encontrado con éxito', false);

  } catch (error) {
    console.error('Error al buscar jugador:', error);
    container.innerHTML = '';
    // Mostrar mensaje de error con el sistema de mensajes
    mostrarMensaje(error.message || 'Ocurrió un error inesperado', true);
  }
}

// Agregar evento al botón de búsqueda
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.querySelector('.boton_busqueda');
  const searchInput = document.getElementById('searchJugador');

  if (searchButton) {
    searchButton.addEventListener('click', buscarJugadores);
  }

  // También buscar al presionar Enter en el input
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        buscarJugadores();
      }
    });
  }
});

// Función para mostrar los jugadores en tarjetas
async function mostrarJugadores() {
  const jugadores = await obtenerJugadores();
  const container = document.querySelector('.jugadores-grid-container');

  if (!container) return;

  if (jugadores.length === 0) {
    container.innerHTML = '<p>No hay jugadores registrados.</p>';
    return;
  }

  jugadores.forEach(jugador => {
    const primeraLetra = jugador.nombre.charAt(0).toUpperCase();
    const nombre = jugador.nombre;
    const documento = jugador.documento;
    const archivoNombre = jugador.archivo ? 'Ver documento' : 'Sin archivo';
    // Construir la URL del archivo para Cloudinary
    let archivoUrl = '#';
    if (jugador.archivo) {
      // Extraer el ID del archivo de la URL
      const fileId = jugador.archivo.split('/').pop();
      // Construir la URL de Cloudinary con el formato correcto
      archivoUrl = `https://res.cloudinary.com/dee5ygh4k/image/upload/v1762113142/real_versalles/jugadores/${fileId}`;
      
      // Si el archivo es un PDF, forzar la descarga
      if (fileId.toLowerCase().endsWith('.pdf')) {
        archivoUrl += '?force_download=true';
      }
    }
    const archivoLink = jugador.archivo ? `<a href="${archivoUrl}" target="_blank" class="archivo-link">${archivoNombre}</a>` : `<span class="sin-archivo">${archivoNombre}</span>`;

    const card = document.createElement('div');
    card.className = 'jugador-card';
    card.id = 'modal-jugador';

    card.innerHTML = `
      <div class="jugador-avatar">${primeraLetra}</div>
      <div class="jugador-info">
        <h3>${nombre}</h3>
        <p><strong>Documento:</strong> ${documento}</p>
        <p><strong>Hoja de vida:</strong> ${archivoLink}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

// Función para actualizar el contador de jugadores
async function actualizarContadorJugadores() {
  try {
    const response = await fetch(`${API_URL}/jugadores`);
    const jugadores = await response.json();
    const contador = document.getElementById('contador-jugadores-span');
    if (contador) {
      contador.textContent = jugadores.length;
    }
    return jugadores.length;
  } catch (error) {
    console.error('Error al actualizar contador de jugadores:', error);
    const contador = document.getElementById('contador-jugadores-span');
    if (contador) {
      contador.textContent = '0';
    }
    return 0;
  }
}

// Función para cerrar sesión
async function cerrarSesion() {
  try {
    const response = await fetch(`${API_URL}/usuarios/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Limpiar datos de sesión
      sessionStorage.removeItem('loggedIn');
      sessionStorage.removeItem('usuario');

      // Redirigir al login
      window.location.href = 'index.html';
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Error al cerrar sesión');
    }
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    alert('Error al cerrar sesión. Intente nuevamente.');
  }
}


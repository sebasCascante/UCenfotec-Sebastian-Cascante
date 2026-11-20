
// libros.js: registra, lista y filtra libros (pages/libros.html).
 
const CLAVE_FILTRO = 'biblioteca.filtroGenero';
 
const formulario = document.getElementById('form-libro');
const lista = document.getElementById('lista-libros');
const estado = document.getElementById('estado');
const filtroGenero = document.getElementById('filtro-genero');

// Géneros: llena el filtro con los géneros que existen.
async function cargarGeneros() {
  const libros = await pedirApi('GET', '/libros');
  const generos = [...new Set(libros.map((libro) => libro.genero))].sort();
  const guardado = localStorage.getItem(CLAVE_FILTRO) || '';
 
  filtroGenero.length = 1;
  generos.forEach((genero) => {
    filtroGenero.add(new Option(genero, genero));
  });
  filtroGenero.value = generos.includes(guardado) ? guardado : '';
}

// Botones: crea un botón de acción para un libro, por ejemplo «Editar».
function crearBoton(texto, clase, libro) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = clase;
  boton.textContent = texto;
  boton.setAttribute('aria-label', `${texto} ${libro.titulo}`);
  return boton;
}

// Tarjetas (opción A): muestra los libros como tarjetas.
function dibujarTarjetas(libros) {
  lista.className = 'tarjetas';
 
  libros.forEach((libro) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'tarjeta';
 
    const titulo = document.createElement('h3');
    titulo.textContent = libro.titulo;
 
    const autor = document.createElement('p');
    autor.textContent = libro.autor;
 
    const detalle = document.createElement('p');
    detalle.textContent =
      `${libro.genero} · ${libro.anio} · ${libro.codigo}`;
 
    const etiqueta = document.createElement('span');
    etiqueta.className = libro.disponible
      ? 'etiqueta'
      : 'etiqueta prestado';
    etiqueta.textContent = libro.disponible ? 'Disponible' : 'Prestado';
 
    const acciones = document.createElement('div');
    acciones.className = 'acciones';
    acciones.append(
      crearBoton('Editar', 'secundario', libro),
      crearBoton('Eliminar', 'peligro', libro)
    );
 
    tarjeta.append(titulo, autor, detalle, etiqueta, acciones);
    lista.append(tarjeta);
  });
}

// Tabla (opción B): muestra los libros en una tabla.
function dibujarTabla(libros) {
  lista.className = 'contenedor-tabla';
 
  const tabla = document.createElement('table');
  tabla.className = 'tabla';
  // El título «Lista de libros» también le da nombre a la tabla.
  tabla.setAttribute('aria-labelledby', 'titulo-lista');
 
  // Encabezado: una fila con un th por columna.
  const encabezado = document.createElement('thead');
  const filaTitulos = document.createElement('tr');
  const columnas = ['Título', 'Autor', 'Género', 'Año', 'Código',
    'Estado', 'Acciones'];
  columnas.forEach((texto) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = texto;
    filaTitulos.append(th);
  });
  encabezado.append(filaTitulos);
 
  // Cuerpo: una fila por libro, con un td por dato.
  const cuerpo = document.createElement('tbody');
  libros.forEach((libro) => {
    const fila = document.createElement('tr');
    const datos = [libro.titulo, libro.autor, libro.genero, libro.anio,
      libro.codigo, libro.disponible ? 'Disponible' : 'Prestado'];
    datos.forEach((dato) => {
      const celda = document.createElement('td');
      celda.textContent = dato;
      fila.append(celda);
    });
 
    // La última celda lleva los botones, dentro de un div.
    const celdaAcciones = document.createElement('td');
    const acciones = document.createElement('div');
    acciones.className = 'acciones';
    acciones.append(
      crearBoton('Editar', 'secundario', libro),
      crearBoton('Eliminar', 'peligro', libro)
    );
    celdaAcciones.append(acciones);
    fila.append(celdaAcciones);
    cuerpo.append(fila);
  });
 
  tabla.append(encabezado, cuerpo);
  lista.append(tabla);
}

// Lista: pide los libros a la API y los muestra.
async function cargarLibros() {
  estado.textContent = 'Cargando libros…';
  lista.replaceChildren();
 
  const genero = filtroGenero.value;
  const ruta = genero
    ? `/libros?genero=${encodeURIComponent(genero)}`
    : '/libros';
 
  try {
    const libros = await pedirApi('GET', ruta);
    const vacio = libros.length === 0;
    estado.textContent = vacio ? 'No hay libros para mostrar.' : '';
 
    // Elija cómo mostrar la lista: tarjetas o tabla.
    //dibujarTarjetas(libros);
    dibujarTabla(libros);
  } catch (error) {
    estado.textContent = 'No se pudieron cargar los libros.';
  }
}

// Registrar: envía un libro nuevo a la API con POST.
async function guardarLibro(evento) {
  // Evita que el formulario recargue la página.
  evento.preventDefault();
 
  // Paso 1: toma los datos del formulario.
  const libro = {
    titulo: document.getElementById('titulo').value,
    autor: document.getElementById('autor').value,
    codigo: document.getElementById('codigo').value,
    anio: Number(document.getElementById('anio').value),
    genero: document.getElementById('genero').value,
    disponible: document.getElementById('disponible').checked
  };
  try {
    // Paso 2: envía el libro con POST y espera la respuesta.
    const resultado = await pedirApi('POST', '/libros', libro);
    // Paso 3: informa el resultado y limpia el formulario.
    // y vuelve a cargar la lista, que ahora incluye el libro nuevo.
    mostrarMensaje(resultado.mensaje, 'exito');
    formulario.reset();
    await cargarGeneros();
    await cargarLibros();
    formulario.reset();
  } catch (error) {
    // La API respondió con un error, o no respondió.
    mostrarMensaje(error.message, 'error');
  }
}

// Eventos: el formulario registra y el filtro recarga la lista.
formulario.addEventListener('submit', guardarLibro);
filtroGenero.addEventListener('change', () => {
  // localStorage recuerda el filtro para la próxima visita.
  localStorage.setItem(CLAVE_FILTRO, filtroGenero.value);
  cargarLibros();
});
 
// Inicio: al abrir la página, carga los géneros y la lista.
async function iniciar() {
  try {
    await cargarGeneros();
  } catch (error) {
    estado.textContent = 'No se pudieron cargar los libros.';
    return;
  }
  await cargarLibros();
}
 
iniciar();
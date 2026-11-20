// ui.js: funciones de la interfaz que usan varias páginas.
 
// Muestra un mensaje de éxito o de error en el párrafo #mensaje.
//   texto: lo que se muestra
//   tipo:  'exito' o 'error'; elige el color con una clase de CSS
function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
}
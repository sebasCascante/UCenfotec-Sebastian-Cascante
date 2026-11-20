// inicio.js: muestra en la portada cuántos libros tiene el catálogo.
 
async function mostrarTotalLibros() {
  const total = document.getElementById('total-libros');
 
  try {
    const libros = await pedirApi('GET', '/libros');
    total.textContent = `El catálogo tiene ${libros.length} libros.`;
  } catch (error) {
    total.textContent = '';
  }
}

mostrarTotalLibros();
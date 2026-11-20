// api.js: el único archivo del frontend que se comunica con la API.
 
// Dirección de la API. Es la otra aplicación: la que guarda los datos.
const URL_API = 'http://localhost:4000/api';

// Envía una petición a la API y devuelve los datos de la respuesta.
//   metodo: 'GET', 'POST', 'PUT' o 'DELETE'
//   ruta:   el final de la dirección, por ejemplo '/libros'
//   datos:  el objeto que se envía; solo con POST y PUT
async function pedirApi(metodo, ruta, datos) {
  // 1. Prepara las opciones de la petición.
  const opciones = { method: metodo, headers: {} };
  if (datos !== undefined) {
    opciones.headers['Content-Type'] = 'application/json';
    opciones.body = JSON.stringify(datos);
  }


  // 2. Envía la petición y espera la respuesta.
  let respuesta;
  try {
    respuesta = await fetch(URL_API + ruta, opciones);
  } catch (error) {
    throw new Error('No se pudo conectar con la API');
  }

  // 3. Convierte el cuerpo de la respuesta en un objeto.
  //    Si el cuerpo no es JSON, usa un objeto vacío.
  const contenido = await respuesta.json().catch(() => ({}));
 
  // 4. Si la API respondió con un error, lo lanza con su mensaje.
  if (!respuesta.ok) {
    const error = new Error(contenido.mensaje || 'Ocurrió un error');
    error.estado = respuesta.status;
    throw error;
  }
 
  return contenido;
}
// manejarErrores.js: responde cualquier error que no se haya manejado.

function manejarErrores(error, req, res, next) {
  // El cuerpo de la petición no es un JSON válido.
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El JSON enviado no es válido' });
  }

  // Cualquier otro error: se registra en la terminal y se responde 500.
  console.error(error);
  res.status(500).json({ mensaje: 'Ocurrió un error en el servidor' });
}

module.exports = manejarErrores;

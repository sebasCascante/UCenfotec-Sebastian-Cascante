// rutaNoEncontrada.js: responde 404 cuando ninguna ruta coincide.

function rutaNoEncontrada(req, res) {
  res.status(404).json({
    mensaje: `No existe la ruta ${req.method} ${req.originalUrl}`
  });
}

module.exports = rutaNoEncontrada;

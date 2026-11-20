// autores.controller.js: recibe las peticiones de /api/autores y responde.

const crypto = require('crypto');
const autores = require('../data/autores');

// Revisa los datos recibidos. Devuelve un mensaje de error o null.
function validar(datos) {
  if (!datos.nombre) {
    return 'Falta el nombre';
  }
  if (!datos.nacionalidad) {
    return 'Falta la nacionalidad';
  }
  return null;
}

// GET /api/autores
function listar(req, res) {
  res.json(autores);
}

// POST /api/autores
function crear(req, res) {
  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const { nombre, nacionalidad, biografia } = req.body;
  const autor = {
    _id: crypto.randomUUID(),
    nombre,
    nacionalidad,
    biografia: biografia || ''
  };
  autores.push(autor);
  res.status(201).json({ mensaje: 'Autor registrado', autor });
}

// PUT /api/autores/:id
function actualizar(req, res) {
  const autor = autores.find((a) => a._id === req.params.id);
  if (!autor) {
    return res.status(404).json({ mensaje: 'El autor no existe' });
  }

  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const { nombre, nacionalidad, biografia } = req.body;
  autor.nombre = nombre;
  autor.nacionalidad = nacionalidad;
  autor.biografia = biografia || '';
  res.json({ mensaje: 'Autor actualizado', autor });
}

module.exports = { listar, crear, actualizar };

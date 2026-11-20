// libros.controller.js: recibe las peticiones de /api/libros y responde.

const crypto = require('crypto');
const libros = require('../data/libros');

// Mensaje para cada campo obligatorio.
const OBLIGATORIOS = {
  titulo: 'Falta el título',
  autor: 'Falta el autor',
  codigo: 'Falta el código',
  anio: 'Falta el año',
  genero: 'Falta el género'
};

// Revisa los datos recibidos. Devuelve un mensaje de error o null.
function validar(datos) {
  const faltante = Object.keys(OBLIGATORIOS).find(
    (campo) => datos[campo] === undefined || datos[campo] === ''
  );
  if (faltante) {
    return OBLIGATORIOS[faltante];
  }

  const anio = Number(datos.anio);
  if (Number.isNaN(anio) || anio < 1000) {
    return 'Año no válido';
  }

  return null;
}

// Busca un libro por su id. Devuelve undefined si no existe.
function buscar(id) {
  return libros.find((libro) => libro._id === id);
}

// GET /api/libros  o  GET /api/libros?genero=Novela
function listar(req, res) {
  const { genero } = req.query;
  const resultado = genero
    ? libros.filter((libro) => libro.genero === genero)
    : libros;
  res.json(resultado);
}

// GET /api/libros/:id
function obtener(req, res) {
  const libro = buscar(req.params.id);
  if (!libro) {
    return res.status(404).json({ mensaje: 'El libro no existe' });
  }
  res.json(libro);
}

// POST /api/libros
function crear(req, res) {
  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const { titulo, autor, codigo, anio, genero, disponible } = req.body;
  if (libros.some((libro) => libro.codigo === codigo)) {
    return res.status(409).json({ mensaje: 'Ya existe un libro con ese código' });
  }

  const libro = {
    _id: crypto.randomUUID(),
    titulo,
    autor,
    codigo,
    anio: Number(anio),
    genero,
    disponible: disponible !== false
  };
  libros.push(libro);
  res.status(201).json({ mensaje: 'Libro registrado', libro });
}

// PUT /api/libros/:id
function actualizar(req, res) {
  const libro = buscar(req.params.id);
  if (!libro) {
    return res.status(404).json({ mensaje: 'El libro no existe' });
  }

  const error = validar(req.body);
  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const { titulo, autor, codigo, anio, genero, disponible } = req.body;
  const repetido = libros.some(
    (otro) => otro.codigo === codigo && otro._id !== libro._id
  );
  if (repetido) {
    return res.status(409).json({ mensaje: 'Ya existe un libro con ese código' });
  }

  libro.titulo = titulo;
  libro.autor = autor;
  libro.codigo = codigo;
  libro.anio = Number(anio);
  libro.genero = genero;
  libro.disponible = disponible !== false;
  res.json({ mensaje: 'Libro actualizado', libro });
}

// DELETE /api/libros/:id
function eliminar(req, res) {
  const posicion = libros.findIndex((libro) => libro._id === req.params.id);
  if (posicion === -1) {
    return res.status(404).json({ mensaje: 'El libro no existe' });
  }

  libros.splice(posicion, 1);
  res.json({ mensaje: 'Libro eliminado' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };

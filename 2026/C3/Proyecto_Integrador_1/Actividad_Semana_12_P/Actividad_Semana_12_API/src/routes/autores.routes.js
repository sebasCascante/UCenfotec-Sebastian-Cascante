// autores.routes.js: conecta cada URL de /api/autores con su controlador.

const express = require('express');
const controlador = require('../controllers/autores.controller');

const router = express.Router();

router.get('/', controlador.listar);
router.post('/', controlador.crear);
router.put('/:id', controlador.actualizar);

module.exports = router;

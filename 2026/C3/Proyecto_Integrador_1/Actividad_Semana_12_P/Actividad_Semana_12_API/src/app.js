// app.js: configura y arranca la API.

require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const librosRoutes = require('./routes/libros.routes');
const autoresRoutes = require('./routes/autores.routes');
const rutaNoEncontrada = require('./middlewares/rutaNoEncontrada');
const manejarErrores = require('./middlewares/manejarErrores');

const app = express();

// 1. Permite las peticiones del frontend, con su cookie de sesión.
app.use(cors({
  origin: process.env.ORIGEN_FRONTEND || 'http://localhost:3000',
  credentials: true
}));

// 2. Lee el JSON que envía el frontend y lo deja en req.body.
app.use(express.json());

// 3. Ruta de prueba: confirma que la API responde.
app.get('/api', (req, res) => {
  res.json({ mensaje: 'API de la Biblioteca funcionando' });
});

// 4. Conecta cada grupo de URL con sus rutas.
app.use('/api/libros', librosRoutes);
app.use('/api/autores', autoresRoutes);

// 5. Responde las URL que no existen y los errores. Van al final.
app.use(rutaNoEncontrada);
app.use(manejarErrores);

// 6. Inicia el servidor.
const puerto = process.env.PORT || 4000;
app.listen(puerto, () => {
  console.log(`API en http://localhost:${puerto}`);
});

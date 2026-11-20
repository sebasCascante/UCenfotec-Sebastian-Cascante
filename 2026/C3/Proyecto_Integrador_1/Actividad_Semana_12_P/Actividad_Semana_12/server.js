// server.js: servidor web del frontend. Entrega la carpeta public.

const path = require('path');
const express = require('express');
const app = express();

// Entrega los archivos de public: HTML, CSS, JS e imágenes.
app.use(express.static(path.join(__dirname, 'public')));

// Al publicar, el hosting define PORT. En local se usa 3000.
const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
    console.log(`Frontend en http://localhost:${puerto}`);
});
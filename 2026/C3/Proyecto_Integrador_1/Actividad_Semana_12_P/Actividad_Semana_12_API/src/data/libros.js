// libros.js: datos en memoria. En la etapa 2 se reemplazan por MongoDB.

const libros = [
  {
    _id: '1',
    titulo: 'Cuentos de mi tía Panchita',
    autor: 'Carmen Lyra',
    codigo: 'BIB-001',
    anio: 1920,
    genero: 'Cuentos',
    disponible: true
  },
  {
    _id: '2',
    titulo: 'Única mirando al mar',
    autor: 'Fernando Contreras Castro',
    codigo: 'BIB-002',
    anio: 1993,
    genero: 'Novela',
    disponible: true
  },
  {
    _id: '3',
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    codigo: 'BIB-003',
    anio: 1967,
    genero: 'Novela',
    disponible: false
  }
];

module.exports = libros;

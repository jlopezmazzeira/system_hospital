//Require
var express = require('express');
var mongoose = require('mongoose');
//Inicializar variables
var app = express();

//Conexión DB
mongoose.connection.openUri('mongodb://localhost:2701/hospitalDB', (err, resp) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'peticion realizada exitosamente'
    });
});

//Escuchar Peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');

});
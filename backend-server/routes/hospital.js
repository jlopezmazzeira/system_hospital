var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

// =====================================
// OBTENER TODOS LOS HOSPITALES
// =====================================
app.get('/', (req, resp, next) => {

    Hospital.find({}).exec(
        (err, hospitales) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                hospitales: hospitales
            });

        }
    );
});

// =====================================
// CREAR HOSTIPAL
// =====================================
app.post('/', mdAutenticacion.verificaToken, (req, resp) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            usuarioToken: req.usuario
        });

    });

});

// =====================================
// ACTUALIZAR HOSPITAL  
// =====================================
app.put('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

// =====================================
// ELIMINAR HOSPITAL
// =====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe el hospital con ese ID' }
            });
        }

        resp.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});

module.exports = app;
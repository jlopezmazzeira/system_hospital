var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

// =====================================
// OBTENER TODOS LOS MEDICOS
// =====================================
app.get('/', (req, resp, next) => {

    Medico.find({}).exec(
        (err, medicos) => {
            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                medicos: medicos
            });

        }
    );
});

// =====================================
// CREAR MEDICO
// =====================================
app.post('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var body = req.body;
    var id = req.params.id;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        resp.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuarioToken: req.usuario
        });

    });

});

// =====================================
// ACTUALIZAR MEDICO  
// =====================================
app.put('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe el medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// =====================================
// ELIMINAR MEDICO
// =====================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, resp) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe el medico con ese ID' }
            });
        }

        resp.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});

module.exports = app;
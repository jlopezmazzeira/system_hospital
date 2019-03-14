var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

// =====================================
// VERIFICAR TOKEN  
// =====================================
exports.verificaToken = function(req, resp, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
}

// =====================================
// VERIFICAR ADMIN  
// =====================================
exports.verificaAdmin = function(req, resp, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return resp.status(401).json({
            ok: false,
            mensaje: 'No tienes los permisos suficientes',
            errors: { message: 'Acceso Denegado' }
        });
    }
}

// =====================================
// VERIFICAR ADMIN O MISMO USUARIO
// =====================================
exports.verificaAdminOMismoUsuario = function(req, resp, next) {
    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return resp.status(401).json({
            ok: false,
            mensaje: 'No tienes los permisos suficientes',
            errors: { message: 'Acceso Denegado' }
        });
    }
}
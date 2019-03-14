var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// =====================================
// LOGIN CON GOOGLE
// =====================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, resp) => {
    var token = req.body.token;
    var gooleUSer = await verify(token)
        .catch(e => {
            return resp.status(403).json({
                ok: false,
                mensaje: 'Token no válido'
            });
        });

    Usuario.findOne({ email: gooleUSer.email }, (err, usuarioDB) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {

            if (usuarioDB.google === false) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticación normal'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                resp.status(201).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }

        } else {
            //El usuario no existe, hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = gooleUSer.nombre;
            usuario.email = gooleUSer.email;
            usuario.img = gooleUSer.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return resp.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear usuario',
                        email: usuario.email,
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                resp.status(201).json({
                    ok: true,
                    usuario: usuarioDB,
                    usuarioToken: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });

            });

        }
    });

});

// =====================================
// LOGIN NORMAL
// =====================================
app.post('/', (req, resp) => {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            if (!usuarioDB) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas',
                    errors: err
                });
            }
        }

        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        resp.status(201).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });
});

function obtenerMenu(ROLE) {
    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'Rxjs', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{titulo: 'Usuarios', url: '/usuarios'},
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }
    return menu;
}
module.exports = app;
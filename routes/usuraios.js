const express = require('express');
const usuarioController = require('../controllers/UsuarioController');
const {check} = require('express-validator');
const router = express.Router();

router.post('/', 
    [ 
        check('email', 'email invalido').isEmail(),
        check('nombre', 'nombre es obligatorio').not().isEmpty(),
        check('password', 'password minimo de 6 caracteres').isLength({min:6})
    ],
    usuarioController.NuevoUsuario
);

module.exports = router;
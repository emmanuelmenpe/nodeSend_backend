const express = require('express');
const authCotroller = require('../controllers/AuthController');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', 
    [ 
        check('email', 'email invalido').isEmail(),
        check('password', 'password es obligatorio').not().isEmpty()
    ],
    authCotroller.autenticarUsuario
);

router.get('/', 
    authMiddleware,
    authCotroller.usuarioAutenticado
);

module.exports = router;
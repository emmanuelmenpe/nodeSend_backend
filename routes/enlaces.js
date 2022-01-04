const express = require('express');
const enlacesController = require('../controllers/EnlacesController');
const archivosController = require('../controllers/ArchivosController');
const {check} = require('express-validator');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/',
    [
        check('nombre', 'archivo es obligatorio').not().isEmpty(),
        check('nombre_original', 'nombre es obligatorio').not().isEmpty(),
    ],
    authMiddleware,
    enlacesController.nuevoEnlace
);

router.get('/', 
    enlacesController.todosEnlaces
);

router.get('/:url',
    enlacesController.obtenerEnlace
);

module.exports = router;
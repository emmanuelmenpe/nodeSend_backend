const express = require('express');
const archivosCotroller = require('../controllers/ArchivosController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', 
    authMiddleware,
    archivosCotroller.subirArchivo
);

router.get('/:archivo',
    archivosCotroller.descargar,
    archivosCotroller.eliminarArchivo
);


module.exports = router;

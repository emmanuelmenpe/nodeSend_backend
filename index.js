const express = require('express');
require('dotenv').config({path: '.env'});
const conexionDB = require('./config/database');
const usuariosRuta = require('./routes/usuraios');

//crear servidor
const app = express();

//conectar a BD
conexionDB();

//puerto
const port = process.env.PORT || 4000;

//habilitar el leer los valires de un body JSON 
app.use(express.json());

//rutas de API
app.use('/api/usuarios', usuariosRuta);

app.listen(port, '0.0.0.0', () => {
    console.log(`servidor ejecutandose en el puerto ${port}`);
});
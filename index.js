const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '.env'});
const conexionDB = require('./config/database');
const usuariosRuta = require('./routes/usuraios');
const authRuta = require('./routes/auth');
const enlacesRuta = require('./routes/enlaces');
const archivosRuta = require('./routes/archivos');

//crear servidor
const app = express();
/*
//solo aceptara peticiones de la url definida
const corsOptions  = {
    origin:"http://localhost:3000/",
    credentials:true,
    methods: "GET,PUT,POST",
    optionsSuccessStatus: 200,
    preflightContinue: true,
}
*/
//habilitar cors
app.use(cors());//(corsOptions));

//conectar a BD
conexionDB();

//puerto
const port = process.env.PORT || 4000;

//habilitar el leer los valires de un body JSON 
app.use(express.json());

//habilitar carpeta publica
app.use(express.static('uploads'));

//rutas de API
app.use('/api/usuarios', usuariosRuta);
app.use('/api/auth', authRuta);
app.use('/api/enlaces', enlacesRuta);
app.use('/api/archivos', archivosRuta);

app.listen(port, '0.0.0.0', () => {
    console.log(`servidor ejecutandose en el puerto ${port}`);
});
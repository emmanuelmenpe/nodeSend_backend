const enlaceModel = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.nuevoEnlace = async (req, res, next) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return next();
    }

    try {
        const {nombre_original} = req.body;

        const enlace = new enlaceModel();

        //crear objeto del enlace
        enlace.url = shortid.generate();
        enlace.nombre = shortid.generate();
        enlace.nombre_original=nombre_original;

        //si el usuario esta autenticado
        if(req.usuario){
            const {password, descargas} = req.body;

            //asignar descargas
            if (descargas) {
                enlace.descargas = descargas;
            }

            //asignar password
            if (password) {
                const salt = await bcrypt.genSalt(10);
                enlace.password = await bcrypt.hash(password, salt);
            }

            //asignar autor
            enlace.autor = req.usuario.id
        }

        //almacenar enlace
        await enlace.save();
        res.status(200).json({msg:`${enlace.url}`});
        return next(); 
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al crear enlace'});
        return next();
    }
}

exports.obtenerEnlace = async(req, res, next) => {
    // verificar si existe el enlace
    const {url} = req.params;
    const enlace = await enlaceModel.findOne({url});
    //console.log(enlace);
    if (!enlace) {
        res.status(404).json({msg:'enlace no existe'});
    }

    res.status(200).json({archivo:enlace.nombre});

    const {descargas, nombre} = enlace;
    if (descargas === 1) {
        req.archivo = nombre;//crear una variable interna(pasarla por req)
        await enlaceModel.findByIdAndRemove(req.params.url);//eliminar enlace de BD
        return next();//pasar al siguiente controlador(archivosController.eliminarArchivo)
    } else {
        enlace.descargas--;
        await enlace.save();
    }
}
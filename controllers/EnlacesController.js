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
        const {nombre_original, nombre} = req.body;

        const enlace = new enlaceModel();

        //crear objeto del enlace
        enlace.url = shortid.generate();
        enlace.nombre = nombre;
        enlace.nombre_original=nombre_original;

        //si el usuario esta autenticado
        if(req.usuario){
            const {password, descargas} = req.body;
            console.log('el password es: '+password);
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
    try {
        // verificar si existe el enlace
        const {url} = req.params;
        
        const enlace = await enlaceModel.findOne({url});
        console.log('esto contiene enlace: ');
        console.log(enlace);
        if (!enlace) {
            res.status(404).json({msg:'enlace no existe'});
            return next();
        }

        res.status(200).json({archivo:enlace.nombre, password:false});
        return next();
    } catch (error) {
        console.log('Ha ocurrido un error: '+error.message);
    }
}

exports.tienePassword = async(req, res, next) => {
    try {
        // verificar si existe el enlace
        const {url} = req.params;
        const enlace = await enlaceModel.findOne({url});
        
        if (!enlace) {
            res.status(404).json({msg:'enlace no existe'});
            return next();
        }
        
        if (enlace.password) {
           return res.status(200).json({password:true, enlace:enlace.url});
        }

        next();
    } catch (error) {
        console.log(error);
    }
}

exports.verificarPassword = async (req, res, next) => {
    try {
        const {url} = req.params;
        const {password} = req.body;

        const enlace = await enlaceModel.findOne({url});

        if (bcrypt.compareSync(password, enlace.password)) {
            return next();//ir a la siguinete funcion o middleware
        }else{
            return res.status(401).json({msg:'Password no valida'})
        }

    } catch (error) {
        console.log(error);
    }
}

exports.todosEnlaces = async (req, res, next) => {
    try {
        const enlaces = await enlaceModel.find({}).select('url -_id');
        console.log(enlaces);
        res.status(200).json({enlaces});
        //return next();
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al obtener URLs'});
        return next();
    }
}
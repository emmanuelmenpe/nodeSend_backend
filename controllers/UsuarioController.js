const usuarioModel = require('../models/Usuario');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.NuevoUsuario =  async(req, res, next) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({errores:errores.array()});
        return next();
    }

    try {
        //verificar si usuario existe
        const {email, password} = req.body;
        let usuario = await usuarioModel.findOne({email});
        if (usuario) {
            res.status(400).json({msg:'el usuario ya existe'});
            return next();
        }

        //crar usuario
        usuario = new usuarioModel(req.body);

        //hashear contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt)

        await usuario.save();

        res.status(200).json({msg:'usuario creado'});
        return next();        
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al crear usuario'});
        return next();
    }
}
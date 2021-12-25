const usuarioModel = require('../models/Usuario');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');

exports.NuevoUsuario =  async(req,res) => {
    //mostrar mensajes de error
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({errores:errores.array()});
    }

    try {
        //verificar si usuario existe
        const {email, password} = req.body;
        let usuario = await usuarioModel.findOne({email});
        if (usuario) {
            return res.status(400).json({msg:'el usuario ya existe'});
        }

        //crar usuario
        usuario = new usuarioModel(req.body);

        //hashear contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt)

        await usuario.save();

        res.status(200).json({msg:'usuario creado'})   
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al crear usuario'})
    }
}
const JWT = require('jsonwebtoken');
require('dotenv').config({path: '.env'});

module.exports = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');

        if (!authHeader) {
            res.status(401).json({msg:'token nulo'})
            return next();
        }

        //convertir el authHeader en array, separado por ' ' y toma la posicion 1
        const token = authHeader.split(' ')[1];

        //validar JWT
        const secreta = process.env.SECRETA;
        const usuario = JWT.verify(token, secreta);

        console.log(usuario);
        req.usuario = usuario;
    
        return next();
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'error al validar usuario'});
        return next();
    }
}
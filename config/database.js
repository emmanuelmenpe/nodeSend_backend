const mongosse = require('mongoose');
require('dotenv').config({path: '.env'});

const conexionDB = async () => {
    try {
        const ruta = process.env.MONGOOSE_URI;
        await mongosse.connect(ruta,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        });
        console.log(`conexión a BD: ${process.env.NOMBRE_DB} establecida.`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = conexionDB;
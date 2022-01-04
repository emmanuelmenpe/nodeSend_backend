const enlaceModel = require('../models/Enlace');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');//file System

exports.subirArchivo = async (req, res, next) => {
    const configMulter = {
        /* VIDEO 652 Y 653 DEL CURSO */
        limits : {fileSize: req.usuario? 5000000*1000 : 5000000},//limite del tamaño del archivo: 5MB
        storage: fileStorage = multer.diskStorage({//donde se almacenara
            destination:(req,file,cb) => {//cb:callback
                cb(null, __dirname+'/../uploads');//(si no hay error pasar null, recibe el directorio actual)
            },
            filename: (req, file, cb) => {
                const extencion = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)//obtener la extencion del arichivo
                cb(null,`${shortid.generate()}${extencion}`);//(si no hay error pasar null, establece el nombre.extencion)
            }
            /*
            fileFilter: (req, file, cb) => {
                if (file.mimetype === "aplication/pdf") {
                    cb(null,true);//hay un error porque no hacepta pdf
                }
            }
            */
        })
    }
    
    const upload = multer(configMulter).single('archivo');

    upload(req,res, async (error) => {
        console.log(req.file);

        if (!error) {
            res.status(200).json({archivo: req.file.filename});//indicar el nombre del archivo
            return next(); 
        }else{
            res.status(500).json({msg:'error al crear enlace'});//mandar mensaje
            return next();
        }
    });
}

exports.eliminarArchivo = async (req, res, next) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
        console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}

exports.descargar = async (req, res, next) => {
    try {
        const {archivo} = req.params;
        //console.log(archivo);
        const enlace = await enlaceModel.findOne({nombre: archivo});
        //console.log(enlace);
        const archivoDescarga = __dirname + '/../uploads/'+archivo;
        res.download(archivoDescarga);


        const {descargas, nombre} = enlace;
        if (descargas === 1) {
            req.archivo = nombre;//crear una variable interna(pasarla por req)
            await enlaceModel.findByIdAndDelete(enlace.id);//eliminar enlace de BD
            return next();//pasar al siguiente controlador(archivosController.eliminarArchivo)
        } else {
            enlace.descargas--;
            await enlace.save();
        }
    } catch (error) {
        console.log('error en controlador descargar'+error.message);
    }
}
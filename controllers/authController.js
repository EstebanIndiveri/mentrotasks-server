const Usuario=require('../models/Usuario');
const bcryptjs=require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');


exports.autenticarUsuario=async(req,res)=>{

       //reviso errores
       const errores=validationResult(req);
       if(!errores.isEmpty()){
           return res.status(400).json({errores:errores.array()})
       }
       //extraigo email y pass del req
       const {email,password}=req.body

       try {
            //reviso usuario registrado
            let usuario=await Usuario.findOne({email})

            if(!usuario){
                return res.status(400).json({msg:'El usuario no existe'});
            }
            //reviso el password
            const passCorrecto=await bcryptjs.compare(password,usuario.password);
            if(!passCorrecto){
                return res.status(400).json({msg:'password Incorrecto'})
            }

            //user y pass correcto, crear y firmar el JWT
            const payload={
                usuario:{
                    id:usuario.id
                }
            };
            //firmo el token:
            jwt.sign(payload,process.env.SECRETA,{
                expiresIn:3600//1hora
            },(error,token)=>{
                if(error) throw error;
                //messaje
                res.json({token});
            })


       } catch (error) {
           console.log(error);
       }
}
//obtiene que usuyario esta auth
exports.usuarioAutenticado=async(req,res)=>{
    try {
        const usuario =await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'hubo un error'});
    }
}
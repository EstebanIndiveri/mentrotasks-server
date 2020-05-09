
const Usuario=require('../models/Usuario');
const bcryptjs=require('bcryptjs');
const {validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');

exports.crearUsuario=async(req,res)=>{

    //reviso errores
    const errores=validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    //extraer email y pass
    const{email,password}=req.body;

    try{
        //reviso usuario registrado unico

    let usuario=await Usuario.findOne({email});
        
    if(usuario){
        return res.status(400).json({msg:'El usuario ya existe'})
    }

    
    //crea el nuevo usuario:
        usuario=new Usuario(req.body);

    //hash del password
    const salt=await bcryptjs.genSalt(10);
    //reescribe pass con el hash
    usuario.password=await bcryptjs.hash(password, salt);

    //guardar usuario
        await usuario.save();
    //crear y firmar el JWT
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

  
    }catch(error){
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}
const Proyecto=require('../models/Proyecto');
const {validationResult} =require('express-validator');
exports.crearProyecto=async(req,res)=>{

    try {

        //reviso errores
        const errores=validationResult(req);
        if(!errores.isEmpty()){
            return res.status(400).json({errores:errores.array()})
        }
        //nuevo proyecto
        const proyecto=new Proyecto(req.body);

        //guardar creador via JWT
        proyecto.creador=req.usuario.id;
        //save proyect
        proyecto.save();
        res.json(proyecto);

        
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error, intente mas tarde');
    }
}

//obtiene todos los proyectos del usuario actual:
exports.obtenerProyectos=async(req,res)=>{
    try {
         const proyectos=await Proyecto.find({creador:req.usuario.id}).sort({creado:-1})
         res.json({proyectos})
        
    } catch (error) {
        console.log(error)
        res.status(500).send('hubo un error');
    }
}

//actualiza un proyecto

exports.actualizarProyecto=async(req,res)=>{
    //si hay errores
    const errores=validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    }
    
   const {nombre}=req.body;
   const nuevoProyecto={};
   if(nombre){
       nuevoProyecto.nombre=nombre;
   }
    try {
       //revisar el id
       let proyecto=await Proyecto.findById(req.params.id);
       console.log(req.params.id);
       
       //si el proyecto existe o no

       if(!proyecto){
           return res.status(404).json({msn:'Proyecto no encontrado'})
       };

       //verificar el creador del proyecto.
       if(proyecto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg:'No autorizado'});
       }

       //actualizamos el proyecto
       proyecto=await Proyecto.findOneAndUpdate({_id:req.params.id},{$set:nuevoProyecto},{new:true});
       console.log(proyecto);
       res.json({proyecto})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}

//elimina un proyecto por id
exports.eliminarProyecto=async(req,res)=>{
    try {
          //revisar el id
       let proyecto=await Proyecto.findById(req.params.id);
       console.log(req.params.id);
       
       //si el proyecto existe o no

       if(!proyecto){
           return res.status(404).json({msn:'Proyecto no encontrado'})
       };

       //verificar el creador del proyecto.
       if(proyecto.creador.toString() !== req.usuario.id){
           return res.status(401).json({msg:'No autorizado'});
       }
       //eliminar el proyecto:
       await Proyecto.findOneAndRemove({_id:req.params.id});
       res.json({msg:'Proyecto eliminado'})
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error al eliminar el proyecto, intenta nuevamente');
    }
}
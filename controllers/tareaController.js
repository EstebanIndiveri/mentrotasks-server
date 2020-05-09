const Tarea=require('../models/Tarea');
const Proyecto =require('../models/Proyecto');
const {validationResult} =require('express-validator');

//crea una nueva tarea
exports.crearTarea=async(req,res)=>{
    //reviso errores
    const errores=validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores:errores.array()})
    };

    try {
            //extraer el proyecto y comprobar si existe
    const {proyecto}=req.body;
    console.log(proyecto);
        const existeProyecto=await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }
        
        //revisar si el proyeto actual pertenece al usuario auth:
       if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
    }
    //creamos la tarea
    const tarea= new Tarea(req.body)
    await tarea.save();
    res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}

//obtiene las tarea por proyectos
exports.obtenerTareas=async(req,res)=>{
    //extraigo el proyecto

    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto}=req.query;
        console.log(proyecto);
        const existeProyecto=await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'})
        }
        //revisar si el proyeto actual pertenece al usuario auth:
        if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
        }    
        const tareas=await Tarea.find({proyecto}).sort({creado:-1})
        res.json({tareas});
    } catch (error) {
      console.log(error);
      res.status(500).send('hubo un error');
    }
};
//actualizo tarea
exports.actualizarTarea=async(req,res)=>{
    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto,nombre,estado}=req.body;
        // si la tarea existe o no :
        let tarea=await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg:'La tarea no existe'});
        };

        const existeProyecto=await Proyecto.findById(proyecto);
        //revisar si el proyeto actual pertenece al usuario auth:
        if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
        }
        
        //creamos el objeto con la nueva información
        const nuevaTarea={};
                
        nuevaTarea.nombre=nombre;
        nuevaTarea.estado=estado;

        //guardar la tarea:
        tarea=await Tarea.findOneAndUpdate({_id:req.params.id},nuevaTarea,{new:true});

        res.json({tarea});
    } catch (error) {
        console.log(error)
        res.status(500).send('hubo un error');
    }
}
//eliminar una tarea por id:
exports.eliminarTarea=async(req,res)=>{
    try {
        //extraer el proyecto y comprobar si existe
        const {proyecto}=req.query;
        // si la tarea existe o no :
        let tarea=await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(404).json({msg:'La tarea no existe'});
        };

        const existeProyecto=await Proyecto.findById(proyecto);
        //revisar si el proyeto actual pertenece al usuario auth:
        if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No autorizado'});
        }
        
        //eliminar la tarea
        await Tarea.findOneAndRemove({_id:req.params.id});
        res.json({msg:'Tarea eliminada'});
     
    } catch (error) {
        console.log(error)
        res.status(500).send('hubo un error');
    }
}

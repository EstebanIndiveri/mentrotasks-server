const mongoose=require('mongoose');

const ProyectoSchema =mongoose.Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Usuario'//del usuario
    },
    creado:{
        type:Date,
        default:Date.now()//para ordenar nuevo arriba
    }
});

module.exports=mongoose.model('Proyecto',ProyectoSchema)
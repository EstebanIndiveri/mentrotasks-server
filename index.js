const express=require('express');
const conectarDB=require('./config/db');
const cors = require('cors');
//creamos el server

const app=express();

//conectamos a la base de datos
conectarDB();

//habilitar cors
app.use(cors());

//habilitar express.json
app.use(express.json({extended:true}));

//puerto de app y heroku
const PORT = process.env.PORT || 4000; 

//importamos las rutas
app.use('/api/usuarios',require('./routes/usuarios'));

app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));

//routing de tareas
app.use('/api/tareas',require('./routes/tareas'));


app.listen(PORT,()=>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});

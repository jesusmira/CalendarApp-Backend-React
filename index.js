const express = require('express');
require('dotenv').config();
const { dbConection } = require('./database/config');
const cors = require('cors');


// Crear el servidor de express
const app = express();

// Base de Datos
dbConection();

//CORS
app.use(cors());

// Directorio Público
app.use( express.static('public'));

// Lectura y parseo del body
app.use( express.json());


//Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );

app.get('*', ( req, res ) => {
    res.sendFile( __dirname + '/public/index.html');
});




// Escuchar peticiones
app.listen( process.env.PORT, () =>{
    console.log(`Servidor corriendo por el puerto ${ process.env.PORT }`);
});
import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoute from './routes/usuario.router.js';
import propiedadesRoute from './routes/propiedades.router.js';
import db from './config/db.js'

const app = express();

//Conexion base de datos

try {
    await db.authenticate();
    db.sync();
    console.log('Base de datos conectada');

} catch (error) {
    console.log(error);
}





//Habilitar pug
app.set('view engine', 'pug');
app.set('views', './views');

//Carpeta publica
app.use(express.static('public'));

//Habilita lectura de datos de form

app.use(express.urlencoded({ extended: true }));

//Hablilitar Cookie parser
app.use(cookieParser())

//Habilitar CSURF
app.use(csrf({ cookie: true }))


//Routing
app.use('/auth', usuarioRoute)
app.use('/', propiedadesRoute)




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`El servidor esta funcionando en el puerto ${PORT}`);

})
import express from "express";
import { body } from 'express-validator'
import { admin, agregarImagen, almacenarImagen, crear, editar, eliminar, cambiarEstado, guardar, guardarCambios, mostrarPropiedad, enviarMensaje, verMensajes } from '../controllers/propiedad.controller.js'
import protegerRuta from "../middleware/potegerRuta.js";
import upload from "../middleware/subirImagen.js";
import identificarUsuario from "../middleware/identificarUsuario.js";

const router = express.Router()



//Routes
router.get('/mis-propiedades', protegerRuta, admin);
router.get('/propiedades/crear', protegerRuta, crear);
router.post('/propiedades/crear',
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'), 
    protegerRuta,
    guardar);

router.get('/propiedades/agregar-imagen/:id',protegerRuta , agregarImagen)

router.post('/propiedades/agregar-imagen/:id',protegerRuta , upload.single('imagen'), almacenarImagen)

router.get('/propiedades/editar/:id', protegerRuta, editar)

router.post('/propiedades/editar/:id',
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion no puede ir vacia').isLength({ max: 200 }).withMessage('La descripcion es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamiento'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'), 
    protegerRuta,
    guardarCambios
    );

router.post('/propiedades/eliminar/:id', protegerRuta, eliminar)

router.put('/propiedades/:id', protegerRuta, cambiarEstado)

//Area puublica

router.get('/propiedad/:id', identificarUsuario, mostrarPropiedad)

router.post('/propiedad/:id', identificarUsuario, body('mensaje').isLength({min:20}).withMessage('El mensaje no puede ir vacio o es muy corto'), enviarMensaje )


router.get('/mensajes/:id', protegerRuta, verMensajes )




export default router
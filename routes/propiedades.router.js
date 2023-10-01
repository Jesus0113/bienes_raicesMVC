import express  from "express";
import { admin, crear } from '../controllers/propiedad.controller.js'

const router = express.Router()



//Routes
router.get('/mis-propiedades', admin );
router.get('/propiedades/crear', crear);
router.delete('/propiedades/:id',  )



export default router
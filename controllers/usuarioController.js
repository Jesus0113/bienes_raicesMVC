import { check, validationResult } from 'express-validator'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion'
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
        csrfToken: req.csrfToken()

    })
}

const registrar = async (req, res) => {

    //validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req);
    await check('email').notEmpty().isEmail().withMessage('El formato email es obligatorio').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El minimo del password son 6 caracteres').run(req);
    // await check('repetir_password').equals('password').withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }

        })

    }

    const { nombre, email, password } = req.body;
    //Verifica si el usuario esta duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Usuario ya esta registrado' }],
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }

    //Almacenar usuario

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envio de email de confirmacion

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //MOstrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: "Cuenta creada correctamente",
        mensaje: 'Hemos enviado un Email de confirmacion, presiona confirmar en el enlace'
    })
}

//Funcion que comprueba una cuenta

const confirmar = async (req, res) => {

    const { token } = req.params;

    //Verificar si el token es valido

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true
        })

    }

    //Confirmar cuenta

    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })


}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar tu acceso a Bienes Raices',
        csrfToken: req.csrfToken()

    })
}

const resetPassword = async (req, res) => {

    //validacion
    await check('email').notEmpty().isEmail().withMessage('El formato email es obligatorio').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/olvide-password', {
            pagina: 'Recuperar tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })

    }

    const { nombre, email, password } = req.body;
    //Verifica si el usuario esta duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Usuario ya esta registrado' }],
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }

    //Almacenar usuario

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envio de email de confirmacion

    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //MOstrar mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: "Cuenta creada correctamente",
        mensaje: 'Hemos enviado un Email de confirmacion, presiona confirmar en el enlace'
    })

}

export {
    formularioLogin,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword

}
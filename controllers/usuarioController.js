import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesion',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
    //Validacion 
    await check('email').notEmpty().isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        //Errores

        return res.render('auth/login', {
            pagina: 'Iniciar session',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })

    }


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

    //Buscar usuario

    const { email } = req.body;
    //Verifica si el usuario esta duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } });

    if (!existeUsuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso de Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El Email no pertenece a ningun usuario' }]
        })
    }

    //Generar token y enviar email
    existeUsuario.token = generarId();
    await existeUsuario.save();

    //Envio de email de confirmacion

    emailOlvidePassword({
        email: existeUsuario.email,
        nombre: existeUsuario.nombre,
        token: existeUsuario.token
    })

    // renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un Email con las instrucciones'
    })

}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } });

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true
        })
    }

    // mostrar formulario para agg password

    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()
    })

}

const nuevoPassword = async (req, res) => {

    //Validar password

    await check('password').isLength({ min: 6 }).withMessage('El minimo del password son 6 caracteres').run(req);

    let resultado = validationResult(req);

    //Verificar que el resultado este vacio
    if (!resultado.isEmpty()) {
        //Errores
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
        })
    }

    const { token } = req.params
    const { password } = req.body;

    //Identificar quien hace cambio

    const usuario = await Usuario.findOne({ where: { token } });

    //hashear nuevo password

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Password reestablecido',
        mensaje: 'El password se guardo correctamente'
    })

}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword

}
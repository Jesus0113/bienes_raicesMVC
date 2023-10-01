import nodemailer from 'nodemailer'


const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const {email, nombre, token} = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu Cuenta en BienesRaices.com',
        text: 'Confirma tu Cuenta en BienesRaices.com',
        html: `

        <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

        <p>Tu cuenta esta lista, solo debes confirmarla en el siguiente enlace:
        <a href="${BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const {email, nombre, token} = datos;

    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Reestablece tu passworden BienesRaices.com',
        text: 'Reestablece tu passworden BienesRaices.com',
        html: `

        <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesRaices</p>

        <p>Sigue el siguiente enlace para generar un password nuevo:
        <a href="${BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Reestablecer password</a></p>

        <p>Si tu no solicitaste el cambio de password, ignora este mensaje</p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}
import bcrypt from 'bcrypt'
const usuarios = [
    {
        nombre: 'Jesus',
        email: 'jesus@email.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple'

import { userModel } from "../models/userModel.js"

async function getAll(req, res) {
    try {   
        const users = await userModel.getAll()
        return res.status(200).send(users)
    } catch {
        return res.status(500).send({message: 'Erro ao ler tabela'})
    }
}

async function signup(req, res) {
    const { email, password, fullName, socialId, confirmPassword } = req.body

    if(!email) return res.status(400).send({message: 'Informe email'})
    if(!fullName) return res.status(400).send({message: 'Informe fullName'})
    if(!socialId) return res.status(400).send({message: 'Informe socialId'})
    if(!password) return res.status(400).send({message: 'Informe password'})
    if(!confirmPassword) return res.status(400).send({message: 'Informe confirmPassword'})

    const userExists = await userModel.getByEmail(email)
    if(userExists) {
        return res.status(409).send({message: 'Usuário já existe'})
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const createdUser = {
        email: email,
        full_name: fullName,
        social_id: socialId,
        password: hashedPassword,
    }

    try {
        await userModel.create(createdUser)
        console.log('Usuário criado com sucesso')
        res.status(201).send(createdUser)
    } catch(error) {
        return res.status(500).send(error)
    }

}

async function signin(req, res) {
    const { email, password } = req.body

    if(!email) return res.status(400).send({message: 'Informe email'})
    if(!password) return res.status(400).send({message: 'Informe password'})

    try {
        const user = await userModel.getByEmail(email)

        if(!user) return res.status(401).send({message: 'Invalid credentials'})

        const validPassword = bcrypt.compareSync(password, user.password)
        if(!validPassword) return res.status(401).send({message: 'Invalid credentials'})

        const now = Math.floor(Date.now() / 1000) // Data em segundos
        const payload = {
            ...user,
            iat: now,
            exp: now + (60 * 60 * 24 ) // Token com expiração em 1 dia
        }
    
        res.json({
            ...payload,
            token: jwt.encode(payload, process.env.AUTH_SECRET)
        })
    } catch(error) {
        console.log(error)
        return res.status(500).send({message: 'Erro autenticando usuário', error})
    }
}

export const User = {
    getAll,
    signup,
    signin,
}
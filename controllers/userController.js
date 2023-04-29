import { supabase } from '../config/db.js'

async function getAll(req, res) {
    const { data: users, error } = await supabase.from('users').select("*")
    if(error) throw error
    
    res.status(200).send(users)
} 

async function signup(req, res) {
    if(!req.body.email) return res.status(400).send({message: 'Informe email'})
    if(!req.body.fullName) return res.status(400).send({message: 'Informe fullName'})
    if(!req.body.socialId) return res.status(400).send({message: 'Informe socialId'})
    if(!req.body.password) return res.status(400).send({message: 'Informe password'})
    if(!req.body.confirmPassword) return res.status(400).send({message: 'Informe confirmPassword'})

    const createdUser = {
        email: req.body.email,
        full_name: req.body.fullName,
        social_id: req.body.socialId,
        password: req.body.password,
    }
    try {
        const { data, error } = await supabase.from('users').insert([createdUser])
        if(error) throw error
        console.log('Usuário criado com sucesso')
        res.status(201).send(createdUser)
    } catch(error) {
        return res.status(500).send(error)
    }

}

export const User = {
    getAll,
    signup,
}
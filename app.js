import express from 'express'
import cors from 'cors'

import { User } from './controllers/userController.js'
import { Auth } from './controllers/authController.js'

const port = 4000

const app = express()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.status(200).send("OK")
})
app.get("/users", (req, res) => {
    User.getAll(req, res)
})
app.post("/signup", (req, res) => {
    User.signup(req, res)
})
app.post("/signin", (req, res) => {
    User.signin(req, res)
})

app.post("/validateToken", (req, res) => {
    Auth.testToken(req, res)
})

app.listen(port, () => {
    console.log(`Servidor executando na porta ${4000}...`)
})
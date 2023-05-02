import jwt from 'jwt-simple'
import passport from 'passport'
import { Strategy, ExtractJwt} from 'passport-jwt'
import dotenv from 'dotenv'

import { supabase } from '../config/db.js'

dotenv.config()

function authenticate() {
    const params = {
        secretOrKey: process.env.AUTH_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }
    
    const strategy = new Strategy(params, async (payload, done) => {
        try {
            const user = await supabase.from('users')
                .select()
                .eq('email', payload.email)
            done(null, user ? {...payload} : false)
        } catch(error) {
            done(error, false)
        }
    })
    
    passport.use(strategy)
    return passport.authenticate('jwt', { session: false })

}

async function validateToken(middleware, req, res) {
    try {
        if(req.user) {
            if(new Date(req.user.exp * 1000) > new Date()) {
                if(req.params.login) return req.user.login == req.params.login ? middleware(req, res) : res.status(401).send('UNAUTHORIZED')
                return middleware(req, res)
            } 
        }
    } catch(e) {
        // Problema com token
    }

    res.status(401).send('Unauthorized')
}


async function testToken(req, res) {
    const userData = req.body || null
    try {
        if(userData) {
            const token = jwt.decode(userData.token, process.env.AUTH_SECRET)
            if(new Date(token.exp * 1000) > new Date()) {
                return res.send(true)
            }
        }
    } catch(e) {
        // Problema com token
    }

    res.send(false)
}

export const Auth = {
    authenticate,
    validateToken,
    testToken,
}

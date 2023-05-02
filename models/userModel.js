import { supabase } from "../config/db.js";

export const userModel = {
    create: async function (createdUser) {
        const { data, error } = await supabase
            .from('users')
            .insert([createdUser])
        if(error) throw error
    },

    getAll: async function() {
        const { data: users, error } = await supabase
            .from('users')
            .select("*")
        if(error) throw error
        return users
    },

    getById: async function(userId) {
        const { data: user, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId)
        if(error) throw error
        return user
    },

    getByEmail: async function(email) {
        const { data: user, error } = await supabase
            .from('users')
            .select()
            .eq('email', email)

        if(error) throw error
        return user[0]
    },

    // update: async function() {
    //     supabase.from('users').update()
    // }

    delete: async function(userId) {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)
    }
}
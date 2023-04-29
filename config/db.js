import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
)

// async function testConnection() {
//     try {
//         const { data, error } = await supabase.from('users').insert([{
//             full_name: 'joao',
//         }])
//         if (error) {
//             throw error;
//         }
//         console.log('Conexão com o Supabase bem-sucedida!');
//         console.log(data);
//     } catch (error) {
//         console.error('Erro ao conectar ao Supabase:', error.message);
//     }
// }

// testConnection();


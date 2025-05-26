import { supabase } from "../../db.js"

const userModel = {
    async login(data) {
        const {email, password} = data

        try {
            const {data: userData, error} = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if(error) {
                throw new Error(error.message)
            }

            return {session: userData.session, user: userData.user}
        } catch (error) {
            console.error(`Erro no login do modelo: ${error.message}`)
            throw error
        }
    }
}

export default userModel
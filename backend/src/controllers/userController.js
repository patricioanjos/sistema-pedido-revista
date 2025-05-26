import userModel from "../models/userModel.js";

const userController = {
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
            }

            const {session, user} = await userModel.login({ email, password })
            res.status(200).json({ message: 'Login realizado com sucesso!', session, user });
        } catch (error) {
            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ message: 'Email ou senha inválidos.' });
            }
            console.error('Erro no controlador de login:', error);
            res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
        }
    }
}

export default userController
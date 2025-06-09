import { settingsModel } from "../models/settingsModel.js";

const settingsController = {
    async getStatus(req, res) {
        try {
            const isEnabled = await settingsModel.getOrderingStatus();
            res.json({ isEnabled });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar status' });
        }
    },

    async updateStatus(req, res) {
        try {
            const { enabled } = req.body
            const supabaseClient = req.supabaseClient

            const updatedSettings = await settingsModel.updateOrderingStatus(enabled, supabaseClient);

            if (updatedSettings?.length > 0) {
                res.status(200).json({ message: 'Status atualizado com sucesso!', data: updatedSettings[0] });
            } else {
                res.status(404).json({ message: 'Status não atualizado, registro não encontrado ou sem permissão.' });
            }
        } catch (error) {
            console.error('Erro no Controller ao atualizar status:', error);
            let statusCode = 500;
            let errorMessage = 'Erro ao atualizar status';

            if (error.message.includes('Permissão negada')) {
                statusCode = 403; // Forbidden
                errorMessage = error.message;
            } else if (error.message.includes('Token de autenticação inválido')) {
                statusCode = 401; // Unauthorized
                errorMessage = error.message;
            }

            res.status(statusCode).json({ message: errorMessage, details: error.message });
        }
    }
}

export default settingsController
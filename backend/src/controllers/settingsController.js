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
            const {enabled} = req.body
            const updatedSettings = await settingsModel.updateOrderingStatus(enabled);

            if (updatedSettings?.length > 0) {
                 res.status(200).json({ message: 'Status atualizado com sucesso!', data: updatedSettings[0] });
            } else {
                 res.status(404).json({ message: 'Status não atualizado, registro não encontrado ou sem permissão.' });
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            res.status(500).json({ error: 'Erro ao atualizar status' });
        }
    }
}

export default settingsController
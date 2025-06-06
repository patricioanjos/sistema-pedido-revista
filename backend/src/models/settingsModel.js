import sql, { supabase } from '../../db.js';

export const settingsModel = {
    async getOrderingStatus() {
        const result = await sql`
        SELECT is_ordering_enabled FROM settings WHERE id = 1;
        `;

        return result[0]?.is_ordering_enabled ?? true
    },

    async updateOrderingStatus(enabled) {
        const {data, error} = await supabase
            .from('settings')
            .update({ is_ordering_enabled: enabled })
            .eq('id', 1)
            .select()
        
        if (error) {
            console.error('Erro Supabase ao atualizar status de pedidos no Model:', error);
            throw new Error(`Falha no banco de dados ao atualizar status: ${error.message}`);
        }

        console.log(error)

        return data
    }
}
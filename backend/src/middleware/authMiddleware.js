// import { supabase } from "../../db.js";
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from "@supabase/supabase-js";


export const verifyAutheticationToken = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Formato: "Bearer TOKEN"

      // instância do cliente Supabase ESPECÍFICA para esta requisição
      const supabaseClientForRequest = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
          auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
          }
      });

      // O método abaixo (`getUser(token)`) é usado para obter o usuário associado a um JWT.
      // Se o token for inválido ou expirado, ele retornará erro ou null.
      const { data: { user }, error } = await supabaseClientForRequest.auth.getUser(token)

      if (error || !user) {
        console.error('Erro de autenticação (JWT inválido ou expirado):', error?.message || 'Usuário não encontrado.')
        return res.status(401).json({ message: 'Não autorizado, token inválido ou expirado.' })
      }

      req.user = user // Anexe o usuário ao objeto de requisição
      req.supabaseClient = supabaseClientForRequest
      next();
    } catch (error) {
      console.error('Erro no middleware de autenticação:', error.message)
      return res.status(401).json({ message: 'Não autorizado, falha na autenticação do token.' })
    }
  } else {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' })
  }
}
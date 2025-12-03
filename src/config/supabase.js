import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
// Reemplaza estos valores con tus credenciales de Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const TABLE_NAME = 'early_birds'

const isSupabaseConfigured =
  typeof SUPABASE_URL === 'string' &&
  SUPABASE_URL.startsWith('http') &&
  typeof SUPABASE_ANON_KEY === 'string' &&
  SUPABASE_ANON_KEY.length > 0

let supabase = null

export const initSupabase = () => {
  if (!isSupabaseConfigured) {
    if (import.meta.env.DEV) {
      console.warn(
        'Supabase no está configurado. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env.'
      )
    }
    return null
  }

  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }

  return supabase
}

export const getSupabase = () => {
  if (!supabase) {
    initSupabase()
  }
  return supabase
}

export const submitEarlyBird = async (email) => {
  const client = getSupabase()

  if (!client) {
    return {
      success: false,
      message: 'Supabase no está configurado. Agrega tus credenciales en el archivo .env para habilitar el formulario.'
    }
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .insert([
      {
        email: email,
        created_at: new Date().toISOString(),
        source: 'landing_page'
      }
    ])
    .select()

  if (error) {
    if (error.code === '23505') {
      return { success: true, message: '¡Ya estás registrado! Te notificaremos cuando estemos listos.' }
    }
    throw error
  }

  return { success: true, data, message: '¡Gracias! Te notificaremos cuando estemos listos.' }
}

export { TABLE_NAME, isSupabaseConfigured }


/**
 * SUPABASE CLIENT
 *
 * Initialise le client Supabase uniquement quand les variables d'env sont présentes.
 * Si VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY sont absents, retourne null
 * et l'app continue avec localStorage.
 *
 * Pour activer :
 *   1. npm install @supabase/supabase-js
 *   2. Copier .env.example → .env.local et remplir les variables
 *   3. Définir VITE_USE_SUPABASE=true dans .env.local
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase = null;

export async function getSupabaseClient() {
  if (_supabase) return _supabase;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquantes — utilisation de localStorage.');
    return null;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
    return _supabase;
  } catch {
    console.warn('[Supabase] @supabase/supabase-js non installé — utilisation de localStorage.');
    return null;
  }
}

/** Accès synchrone (null si pas encore initialisé) */
export function supabase() {
  return _supabase;
}

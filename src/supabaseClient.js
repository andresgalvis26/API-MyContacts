import { createClient } from '@supabase/supabase-js';

// Variables desde tu panel de Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// Crear client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
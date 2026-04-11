import { supabase } from '@/lib/supabaseClient';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ── Upload fichier vers Supabase Storage ──────────────────────
export async function uploadFichier(bucket, fichier, chemin) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(chemin, fichier, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(chemin);
  return urlData.publicUrl;
}

// ── Talents ───────────────────────────────────────────────────
export async function getAll() {
  const { data, error } = await supabase.from('talents').select('*');
  if (error) throw error;
  return data;
}

export async function getTalent(id) {
  const { data, error } = await supabase
    .from('talents')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateTalent(id, updates) {
  const { data, error } = await supabase
    .from('talents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
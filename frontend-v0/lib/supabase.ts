import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isPlaceholder = supabaseUrl === 'your_supabase_url' || !supabaseUrl;

if (isPlaceholder) {
  console.warn('Supabase credentials missing or placeholders used. Image uploads will not work.');
}

// Initialize client only if credentials look valid to prevent crash
export const supabase = !isPlaceholder 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any);

export const uploadImage = async (file: File, bucket: string, path: string) => {
  if (!supabase) {
    throw new Error('Supabase not configured. Please add valid credentials to .env.local');
  }
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

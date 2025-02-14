
import { supabase } from "@/integrations/supabase/client";

export const queryKeys = {
  analysisFile: 'analysisFile'
} as const;

export type AnalysisData = {
  fileName: string;
  status: 'pending' | 'complete' | 'error';
};

export const fetchLatestAnalysis = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('load_profile_analyses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  return {
    fileName: data.file_path,
    status: data.status,
  } as AnalysisData;
};

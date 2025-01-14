import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { analysisId } = await req.json()
    console.log(`Processing analysis ${analysisId}`)

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the analysis record
    const { data: analysis, error: analysisError } = await supabase
      .from('load_profile_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (analysisError || !analysis) {
      console.error('Error fetching analysis:', analysisError)
      throw new Error('Analysis not found')
    }

    // Download the CSV file
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('load_profiles')
      .download(analysis.file_path)

    if (downloadError) {
      console.error('Error downloading file:', downloadError)
      throw new Error('Failed to download file')
    }

    // Parse CSV data
    const text = await fileData.text()
    const values = text.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '')
      .map(Number)

    // Perform calculations
    const results = {
      mean: values.reduce((sum, val) => sum + val, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      total: values.reduce((sum, val) => sum + val, 0),
      hourlyData: values,
    }

    // Update analysis with results
    const { error: updateError } = await supabase
      .from('load_profile_analyses')
      .update({
        status: 'completed',
        results,
        updated_at: new Date().toISOString()
      })
      .eq('id', analysisId)

    if (updateError) {
      console.error('Error updating analysis:', updateError)
      throw new Error('Failed to update analysis results')
    }

    return new Response(
      JSON.stringify({ message: 'Analysis completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jhnqdukpwmcvkcwvejfg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobnFkdWtwd21jdmtjd3ZlamZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTM5NjEsImV4cCI6MjA1MTgyOTk2MX0.drznplIm46Cwb7yCbtBCRaYFCmqgbOb2IYi47-DW0iQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
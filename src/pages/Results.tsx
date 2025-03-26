
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";
import ResultsTabs from "@/components/results/ResultsTabs";
import ResultsLoading from "@/components/results/ResultsLoading";
import ResultsError from "@/components/results/ResultsError";
import AnalysisOverview from "@/components/results/AnalysisOverview";
import ExportButton from "@/components/results/ExportButton";

const Results = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check for analysis file
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      toast.error("No analysis found. Please start a new analysis.");
      navigate('/');
    }
  }, [navigate]);
  
  const handleBack = () => {
    localStorage.removeItem('analysisFileName');
    localStorage.removeItem('electricityPrice');
    localStorage.removeItem('gridPowerCharges');
    localStorage.removeItem('pvPeak');
    localStorage.removeItem('loadsKwIsNet');
    navigate('/');
  };
  
  const {
    data: analysis,
    isLoading,
    error
  } = useQuery({
    queryKey: ['analysis'],
    queryFn: async () => {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const {
        data,
        error
      } = await supabase.from('load_profile_analyses').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      }).limit(1).single();
      if (error) throw error;
      return data;
    }
  });
  
  if (isLoading) {
    return <ResultsLoading />;
  }
  
  if (error) {
    return <ResultsError />;
  }
  
  return (
    <div className="pt-10 px-4 sm:px-6 lg:px-8 bg-[#F1F1F1] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div id="results-content" className="space-y-6">
          <AnalysisOverview />
          <ResultsTabs />
        </div>

        <ExportButton />
      </div>
    </div>
  );
};

export default Results;

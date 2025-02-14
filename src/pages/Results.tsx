
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadProfileChart from "@/components/results/LoadProfileChart"
import PVProductionChart from "@/components/results/PVProductionChart"
import BatteryDesignCard from "@/components/results/BatteryDesignCard"
import ComparisonCard from "@/components/results/ComparisonCard"
import CostsCard from "@/components/results/CostsCard"
import ESGReportingCard from "@/components/results/ESGReportingCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { toast } from "sonner"
import html2pdf from 'html2pdf.js'
import { useEffect } from "react"

const Results = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      toast.error("No analysis found. Please start a new analysis.");
      navigate('/');
    }
  }, [navigate]);

  const { data: analysis, isLoading, error } = useQuery({
    queryKey: ['analysis'],
    queryFn: async () => {
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
      return data;
    },
  });

  const handleExport = async () => {
    try {
      console.log("Starting PDF export...");
      const element = document.getElementById('results-content');
      if (!element) {
        console.error("Results content element not found");
        toast.error("Could not generate PDF");
        return;
      }

      const opt = {
        margin: 10,
        filename: 'analysis-results.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      toast.promise(
        html2pdf().set(opt).from(element).save(),
        {
          loading: 'Generating PDF...',
          success: 'PDF downloaded successfully',
          error: 'Failed to generate PDF'
        }
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading analysis results...</div>
    </div>;
  }

  if (error) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Error loading analysis results</div>
    </div>;
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mb-4 text-white hover:text-white/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Analysis Results</h1>
        </div>

        <div id="results-content" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-2">
              <Card className="p-6 bg-white/95 backdrop-blur-sm">
                <h2 className="text-2xl font-semibold mb-4">Load Profile Analysis</h2>
                <div className="space-y-4">
                  <LoadProfileChart />
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">PV Design</h2>
              <div className="space-y-4">
                <PVProductionChart />
              </div>
            </Card>

            <BatteryDesignCard />
            <ComparisonCard />
            <CostsCard />
            <ESGReportingCard />
          </div>
        </div>

        <div className="flex justify-center mt-8 pb-32">
          <Button 
            variant="secondary"
            size="lg"
            onClick={handleExport}
            className="w-48"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;

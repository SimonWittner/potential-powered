
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ComparisonCard = () => {
  const [comparisonLoadPlot, setComparisonLoadPlot] = useState<string | null>(null);
  const [newPeakLoadPlot, setNewPeakLoadPlot] = useState<string | null>(null);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    const checkAndFetchPlots = async () => {
      try {
        // Check if peak load plot exists
        const peakLoadName = `peak_load_${fileId}.png`;
        const { data: peakLoadExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: peakLoadName
          });

        if (peakLoadExists && peakLoadExists.length > 0) {
          const { data: peakLoadUrl } = supabase
            .storage
            .from('analysis_results')
            .getPublicUrl(peakLoadName);
          
          if (peakLoadUrl) {
            console.log("Successfully fetched peak load plot");
            setNewPeakLoadPlot(peakLoadUrl.publicUrl);
          }
        }

        // Check if comparison load plot exists
        const comparisonName = `comparison_load_${fileId}.png`;
        const { data: comparisonExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: comparisonName
          });

        if (comparisonExists && comparisonExists.length > 0) {
          const { data: comparisonUrl } = supabase
            .storage
            .from('analysis_results')
            .getPublicUrl(comparisonName);
          
          if (comparisonUrl) {
            console.log("Successfully fetched comparison load plot");
            setComparisonLoadPlot(comparisonUrl.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error fetching plots:", error);
      }
    };

    // Initial check
    checkAndFetchPlots();

    // Set up polling interval to check for new files
    const interval = setInterval(checkAndFetchPlots, 5000); // Check every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-6">
        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
          {comparisonLoadPlot ? (
            <img 
              src={comparisonLoadPlot} 
              alt="Load Profile Comparison" 
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading comparison plot...</p>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">New Peak Load</h3>
          {newPeakLoadPlot ? (
            <img 
              src={newPeakLoadPlot} 
              alt="New Peak Load" 
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading peak load plot...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;


import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SelfConsumptionComparisonCard = () => {
  const [evocomparisonLoadPlot, setEvoComparisonLoadPlot] = useState<string | null>(null);  
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    const checkAndFetchPlot = async () => {
      try {
        // Check if evocomparison plot exists
        const evocomparisonName = `evo_profile_${fileId}.png`;
        const { data: evocomparisonExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: evocomparisonName
          });

        if (evocomparisonExists && evocomparisonExists.length > 0) {
          const { data: evocomparisonData } = await supabase
            .storage
            .from('analysis_results')
            .download(evocomparisonName);
          
          if (evocomparisonData) {
            const url = URL.createObjectURL(evocomparisonData);
            console.log("Successfully fetched and created URL for peak load plot:", url);
            setEvoComparisonLoadPlot(url);
          }
        }


        // Check if heatmap exists
        const heatmapName = `evo_heatmap_${fileId}.png`;
        const { data: heatmapExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: heatmapName
          });

        if (heatmapExists && heatmapExists.length > 0) {
          const { data: heatmapData } = await supabase
            .storage
            .from('analysis_results')
            .download(heatmapName);
          
          if (heatmapData) {
            const url = URL.createObjectURL(heatmapData);
            console.log("Successfully fetched and created URL for heatmap:", url);
            setHeatmapImage(url);
            setIsLoading(false);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching heatmap:", error);
        return false;
      }
    };

    // Initial check
    checkAndFetchPlot();

    // Set up polling interval to check for new files
    const interval = setInterval(checkAndFetchPlot, 5000); // Check every 5 seconds

    // Cleanup interval and object URL on component unmount
    return () => {
      clearInterval(interval);
      if (evocomparisonLoadPlot) URL.revokeObjectURL(evocomparisonLoadPlot);
      if (heatmapImage) URL.revokeObjectURL(heatmapImage);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>

      {/* Load Profile Comparison */}
      <div className="w-full overflow-hidden bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
        {evocomparisonLoadPlot ? (
          <div className="w-full h-[500px]">
            <img 
              src={evocomparisonLoadPlot} 
              alt="Load Profile Comparison" 
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center">
            <p className="text-gray-500">Loading comparison plot...</p>
          </div>
        )}
      </div>

      {/* Investment Costs */}
      <div className="w-full overflow-hidden bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Investment Costs</h3>
        {isLoading ? (
          <div className="w-full h-[500px] flex items-center justify-center">
            <p className="text-gray-500">Loading investment costs heatmap plot...</p>
          </div>
        ) : (
          <div className="w-full h-[500px]">
            {heatmapImage ? (
              <img 
                src={heatmapImage} 
                alt="Self-Consumption Heatmap" 
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">
                No heatmap available
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SelfConsumptionComparisonCard;


import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PeakShavingComparisonCard = () => {
  const [evocomparisonLoadPlot, setEvoComparisonLoadPlot] = useState<string | null>(null);  
  const [yearlyPeakLoadsPlot, setYearlyPeakLoadsPlot] = useState<string | null>(null);
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
        const evocomparisonName = `ps_profile_${fileId}.png`;
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
            console.log("Successfully fetched and created URL for peak shaving load plot:", url);
            setEvoComparisonLoadPlot(url);
          }
        }

        // Check if yearly peak loads plot exists
        const yearlyPeakLoadsName = `ps_yearly_peak_load_${fileId}.png`;
        const { data: yearlyPeakLoadsExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: yearlyPeakLoadsName
          });

        if (yearlyPeakLoadsExists && yearlyPeakLoadsExists.length > 0) {
          const { data: yearlyPeakLoadsData } = await supabase
            .storage
            .from('analysis_results')
            .download(yearlyPeakLoadsName);
          
          if (yearlyPeakLoadsData) {
            const url = URL.createObjectURL(yearlyPeakLoadsData);
            console.log("Successfully fetched and created URL for yearly peak loads plot:", url);
            setYearlyPeakLoadsPlot(url);
            setIsLoading(false);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching peak shaving plots:", error);
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
      if (yearlyPeakLoadsPlot) URL.revokeObjectURL(yearlyPeakLoadsPlot);
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

      {/* Yearly Peak Loads */}
      <div className="w-full overflow-hidden bg-white rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Yearly Peak Loads</h3>
        {isLoading ? (
          <div className="w-full h-[500px] flex items-center justify-center">
            <p className="text-gray-500">Loading yearly peak loads plot...</p>
          </div>
        ) : (
          <div className="w-full h-[500px]">
            {yearlyPeakLoadsPlot ? (
              <img 
                src={yearlyPeakLoadsPlot} 
                alt="Yearly Peak Loads" 
                className="w-full h-full object-contain"
              />
            ) : (
              <p className="text-gray-500 flex items-center justify-center h-full">
                No yearly peak loads plot available
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PeakShavingComparisonCard;

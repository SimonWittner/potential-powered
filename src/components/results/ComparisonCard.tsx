
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ComparisonCard = () => {
  const [comparisonLoadPlot, setComparisonLoadPlot] = useState<string | null>(null);
  const [newPeakLoadPlot, setNewPeakLoadPlot] = useState<string | null>(null);
  const [yearlyPeakLoadPlot, setYearlyPeakLoadPlot] = useState<string | null>(null);

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
        const peakLoadName = `new_peak_load_${fileId}.png`;
        const { data: peakLoadExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: peakLoadName
          });

        if (peakLoadExists && peakLoadExists.length > 0) {
          const { data: peakLoadData } = await supabase
            .storage
            .from('analysis_results')
            .download(peakLoadName);
          
          if (peakLoadData) {
            const url = URL.createObjectURL(peakLoadData);
            console.log("Successfully fetched and created URL for peak load plot:", url);
            setNewPeakLoadPlot(url);
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
          const { data: comparisonData } = await supabase
            .storage
            .from('analysis_results')
            .download(comparisonName);
          
          if (comparisonData) {
            const url = URL.createObjectURL(comparisonData);
            console.log("Successfully fetched and created URL for comparison load plot:", url);
            setComparisonLoadPlot(url);
          }
        }

        // Check if yearly peak load plot exists
        const yearlyPeakName = `yearly_peak_load_${fileId}.png`;
        const { data: yearlyPeakExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: yearlyPeakName
          });

        if (yearlyPeakExists && yearlyPeakExists.length > 0) {
          const { data: yearlyPeakData } = await supabase
            .storage
            .from('analysis_results')
            .download(yearlyPeakName);
          
          if (yearlyPeakData) {
            const url = URL.createObjectURL(yearlyPeakData);
            console.log("Successfully fetched and created URL for yearly peak load plot:", url);
            setYearlyPeakLoadPlot(url);
          }
        }
      } catch (error) {
        console.error("Error fetching plots:", error);
      }
    };

    // Initial check
    checkAndFetchPlots();

    // Set up polling interval to check for new files
    const interval = setInterval(checkAndFetchPlots, 1000); // Check every 5 seconds

    // Cleanup interval and object URLs on component unmount
    return () => {
      clearInterval(interval);
      if (comparisonLoadPlot) URL.revokeObjectURL(comparisonLoadPlot);
      if (newPeakLoadPlot) URL.revokeObjectURL(newPeakLoadPlot);
      if (yearlyPeakLoadPlot) URL.revokeObjectURL(yearlyPeakLoadPlot);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-6">
        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
          {comparisonLoadPlot ? (
            <div className="w-full h-[500px]">
              <img 
                src={comparisonLoadPlot} 
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

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">New Peak Load</h3>
          {newPeakLoadPlot ? (
            <div className="w-full h-[500px]">
              <img 
                src={newPeakLoadPlot} 
                alt="New Peak Load" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center">
              <p className="text-gray-500">Loading peak load plot...</p>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Yearly Peak Loads</h3>
          {yearlyPeakLoadPlot ? (
            <div className="w-full h-[500px]">
              <img 
                src={yearlyPeakLoadPlot} 
                alt="Yearly Peak Loads" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center">
              <p className="text-gray-500">Loading yearly peak loads plot...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;

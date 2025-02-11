
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LoadProfileChart = () => {
  const [plotImageUrl, setPlotImageUrl] = useState<string | null>(null);
  const [weeklyPlotImageUrl, setWeeklyPlotImageUrl] = useState<string | null>(null);
  const [peakLoadPlotImageUrl, setPeakLoadPlotImageUrl] = useState<string | null>(null);

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
        let hasDaily = false, hasWeekly = false, hasPeak = false;

        // Check if daily load plot exists
        const dailyLoadName = `daily_load_${fileId}.png`;
        const { data: dailyLoadExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: dailyLoadName
          });

        if (dailyLoadExists && dailyLoadExists.length > 0) {
          const { data: dailyLoadData } = await supabase
            .storage
            .from('analysis_results')
            .download(dailyLoadName);
          
          if (dailyLoadData) {
            const url = URL.createObjectURL(dailyLoadData);
            console.log("Successfully fetched and created URL for daily load plot:", url);
            setPlotImageUrl(url);
            hasDaily = true;
          }
        }

        // Check if weekly load plot exists
        const weeklyLoadName = `weekly_load_${fileId}.png`;
        const { data: weeklyLoadExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: weeklyLoadName
          });

        if (weeklyLoadExists && weeklyLoadExists.length > 0) {
          const { data: weeklyLoadData } = await supabase
            .storage
            .from('analysis_results')
            .download(weeklyLoadName);
          
          if (weeklyLoadData) {
            const url = URL.createObjectURL(weeklyLoadData);
            console.log("Successfully fetched and created URL for weekly load plot:", url);
            setWeeklyPlotImageUrl(url);
            hasWeekly = true;
          }
        }

        // Check if peak load plot exists
        const peakLoadName = `peak_load_${fileId}.png`;
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
            setPeakLoadPlotImageUrl(url);
            hasPeak = true;
          }
        }

        // Return true if all plots are fetched
        return hasDaily && hasWeekly && hasPeak;
      } catch (error) {
        console.error("Error fetching plots:", error);
        return false;
      }
    };

    let intervalId: NodeJS.Timeout;
    
    const startPolling = async () => {
      const allPlotsFetched = await checkAndFetchPlots();
      
      if (!allPlotsFetched) {
        // Only set up polling if plots haven't been fetched yet
        intervalId = setInterval(async () => {
          const success = await checkAndFetchPlots();
          if (success) {
            console.log("All plots fetched successfully, stopping polling");
            clearInterval(intervalId);
          }
        }, 5000); // Check every 5 seconds
      }
    };

    startPolling();

    // Cleanup interval and object URLs on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (plotImageUrl) URL.revokeObjectURL(plotImageUrl);
      if (weeklyPlotImageUrl) URL.revokeObjectURL(weeklyPlotImageUrl);
      if (peakLoadPlotImageUrl) URL.revokeObjectURL(peakLoadPlotImageUrl);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Daily Load</h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            {plotImageUrl ? (
              <img 
                src={plotImageUrl} 
                alt="Load Profile Analysis" 
                className="max-h-full w-auto object-contain"
              />
            ) : (
              <div className="text-gray-500">Loading daily load data...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Average Load</h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            {weeklyPlotImageUrl ? (
              <img 
                src={weeklyPlotImageUrl} 
                alt="Weekly Load Analysis" 
                className="max-h-full w-auto object-contain"
              />
            ) : (
              <div className="text-gray-500">Loading weekly load data...</div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Peak Load</h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            {peakLoadPlotImageUrl ? (
              <img 
                src={peakLoadPlotImageUrl} 
                alt="Peak Load Analysis" 
                className="max-h-full w-auto object-contain"
              />
            ) : (
              <div className="text-gray-500">Loading peak load data...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Analysis</h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-gray-500">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadProfileChart;



import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const LoadProfileChart = () => {
  const analysisFileName = localStorage.getItem('analysisFileName');
  const fileId = analysisFileName?.replace(/\.[^/.]+$/, "");

  const fetchPlots = async () => {
    if (!fileId) throw new Error("No analysis file name found");

    const plots: { [key: string]: string } = {};

    // Fetch daily load plot
    const dailyLoadName = `daily_load_${fileId}.png`;
    const { data: dailyLoadExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: dailyLoadName });

    if (dailyLoadExists && dailyLoadExists.length > 0) {
      const { data: dailyLoadData } = await supabase
        .storage
        .from('analysis_results')
        .download(dailyLoadName);
      
      if (dailyLoadData) {
        plots.daily = URL.createObjectURL(dailyLoadData);
      }
    }

    // Fetch weekly load plot
    const weeklyLoadName = `weekly_load_${fileId}.png`;
    const { data: weeklyLoadExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: weeklyLoadName });

    if (weeklyLoadExists && weeklyLoadExists.length > 0) {
      const { data: weeklyLoadData } = await supabase
        .storage
        .from('analysis_results')
        .download(weeklyLoadName);
      
      if (weeklyLoadData) {
        plots.weekly = URL.createObjectURL(weeklyLoadData);
      }
    }

    // Fetch peak load plot
    const peakLoadName = `peak_load_${fileId}.png`;
    const { data: peakLoadExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: peakLoadName });

    if (peakLoadExists && peakLoadExists.length > 0) {
      const { data: peakLoadData } = await supabase
        .storage
        .from('analysis_results')
        .download(peakLoadName);
      
      if (peakLoadData) {
        plots.peak = URL.createObjectURL(peakLoadData);
      }
    }

    return plots;
  };

  const { data: plots } = useQuery({
    queryKey: ['load-profile-plots', fileId],
    queryFn: fetchPlots,
    staleTime: Infinity, // Keep the data fresh forever
    gcTime: Infinity, // Never delete from cache (previously cacheTime)
    enabled: !!fileId,
  });

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (plots) {
        Object.values(plots).forEach(url => URL.revokeObjectURL(url));
      }
    };
  }, [plots]);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Daily Load</h3>
          <div className="h-[400px] w-full flex items-center justify-center">
            {plots?.daily ? (
              <img 
                src={plots.daily} 
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
            {plots?.weekly ? (
              <img 
                src={plots.weekly} 
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
            {plots?.peak ? (
              <img 
                src={plots.peak} 
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

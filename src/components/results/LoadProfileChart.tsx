
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";

const generateLoadProfileData = () => {
  return [
    { hour: "00:00", demand: 13 },
    { hour: "02:00", demand: 14 },
    { hour: "04:00", demand: 15 },
    { hour: "06:00", demand: 22 },
    { hour: "08:00", demand: 50 },
    { hour: "10:00", demand: 52 },
    { hour: "12:00", demand: 50 },
    { hour: "14:00", demand: 38 },
    { hour: "16:00", demand: 45 },
    { hour: "18:00", demand: 25 },
    { hour: "20:00", demand: 18 },
    { hour: "22:00", demand: 13 }
  ];
};

const LoadProfileChart = () => {
  const loadData = generateLoadProfileData();
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
          }
        }

        // Return true if all plots are fetched
        return !!(dailyLoadData && weeklyLoadData && peakLoadData);
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
          {plotImageUrl ? (
            <div className="h-[150px] w-full flex items-center justify-center">
              <img 
                src={plotImageUrl} 
                alt="Load Profile Analysis" 
                className="max-h-full w-auto"
              />
            </div>
          ) : (
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    label={{ 
                      value: 'kW', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#666' }
                    }}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Average Load</h3>
          <div className="h-[150px] w-full flex items-center justify-center">
            {weeklyPlotImageUrl ? (
              <img 
                src={weeklyPlotImageUrl} 
                alt="Weekly Load Analysis" 
                className="max-h-full w-auto"
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
          <div className="h-[150px] w-full flex items-center justify-center">
            {peakLoadPlotImageUrl ? (
              <img 
                src={peakLoadPlotImageUrl} 
                alt="Peak Load Analysis" 
                className="max-h-full w-auto"
              />
            ) : (
              <div className="text-gray-500">Loading peak load data...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Analysis</h3>
          <div className="h-[150px] w-full flex items-center justify-center">
            <div className="text-gray-500">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadProfileChart;

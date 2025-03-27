
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Define the data type for daily load
interface DailyLoadData {
  hour: number;
  load: number;
}

const LoadProfileChart = () => {
  const [weeklyPlotImageUrl, setWeeklyPlotImageUrl] = useState<string | null>(null);
  const [peakLoadPlotImageUrl, setPeakLoadPlotImageUrl] = useState<string | null>(null);
  const [dailyLoadData, setDailyLoadData] = useState<DailyLoadData[] | null>(null);

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
        let hasDaily = false,
          hasWeekly = false,
          hasPeak = false;

        // Try to fetch daily load JSON data
        const dailyLoadJsonName = `daily_load_${fileId}.json`;
        const {
          data: dailyLoadJsonExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: dailyLoadJsonName
        });
        
        if (dailyLoadJsonExists && dailyLoadJsonExists.length > 0) {
          const {
            data: dailyLoadJsonData
          } = await supabase.storage.from('analysis_results').download(dailyLoadJsonName);
          
          if (dailyLoadJsonData) {
            try {
              const text = await dailyLoadJsonData.text();
              const data = JSON.parse(text) as DailyLoadData[];
              console.log("Successfully fetched daily load JSON data:", data);
              setDailyLoadData(data);
              hasDaily = true;
            } catch (error) {
              console.error("Error parsing daily load JSON data:", error);
            }
          }
        }

        // Check if weekly load plot exists
        const weeklyLoadName = `weekly_load_${fileId}.png`;
        const {
          data: weeklyLoadExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: weeklyLoadName
        });
        if (weeklyLoadExists && weeklyLoadExists.length > 0) {
          const {
            data: weeklyLoadData
          } = await supabase.storage.from('analysis_results').download(weeklyLoadName);
          if (weeklyLoadData) {
            const url = URL.createObjectURL(weeklyLoadData);
            console.log("Successfully fetched and created URL for weekly load plot:", url);
            setWeeklyPlotImageUrl(url);
            hasWeekly = true;
          }
        }

        // Check if peak load plot exists
        const peakLoadName = `peak_load_${fileId}.png`;
        const {
          data: peakLoadExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: peakLoadName
        });
        if (peakLoadExists && peakLoadExists.length > 0) {
          const {
            data: peakLoadData
          } = await supabase.storage.from('analysis_results').download(peakLoadName);
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
      if (weeklyPlotImageUrl) URL.revokeObjectURL(weeklyPlotImageUrl);
      if (peakLoadPlotImageUrl) URL.revokeObjectURL(peakLoadPlotImageUrl);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  // Format hour for X-axis
  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  return <div className="grid grid-cols-2 gap-8 rounded-sm">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Daily Load</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {dailyLoadData ? (
              <ChartContainer 
                config={{
                  load: {
                    label: "Load",
                    color: "#3b82f6" // blue-500
                  }
                }}
                className="w-full h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dailyLoadData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={formatHour}
                      ticks={[0, 3, 6, 9, 12, 15, 18, 21]} // Show only every 3 hours
                      label={{ value: 'Hour of Day', position: 'insideBottom', offset: -10 }}
                    />
                    <YAxis 
                      label={{ value: 'Load (kW)', angle: -90, position: 'insideLeft', offset: 10 }}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as DailyLoadData;
                          return (
                            <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                              <p className="text-sm font-medium">{`${formatHour(data.hour)}`}</p>
                              <p className="text-sm text-blue-600">{`Load: ${data.load.toFixed(2)} kW`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="load" 
                      name="Load"
                      stroke="#3b82f6" 
                      dot={{ r: 1 }} 
                      activeDot={{ r: 5 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-gray-500">Loading daily load data...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Weekly Load</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {weeklyPlotImageUrl ? <img src={weeklyPlotImageUrl} alt="Weekly Load Analysis" className="max-h-full w-auto object-contain" /> : <div className="text-gray-500">Loading weekly load data...</div>}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Peak Load</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {peakLoadPlotImageUrl ? <img src={peakLoadPlotImageUrl} alt="Peak Load Analysis" className="max-h-full w-auto object-contain" /> : <div className="text-gray-500">Loading peak load data...</div>}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Analysis</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <div className="text-gray-500">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>;
};
export default LoadProfileChart;

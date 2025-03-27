
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DailyLoadData {
  hour: string;
  load: number;
}

const LoadProfileChart = () => {
  const [dailyLoadData, setDailyLoadData] = useState<DailyLoadData[]>([]);
  const [weeklyPlotImageUrl, setWeeklyPlotImageUrl] = useState<string | null>(null);
  const [peakLoadPlotImageUrl, setPeakLoadPlotImageUrl] = useState<string | null>(null);
  const [isLoadingDailyData, setIsLoadingDailyData] = useState(true);

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

        // Check if daily load JSON exists
        const dailyLoadJsonName = `daily_load_${fileId}.json`;
        const {
          data: dailyLoadExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: dailyLoadJsonName
        });
        
        if (dailyLoadExists && dailyLoadExists.length > 0) {
          const {
            data: dailyLoadData
          } = await supabase.storage.from('analysis_results').download(dailyLoadJsonName);
          
          if (dailyLoadData) {
            const json = await dailyLoadData.text();
            const parsedData = JSON.parse(json);
            
            // Transform data for chart if needed
            const formattedData = parsedData.map((value: number, index: number) => ({
              hour: index.toString(),
              load: value
            }));
            
            console.log("Successfully fetched daily load JSON data");
            setDailyLoadData(formattedData);
            setIsLoadingDailyData(false);
            hasDaily = true;
          }
        } else {
          console.log("Daily load JSON not found, looking for PNG fallback");
          // Fallback to PNG if JSON doesn't exist
          const dailyLoadName = `daily_load_${fileId}.png`;
          const {
            data: dailyLoadPngExists
          } = await supabase.storage.from('analysis_results').list('', {
            search: dailyLoadName
          });
          
          if (dailyLoadPngExists && dailyLoadPngExists.length > 0) {
            console.log("Found PNG fallback for daily load");
            setIsLoadingDailyData(false);
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
        setIsLoadingDailyData(false);
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

  // Format hour labels for better display
  const formatHour = (hour: string) => {
    const hourNum = parseInt(hour);
    return `${hourNum}:00`;
  };

  // Create chart config for Recharts
  const chartConfig = {
    load: {
      label: "Power (kW)",
      color: "#0ea5e9", // sky blue color
    }
  };

  return <div className="grid grid-cols-2 gap-8 rounded-sm">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Daily Load</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {isLoadingDailyData ? (
              <div className="text-gray-500">Loading daily load data...</div>
            ) : dailyLoadData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full">
                <LineChart data={dailyLoadData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={formatHour} 
                    interval={2} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent
                        active={active}
                        payload={payload}
                        formatter={(value) => [`${value.toFixed(2)} kW`, "Load"]}
                        labelFormatter={(hour) => `Hour: ${formatHour(hour as string)}`}
                      />
                    )}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#0ea5e9" 
                    strokeWidth={2} 
                    activeDot={{ r: 6 }} 
                    dot={false}
                    name="Power (kW)"
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="text-gray-500">No daily load data available</div>
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

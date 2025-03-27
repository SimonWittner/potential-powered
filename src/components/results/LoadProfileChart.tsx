import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ReferenceLine, Legend } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Define the data types for load data
interface DailyLoadData {
  hour: number;
  load: number;
}

interface WeeklyLoadData {
  day?: number;
  load: number;
}

interface PeakLoadData {
  time: string;
  load: number;
}

const LoadProfileChart = () => {
  const [dailyLoadData, setDailyLoadData] = useState<DailyLoadData[] | null>(null);
  const [weeklyLoadData, setWeeklyLoadData] = useState<WeeklyLoadData[] | null>(null);
  const [peakLoadData, setPeakLoadData] = useState<PeakLoadData[] | null>(null);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");
    const checkAndFetchPlots = async () => {
      try {
        let hasDaily = false,
          hasWeekly = false,
          hasPeak = false;

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

        const weeklyLoadJsonName = `weekly_load_${fileId}.json`;
        const {
          data: weeklyLoadJsonExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: weeklyLoadJsonName
        });
        
        if (weeklyLoadJsonExists && weeklyLoadJsonExists.length > 0) {
          const {
            data: weeklyLoadJsonData
          } = await supabase.storage.from('analysis_results').download(weeklyLoadJsonName);
          
          if (weeklyLoadJsonData) {
            try {
              const text = await weeklyLoadJsonData.text();
              const data = JSON.parse(text) as WeeklyLoadData[];
              
              const processedData = data.map((item, index) => {
                if (item.day === undefined) {
                  return { ...item, day: index };
                }
                return item;
              });
              
              console.log("Successfully fetched weekly load JSON data:", processedData);
              setWeeklyLoadData(processedData);
              hasWeekly = true;
            } catch (error) {
              console.error("Error parsing weekly load JSON data:", error);
            }
          }
        } else {
          console.log("Weekly load JSON data not found");
        }

        const peakLoadJsonName = `peak_load_${fileId}.json`;
        const {
          data: peakLoadJsonExists
        } = await supabase.storage.from('analysis_results').list('', {
          search: peakLoadJsonName
        });
        
        if (peakLoadJsonExists && peakLoadJsonExists.length > 0) {
          const {
            data: peakLoadJsonData
          } = await supabase.storage.from('analysis_results').download(peakLoadJsonName);
          
          if (peakLoadJsonData) {
            try {
              const text = await peakLoadJsonData.text();
              const data = JSON.parse(text) as PeakLoadData[];
              console.log("Successfully fetched peak load JSON data:", data);
              setPeakLoadData(data);
              hasPeak = true;
            } catch (error) {
              console.error("Error parsing peak load JSON data:", error);
            }
          }
        }

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
        intervalId = setInterval(async () => {
          const success = await checkAndFetchPlots();
          if (success) {
            console.log("All plots fetched successfully, stopping polling");
            clearInterval(intervalId);
          }
        }, 5000);
      }
    };
    startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const formatHour = (hour: number) => {
    return `${hour}:00`;
  };

  const formatDay = (day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day % 7];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}. ${date.toLocaleDateString('en-US', { 
      month: 'short'
    })}`;
  };

  const getMaxLoad = (data: PeakLoadData[] | WeeklyLoadData[]) => {
    return Math.max(...data.map(item => item.load));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Average Daily Load</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
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
                    label={{ value: 'Load [kW]', angle: -90, position: 'insideLeft', offset: 7 }}
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
                    strokeWidth={2}
                    dot={{ r: 1 }} 
                    activeDot={{ r: 5 }}
                    fill="#3b82f6"
                    fillOpacity={0.2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Peak Load</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          {peakLoadData ? (
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
                  data={peakLoadData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tickFormatter={formatDate}
                    label={{ value: 'Date', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    label={{ value: 'Load [kW]', angle: -90, position: 'insideLeft', offset: 7 }}
                  />
                  {peakLoadData && (
                    <ReferenceLine 
                      y={getMaxLoad(peakLoadData)} 
                      stroke="red" 
                      strokeDasharray="3 3"
                      label={{
                        value: `Peak Load: ${getMaxLoad(peakLoadData).toFixed(2)} kW`,
                        position: 'right',
                        fill: 'red'
                      }}
                    />
                  )}
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as PeakLoadData;
                        const date = new Date(data.time);
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                            <p className="text-sm font-medium">{formatDate(data.time)}</p>
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
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 1 }} 
                    activeDot={{ r: 5 }}
                    name="Load"
                  />
                  {peakLoadData && (
                    <ReferenceLine 
                      y={getMaxLoad(peakLoadData)}
                      stroke="red"
                      strokeDasharray="3 3"
                      name="Peak Load"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Average Weekly Load</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          {weeklyLoadData ? (
            <ChartContainer 
              config={{
                load: {
                  label: "Load",
                  color: "#3b82f6" // Changed to blue-500 to match other plots
                }
              }}
              className="w-full h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weeklyLoadData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="day" 
                    tickFormatter={formatDay}
                    label={{ value: 'Day of Week', position: 'insideBottom', offset: -5 }}
                    tick={false}
                  />
                  <YAxis 
                    label={{ value: 'Load [kW]', angle: -90, position: 'insideLeft', offset: 7 }}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as WeeklyLoadData;
                        return (
                          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                            <p className="text-sm font-medium">{formatDay(data.day || 0)}</p>
                            <p className="text-sm text-blue-600">{`Load: ${data.load.toFixed(2)} kW`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="load"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={0}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    name="Load"
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 1 }} 
                    activeDot={{ r: 5 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Additional Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <div className="text-gray-500">Coming soon...</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadProfileChart;

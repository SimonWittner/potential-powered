
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PeakShavingBatteryCard = () => {
  const [batteryData, setBatteryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 15); // Increment progress every second
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    const checkAndFetchData = async () => {
      try {
        // Check if data file exists - using ps_data prefix for peak shaving
        const fileName = `ps_data_${fileId}.json`;
        const { data: fileExists } = await supabase
          .storage
          .from('analysis_results')
          .list('', {
            search: fileName
          });

        if (fileExists && fileExists.length > 0) {
          const { data } = await supabase
            .storage
            .from('analysis_results')
            .download(fileName);
          
          if (data) {
            const jsonData = await data.text();
            const parsedData = JSON.parse(jsonData);
            console.log("Peak shaving battery design data received:", parsedData);
            setBatteryData(parsedData);
            setIsLoading(false);
            setProgress(100);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching peak shaving battery design data:", error);
        return false;
      }
    };

    let dataCheckInterval: NodeJS.Timeout;
    
    const startPolling = async () => {
      const dataFetched = await checkAndFetchData();
      
      if (!dataFetched) {
        // Only set up polling if data hasn't been fetched yet
        dataCheckInterval = setInterval(async () => {
          const success = await checkAndFetchData();
          if (success) {
            console.log("Peak shaving battery design data fetched successfully, stopping polling");
            clearInterval(dataCheckInterval);
          }
        }, 1000); // Check every 5 seconds
      }
    };

    // Start the initial check after a delay to allow for data processing
    const timer = setTimeout(() => {
      startPolling();
    }, 5000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (dataCheckInterval) clearInterval(dataCheckInterval);
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Battery Design</h2>
      <div className="space-y-4">
        {isLoading ? (
          <div className="w-full">
            <div className="relative w-full h-4 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-500">
              Loading battery design data... {Math.floor(progress)}%
            </p>
          </div>
        ) : (
          <div className="bg-gray-100 p-3 rounded-lg relative">
            <div className="absolute top-3 right-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      <strong>Recommended Battery</strong>
                      <br />
                      This is the perfect optimized battery for peak shaving.
                      <br />
                      <br />
                      <strong>Peak Reduction</strong>
                      <br />
                      The percentage of peak demand that can be reduced with this battery.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p>Recommended Battery: <span className="font-bold">{batteryData?.ps_battery_size_kwh?.toFixed(0) || 0} kWh </span> <span className="mx-2">|</span> <span className="font-bold">{batteryData?.ps_battery_size_kw?.toFixed(0) || 0} kW</span></p>
            <p>Peak Reduction: {batteryData?.ps_peak_reduction?.toFixed(1) || 0} kW</p>
            <p>Estimated Full Cycles per Year: {batteryData?.ps_battery_cycles?.toFixed(0) || 0}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PeakShavingBatteryCard;

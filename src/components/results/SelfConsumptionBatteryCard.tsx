import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SelfConsumptionBatteryCard = () => {
  const [batteryData, setBatteryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress initially
    setProgress(0);
    
    // Check if data was already loaded
    const cachedData = localStorage.getItem('selfConsumptionBatteryData');
    if (cachedData) {
      setBatteryData(JSON.parse(cachedData));
      setIsLoading(false);
      setProgress(100);
      return;
    }

    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove stored progress to get fresh loading bar
    localStorage.removeItem('selfConsumptionProgress');
    
    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 15); // Increment progress every second
        const cappedProgress = nextProgress >= 100 ? 100 : nextProgress;
        localStorage.setItem('selfConsumptionProgress', cappedProgress.toString());
        return cappedProgress;
      });
    }, 1000); // Update progress every second

    const checkAndFetchData = async () => {
      try {
        // Check if data file exists - using evo_data prefix
        const fileName = `evo_data_${fileId}.json`;
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
            console.log("Self-consumption battery design data received:", parsedData);
            setBatteryData(parsedData);
            
            // Cache the data to prevent future loading
            localStorage.setItem('selfConsumptionBatteryData', jsonData);
            
            setIsLoading(false);
            setProgress(100);
            localStorage.setItem('selfConsumptionProgress', '100');
            // Mark this tab as loaded
            localStorage.setItem('selfConsumptionLoaded', 'true');
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching self-consumption battery design data:", error);
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
            console.log("Self-consumption battery design data fetched successfully, stopping polling");
            clearInterval(dataCheckInterval);
          }
        }, 1000); // Check every second
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
            <Progress value={progress} className="h-4" />
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
                  <TooltipContent className="max-w-[500px]">
                    <p>
                      <strong>Recommended Battery</strong>
                      <br />
                      This is the perfect optimized battery. It is not necessarily existing in the market.
                      <br />
                      <br />
                      <strong>Increase Self-consumption</strong>
                      <br />
                      Additional self-consumption that this battery can provide. Value might be 0 or negative in case of no PV system (battery allowed to charge from grid).
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p>Recommended Battery: <span className="font-bold">{batteryData?.evo_battery_size_kwh.toFixed(0) || 0} kWh </span> <span className="mx-2">|</span> <span className="font-bold">{batteryData?.evo_battery_size_kw.toFixed(0) || 0} kW</span></p>
            <p>Increase Self-consumption: +{batteryData?.evo_increase_self_consumption_opt.toFixed(2) || 0}%</p>
            <p>Estimated Full Cycles per Year: {batteryData?.evo_battery_cycles.toFixed(0) || 0}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SelfConsumptionBatteryCard;

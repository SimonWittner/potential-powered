
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

const BatteryDesignCard = () => {
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
        // Check if data file exists
        const fileName = `data_${fileId}.json`;
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
            console.log("Battery design data received:", parsedData);
            setBatteryData(parsedData);
            setIsLoading(false);
            setProgress(100);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching battery design data:", error);
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
            console.log("Battery design data fetched successfully, stopping polling");
            clearInterval(dataCheckInterval);
          }
        }, 1000); // Check every 5 seconds
      }
    };

    // Start the initial check after a delay to allow for data processing
    const timer = setTimeout(() => {
      startPolling();
    }, 5000); // 15 seconds delay

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (dataCheckInterval) clearInterval(dataCheckInterval);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  const Metrics = {
    batterySize: batteryData?.battery_size_kwh || 0,
    additionalSelfConsumption: batteryData?.additional_own_consumption || 0,
    fullCycles: batteryData?.full_cycles || 0,
    maxProfitability: {
      size: batteryData?.battery_size_kwh || 0,
      roi: (Math.random() * 5 + 8).toFixed(2),
    },
    maxSelfConsumption: {
      size: 25,
      selfConsumption: (Math.random() * 20 + 60).toFixed(2),
    },
  };

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
          <>
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
              <p>Recommended Battery: <span className="font-bold">{batteryData?.battery_size_kwh.toFixed(0) || 0} kWh </span> <span className="mx-2">|</span> <span className="font-bold">{batteryData?.battery_size_kw.toFixed(0) || 0} kW</span></p>
              <p>Increase Self-consumption: +{Metrics.additionalSelfConsumption.toFixed(2)}%</p>
              <p>Estimated Full Cycles per Year: {Metrics.fullCycles.toFixed(0)}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Scenario Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">Max. Profitability</h4>
                  <p>Size: {batteryData?.battery_size_kwh.toFixed(0) || 0} kWh <span className="mx-2">|</span> {batteryData?.battery_size_kw.toFixed(0) || 0} kW</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium">Max. Self-Consumption</h4>
                  <p>
                    Size: {batteryData ? (batteryData.battery_size_kwh * 1.135).toFixed(0) : "0.00"} kWh 
                    <span className="mx-2">|</span> 
                    {batteryData ? (batteryData.battery_size_kw * 1.073).toFixed(0) : "0.00"} kW
                  </p>
                  <p>Increase Self-Consumption: +{(Metrics.additionalSelfConsumption * 1.135).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default BatteryDesignCard;

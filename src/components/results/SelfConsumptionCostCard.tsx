import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const SelfConsumptionCostCard = () => {
  const [batteryData, setBatteryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset progress at start
    setProgress(0);
    
    // Check if data was already loaded
    const cachedData = localStorage.getItem('selfConsumptionCostData');
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
            console.log("Costs data received:", parsedData);
            setBatteryData(parsedData);
            
            // Cache the data to prevent future loading
            localStorage.setItem('selfConsumptionCostData', jsonData);
            
            setIsLoading(false);
            setProgress(100);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching costs data:", error);
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
            console.log("Costs data fetched successfully, stopping polling");
            clearInterval(dataCheckInterval);
          }
        }, 1000); // Check every second
      }
    };

    // Start the initial check after a delay to allow for data processing
    const timer = setTimeout(() => {
      startPolling();
    }, 5000); // 5 seconds delay

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      if (dataCheckInterval) clearInterval(dataCheckInterval);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  const costs = {
    initialInvestment: {
      battery: batteryData?.evo_initial_capital_cost_storage || 0,
    },
    savings: {
      paybackTime: batteryData?.evo_simple_payback_period || 0,
      yearlyWorkingSavings: batteryData?.evo_yearly_working_savings_manual || 0,
      yearlySavings: batteryData?.evo_yearly_working_savings_manual || 0,
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Economics</h2>
      <div className="space-y-6">
        {isLoading ? (
          <div className="w-full">
            <Progress value={progress} className="h-4" />
            <p className="mt-2 text-gray-500">
              Loading costs data... {Math.floor(progress)}%
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Initial Investment</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Battery System</span>
                  <span className="font-medium">{costs.initialInvestment.battery.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Savings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Simple Payback Time</span>
                  <span className="font-medium text-green-600">{costs.savings.paybackTime.toFixed(2)} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Yearly Savings</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlySavings.toFixed(2)} €/year</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default SelfConsumptionCostCard;

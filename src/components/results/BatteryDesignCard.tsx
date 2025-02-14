
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const BatteryDesignCard = () => {
  const analysisFileName = localStorage.getItem('analysisFileName');
  const fileId = analysisFileName?.replace(/\.[^/.]+$/, "");
  const [progress, setProgress] = useState(0);

  const fetchBatteryData = async () => {
    if (!fileId) throw new Error("No analysis file name found");

    const fileName = `data_${fileId}.json`;
    const { data: fileExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: fileName });

    if (fileExists && fileExists.length > 0) {
      const { data } = await supabase
        .storage
        .from('analysis_results')
        .download(fileName);
      
      if (data) {
        const jsonData = await data.text();
        return JSON.parse(jsonData);
      }
    }
    return null;
  };

  const { data: batteryData, isLoading } = useQuery({
    queryKey: ['battery-data', fileId],
    queryFn: fetchBatteryData,
    staleTime: Infinity, // Keep the data fresh forever
    gcTime: Infinity, // Never delete from cache (previously cacheTime)
    enabled: !!fileId,
  });

  // Progress bar animation
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 15);
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  const Metrics = {
    batterySize: batteryData?.battery_size_kwh || 0,
    additionalSelfConsumption: batteryData?.additional_own_consumption || 0,
    fullCycles: 17,
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
            <div className="bg-gray-100 p-3 rounded-lg">
              <p>Recommended Battery: <span className="font-bold">{batteryData?.battery_size_kwh || 0} kWh </span> <span className="mx-2">|</span> <span className="font-bold">{batteryData?.battery_size_kw || 0} kW</span></p>
              <p>Additional Self-consumption: +{Metrics.additionalSelfConsumption.toFixed(2)}%</p>
              <p>Estimated Full Cycles per Year: {Metrics.fullCycles}</p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Scenario Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">Max. Profitability</h4>
                  <p>Size: {batteryData?.battery_size_kwh || 0} kWh <span className="mx-2">|</span> {batteryData?.battery_size_kw || 0} kW</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium">Max. Self-Consumption</h4>
                  <p>
                    Size: {batteryData ? (batteryData.battery_size_kwh * 1.135).toFixed(0) : "0.00"} kWh 
                    <span className="mx-2">|</span> 
                    {batteryData ? (batteryData.battery_size_kw * 1.073).toFixed(0) : "0.00"} kW
                  </p>
                  <p>Self-Consumption: {Metrics.maxSelfConsumption.selfConsumption}%</p>
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

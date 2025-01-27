import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = 'https://d3cd-185-197-236-130.ngrok-free.app';

const BatteryDesignCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("Starting 90-second delay before fetching battery data...");
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 90); // Increment progress every second
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    const timer = setTimeout(() => {
      console.log("Delay complete, initiating battery data fetch");
      setShouldFetch(true);
      setProgress(100); // Ensure the progress bar reaches 100%
      clearInterval(interval); // Stop progress updates
    }, 90000); // 90 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const { data: batteryData, isLoading } = useQuery({
    queryKey: ["batteryDesign"],
    queryFn: async () => {
      console.log("Fetching battery design data...");
      const response = await fetch(
        `${API_URL}/get-plot?name=example.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch battery design data");
      }
      const data = await response.json();
      console.log("Battery design data received:", data);
      return data;
    },
    enabled: shouldFetch,
  });

  const randomMetrics = {
    batterySize: batteryData?.battery_size_kwh || 0,
    additionalSelfConsumption: 14.9,
    fullCycles: 113,
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
        {!shouldFetch || isLoading ? (
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
            </div>
            <p>Additional Self-consumption: +{randomMetrics.additionalSelfConsumption}%</p>
            <p>Estimated Full Cycles per Year: {randomMetrics.fullCycles}</p>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Scenario Comparison</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium">Max. Profitability</h4>
                  <p>Size: {batteryData?.battery_size_kwh || 0} kWh <span className="mx-2">|</span> {batteryData?.battery_size_kw || 0} kW</p>
                  <p>ROI: {randomMetrics.maxProfitability.roi}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium">Max. Self-Consumption</h4>
                  <p>
                    Size: {batteryData ? (batteryData.battery_size_kwh * 1.135).toFixed(0) : "0.00"} kWh 
                    <span className="mx-2">|</span> 
                    {batteryData ? (batteryData.battery_size_kw * 1.073).toFixed(0) : "0.00"} kW
                  </p>
                  <p>Self-Consumption: {randomMetrics.maxSelfConsumption.selfConsumption}%</p>
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

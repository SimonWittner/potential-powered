import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const BatteryDesignCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 90000); // 90 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const { data: batteryData, isLoading } = useQuery({
    queryKey: ['batteryDesign'],
    queryFn: async () => {
      console.log("Fetching battery design data...");
      const response = await fetch('http://localhost:3001/get-plot?name=example.json');
      if (!response.ok) {
        throw new Error('Failed to fetch battery design data');
      }
      const data = await response.json();
      console.log("Battery design data received:", data);
      return data;
    },
    enabled: shouldFetch,
  });

  const randomMetrics = {
    batterySize: batteryData?.battery_size_kwh || 0, // Default to 0 instead of 17
    additionalSelfConsumption: 14.9,
    fullCycles: 113,
    maxProfitability: {
      size: 17,
      roi: (Math.random() * 5 + 8).toFixed(2)
    },
    maxSelfConsumption: {
      size: 25,
      selfConsumption: (Math.random() * 20 + 60).toFixed(2)
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Battery Design</h2>
      <div className="space-y-4">
        <p>
          Recommended Battery Size:{' '}
          {!shouldFetch || isLoading ? (
            <span className="text-gray-500">loading...</span>
          ) : (
            `${randomMetrics.batterySize} kWh`
          )}
        </p>
        <p>Additional Self-consumption: +{randomMetrics.additionalSelfConsumption}%</p>
        <p>Estimated Full Cycles per Year: {randomMetrics.fullCycles}</p>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Scenario Comparison</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium">Maximum Profitability</h4>
              <p>Size: {randomMetrics.maxProfitability.size} kWh</p>
              <p>ROI: {randomMetrics.maxProfitability.roi}%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium">Maximum Self-Consumption</h4>
              <p>Size: {randomMetrics.maxSelfConsumption.size} kWh</p>
              <p>Self-Consumption: {randomMetrics.maxSelfConsumption.selfConsumption}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BatteryDesignCard;
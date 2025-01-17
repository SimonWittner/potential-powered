import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

const BatteryDesignCard = () => {
  const [batterySize, setBatterySize] = useState<number>(17); // Default value as fallback
  
  useEffect(() => {
    const fetchProcessedData = async () => {
      try {
        console.log('Fetching processed data from local server...');
        const response = await fetch('http://localhost:3001/get-processed-data');
        if (!response.ok) {
          throw new Error('Failed to fetch processed data');
        }
        const data = await response.json();
        console.log('Received processed data:', data);
        
        if (data.battery_size_kwh) {
          setBatterySize(data.battery_size_kwh);
        }
      } catch (error) {
        console.error('Error fetching processed data:', error);
        // Keep the default battery size if fetch fails
      }
    };

    fetchProcessedData();
  }, []);

  const randomMetrics = {
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
        <p>Recommended Battery Size: {batterySize} kWh</p>
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

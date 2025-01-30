import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";

const CostsCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("Starting 120-second delay before fetching costs data...");
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 120); // Increment progress every second
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    const timer = setTimeout(() => {
      console.log("Delay complete, initiating costs data fetch");
      setShouldFetch(true);
      setProgress(100);
      clearInterval(interval);
    }, 120000); // 120 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const { data: batteryData, isLoading } = useQuery({
    queryKey: ["costsData"],
    queryFn: async () => {
      console.log("Fetching costs data...");
      const response = await fetch(
        `${API_URL}/get-plot?name=example.json`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch costs data");
      }
      const data = await response.json();
      console.log("Costs data received:", data);
      return data;
    },
    enabled: shouldFetch,
  });

  const costs = {
    initialInvestment: {
      total: batteryData?.initial_capital_cost || 0,
      battery: batteryData?.initial_capital_cost_storage || 0,
    },
    savings: {
      paybackTime: batteryData?.simple_payback_years || 0,
      yearlySavings: batteryData?.yearly_savings || 0,
      npv: batteryData?.net_present_value || 0,
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Costs</h2>
      <div className="space-y-6">
        {!shouldFetch || isLoading ? (
          <div className="w-full">
            <div className="relative w-full h-4 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
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
                  <span>Total</span>
                  <span className="font-medium">{costs.initialInvestment.total} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Battery System</span>
                  <span className="font-medium">{costs.initialInvestment.battery} €</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Savings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Simple Payback Time</span>
                  <span className="font-medium">{costs.savings.paybackTime} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Yearly Savings</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlySavings} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Net Present Value</span>
                  <span className="font-medium">{costs.savings.npv} €</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default CostsCard;
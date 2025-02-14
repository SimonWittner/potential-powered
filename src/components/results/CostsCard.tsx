
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const CostsCard = () => {
  const analysisFileName = localStorage.getItem('analysisFileName');
  const fileId = analysisFileName?.replace(/\.[^/.]+$/, "");
  const [progress, setProgress] = useState(0);

  const fetchCostsData = async () => {
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
    queryKey: ['costs-data', fileId],
    queryFn: fetchCostsData,
    staleTime: Infinity, // Keep the data fresh forever
    cacheTime: Infinity, // Never delete from cache
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

  const costs = {
    initialInvestment: {
      total: batteryData?.initial_capital_cost || 0,
      battery: batteryData?.initial_capital_cost_storage || 0,
    },
    savings: {
      paybackTime: batteryData?.simple_payback_years || 0,
      yearlyGridSavings: batteryData?.yearly_grid_savings_manual || 0,
      yearlyWorkingSavings: batteryData?.yearly_working_savings_manual || 0,
      yearlySavings: batteryData?.yearly_savings_manual || 0,
      npv: batteryData?.net_present_value || 0,
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Economics</h2>
      <div className="space-y-6">
        {isLoading ? (
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
                  <span>Yearly Grid Power Charge Savings (Savings Peak Reduction)</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlyGridSavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Yearly Electricity Price Savings</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlyWorkingSavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Yearly Savings</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlySavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Net Present Value</span>
                  <span className="font-medium text-green-600">{costs.savings.npv} €</span>
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

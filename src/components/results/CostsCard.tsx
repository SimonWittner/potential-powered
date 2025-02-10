
import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";
import { useLanguage } from "@/context/LanguageContext";

const CostsCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    console.log("Starting 120-second delay before fetching costs data...");
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 15); // Increment progress every second
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    const timer = setTimeout(() => {
      console.log("Delay complete, initiating costs data fetch");
      setShouldFetch(true);
      setProgress(100);
      clearInterval(interval);
    }, 15000); // 120 seconds

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
      yearlyGridSavings: batteryData?.yearly_grid_savings_manual || 0,
      yearlyWorkingSavings: batteryData?.yearly_working_savings_manual || 0,
      yearlySavings: batteryData?.yearly_savings_manual || 0,
      npv: batteryData?.net_present_value || 0,
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">{t('economics')}</h2>
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
              {t('loading')}... {Math.floor(progress)}%
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">{t('initialInvestment')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{t('batterySystem')}</span>
                  <span className="font-medium">{costs.initialInvestment.battery.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">{t('savings')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{t('simplePaybackTime')}</span>
                  <span className="font-medium text-green-600">{costs.savings.paybackTime.toFixed(2)} {t('years')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('yearlyGridSavings')}</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlyGridSavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('yearlyElectricitySavings')}</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlyWorkingSavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('totalYearlySavings')}</span>
                  <span className="font-medium text-green-600">{costs.savings.yearlySavings.toFixed(2)} €/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('netPresentValue')}</span>
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


import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react";

const ESGReportingCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    console.log("Starting 15-second delay before fetching ESG data...");
    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + (100 / 15); // Increment progress every second
        return nextProgress >= 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    const timer = setTimeout(() => {
      console.log("Delay complete, initiating ESG data fetch");
      setShouldFetch(true);
      setProgress(100);
      clearInterval(interval);
    }, 15000); // 15 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const esgMetrics = {
    environmental: {
      co2Reduction: (Math.random() * 5000 + 3000).toFixed(2),
      treeEquivalent: Math.floor(Math.random() * 200 + 100),
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">ESG Reporting</h2>
      <div className="space-y-6">
        {!shouldFetch ? (
          <div className="w-full">
            <div className="relative w-full h-4 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-500">
              Loading ESG data... {Math.floor(progress)}%
            </p>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Environmental Impact</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>CO₂ Reduction</span>
                <span className="font-medium">{esgMetrics.environmental.co2Reduction} kg/year</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Equivalent Trees Planted</span>
                <span className="font-medium">{esgMetrics.environmental.treeEquivalent} trees</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ESGReportingCard;

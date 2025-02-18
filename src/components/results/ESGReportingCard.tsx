
import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ESGReportingCard = () => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [batteryData, setBatteryData] = useState<any>(null);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    console.log("Starting 15-second delay before fetching ESG data...");
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
            console.log("ESG data received:", parsedData);
            setBatteryData(parsedData);
            setShouldFetch(true);
            setProgress(100);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching ESG data:", error);
        return false;
      }
    };

    // Start the initial check after a delay to allow for data processing
    const timer = setTimeout(async () => {
      console.log("Delay complete, initiating ESG data fetch");
      await checkAndFetchData();
      clearInterval(interval);
    }, 15000); // 15 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const esgMetrics = {
    environmental: {
      co2Reduction: batteryData?.annual_co2_savings || 0,
      treeEquivalent: batteryData?.trees_saved || 0,
    }
  };

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm">
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
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4 text-neutral-800">Environmental Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">CO₂ Reduction</span>
                <span className="font-medium text-neutral-800">{esgMetrics.environmental.co2Reduction} kg/year</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Equivalent Trees Planted</span>
                <span className="font-medium text-neutral-800">{esgMetrics.environmental.treeEquivalent} trees</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ESGReportingCard;

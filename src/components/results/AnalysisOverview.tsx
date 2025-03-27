
import { Card } from "@/components/ui/card";
import LoadProfileChart from "@/components/results/LoadProfileChart";
import PVProductionChart from "@/components/results/PVProductionChart";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AnalysisOverview = () => {
  const [yearlyConsumption, setYearlyConsumption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const analysisFileName = localStorage.getItem('analysisFileName');
        
        if (!analysisFileName) {
          console.error("No analysis file name found");
          return;
        }
        
        const fileId = analysisFileName.split('.')[0];
        const { data, error } = await supabase.storage
          .from('load_profiles')
          .download(`input_data_${fileId}.json`);
          
        if (error) {
          console.error("Error fetching input data:", error);
          return;
        }
        
        const inputData = JSON.parse(await data.text());
        if (inputData && inputData.yearly_consumption) {
          setYearlyConsumption(inputData.yearly_consumption);
        }
      } catch (error) {
        console.error("Error processing input data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return <div className="grid grid-cols-1 gap-8">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Load Profile Analysis</h2>
          <div className="flex space-x-4">
            <div className="bg-[#3b82f6] p-3 text-white text-center flex flex-col justify-center min-w-[110px] shadow-sm rounded-full">
              <span className="font-bold text-lg">
                {isLoading ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <>
                    {yearlyConsumption ? Math.round(yearlyConsumption)} <span className="text-sm">kWh</span>
                  </>
                )}
              </span>
              <span className="text-xs">Load/Year</span>
            </div>
            <div className="bg-[#3b82f6] p-3 text-white text-center flex flex-col justify-center min-w-[110px] shadow-sm rounded-full">
              <span className="font-bold text-lg">50 <span className="text-sm">kW</span></span>
              <span className="text-xs">Maximum Load</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <LoadProfileChart />
        </div>
      </Card>

      <Card className="p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">PV Design</h2>
        <div className="space-y-4">
          <PVProductionChart />
        </div>
      </Card>
    </div>;
};
export default AnalysisOverview;

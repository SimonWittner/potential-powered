
import { Card } from "@/components/ui/card";
import LoadProfileChart from "@/components/results/LoadProfileChart";
import PVProductionChart from "@/components/results/PVProductionChart";

const AnalysisOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Load Profile Analysis</h2>
          <div className="flex space-x-4">
            <div className="bg-[#3b82f6] rounded-lg p-3 text-white text-center flex flex-col justify-center min-w-[110px] shadow-sm">
              <span className="font-bold text-lg">100 MWh</span>
              <span className="text-xs">Load/Year</span>
            </div>
            <div className="bg-[#3b82f6] rounded-lg p-3 text-white text-center flex flex-col justify-center min-w-[110px] shadow-sm">
              <span className="font-bold text-lg">50 kW</span>
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
    </div>
  );
};

export default AnalysisOverview;

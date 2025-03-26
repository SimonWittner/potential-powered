
import { Card } from "@/components/ui/card";
import LoadProfileChart from "@/components/results/LoadProfileChart";
import PVProductionChart from "@/components/results/PVProductionChart";

const AnalysisOverview = () => {
  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="p-6 bg-white shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Load Profile Analysis</h2>
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

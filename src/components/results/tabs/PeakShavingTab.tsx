
import PeakShavingBatteryCard from "@/components/results/PeakShavingBatteryCard";
import PeakShavingComparisonCard from "@/components/results/PeakShavingComparisonCard";
import PeakShavingCostCard from "@/components/results/PeakShavingCostCard";
import { Card } from "@/components/ui/card";

const PeakShavingTab = () => {
  return (
    <Card className="rounded-tl-none rounded-tr-none p-8 bg-white/95 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-8">
        <PeakShavingBatteryCard />
        <PeakShavingComparisonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PeakShavingCostCard />
        </div>
      </div>
    </Card>
  );
};

export default PeakShavingTab;


import SelfConsumptionBatteryCard from "@/components/results/SelfConsumptionBatteryCard";
import SelfConsumptionComparisonCard from "@/components/results/SelfConsumptionComparisonCard";
import SelfConsumptionCostCard from "@/components/results/SelfConsumptionCostCard";
import { Card } from "@/components/ui/card";

const SelfConsumptionTab = () => {
  return (
    <Card className="rounded-tl-none rounded-tr-none p-8 bg-white/95 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-8">
        <SelfConsumptionBatteryCard />
        <SelfConsumptionComparisonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SelfConsumptionCostCard />
        </div>
      </div>
    </Card>
  );
};

export default SelfConsumptionTab;

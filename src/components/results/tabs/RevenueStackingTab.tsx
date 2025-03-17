
import BatteryDesignCard from "@/components/results/BatteryDesignCard";
import ComparisonCard from "@/components/results/ComparisonCard";
import CostsCard from "@/components/results/CostsCard";
import ESGReportingCard from "@/components/results/ESGReportingCard";
import { Card } from "@/components/ui/card";

const RevenueStackingTab = () => {
  return (
    <Card className="rounded-tl-none rounded-tr-none p-8 bg-white/95 backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-8">
        <BatteryDesignCard />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ComparisonCard />
          <CostsCard />
          <ESGReportingCard />
        </div>
      </div>
    </Card>
  );
};

export default RevenueStackingTab;

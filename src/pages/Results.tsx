import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import LoadProfileChart from "@/components/results/LoadProfileChart";
import PVProductionChart from "@/components/results/PVProductionChart";
import BatteryDesignCard from "@/components/results/BatteryDesignCard";
import ComparisonCard from "@/components/results/ComparisonCard";
import CostsCard from "@/components/results/CostsCard";
import ESGReportingCard from "@/components/results/ESGReportingCard";
import EconomicCalculationsCard from "@/components/results/EconomicCalculationsCard";

const Results = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);

  useEffect(() => {
    // Set analysisComplete to true after a short delay to ensure plots are ready
    const timer = setTimeout(() => {
      setAnalysisComplete(true);
    }, 2000); // Adjust this delay based on your analysis duration

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <LoadProfileChart analysisComplete={analysisComplete} />
          </Card>
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <PVProductionChart />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <BatteryDesignCard />
          </Card>
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <ComparisonCard />
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <CostsCard />
          </Card>
          <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
            <ESGReportingCard />
          </Card>
        </div>

        <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm">
          <EconomicCalculationsCard />
        </Card>
      </div>
    </div>
  );
};

export default Results;
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import LoadProfileChart from "@/components/results/LoadProfileChart"
import PVProductionChart from "@/components/results/PVProductionChart"
import BatteryDesignCard from "@/components/results/BatteryDesignCard"
import EconomicCalculationsCard from "@/components/results/EconomicCalculationsCard"
import ComparisonCard from "@/components/results/ComparisonCard"
import CostsCard from "@/components/results/CostsCard"
import ESGReportingCard from "@/components/results/ESGReportingCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const Results = () => {
  const navigate = useNavigate();
  const randomMetrics = {
    peakDemand: (Math.random() * 100 + 50).toFixed(2),
    highTariffCoverage: (Math.random() * 30 + 40).toFixed(2),
    lowTariffCoverage: (Math.random() * 20 + 60).toFixed(2),
    yield: (Math.random() * 1000 + 800).toFixed(2),
    selfConsumption: (Math.random() * 40 + 30).toFixed(2),
  };

  const handleExport = () => {
    console.log("Exporting analysis...");
  };

  return (
    <>
      <Header
        title="Analysis Results"
        showBackButton={true}
      />
      <div className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mb-4 text-white hover:text-white/80"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Analysis Results</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Load Profile Analysis</h2>
              <div className="space-y-4">
                <p>Peak Demand: {randomMetrics.peakDemand} kW</p>
                <p>High Tariff Coverage: {randomMetrics.highTariffCoverage}%</p>
                <p>Low Tariff Coverage: {randomMetrics.lowTariffCoverage}%</p>
                <LoadProfileChart />
              </div>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">PV Design</h2>
              <div className="space-y-4">
                <p>Specific Yield: {randomMetrics.yield} kWh/kWp</p>
                <p>Self-consumption Rate: {randomMetrics.selfConsumption}%</p>
                <PVProductionChart />
              </div>
            </Card>

            <BatteryDesignCard />
            <ComparisonCard />
            <CostsCard />
            <ESGReportingCard />
          </div>

          <div className="w-full">
            <EconomicCalculationsCard />
          </div>

          <div className="flex justify-center mt-8 pb-32">
            <Button 
              variant="secondary"
              size="lg"
              onClick={handleExport}
              className="w-48"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Results;

import { useNavigate } from "react-router-dom";
import LoadProfileChart from "@/components/results/LoadProfileChart"
import PVProductionChart from "@/components/results/PVProductionChart"
import BatteryDesignCard from "@/components/results/BatteryDesignCard"
import EconomicCalculationsCard from "@/components/results/EconomicCalculationsCard"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

const Results = () => {
  const navigate = useNavigate();
  const randomMetrics = {
    peakDemand: (Math.random() * 100 + 50).toFixed(2),
    highTariffCoverage: (Math.random() * 30 + 40).toFixed(2),
    lowTariffCoverage: (Math.random() * 20 + 60).toFixed(2),
    yield: (Math.random() * 1000 + 800).toFixed(2),
    selfConsumption: (Math.random() * 40 + 30).toFixed(2),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Analysis Results</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Load Profile Analysis</h2>
            <div className="space-y-4">
              <p>Peak Demand: {randomMetrics.peakDemand} kW</p>
              <p>High Tariff Coverage: {randomMetrics.highTariffCoverage}%</p>
              <p>Low Tariff Coverage: {randomMetrics.lowTariffCoverage}%</p>
              <LoadProfileChart />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">PV Design</h2>
            <div className="space-y-4">
              <p>Specific Yield: {randomMetrics.yield} kWh/kWp</p>
              <p>Self-consumption Rate: {randomMetrics.selfConsumption}%</p>
              <PVProductionChart />
            </div>
          </Card>

          <BatteryDesignCard />
          <EconomicCalculationsCard />
        </div>
      </div>
    </div>
  );
};

export default Results;
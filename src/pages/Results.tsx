import { Card } from "@/components/ui/card"
import LoadProfileChart from "@/components/results/LoadProfileChart"
import PVProductionChart from "@/components/results/PVProductionChart"

const Results = () => {
  const randomMetrics = {
    peakDemand: (Math.random() * 100 + 50).toFixed(2),
    yield: (Math.random() * 1000 + 800).toFixed(2),
    selfConsumption: (Math.random() * 40 + 30).toFixed(2),
    batterySize: Math.floor(Math.random() * 20 + 5),
    paybackPeriod: (Math.random() * 5 + 5).toFixed(1),
    roi: (Math.random() * 10 + 8).toFixed(2),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Analysis Results</h1>
          <p className="text-lg text-gray-600">Here's what we found based on your data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Load Profile Analysis</h2>
            <div className="space-y-4">
              <p>Peak Demand: {randomMetrics.peakDemand} kW</p>
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

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Battery Design</h2>
            <div className="space-y-4">
              <p>Recommended Battery Size: {randomMetrics.batterySize} kWh</p>
              <p>Additional Self-consumption: +{(Math.random() * 20 + 10).toFixed(1)}%</p>
              <p>Estimated Full Cycles per Year: {Math.floor(Math.random() * 200 + 100)}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Economic Calculations</h2>
            <div className="space-y-4">
              <p>Payback Period: {randomMetrics.paybackPeriod} years</p>
              <p>Return on Investment: {randomMetrics.roi}%</p>
              <p>LCOE: {(Math.random() * 0.1 + 0.08).toFixed(3)} €/kWh</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
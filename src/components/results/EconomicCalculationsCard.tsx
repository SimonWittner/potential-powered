import { Card } from "@/components/ui/card";

const EconomicCalculationsCard = () => {
  const randomMetrics = {
    // PV metrics
    roi: (Math.random() * 10 + 8).toFixed(2),
    lcoe: (Math.random() * 0.1 + 0.08).toFixed(3),
    annualYield: Math.floor(Math.random() * 5000 + 8000),
    // Battery metrics
    paybackPeriod: (Math.random() * 5 + 5).toFixed(1),
    roe: (Math.random() * 8 + 12).toFixed(2),
  };

  const getValueStyle = (level: "High" | "Medium" | "Low") => {
    return {
      High: "bg-green-200 text-green-800",
      Medium: "bg-yellow-200 text-yellow-800",
      Low: "bg-red-200 text-red-800",
    }[level];
  };

  const MetricRow = ({ label, value, level }: { label: string; value: string | number; level: "High" | "Medium" | "Low" }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium px-3 py-1 rounded-full text-sm ${getValueStyle(level)}`}>
        {value}
      </span>
    </div>
  );

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Economics</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">PV</h3>
          <div className="space-y-2">
            <MetricRow 
              label="Return on Investment (ROI)" 
              value={`${randomMetrics.roi}%`}
              level="Medium"
            />
            <MetricRow 
              label="LCOE" 
              value={`${randomMetrics.lcoe} €/kWh`}
              level="Low"
            />
            <MetricRow 
              label="Annual Yield" 
              value={`${randomMetrics.annualYield} kWh`}
              level="Medium"
            />
            <MetricRow 
              label="Payback Period" 
              value={`${randomMetrics.paybackPeriod} years`}
              level="High"
            />
            <MetricRow 
              label="Return on Equity (ROE)" 
              value={`${randomMetrics.roe}%`}
              level="Medium"
            />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Battery</h3>
          <div className="space-y-2">
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default EconomicCalculationsCard;
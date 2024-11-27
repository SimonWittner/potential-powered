import { Card } from "@/components/ui/card"

const EconomicCalculationsCard = () => {
  const randomMetrics = {
    paybackPeriod: (Math.random() * 5 + 5).toFixed(1),
    roe: (Math.random() * 8 + 12).toFixed(2),
    roi: (Math.random() * 10 + 8).toFixed(2),
    lcoe: (Math.random() * 0.1 + 0.08).toFixed(3),
    annualYield: Math.floor(Math.random() * 5000 + 8000),
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Economic Calculations</h2>
      <div className="space-y-4">
        <p>Payback Period: {randomMetrics.paybackPeriod} years</p>
        <p>Return on Equity (ROE): {randomMetrics.roe}%</p>
        <p>Return on Investment (ROI): {randomMetrics.roi}%</p>
        <p>LCOE: {randomMetrics.lcoe} €/kWh</p>
        <p>Annual Yield: {randomMetrics.annualYield} kWh</p>
      </div>
    </Card>
  );
};

export default EconomicCalculationsCard;
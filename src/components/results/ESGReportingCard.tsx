import { Card } from "@/components/ui/card"

const ESGReportingCard = () => {
  const esgMetrics = {
    environmental: {
      co2Reduction: (Math.random() * 5000 + 3000).toFixed(2),
      treeEquivalent: Math.floor(Math.random() * 200 + 100),
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">ESG Reporting</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Environmental Impact</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>CO₂ Reduction</span>
              <span className="font-medium">{esgMetrics.environmental.co2Reduction} kg/year</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Equivalent Trees Planted</span>
              <span className="font-medium">{esgMetrics.environmental.treeEquivalent} trees</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ESGReportingCard;
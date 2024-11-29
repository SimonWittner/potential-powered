import { Card } from "@/components/ui/card"

const ESGReportingCard = () => {
  const esgMetrics = {
    environmental: {
      co2Reduction: (Math.random() * 5000 + 3000).toFixed(2),
      treeEquivalent: Math.floor(Math.random() * 200 + 100),
      waterSaved: (Math.random() * 1000 + 500).toFixed(2)
    },
    social: {
      jobsCreated: Math.floor(Math.random() * 5 + 2),
      communityBenefit: (Math.random() * 10000 + 5000).toFixed(2)
    },
    governance: {
      complianceScore: Math.floor(Math.random() * 20 + 80),
      transparencyRating: ['A', 'A-', 'B+', 'B'][Math.floor(Math.random() * 4)]
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
            <div className="flex justify-between items-center">
              <span>Water Resources Saved</span>
              <span className="font-medium">{esgMetrics.environmental.waterSaved} L/year</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Social Impact</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Local Jobs Created</span>
              <span className="font-medium">{esgMetrics.social.jobsCreated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Community Economic Benefit</span>
              <span className="font-medium">{esgMetrics.social.communityBenefit} €/year</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Governance</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Compliance Score</span>
              <span className="font-medium">{esgMetrics.governance.complianceScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Transparency Rating</span>
              <span className="font-medium">{esgMetrics.governance.transparencyRating}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ESGReportingCard;
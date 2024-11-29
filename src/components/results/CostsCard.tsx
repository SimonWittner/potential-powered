import { Card } from "@/components/ui/card"

const CostsCard = () => {
  const costs = {
    initialInvestment: {
      pv: (Math.random() * 20000 + 10000).toFixed(2),
      battery: (Math.random() * 15000 + 8000).toFixed(2),
      installation: (Math.random() * 5000 + 2000).toFixed(2)
    },
    operationalCosts: {
      maintenance: (Math.random() * 500 + 200).toFixed(2),
      insurance: (Math.random() * 300 + 100).toFixed(2)
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Costs</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Initial Investment</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>PV System</span>
              <span className="font-medium">{costs.initialInvestment.pv} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Battery System</span>
              <span className="font-medium">{costs.initialInvestment.battery} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Installation</span>
              <span className="font-medium">{costs.initialInvestment.installation} €</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Annual Operational Costs</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Maintenance</span>
              <span className="font-medium">{costs.operationalCosts.maintenance} €/year</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Insurance</span>
              <span className="font-medium">{costs.operationalCosts.insurance} €/year</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CostsCard;
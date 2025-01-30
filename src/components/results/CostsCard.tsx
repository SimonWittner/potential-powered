import { Card } from "@/components/ui/card"

const CostsCard = () => {
  const costs = {
    initialInvestment: {
      total: (Math.random() * 40000 + 20000).toFixed(2),
      battery: (Math.random() * 15000 + 8000).toFixed(2),
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Costs</h2>
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3">Initial Investment</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Total</span>
              <span className="font-medium">{costs.initialInvestment.total} €</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Battery System</span>
              <span className="font-medium">{costs.initialInvestment.battery} €</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CostsCard;
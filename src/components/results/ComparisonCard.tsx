import { Card } from "@/components/ui/card";

const ComparisonCard = () => {
  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Load Profile - Exemplary Week</h3>
          <div className="w-full overflow-hidden bg-white rounded-lg p-6">
            <img 
              src="/lovable-uploads/d4cb65d7-45ff-43cb-b489-6b46338d2cb2.png" 
              alt="Load Profile - Exemplary Week" 
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;
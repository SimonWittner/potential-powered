import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

const ComparisonCard = () => {
  const [plotUrl, setPlotUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-plot');
        if (!response.ok) {
          console.error('Failed to fetch plot');
          return;
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPlotUrl(url);
      } catch (error) {
        console.error('Error fetching plot:', error);
      }
    };

    fetchPlot();

    // Cleanup function to revoke the object URL
    return () => {
      if (plotUrl) {
        URL.revokeObjectURL(plotUrl);
      }
    };
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-4">
        {plotUrl && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Load Profile - Exemplary Week</h3>
            <img 
              src={plotUrl} 
              alt="Load profile exemplary week plot" 
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default ComparisonCard;
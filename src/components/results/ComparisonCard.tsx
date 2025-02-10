import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";

const ComparisonCard = () => {
  const [comparisonLoadPlot, setComparisonLoadPlot] = useState<string | null>(null);
  const [newPeakLoadPlot, setNewPeakLoadPlot] = useState<string | null>(null);

  useEffect(() => {
    console.log("Starting 45s delay for comparison load plot fetch");
    const comparisonLoadTimer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/get-plot?name=comparison_load.png`);
        if (!response.ok) throw new Error('Failed to fetch comparison load plot');
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log("Successfully fetched comparison load plot");
        setComparisonLoadPlot(imageUrl);
      } catch (error) {
        console.error("Error fetching comparison load plot:", error);
      }
    }, 10000);

    console.log("Starting 45s delay for new peak load plot fetch");
    const newPeakLoadTimer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/get-plot?name=new_peak_load.png`);
        if (!response.ok) throw new Error('Failed to fetch new peak load plot');
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        console.log("Successfully fetched new peak load plot");
        setNewPeakLoadPlot(imageUrl);
      } catch (error) {
        console.error("Error fetching new peak load plot:", error);
      }
    }, 15000);

    return () => {
      clearTimeout(comparisonLoadTimer);
      clearTimeout(newPeakLoadTimer);
    };
  }, []);

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-6">
        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
          {comparisonLoadPlot ? (
            <img 
              src={comparisonLoadPlot} 
              alt="Load Profile Comparison" 
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading comparison plot...</p>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">New Peak Load</h3>
          {newPeakLoadPlot ? (
            <img 
              src={newPeakLoadPlot} 
              alt="New Peak Load" 
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center">
              <p className="text-gray-500">Loading peak load plot...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;

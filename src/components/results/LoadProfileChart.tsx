import { useEffect, useState } from "react";

const LoadProfileChart = () => {
  const [plotUrl, setPlotUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const response = await fetch('http://localhost:3001/get-plot?name=average_daily_load.png');
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
    <div className="space-y-8">
      {plotUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Average Daily Load Profile</h3>
          <img 
            src={plotUrl} 
            alt="Average daily load profile plot" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default LoadProfileChart;
import { useEffect, useState } from "react";

interface LoadProfileChartProps {
  analysisComplete?: boolean;
}

const LoadProfileChart = ({ analysisComplete = false }: LoadProfileChartProps) => {
  const [dailyPlotUrl, setDailyPlotUrl] = useState<string | null>(null);
  const [weeklyPlotUrl, setWeeklyPlotUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        console.log('Fetching plots after analysis completion');
        
        // Fetch daily plot
        const dailyResponse = await fetch('http://localhost:3001/get-plot?name=average_daily_load.png');
        if (!dailyResponse.ok) {
          console.error('Failed to fetch daily plot');
          return;
        }
        const dailyBlob = await dailyResponse.blob();
        const dailyUrl = URL.createObjectURL(dailyBlob);
        setDailyPlotUrl(dailyUrl);

        // Fetch weekly plot
        const weeklyResponse = await fetch('http://localhost:3001/get-plot?name=average_weekly_load.png');
        if (!weeklyResponse.ok) {
          console.error('Failed to fetch weekly plot');
          return;
        }
        const weeklyBlob = await weeklyResponse.blob();
        const weeklyUrl = URL.createObjectURL(weeklyBlob);
        setWeeklyPlotUrl(weeklyUrl);
      } catch (error) {
        console.error('Error fetching plots:', error);
      }
    };

    if (analysisComplete) {
      fetchPlots();
    }

    // Cleanup function to revoke the object URLs
    return () => {
      if (dailyPlotUrl) {
        URL.revokeObjectURL(dailyPlotUrl);
      }
      if (weeklyPlotUrl) {
        URL.revokeObjectURL(weeklyPlotUrl);
      }
    };
  }, [analysisComplete]);

  return (
    <div className="space-y-8">
      {dailyPlotUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Average Daily Load Profile</h3>
          <img 
            src={dailyPlotUrl} 
            alt="Average daily load profile plot" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}
      {weeklyPlotUrl && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Average Weekly Load Profile</h3>
          <img 
            src={weeklyPlotUrl} 
            alt="Average weekly load profile plot" 
            className="w-full rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default LoadProfileChart;
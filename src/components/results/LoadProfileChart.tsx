import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { API_URL } from "@/config/api";

const generateLoadProfileData = () => {
  return [
    { hour: "00:00", demand: 13 },
    { hour: "02:00", demand: 14 },
    { hour: "04:00", demand: 15 },
    { hour: "06:00", demand: 22 },
    { hour: "08:00", demand: 50 },
    { hour: "10:00", demand: 52 },
    { hour: "12:00", demand: 50 },
    { hour: "14:00", demand: 38 },
    { hour: "16:00", demand: 45 },
    { hour: "18:00", demand: 25 },
    { hour: "20:00", demand: 18 },
    { hour: "22:00", demand: 13 }
  ];
};

const LoadProfileChart = () => {
  const loadData = generateLoadProfileData();
  const [plotImageUrl, setPlotImageUrl] = useState<string | null>(null);
  const [weeklyPlotImageUrl, setWeeklyPlotImageUrl] = useState<string | null>(null);
  const [peakLoadPlotImageUrl, setPeakLoadPlotImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedImageUrl = localStorage.getItem('plotImageUrl');
    if (storedImageUrl) {
      setPlotImageUrl(storedImageUrl);
    }

    // Fetch weekly load plot after 10 seconds
    const weeklyTimer = setTimeout(() => {
      fetch(`${API_URL}/get-plot?name=weekly_load.png`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setWeeklyPlotImageUrl(url);
          localStorage.setItem('weeklyPlotImageUrl', url);
        })
        .catch(error => console.error('Error fetching weekly load plot:', error));
    }, 20000);

    // Fetch peak load plot
    const peakLoadTimer = setTimeout(() => {
      fetch(`${API_URL}/get-plot?name=peak_load.png`)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          setPeakLoadPlotImageUrl(url);
          localStorage.setItem('peakLoadPlotImageUrl', url);
        })
        .catch(error => console.error('Error fetching peak load plot:', error));
    }, 10000); 

    return () => {
      clearTimeout(weeklyTimer);
      clearTimeout(peakLoadTimer);
      if (plotImageUrl) URL.revokeObjectURL(plotImageUrl);
      if (weeklyPlotImageUrl) URL.revokeObjectURL(weeklyPlotImageUrl);
      if (peakLoadPlotImageUrl) URL.revokeObjectURL(peakLoadPlotImageUrl);
    };
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Average Daily Load</h3>
          {plotImageUrl ? (
            <div className="h-[150px] w-full flex items-center justify-center">
              <img 
                src={plotImageUrl} 
                alt="Load Profile Analysis" 
                className="max-h-full w-auto"
              />
            </div>
          ) : (
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="hour" 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#666"
                    tick={{ fill: '#666', fontSize: 12 }}
                    label={{ 
                      value: 'kW', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#666' }
                    }}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="demand" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Average Load</h3>
          <div className="h-[150px] w-full flex items-center justify-center">
            {weeklyPlotImageUrl ? (
              <img 
                src={weeklyPlotImageUrl} 
                alt="Weekly Load Analysis" 
                className="max-h-full w-auto"
              />
            ) : (
              <div className="text-gray-500">Loading weekly load data...</div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Peak Load</h3>
          <div className="h-[150px] w-full flex items-center justify-center">
            {peakLoadPlotImageUrl ? (
              <img 
                src={peakLoadPlotImageUrl} 
                alt="Peak Load Analysis" 
                className="max-h-full w-auto"
              />
            ) : (
              <div className="text-gray-500">Loading peak load data...</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Additional Analysis</h3>
          <div className="h-[150px] w-full flex items-center justify-center">
            <div className="text-gray-500">Coming soon...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadProfileChart;

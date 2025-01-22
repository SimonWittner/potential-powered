import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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

const generateCostData = () => {
  return [
    { hour: "Januar", cost: 9779 },
    { hour: "Februar", cost: 10486 },
    { hour: "März", cost: 10732 },
    { hour: "April", cost: 7290 },
    { hour: "Mai", cost: 7116 },
    { hour: "Juni", cost: 6050 },
    { hour: "Juli", cost: 9514 },
    { hour: "August", cost: 12556 },
    { hour: "September", cost: 9043 },
    { hour: "Oktober", cost: 7504 },
    { hour: "November", cost: 6395 },
    { hour: "Dezember", cost: 7656 }
  ];
};

const LoadProfileChart = () => {
  const loadData = generateLoadProfileData();
  const costData = generateCostData();
  const [plotImageUrl, setPlotImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedImageUrl = localStorage.getItem('plotImageUrl');
    if (storedImageUrl) {
      setPlotImageUrl(storedImageUrl);
    }

    // Cleanup
    return () => {
      if (plotImageUrl) {
        URL.revokeObjectURL(plotImageUrl);
      }
    };
  }, []);

  return (
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
        <h3 className="text-lg font-semibold mb-4">Cost Allocation</h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={costData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="hour" 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
              />
              <YAxis 
                stroke="#666"
                tick={{ fill: '#666', fontSize: 12 }}
                label={{ 
                  value: 'EUR', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#fda4af"
                fill="#fecdd3" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LoadProfileChart;
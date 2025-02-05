
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

const generateMonthlyData = (pvSize: number) => {
  const baseValues = [
    { month: "Januar", baseProduction: 1779 },
    { month: "Februar", baseProduction: 2486 },
    { month: "März", baseProduction: 4732 },
    { month: "April", baseProduction: 5290 },
    { month: "Mai", baseProduction: 6116 },
    { month: "Juni", baseProduction: 6550 },
    { month: "Juli", baseProduction: 6514 },
    { month: "August", baseProduction: 5556 },
    { month: "September", baseProduction: 4043 },
    { month: "Oktober", baseProduction: 2504 },
    { month: "November", baseProduction: 1395 },
    { month: "Dezember", baseProduction: 1156 }
  ];

  // Scale the production values based on PV size
  return baseValues.map(item => ({
    month: item.month,
    production: (item.baseProduction * pvSize) / 100 // Assuming base values are for 100kWp
  }));
};

const generateDailyData = (pvSize: number) => {
  const data = [];
  for (let hour = 0; hour <= 23; hour++) {
    let baseProduction = 0;
    
    // Night hours (0-5 and 20-23)
    if (hour <= 5 || hour >= 20) {
      baseProduction = 12;
    }
    // Morning ramp up (6-8)
    else if (hour >= 6 && hour <= 8) {
      baseProduction = 12 + ((hour - 6) * 13);
    }
    // Peak hours (9-16)
    else if (hour >= 9 && hour <= 16) {
      baseProduction = 51;
    }
    // Evening ramp down (17-19)
    else if (hour >= 17 && hour <= 19) {
      baseProduction = 51 - ((hour - 16) * 13);
    }

    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      production: (baseProduction * pvSize) / 100 // Scale based on PV size
    });
  }
  return data;
};

const PVProductionChart = () => {
  const [pvSize, setPvSize] = useState<number>(0);

  useEffect(() => {
    // Add console.log to debug localStorage values
    console.log('Reading from localStorage:', {
      pvPeak: localStorage.getItem('pvPeak'),
      hasExistingPV: localStorage.getItem('hasExistingPV')
    });

    const storedPvSize = localStorage.getItem('pvPeak');
    const hasExistingPV = localStorage.getItem('hasExistingPV');
    
    if (storedPvSize) {
      console.log('Setting PV size to:', parseFloat(storedPvSize));
      setPvSize(parseFloat(storedPvSize));
    } else {
      console.log('Setting PV size to 0');
      setPvSize(0);
    }
  }, []); // Empty dependency array means this runs once when component mounts

  const monthlyData = generateMonthlyData(pvSize);
  const dailyData = generateDailyData(pvSize);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-600 mb-2">PV System Size: {pvSize} kWp</p>
      </div>
      
      <div className="space-y-2 mt-12">
        <h3 className="text-lg font-medium mb-4">PV Generation Daily</h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
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
              <Line 
                type="monotone" 
                dataKey="production" 
                stroke="#2563eb" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-2 mt-12">
        <h3 className="text-lg font-medium mb-4">PV Generation Yearly</h3>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis 
                dataKey="month"
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
              <Line 
                type="monotone" 
                dataKey="production" 
                stroke="#2563eb" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PVProductionChart;

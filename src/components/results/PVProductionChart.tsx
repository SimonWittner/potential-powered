import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const generateMonthlyData = () => {
  return [
    { month: "Januar", production: 1779 },
    { month: "Februar", production: 2486 },
    { month: "März", production: 4732 },
    { month: "April", production: 5290 },
    { month: "Mai", production: 6116 },
    { month: "Juni", production: 6550 },
    { month: "Juli", production: 6514 },
    { month: "August", production: 5556 },
    { month: "September", production: 4043 },
    { month: "Oktober", production: 2504 },
    { month: "November", production: 1395 },
    { month: "Dezember", production: 1156 }
  ];
};

const generateDailyData = () => {
  const data = [];
  for (let hour = 0; hour <= 23; hour++) {
    let production = 0;
    
    // Night hours (0-5 and 20-23)
    if (hour <= 5 || hour >= 20) {
      production = 12;
    }
    // Morning ramp up (6-8)
    else if (hour >= 6 && hour <= 8) {
      production = 12 + ((hour - 6) * 13);
    }
    // Peak hours (9-16)
    else if (hour >= 9 && hour <= 16) {
      production = 51;
    }
    // Evening ramp down (17-19)
    else if (hour >= 17 && hour <= 19) {
      production = 51 - ((hour - 16) * 13);
    }

    data.push({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      production: production
    });
  }
  return data;
};

const PVProductionChart = () => {
  const monthlyData = generateMonthlyData();
  const dailyData = generateDailyData();

  return (
    <div className="space-y-6">
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
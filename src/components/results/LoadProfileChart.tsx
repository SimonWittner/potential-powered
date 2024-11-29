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
    { hour: "00:00", cost: 0.15 },
    { hour: "02:00", cost: 0.15 },
    { hour: "04:00", cost: 0.15 },
    { hour: "06:00", cost: 0.25 },
    { hour: "08:00", cost: 0.35 },
    { hour: "10:00", cost: 0.35 },
    { hour: "12:00", cost: 0.35 },
    { hour: "14:00", cost: 0.25 },
    { hour: "16:00", cost: 0.25 },
    { hour: "18:00", cost: 0.15 },
    { hour: "20:00", cost: 0.15 },
    { hour: "22:00", cost: 0.15 }
  ];
};

const LoadProfileChart = () => {
  const loadData = generateLoadProfileData();
  const costData = generateCostData();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Load Profile</h3>
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
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Cost Allocation</h3>
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
                  value: '€/kWh', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="cost" 
                stroke="#16a34a" 
                fill="#22c55e" 
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
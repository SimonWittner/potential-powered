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

const PVProductionChart = () => {
  const data = generateMonthlyData();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">PV Generation</h3>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="month"
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              label={{ 
                value: 'kWh', 
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
  );
};

export default PVProductionChart;
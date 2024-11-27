import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const generateRandomData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
    production: Math.random() * 1000 + 200,
  }));
};

const PVProductionChart = () => {
  const data = generateRandomData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="production" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PVProductionChart;
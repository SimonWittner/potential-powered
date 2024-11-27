import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const generateRandomData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    demand: Math.random() * 100 + 20,
  }));
};

const LoadProfileChart = () => {
  const data = generateRandomData();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="demand" stroke="#2563eb" fill="#3b82f6" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadProfileChart;
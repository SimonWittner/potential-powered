import { Card } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ComparisonCard = () => {
  const generateComparisonData = () => {
    return [
      { month: "Januar", loadProfile: 33, loadWithPV: 31, loadWithPVAndBattery: 29 },
      { month: "Februar", loadProfile: 28, loadWithPV: 26, loadWithPVAndBattery: 24 },
      { month: "März", loadProfile: 45, loadWithPV: 42, loadWithPVAndBattery: 39 },
      { month: "April", loadProfile: 27, loadWithPV: 25, loadWithPVAndBattery: 23 },
      { month: "Mai", loadProfile: 28, loadWithPV: 26, loadWithPVAndBattery: 24 },
      { month: "Juni", loadProfile: 16, loadWithPV: 15, loadWithPVAndBattery: 14 },
      { month: "Juli", loadProfile: 34, loadWithPV: 32, loadWithPVAndBattery: 30 },
      { month: "August", loadProfile: 28, loadWithPV: 26, loadWithPVAndBattery: 24 },
      { month: "September", loadProfile: 46, loadWithPV: 44, loadWithPVAndBattery: 42 },
      { month: "Oktober", loadProfile: 27, loadWithPV: 25, loadWithPVAndBattery: 23 },
      { month: "November", loadProfile: 28, loadWithPV: 26, loadWithPVAndBattery: 24 },
      { month: "Dezember", loadProfile: 18, loadWithPV: 17, loadWithPVAndBattery: 16 }
    ];
  };

  const data = generateComparisonData();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Load Average Week - Comparing Asset</h3>
        <div className="h-[300px] w-full">
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
                  value: 'kW', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="loadProfile" 
                name="Load Profile"
                stroke="#2563eb" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="loadWithPV" 
                name="Load with PV"
                stroke="#16a34a" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="loadWithPVAndBattery" 
                name="Load with PV & Battery"
                stroke="#dc2626" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;
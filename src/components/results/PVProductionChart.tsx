import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const generateMonthlyData = (pvSize: number) => {
  const baseValues = [
    { month: "Jan", baseProduction: 1779 },
    { month: "Feb", baseProduction: 2486 },
    { month: "March", baseProduction: 4732 },
    { month: "Apr", baseProduction: 5290 },
    { month: "Mai", baseProduction: 6116 },
    { month: "Juni", baseProduction: 6550 },
    { month: "July", baseProduction: 6514 },
    { month: "Aug", baseProduction: 5556 },
    { month: "Sep", baseProduction: 4643 },
    { month: "Oct", baseProduction: 2504 },
    { month: "Nov", baseProduction: 1395 },
    { month: "Dec", baseProduction: 1156 }
  ];

  return baseValues.map(item => ({
    month: item.month,
    production: (item.baseProduction * pvSize) / 100
  }));
};

const generateDailyData = (pvSize: number) => {
  const baseValues = [
    { hour: "00:00", baseProduction: 0 },
    { hour: "01:00", baseProduction: 0 },
    { hour: "02:00", baseProduction: 0 },
    { hour: "03:00", baseProduction: 0 },
    { hour: "04:00", baseProduction: 0 },
    { hour: "05:00", baseProduction: 3 },
    { hour: "06:00", baseProduction: 12 },
    { hour: "07:00", baseProduction: 25 },
    { hour: "08:00", baseProduction: 38 },
    { hour: "09:00", baseProduction: 43 },
    { hour: "10:00", baseProduction: 47 },
    { hour: "11:00", baseProduction: 51 },
    { hour: "12:00", baseProduction: 53 },
    { hour: "13:00", baseProduction: 52 },
    { hour: "14:00", baseProduction: 52 },
    { hour: "15:00", baseProduction: 49 },
    { hour: "16:00", baseProduction: 45 },
    { hour: "17:00", baseProduction: 38 },
    { hour: "18:00", baseProduction: 25 },
    { hour: "19:00", baseProduction: 12 },
    { hour: "20:00", baseProduction: 9 },
    { hour: "21:00", baseProduction: 5 },
    { hour: "22:00", baseProduction: 2 },
    { hour: "23:00", baseProduction: 0 }
  ];

  return baseValues.map(item => ({
    hour: item.hour,
    production: (item.baseProduction * pvSize) / 100
  }));
};

const PVProductionChart = () => {
  const [pvSize, setPvSize] = useState<number>(0);

  useEffect(() => {
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
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Average PV Generation Daily</CardTitle>
        </CardHeader>
        <CardContent>
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
                    value: 'PV [kW]', 
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
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Average PV Generation Yearly</CardTitle>
        </CardHeader>
        <CardContent>
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
                    value: 'PV [kW]', 
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
        </CardContent>
      </Card>
    </div>
  );
};

export default PVProductionChart;

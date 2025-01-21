import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [plotUrl, setPlotUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestAnalysis = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: analysis, error } = await supabase
          .from('load_profile_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !analysis) {
          console.error('Error fetching analysis:', error);
          return;
        }

        // Wait for 40 seconds before fetching the plot
        await new Promise(resolve => setTimeout(resolve, 40000));

        const plotName = `${analysis.file_path.split('.')[0]}_daily_load.png`;
        console.log('Fetching plot:', plotName);

        const response = await fetch(`http://localhost:3001/get-plot?name=${plotName}`);
        if (!response.ok) {
          console.error('Failed to fetch plot');
          return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPlotUrl(url);
      } catch (error) {
        console.error('Error in fetchLatestAnalysis:', error);
      }
    };

    fetchLatestAnalysis();

    return () => {
      if (plotUrl) {
        URL.revokeObjectURL(plotUrl);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Load Profile</h3>
        {plotUrl && (
          <div className="mb-6">
            <img 
              src={plotUrl} 
              alt="Daily load profile" 
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}
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
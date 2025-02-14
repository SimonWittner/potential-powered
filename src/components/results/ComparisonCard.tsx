
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ComparisonCard = () => {
  const analysisFileName = localStorage.getItem('analysisFileName');
  const fileId = analysisFileName?.replace(/\.[^/.]+$/, "");

  const fetchPlots = async () => {
    if (!fileId) throw new Error("No analysis file name found");

    const plots: { [key: string]: string } = {};

    // Fetch peak load plot
    const peakLoadName = `new_peak_load_${fileId}.png`;
    const { data: peakLoadExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: peakLoadName });

    if (peakLoadExists && peakLoadExists.length > 0) {
      const { data: peakLoadData } = await supabase
        .storage
        .from('analysis_results')
        .download(peakLoadName);
      
      if (peakLoadData) {
        plots.peakLoad = URL.createObjectURL(peakLoadData);
      }
    }

    // Fetch comparison load plot
    const comparisonName = `comparison_load_${fileId}.png`;
    const { data: comparisonExists } = await supabase
      .storage
      .from('analysis_results')
      .list('', { search: comparisonName });

    if (comparisonExists && comparisonExists.length > 0) {
      const { data: comparisonData } = await supabase
        .storage
        .from('analysis_results')
        .download(comparisonName);
      
      if (comparisonData) {
        plots.comparison = URL.createObjectURL(comparisonData);
      }
    }

    return plots;
  };

  const { data: plots, isLoading } = useQuery({
    queryKey: ['comparison-plots', fileId],
    queryFn: fetchPlots,
    staleTime: Infinity, // Keep the data fresh forever
    gcTime: Infinity, // Never delete from cache (previously cacheTime)
    enabled: !!fileId,
  });

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (plots) {
        Object.values(plots).forEach(url => URL.revokeObjectURL(url));
      }
    };
  }, [plots]);

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm col-span-2">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-6">
        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
          {plots?.comparison ? (
            <div className="w-full h-[400px]">
              <img 
                src={plots.comparison} 
                alt="Load Profile Comparison" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center">
              <p className="text-gray-500">Loading comparison plot...</p>
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">New Peak Load</h3>
          {plots?.peakLoad ? (
            <div className="w-full h-[400px]">
              <img 
                src={plots.peakLoad} 
                alt="New Peak Load" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center">
              <p className="text-gray-500">Loading peak load plot...</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ComparisonCard;

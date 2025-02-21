
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SelfConsumptionComparisonCard = () => {
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const analysisFileName = localStorage.getItem('analysisFileName');
    if (!analysisFileName) {
      console.error("No analysis file name found");
      return;
    }

    // Remove file extension from analysisFileName if it exists
    const fileId = analysisFileName.replace(/\.[^/.]+$/, "");

    const checkAndFetchPlots = async () => {
      try {
        // Check if heatmap exists
        const heatmapName = `evo_heatmap_${fileId}.png`;
        const profileName = `evo_profile_${fileId}.png`;

        const [heatmapExists, profileExists] = await Promise.all([
          supabase.storage.from('analysis_results').list('', { search: heatmapName }),
          supabase.storage.from('analysis_results').list('', { search: profileName })
        ]);

        if (heatmapExists.data?.length > 0 && profileExists.data?.length > 0) {
          const [heatmapData, profileData] = await Promise.all([
            supabase.storage.from('analysis_results').download(heatmapName),
            supabase.storage.from('analysis_results').download(profileName)
          ]);
          
          if (heatmapData.data && profileData.data) {
            const heatmapUrl = URL.createObjectURL(heatmapData.data);
            const profileUrl = URL.createObjectURL(profileData.data);
            console.log("Successfully fetched and created URLs for plots");
            setHeatmapImage(heatmapUrl);
            setProfileImage(profileUrl);
            setIsLoading(false);
            return true;
          }
        }
        return false;
      } catch (error) {
        console.error("Error fetching plots:", error);
        return false;
      }
    };

    // Initial check
    checkAndFetchPlots();

    // Set up polling interval to check for new files
    const interval = setInterval(checkAndFetchPlots, 5000); // Check every 5 seconds

    // Cleanup interval and object URLs on component unmount
    return () => {
      clearInterval(interval);
      if (heatmapImage) URL.revokeObjectURL(heatmapImage);
      if (profileImage) URL.revokeObjectURL(profileImage);
    };
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Comparison</h2>
      <div className="space-y-8">
        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Load Profile Comparison</h3>
          {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <p className="text-gray-500">Loading load profile comparison plot...</p>
            </div>
          ) : (
            <div className="w-full h-[500px]">
              {profileImage && (
                <img 
                  src={profileImage} 
                  alt="Load Profile Comparison" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
        </div>

        <div className="w-full overflow-hidden bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Investment Costs</h3>
          {isLoading ? (
            <div className="w-full h-[500px] flex items-center justify-center">
              <p className="text-gray-500">Loading investment costs plot...</p>
            </div>
          ) : (
            <div className="w-full h-[500px]">
              {heatmapImage && (
                <img 
                  src={heatmapImage} 
                  alt="Investment Costs Heatmap" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SelfConsumptionComparisonCard;

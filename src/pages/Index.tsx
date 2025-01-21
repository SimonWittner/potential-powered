import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ConsumptionForm from "@/components/form/ConsumptionForm";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import InterestsForm from "@/components/form/InterestsForm";
import AnalysisDialog from "@/components/AnalysisDialog";

// Define server URLs based on environment
const SERVER_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : 'https://api.lumera.ai'; // Replace with your production API URL

const Index = () => {
  const [step, setStep] = useState(1);
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const checkLocalServer = async () => {
    if (window.location.hostname === 'localhost') {
      try {
        const response = await fetch(`${SERVER_URL}/health`);
        return response.ok;
      } catch {
        return false;
      }
    }
    return false;
  };

  const handleElectricityPriceChange = (value: string) => {
    setShowElectricityPrice(value === "yes");
    if (value === "yes") {
      setShowLoadProfileUpload(true);
    }
  };

  const handleLoadProfileChange = (value: string) => {
    setShowLoadProfileUpload(value === "yes");
    if (value === "yes") {
      setShowYearlyConsumption(false);
    } else {
      setShowYearlyConsumption(true);
    }
  };

  const handleFileUpload = async (
    filePath: string,
    electricityPrice?: number,
    gridPowerCharges?: number
  ) => {
    setUploadedFilePath(filePath);
    
    if (electricityPrice !== undefined) {
      localStorage.setItem('electricityPrice', electricityPrice.toString());
    }
    if (gridPowerCharges !== undefined) {
      localStorage.setItem('gridPowerCharges', gridPowerCharges.toString());
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFilePath) {
      toast.error("Please upload a load profile first");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const isLocalServerAvailable = await checkLocalServer();
      let useLocalProcessing = false;

      if (isLocalServerAvailable) {
        useLocalProcessing = window.confirm(
          "Local processing server detected. Would you like to use it? " +
          "(This is faster but your data will be processed locally)"
        );
      }

      const { data: analysis, error: insertError } = await supabase
        .from('load_profile_analyses')
        .insert({
          user_id: user.id,
          file_path: uploadedFilePath,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError || !analysis) {
        throw insertError || new Error('Failed to create analysis');
      }

      // Wait for 40 seconds and fetch the plot
      await new Promise(resolve => setTimeout(resolve, 40000));

      try {
        const response = await fetch(`${SERVER_URL}/get-plot?name=daily_load.png`);
        if (!response.ok) {
          throw new Error('Failed to fetch plot');
        }
        const blob = await response.blob();
        const plotUrl = URL.createObjectURL(blob);
        localStorage.setItem('dailyLoadPlot', plotUrl);
      } catch (error) {
        console.error('Error fetching plot:', error);
        // Don't show error toast here as it's not critical
      }

      if (!useLocalProcessing) {
        const { error: updateError } = await supabase
          .from('load_profile_analyses')
          .update({ status: 'processing' })
          .eq('id', analysis.id);

        if (updateError) {
          throw updateError;
        }
      }

      navigate("/results");
    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error("Failed to start analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <div className="space-y-8">
            {step === 1 && (
              <div className="space-y-8">
                <CompanyInfoForm />
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>Next</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <ConsumptionForm
                  showElectricityPrice={showElectricityPrice}
                  showLoadProfileUpload={showLoadProfileUpload}
                  showYearlyConsumption={showYearlyConsumption}
                  onElectricityPriceChange={handleElectricityPriceChange}
                  onLoadProfileChange={handleLoadProfileChange}
                  onFileUpload={handleFileUpload}
                />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Next</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <InterestsForm />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button onClick={handleAnalyze}>Analyze</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <AnalysisDialog 
        open={isAnalyzing} 
        onOpenChange={setIsAnalyzing}
      />
    </div>
  );
};

export default Index;
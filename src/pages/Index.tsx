import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AnalysisDialog from "@/components/AnalysisDialog";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import InterestsForm from "@/components/form/InterestsForm";
import ConsumptionForm from "@/components/form/ConsumptionForm";
import { useNavigate } from "react-router-dom";

const LOCAL_SERVER_URL = 'http://localhost:3001';

const Index = () => {
  const navigate = useNavigate();
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [hasGridCapacity, setHasGridCapacity] = useState<string>("");
  const [gridCapacityAmount, setGridCapacityAmount] = useState<string>("");
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interests = [
    { id: "pv", label: "PV" },
    { id: "battery", label: "Battery" },
    { id: "evCharging", label: "EV Charging" },
    { id: "heatpump", label: "Heatpump" },
  ];

  const handleAddressChange = async (value: string) => {
    setAddress(value);
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
  };

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest]
    );
  };

  const handleElectricityPriceChange = (value: string) => {
    setShowElectricityPrice(value === "yes");
  };

  const handleLoadProfileChange = (value: string) => {
    setShowLoadProfileUpload(value === "yes");
    setShowYearlyConsumption(value === "no");
  };

  const checkLocalServer = async () => {
    try {
      console.log('Checking local server availability...');
      const response = await fetch(`${LOCAL_SERVER_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Local server response:', response.ok);
      return response.ok;
    } catch (error) {
      console.log('Local server not available:', error);
      return false;
    }
  };

  const downloadFileLocally = async (
    filePath: string, 
    electricityPrice?: number,
    gridPowerCharges?: number
  ) => {
    try {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('load_profiles')
        .download(filePath);

      if (downloadError) {
        throw downloadError;
      }

      const companyData = {
        companyName,
        address,
        electricityPrice,
        gridPowerCharges
      };

      const response = await fetch(`${LOCAL_SERVER_URL}/process-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: filePath,
          fileContent: await fileData.text(),
          companyData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process file locally');
      }

      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
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
      toast.error("Please upload a load profile file first");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to perform analysis");
        return;
      }

      const isLocalServerAvailable = await checkLocalServer();
      let useLocalProcessing = false;

      if (isLocalServerAvailable) {
        const electricityPrice = localStorage.getItem('electricityPrice');
        const gridPowerCharges = localStorage.getItem('gridPowerCharges');
        
        useLocalProcessing = await downloadFileLocally(
          uploadedFilePath,
          electricityPrice ? parseFloat(electricityPrice) : undefined,
          gridPowerCharges ? parseFloat(gridPowerCharges) : undefined
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
        const response = await fetch(`${LOCAL_SERVER_URL}/get-plot?name=daily_load.png`);
        if (!response.ok) {
          throw new Error('Failed to fetch plot');
        }
        const blob = await response.blob();
        const plotUrl = URL.createObjectURL(blob);
        localStorage.setItem('dailyLoadPlot', plotUrl);
      } catch (error) {
        console.error('Error fetching plot:', error);
        toast.error("Failed to fetch analysis plot");
      }

      if (!useLocalProcessing) {
        const { error: processError } = await supabase.functions
          .invoke('analyze-load-profile', {
            body: { analysisId: analysis.id }
          });

        if (processError) {
          throw processError;
        }
      }

      setShowAnalysisDialog(true);
      toast.success("Analysis completed successfully");
      navigate('/results');
    } catch (error) {
      console.error('Error processing analysis:', error);
      toast.error("Failed to process analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-4">
            Potential Analysis
          </h1>
          <p className="text-lg text-gray-300">
            Analyse your potential for a PV and/or a battery. Get results in less
            than 5 minutes.
          </p>
        </div>

        <Card className="p-6 space-y-8 shadow-lg bg-white/95 backdrop-blur-sm animate-fade-in mb-12">
          <div className="space-y-8">
            <CompanyInfoForm 
              address={address}
              onAddressChange={handleAddressChange}
              companyName={companyName}
              onCompanyNameChange={handleCompanyNameChange}
            />

            <InterestsForm
              interests={interests}
              selectedInterests={selectedInterests}
              onInterestChange={handleInterestChange}
            />

            <ConsumptionForm
              showElectricityPrice={showElectricityPrice}
              showLoadProfileUpload={showLoadProfileUpload}
              showYearlyConsumption={showYearlyConsumption}
              onElectricityPriceChange={handleElectricityPriceChange}
              onLoadProfileChange={handleLoadProfileChange}
              onFileUpload={handleFileUpload}
            />

            <Button 
              className="w-full" 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Analyse"}
            </Button>
          </div>
        </Card>

        <AnalysisDialog 
          open={showAnalysisDialog} 
          onOpenChange={setShowAnalysisDialog}
        />
      </div>
    </div>
  );
};

export default Index;
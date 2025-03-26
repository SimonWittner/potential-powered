import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AnalysisDialog from "@/components/AnalysisDialog";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import ConsumptionForm from "@/components/form/ConsumptionForm";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";

const Index = () => {
  const navigate = useNavigate();
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasExistingPV, setHasExistingPV] = useState("");
  const [pvSize, setPvSize] = useState("");

  useEffect(() => {
    const existingAnalysis = localStorage.getItem('analysisFileName');
    
    if (existingAnalysis) {
      navigate('/results');
    } else {
      clearAllCachedData();
    }
  }, [navigate]);

  const clearAllCachedData = () => {
    const cacheKeys = [
      'esgReportingData',
      'peakShavingCostData',
      'selfConsumptionCostData',
      'peakShavingBatteryData',
      'selfConsumptionBatteryData',
      'revenueCostsData',
      'revenueStackingBatteryData',
      'peakShavingProgress',
      'selfConsumptionProgress',
      'revenueStackingProgress',
      'peakShavingLoaded',
      'selfConsumptionLoaded',
      'revenueStackingLoaded',
      'resultsLoadingComplete'
    ];
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
    
    console.log('All cached data cleared');
  };

  const handleAddressChange = async (value: string) => {
    setAddress(value);
  };

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
  };

  const handleElectricityPriceChange = (value: string) => {
    setShowElectricityPrice(value === "yes");
  };

  const handleLoadProfileChange = (value: string) => {
    setShowLoadProfileUpload(value === "yes");
    setShowYearlyConsumption(value === "no");
  };

  const handleExistingPVChange = (value: string) => {
    setHasExistingPV(value);
  };

  const handlePVSizeChange = (value: string) => {
    setPvSize(value);
  };

  const checkLocalServer = async () => {
    try {
      console.log('Checking server availability...');
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response.ok);
      return response.ok;
    } catch (error) {
      console.log('Server not available:', error);
      return false;
    }
  };

  const downloadFileLocally = async (
    filePath: string,
    electricityPrice?: number,
    gridPowerCharges?: number,
    pvPeak?: number,
    loadsKwIsNet?: boolean
  ) => {
    try {
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('load_profiles')
        .download(filePath);

      if (downloadError) {
        throw downloadError;
      }

      const companyData = {
        companyName,
        address,
        ...electricityPrice !== undefined && { electricityPrice },
        ...gridPowerCharges !== undefined && { gridPowerCharges },
        ...pvPeak !== undefined && { pv_peak: pvPeak },
        ...loadsKwIsNet !== undefined && { loads_kw_is_net: loadsKwIsNet }
      };

      const response = await fetch(`${API_URL}/process-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName: filePath,
          fileContent: await fileData.text(),
          companyData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process file');
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
    gridPowerCharges?: number,
    pvPeak?: number,
    loadsKwIsNet?: boolean
  ) => {
    setUploadedFilePath(filePath);
    localStorage.setItem('analysisFileName', filePath);

    if (electricityPrice !== undefined) {
      localStorage.setItem('electricityPrice', electricityPrice.toString());
    } else {
      localStorage.removeItem('electricityPrice');
    }

    if (gridPowerCharges !== undefined) {
      localStorage.setItem('gridPowerCharges', gridPowerCharges.toString());
    } else {
      localStorage.removeItem('gridPowerCharges');
    }

    if (pvPeak !== undefined) {
      localStorage.setItem('pvPeak', pvPeak.toString());
    } else {
      localStorage.removeItem('pvPeak');
    }

    if (loadsKwIsNet !== undefined) {
      localStorage.setItem('loadsKwIsNet', loadsKwIsNet.toString());
    } else {
      localStorage.removeItem('loadsKwIsNet');
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFilePath) {
      toast.error("Please upload a load profile file first");
      return;
    }

    if (hasExistingPV === "yes") {
      const pvSizeValue = parseFloat(pvSize);
      if (!pvSize || isNaN(pvSizeValue) || pvSizeValue <= 0) {
        toast.error("Please enter a valid PV size greater than 0");
        return;
      }
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
        const pvPeak = localStorage.getItem('pvPeak');
        const loadsKwIsNet = localStorage.getItem('loadsKwIsNet');

        useLocalProcessing = await downloadFileLocally(
          uploadedFilePath,
          electricityPrice ? parseFloat(electricityPrice) : undefined,
          gridPowerCharges ? parseFloat(gridPowerCharges) : undefined,
          pvPeak ? parseFloat(pvPeak) : undefined,
          loadsKwIsNet ? loadsKwIsNet === 'true' : undefined
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

      if (!useLocalProcessing) {
        const { error: processError } = await supabase.functions.invoke('analyze-load-profile', {
          body: { analysisId: analysis.id }
        });

        if (processError) {
          throw processError;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 30000));
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
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-white/95">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-8 animate-fade-in">
          <CompanyInfoForm
            address={address}
            onAddressChange={handleAddressChange}
            companyName={companyName}
            onCompanyNameChange={handleCompanyNameChange}
          />

          <ConsumptionForm
            showElectricityPrice={showElectricityPrice}
            showLoadProfileUpload={showLoadProfileUpload}
            showYearlyConsumption={showYearlyConsumption}
            onElectricityPriceChange={handleElectricityPriceChange}
            onLoadProfileChange={handleLoadProfileChange}
            onFileUpload={handleFileUpload}
            onExistingPVChange={handleExistingPVChange}
            onPVSizeChange={handlePVSizeChange}
          />

          <Button
            className="w-full"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyse"}
          </Button>
        </div>

        <AnalysisDialog
          open={showAnalysisDialog}
          onOpenChange={setShowAnalysisDialog}
        />
      </div>
    </div>
  );
};

export default Index;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AnalysisDialog from "@/components/AnalysisDialog";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import ConsumptionForm from "@/components/form/ConsumptionForm";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import { Card, CardContent } from "@/components/ui/card";

interface FormData {
  electricityPrice?: number;
  gridPowerCharges?: number;
  pvPeak?: number;
  loadsKwIsNet?: boolean;
}

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
  const [formData, setFormData] = useState<FormData>({});

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

  const handleFormDataChange = (data: FormData) => {
    setFormData(prevData => {
      const newData = {...prevData, ...data};
      console.log("Updated form data:", newData);
      return newData;
    });
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
    formData: FormData
  ) => {
    try {
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('load_profiles')
        .download(filePath);

      if (downloadError) {
        throw downloadError;
      }

      console.log("Form data before sending to backend:", formData);
      
      const companyData = {
        companyName,
        address,
        ...formData.electricityPrice !== undefined && { 
          electricityPrice: formData.electricityPrice 
        },
        ...formData.gridPowerCharges !== undefined && { 
          gridPowerCharges: formData.gridPowerCharges 
        },
        ...formData.pvPeak !== undefined && { 
          pv_peak: formData.pvPeak 
        },
        ...formData.loadsKwIsNet !== undefined && { 
          loads_kw_is_net: formData.loadsKwIsNet 
        }
      };

      console.log("Sending data to backend:", companyData);

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

  const handleFileUpload = (filePath: string) => {
    setUploadedFilePath(filePath);
    localStorage.setItem('analysisFileName', filePath);
  };

  const saveFormDataToLocalStorage = (data: FormData) => {
    console.log("Saving to localStorage:");
    
    if (data.electricityPrice !== undefined) {
      console.log("- electricityPrice:", data.electricityPrice);
      localStorage.setItem('electricityPrice', String(data.electricityPrice));
    } else {
      localStorage.removeItem('electricityPrice');
    }

    if (data.gridPowerCharges !== undefined) {
      console.log("- gridPowerCharges:", data.gridPowerCharges);
      localStorage.setItem('gridPowerCharges', String(data.gridPowerCharges));
    } else {
      localStorage.removeItem('gridPowerCharges');
    }

    if (data.pvPeak !== undefined) {
      console.log("- pvPeak:", data.pvPeak);
      localStorage.setItem('pvPeak', String(data.pvPeak));
    } else {
      localStorage.removeItem('pvPeak');
    }

    if (data.loadsKwIsNet !== undefined) {
      console.log("- loadsKwIsNet:", data.loadsKwIsNet);
      localStorage.setItem('loadsKwIsNet', String(data.loadsKwIsNet));
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

      console.log("Form data before saving to localStorage:", formData);
      saveFormDataToLocalStorage(formData);

      const isLocalServerAvailable = await checkLocalServer();
      let useLocalProcessing = false;

      if (isLocalServerAvailable) {
        useLocalProcessing = await downloadFileLocally(uploadedFilePath, formData);
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
        console.log("Using edge function with form data:", formData);
        const { error: processError } = await supabase.functions.invoke('analyze-load-profile', {
          body: { 
            analysisId: analysis.id,
            formData: formData
          }
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
    <div className="min-h-screen pt-10 px-4 sm:px-6 lg:px-8 pb-12 bg-[#F1F1F1]">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 animate-fade-in">
          <Card className="rounded-xl shadow-md overflow-hidden bg-white">
            <CardContent className="p-8">
              <div className="space-y-8">
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
                  onFormDataChange={handleFormDataChange}
                />
              </div>
            </CardContent>
          </Card>

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

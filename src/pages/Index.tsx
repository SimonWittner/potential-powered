import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AnalysisDialog from "@/components/AnalysisDialog";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import InterestsForm from "@/components/form/InterestsForm";
import ConsumptionForm from "@/components/form/ConsumptionForm";
import { useNavigate } from "react-router-dom";

const LOCAL_SERVER_URL = 'http://localhost:3001'; // Update this to match your local server port

const Index = () => {
  const navigate = useNavigate();
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
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

  const handleFileUpload = (filePath: string) => {
    setUploadedFilePath(filePath);
  };

  const checkLocalServer = async () => {
    try {
      const response = await fetch(`${LOCAL_SERVER_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      console.log('Local server not available:', error);
      return false;
    }
  };

  const downloadFileLocally = async (filePath: string) => {
    try {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('load_profiles')
        .download(filePath);

      if (downloadError) {
        throw downloadError;
      }

      const response = await fetch(`${LOCAL_SERVER_URL}/process-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: filePath,
          fileContent: await fileData.text()
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

      // Check if local server is available
      const isLocalServerAvailable = await checkLocalServer();
      let useLocalProcessing = false;

      if (isLocalServerAvailable) {
        useLocalProcessing = await downloadFileLocally(uploadedFilePath);
      }

      // Create analysis record
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
        // Fall back to edge function if local processing failed
        const { data: processedData, error: processError } = await supabase.functions
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

            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-black">Do you know if you have available grid connection capacity?</Label>
                <RadioGroup
                  value={hasGridCapacity}
                  onValueChange={setHasGridCapacity}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="grid-yes" />
                    <Label htmlFor="grid-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="grid-no" />
                    <Label htmlFor="grid-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {hasGridCapacity === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="grid-capacity">How much (in kWh)?</Label>
                  <Input
                    id="grid-capacity"
                    type="number"
                    value={gridCapacityAmount}
                    onChange={(e) => setGridCapacityAmount(e.target.value)}
                    placeholder="Enter capacity in kWh"
                  />
                </div>
              )}
            </div>

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

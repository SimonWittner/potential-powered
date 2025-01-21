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

const Index = () => {
  const navigate = useNavigate();
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const interests = [
    { id: "pv", label: "PV" },
    { id: "battery", label: "Battery" },
    { id: "evCharging", label: "EV Charging" },
    { id: "heatpump", label: "Heatpump" },
  ];

  const handleAddressChange = (value: string) => {
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

  const handleFileUpload = async (filePath: string) => {
    setUploadedFilePath(filePath);
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
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnalysisDialog from "@/components/AnalysisDialog";
import CompanyInfoForm from "@/components/form/CompanyInfoForm";
import InterestsForm from "@/components/form/InterestsForm";
import ConsumptionForm from "@/components/form/ConsumptionForm";

const Index = () => {
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Potential Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Analyse your potential for a PV and/or a battery. Get results in less
            than 5 minutes.
          </p>
        </div>

        <Card className="p-6 space-y-8 shadow-lg bg-white animate-fade-in">
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
            />

            <Button 
              className="w-full" 
              onClick={() => setShowAnalysisDialog(true)}
            >
              Analyse
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
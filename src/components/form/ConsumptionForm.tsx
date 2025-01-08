import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"

interface ConsumptionFormProps {
  showElectricityPrice: boolean;
  showLoadProfileUpload: boolean;
  showYearlyConsumption: boolean;
  onElectricityPriceChange: (value: string) => void;
  onLoadProfileChange: (value: string) => void;
}

const ConsumptionForm = ({
  showElectricityPrice,
  showLoadProfileUpload,
  showYearlyConsumption,
  onElectricityPriceChange,
  onLoadProfileChange,
}: ConsumptionFormProps) => {
  const [isUploading, useState] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        e.target.value = "";
        return;
      }

      try {
        setIsUploading(true);
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('load_profiles')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        toast.success("File uploaded successfully");
        onLoadProfileChange(fileName);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Do you know your electricity price?</Label>
        <RadioGroup
          onValueChange={(value) => onElectricityPriceChange(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="price-yes" />
            <Label htmlFor="price-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="price-no" />
            <Label htmlFor="price-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {showElectricityPrice && (
        <div className="animate-fade-in">
          <Label htmlFor="electricityPrice">Electricity Price</Label>
          <Input
            id="electricityPrice"
            type="number"
            placeholder="Enter price in €/kWh"
            className="mt-1"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Do you know your load profile?</Label>
        <RadioGroup
          onValueChange={(value) => onLoadProfileChange(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="profile-yes" />
            <Label htmlFor="profile-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="profile-no" />
            <Label htmlFor="profile-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {showLoadProfileUpload && (
        <div className="animate-fade-in">
          <Label htmlFor="loadProfile">Upload Load Profile (CSV)</Label>
          <Input
            id="loadProfile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1"
            disabled={isUploading}
          />
        </div>
      )}

      {showYearlyConsumption && (
        <div className="animate-fade-in">
          <Label htmlFor="yearlyConsumption">
            Average Yearly Consumption
          </Label>
          <Input
            id="yearlyConsumption"
            type="number"
            placeholder="Enter consumption in kWh"
            className="mt-1"
          />
        </div>
      )}
    </div>
  );
};

export default ConsumptionForm;
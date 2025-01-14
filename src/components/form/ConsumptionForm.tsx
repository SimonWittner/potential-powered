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
  onElectricityPriceChange,
}: ConsumptionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('load_profiles')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      toast.success("File uploaded successfully");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
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
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loadProfile">Upload Load Profile</Label>
          <Input
            id="loadProfile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
            className="mt-1"
          />
          {isUploading && (
            <p className="text-sm text-muted-foreground">Uploading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumptionForm;
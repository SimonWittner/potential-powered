import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { uploadFileToBucket } from "../integrations/supabase/fileUpload"; // Adjust the path as needed

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
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (file.type !== "text/csv") {
    toast.error("Please upload a CSV file");
    e.target.value = ""; // Reset the input
    return;
  }

  // Upload the file to Supabase Storage
  const bucketName = "load-profiles"; // Ensure this matches your bucket name
  const filePath = await uploadFileToBucket(bucketName, file);

  if (filePath) {
    toast.success("File uploaded successfully");
    onLoadProfileChange(filePath); // Pass the file path to the parent component
  } else {
    toast.error("File upload failed. Please try again.");
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
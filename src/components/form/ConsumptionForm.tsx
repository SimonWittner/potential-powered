import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { Upload, X } from "lucide-react"

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
  const [dragActive, setDragActive] = useState(false);

  const validateCSVContent = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length !== 8760) {
          toast.error("File must contain exactly 8760 values (hourly data for one year)");
          resolve(false);
        } else {
          resolve(true);
        }
      };
      reader.readAsText(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    if (file.type !== "text/csv") {
      toast.error("Please upload a CSV file");
      return;
    }

    const isValid = await validateCSVContent(file);
    if (!isValid) return;

    setIsUploading(true);
    try {
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
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
    e.target.value = '';
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
          <div className="animate-fade-in space-y-4">
            <div>
              <Label htmlFor="electricityPrice">Electricity Price</Label>
              <Input
                id="electricityPrice"
                type="number"
                placeholder="Enter price in €/kWh"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="gridPowerCharges">Grid Power Charges</Label>
              <Input
                id="gridPowerCharges"
                type="number"
                placeholder="Enter price in €/kW/month"
                className="mt-1"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Load Profile Upload</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {isUploading ? (
              <div className="animate-pulse">Uploading...</div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop your CSV file here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  File must contain a single column with 8760 values in kW
                </p>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionForm;
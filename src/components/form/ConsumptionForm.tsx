
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import ExistingPvSection from "./ExistingPvSection"
import ElectricityPriceSection from "./ElectricityPriceSection"
import FileUploadSection from "./FileUploadSection"

interface ConsumptionFormProps {
  showElectricityPrice: boolean;
  showLoadProfileUpload: boolean;
  showYearlyConsumption: boolean;
  onElectricityPriceChange: (value: string) => void;
  onLoadProfileChange: (value: string) => void;
  onFileUpload: (filePath: string) => void;
  onExistingPVChange: (value: string) => void;
  onPVSizeChange: (value: string) => void;
  onElectricityPriceDataChange: (electricityPrice: string, gridPowerCharges: string) => void;
  onIncludesPVGenerationChange: (value: string) => void;
  electricityPrice: string;
  gridPowerCharges: string;
  hasExistingPV: string;
  pvSize: string;
  includesPVGeneration: string;
}

const ConsumptionForm = ({
  showElectricityPrice,
  onElectricityPriceChange,
  onFileUpload,
  onExistingPVChange,
  onPVSizeChange,
  onElectricityPriceDataChange,
  onIncludesPVGenerationChange,
  electricityPrice,
  gridPowerCharges,
  hasExistingPV,
  pvSize,
  includesPVGeneration
}: ConsumptionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<{ value: number }[]>([]);

  const validateCSVContent = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim() !== '');
        if (rows.length !== 8760) {
          toast.error("File must contain a single column with 8760 values in kW");
          resolve(false);
        } else {
          // Create preview data
          const values = rows.map(row => ({ value: parseFloat(row) }));
          setPreviewData(values);
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

      const { data, error: uploadError } = await supabase.storage
        .from('load_profiles')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      onFileUpload(fileName);
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    await handleFile(file);
  };

  const handleElectricityPriceChange = (value: string) => {
    onElectricityPriceDataChange(value, gridPowerCharges);
  };

  const handleGridPowerChargesChange = (value: string) => {
    onElectricityPriceDataChange(electricityPrice, value);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-8">
        <ExistingPvSection 
          onPvSizeChange={onPVSizeChange}
          onHasExistingPvChange={onExistingPVChange}
          onIncludesPvGenerationChange={onIncludesPVGenerationChange}
          hasExistingPV={hasExistingPV}
          pvSize={pvSize}
          includesPVGeneration={includesPVGeneration}
        />

        <ElectricityPriceSection
          showElectricityPrice={showElectricityPrice}
          onElectricityPriceChange={handleElectricityPriceChange}
          onGridPowerChargesChange={handleGridPowerChargesChange}
          onKnowsElectricityPriceChange={onElectricityPriceChange}
          electricityPrice={electricityPrice}
          gridPowerCharges={gridPowerCharges}
        />
      </div>

      <FileUploadSection 
        onFileUpload={handleFileUpload}
        previewData={previewData}
      />
    </div>
  );
};

export default ConsumptionForm;

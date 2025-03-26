
import { useState } from "react"
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
  onFileUpload: (filePath: string, electricityPrice?: number, gridPowerCharges?: number, pvPeak?: number, loadsKwIsNet?: boolean) => void;
  onExistingPVChange?: (value: string) => void;
  onPVSizeChange?: (value: string) => void;
}

const ConsumptionForm = ({
  showElectricityPrice,
  onElectricityPriceChange,
  onFileUpload,
  onExistingPVChange,
  onPVSizeChange,
}: ConsumptionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [electricityPrice, setElectricityPrice] = useState<string>("");
  const [gridPowerCharges, setGridPowerCharges] = useState<string>("");
  const [hasExistingPV, setHasExistingPV] = useState<string>("");
  const [pvSize, setPvSize] = useState<string>("");
  const [includesPVGeneration, setIncludesPVGeneration] = useState<string>("");
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

      const parsedElectricityPrice = electricityPrice ? parseFloat(electricityPrice) : undefined;
      const parsedGridPowerCharges = gridPowerCharges ? parseFloat(gridPowerCharges) : undefined;
      const parsedPvPeak = (hasExistingPV === "yes" && pvSize) 
        ? Number(pvSize.replace(',', '.'))
        : undefined;

      // Validate the result
      if (parsedPvPeak !== undefined && isNaN(parsedPvPeak)) {
        toast.error("Invalid PV size value");
        return;
      }

      const loadsKwIsNet = includesPVGeneration === "no" ? false : undefined;

      onFileUpload(fileName, parsedElectricityPrice, parsedGridPowerCharges, parsedPvPeak, loadsKwIsNet);
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

  const handleHasExistingPvChange = (value: string) => {
    setHasExistingPV(value);
    if (onExistingPVChange) {
      onExistingPVChange(value);
    }
  };

  const handlePvSizeChange = (value: string) => {
    setPvSize(value);
    if (onPVSizeChange) {
      onPVSizeChange(value);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <ExistingPvSection 
          onPvSizeChange={handlePvSizeChange}
          onHasExistingPvChange={handleHasExistingPvChange}
          onIncludesPvGenerationChange={setIncludesPVGeneration}
        />

        <ElectricityPriceSection
          showElectricityPrice={showElectricityPrice}
          onElectricityPriceChange={setElectricityPrice}
          onGridPowerChargesChange={setGridPowerCharges}
          onKnowsElectricityPriceChange={onElectricityPriceChange}
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


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
  onFileUpload: (filePath: string) => void;
  onExistingPVChange?: (value: string) => void;
  onPVSizeChange?: (value: string) => void;
  onFormDataChange: (data: {
    electricityPrice?: number;
    gridPowerCharges?: number;
    pvPeak?: number;
    loadsKwIsNet?: boolean;
  }) => void;
}

const ConsumptionForm = ({
  showElectricityPrice,
  onElectricityPriceChange,
  onFileUpload,
  onExistingPVChange,
  onPVSizeChange,
  onFormDataChange,
}: ConsumptionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [electricityPrice, setElectricityPrice] = useState<string>("");
  const [gridPowerCharges, setGridPowerCharges] = useState<string>("");
  const [hasExistingPV, setHasExistingPV] = useState<string>("");
  const [pvSize, setPvSize] = useState<string>("");
  const [includesPVGeneration, setIncludesPVGeneration] = useState<string>("");
  const [previewData, setPreviewData] = useState<{ value: number }[]>([]);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");

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

  const updateFormData = () => {
    // Parse values properly, ensuring we use the full string value
    const formData = {
      electricityPrice: electricityPrice ? parseFloat(electricityPrice) : undefined,
      gridPowerCharges: gridPowerCharges ? parseFloat(gridPowerCharges) : undefined,
      pvPeak: (hasExistingPV === "yes" && pvSize) 
        ? parseFloat(pvSize.replace(',', '.'))
        : undefined,
      loadsKwIsNet: includesPVGeneration === "no" ? false : undefined
    };

    onFormDataChange(formData);
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

      setUploadedFilePath(fileName);
      onFileUpload(fileName);
      updateFormData();
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
    updateFormData();
  };

  const handlePvSizeChange = (value: string) => {
    setPvSize(value);
    if (onPVSizeChange) {
      onPVSizeChange(value);
    }
    updateFormData();
  };

  const handleElectricityPriceChange = (value: string) => {
    setElectricityPrice(value);
    updateFormData();
  };

  const handleGridPowerChargesChange = (value: string) => {
    setGridPowerCharges(value);
    updateFormData();
  };

  const handleIncludesPvGenerationChange = (value: string) => {
    setIncludesPVGeneration(value);
    updateFormData();
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-8">
        <ExistingPvSection 
          onPvSizeChange={handlePvSizeChange}
          onHasExistingPvChange={handleHasExistingPvChange}
          onIncludesPvGenerationChange={handleIncludesPvGenerationChange}
        />

        <ElectricityPriceSection
          showElectricityPrice={showElectricityPrice}
          onElectricityPriceChange={handleElectricityPriceChange}
          onGridPowerChargesChange={handleGridPowerChargesChange}
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useState, useRef } from "react"
import { Upload, Info, ZoomIn, ZoomOut } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Button } from "@/components/ui/button"

interface ConsumptionFormProps {
  showElectricityPrice: boolean;
  showLoadProfileUpload: boolean;
  showYearlyConsumption: boolean;
  onElectricityPriceChange: (value: string) => void;
  onLoadProfileChange: (value: string) => void;
  onFileUpload: (filePath: string, electricityPrice?: number, gridPowerCharges?: number, pvPeak?: number, loadsKwIsNet?: boolean) => void;
}

const ConsumptionForm = ({
  showElectricityPrice,
  onElectricityPriceChange,
  onFileUpload,
}: ConsumptionFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [electricityPrice, setElectricityPrice] = useState<string>("");
  const [gridPowerCharges, setGridPowerCharges] = useState<string>("");
  const [hasExistingPV, setHasExistingPV] = useState<string>("");
  const [pvSize, setPvSize] = useState<string>("");
  const [includesPVGeneration, setIncludesPVGeneration] = useState<string>("");
  const [previewData, setPreviewData] = useState<{ value: number }[]>([]);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [chartBottom, setChartBottom] = useState<number | undefined>(undefined);
  const [chartTop, setChartTop] = useState<number | undefined>(undefined);

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
      const parsedPvPeak = (hasExistingPV === "yes" && pvSize) ? parseFloat(pvSize) : undefined;
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

  const getAxisYDomain = (from: number, to: number) => {
    const data = previewData.slice(from, to);
    let [bottom, top] = [data[0]?.value ?? 0, data[0]?.value ?? 0];
    
    data.forEach((d) => {
      if (d.value > top) top = d.value;
      if (d.value < bottom) bottom = d.value;
    });

    return [bottom - (top - bottom) * 0.1, top + (top - bottom) * 0.1];
  };

  const zoom = () => {
    if (refAreaLeft === null || refAreaRight === null) return;

    let left = Math.min(refAreaLeft, refAreaRight);
    let right = Math.max(refAreaLeft, refAreaRight);

    if (right - left < 10) {
      setRefAreaLeft(null);
      setRefAreaRight(null);
      return;
    }

    const [bottom, top] = getAxisYDomain(left, right);

    setChartBottom(bottom);
    setChartTop(top);
    setLeft(left);
    setRight(right);
    setRefAreaLeft(null);
    setRefAreaRight(null);
  };

  const zoomOut = () => {
    setLeft(null);
    setRight(null);
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setChartBottom(undefined);
    setChartTop(undefined);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Do you have an existing PV?</Label>
          <RadioGroup
            onValueChange={(value) => setHasExistingPV(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pv-yes" />
              <Label htmlFor="pv-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pv-no" />
              <Label htmlFor="pv-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {hasExistingPV === "yes" && (
          <div className="animate-fade-in space-y-4">
            <div>
              <Label htmlFor="pvSize">PV Size</Label>
              <Input
                id="pvSize"
                type="number"
                placeholder="Enter size in kWp"
                className="mt-1"
                value={pvSize}
                onChange={(e) => setPvSize(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Load profile after PV generation?</Label>
              <RadioGroup
                onValueChange={(value) => setIncludesPVGeneration(value)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="generation-yes" />
                  <Label htmlFor="generation-yes">Net Load (after PV production)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="generation-no" />
                  <Label htmlFor="generation-no">Gross Load (before PV production)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

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
                value={electricityPrice}
                onChange={(e) => setElectricityPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="gridPowerCharges">Grid Power Charges</Label>
              <Input
                id="gridPowerCharges"
                type="number"
                placeholder="Enter price in €/kW/month"
                className="mt-1"
                value={gridPowerCharges}
                onChange={(e) => setGridPowerCharges(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Label>Load Profile Upload</Label>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-full w-4 h-4 hover:bg-gray-100">
                <Info className="h-3 w-3 text-gray-500" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <p>The load profile is needed for the most accurate analysis results.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
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

        {previewData.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Load Profile Preview</h3>
              {(left !== null || right !== null) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={zoomOut}
                  className="flex items-center gap-1"
                >
                  <ZoomOut className="h-4 w-4" />
                  Reset Zoom
                </Button>
              )}
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={previewData}
                  onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel as number)}
                  onMouseMove={(e) => refAreaLeft && e && setRefAreaRight(e.activeLabel as number)}
                  onMouseUp={zoom}
                >
                  <XAxis 
                    allowDataOverflow
                    domain={left !== null ? [left, right as number] : ['dataMin', 'dataMax']}
                    type="number"
                    tickFormatter={(value) => `${Math.round(value/24)}d`}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    allowDataOverflow
                    domain={chartBottom !== undefined ? [chartBottom, chartTop as number] : ['auto', 'auto']}
                    label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', offset: 10 }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} kW`, 'Power']}
                    labelFormatter={(label) => `Hour ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    dot={false}
                    strokeWidth={1}
                  />
                  {refAreaLeft && refAreaRight && (
                    <ReferenceArea
                      x1={refAreaLeft}
                      x2={refAreaRight}
                      strokeOpacity={0.3}
                      fill="#2563eb"
                      fillOpacity={0.1}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">Click and drag on the chart to zoom into a specific time range</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumptionForm;

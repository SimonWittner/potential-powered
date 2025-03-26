
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Upload } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FileUploadSectionProps {
  onFileUpload: (file: File) => Promise<void>;
  previewData: { value: number }[];
}

const FileUploadSection = ({
  onFileUpload,
  previewData
}: FileUploadSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    await onFileUpload(file);
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
      await onFileUpload(file);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Load Profile Upload</Label>
        <HoverCard openDelay={0}>
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
          <h3 className="text-sm font-medium text-gray-700 mb-2">Load Profile Preview</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={previewData}>
                <XAxis 
                  label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                  tick={false}
                />
                <YAxis 
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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;

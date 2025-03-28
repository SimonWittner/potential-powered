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
      <div className="flex items-center space-x-2">
        <Label>Load Profile Upload</Label>
        <HoverCard openDelay={100}>
          <HoverCardTrigger asChild>
            <Info className="h-4 w-4 text-gray-500 cursor-help" />
          </HoverCardTrigger>
          <HoverCardContent className="text-sm p-4 bg-white shadow-lg rounded-md border border-gray-200 w-[500px]">
            <p className="text-gray-600">
              <strong>Load Profile</strong><br />
              The load profile is needed for the most accurate analysis results.
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Upload</strong><br />
              Upload load data in a .csv file. The file should have a single column with 8760 numeric values (no heading/column name).<br />
              If uploading causes issues, open the .csv file with a text editor and verify that it has this format:
            </p>
            <img 
              src="data:image/png;base64,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" 
              alt="CSV Format Example" 
              className="mt-2 w-48 h-auto rounded-md border"
            />
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

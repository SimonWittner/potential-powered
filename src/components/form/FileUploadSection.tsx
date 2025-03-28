import { useState } from "react";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info, Upload, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handleDemoUpload = async () => {
    setIsUploading(true);
    try {
      const demoFileUrl = "https://jhnqdukpwmcvkcwvejfg.supabase.co/storage/v1/object/sign/demoload/load_hourly_demo.csv?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJkZW1vbG9hZC9sb2FkX2hvdXJseV9kZW1vLmNzdiIsImlhdCI6MTc0MzE2NDEyNiwiZXhwIjoxOTAwODQ0MTI2fQ.3_lEkUNd7p2GGVKkmPSP2_BWo8tzG9_X_8DV-AI3K4A";
      
      const response = await fetch(demoFileUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch demo file: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.blob();
      
      const file = new File(
        [data], 
        'load_hourly_demo.csv', 
        { type: 'text/csv' }
      );
      
      await onFileUpload(file);
      toast.success("Demo load profile uploaded successfully");
    } catch (error) {
      console.error('Error downloading demo file:', error);
      toast.error("Failed to load demo file");
    } finally {
      setIsUploading(false);
    }
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
              Upload load data in a .csv file. The file should have a single column with 8760 numeric values (no heading/column name) in [kW].<br />
              If uploading causes issues, open the .csv file with a text editor and verify that it has this format:
            </p>
            <img 
              src="../../../public/lovable-uploads/csv_upload_hover.png" 
              alt="CSV Format Example" 
              className="mt-2 w-48 h-auto rounded-md border"
            />
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-1 right-0 z-10 h-8 rounded-md bg-white border-gray-200 shadow-sm flex items-center gap-1 px-2"
          aria-label="Upload demo load profile"
          onClick={handleDemoUpload}
          disabled={isUploading}
        >
          <Plus className="h-4 w-4" />
          <span className="text-xs">Try Demo Load Profile</span>
        </Button>
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

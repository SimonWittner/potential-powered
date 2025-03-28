
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
      // Fetch the demo file from Supabase storage
      const { data, error } = await supabase
        .storage
        .from('demoload')
        .download('load_hourly_demo.csv');
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error('Failed to download demo file');
      }
      
      // Convert the blob to a File object
      const file = new File(
        [data], 
        'load_hourly_demo.csv', 
        { type: 'text/csv' }
      );
      
      // Pass the file to the onFileUpload function
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
              src="data:image/png;base64,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" 
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
          <span className="text-xs">Upload Demo Load Profile</span>
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


import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ExistingPvSectionProps {
  onPvSizeChange: (value: string) => void;
  onHasExistingPvChange: (value: string) => void;
  onIncludesPvGenerationChange: (value: string) => void;
}

const ExistingPvSection = ({ 
  onPvSizeChange,
  onHasExistingPvChange,
  onIncludesPvGenerationChange
}: ExistingPvSectionProps) => {
  const [hasExistingPV, setHasExistingPV] = useState<string>("");
  const [pvSize, setPvSize] = useState<string>("");
  const [includesPVGeneration, setIncludesPVGeneration] = useState<string>("");

  const handleHasExistingPvChange = (value: string) => {
    setHasExistingPV(value);
    onHasExistingPvChange(value);
  };

  const handlePvSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (e.target.value === "" || (value >= 0)) {
      setPvSize(e.target.value);
      onPvSizeChange(e.target.value);
    }
  };

  // Prevent wheel events from changing the input value - fix added for vanishing input values (mac)
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  const handleIncludesPvGenerationChange = (value: string) => {
    setIncludesPVGeneration(value);
    onIncludesPvGenerationChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label>PV existing or planned?</Label>
          <HoverCard openDelay={100}>
            <HoverCardTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="text-sm p-4 bg-white shadow-lg rounded-md border border-gray-200 w-96">
              <p className="font-semibold">PV existing</p>
              <p className="text-gray-600">Add your existing PV size in kWp. Select if your load profile is measured (Net Load) or before (Gross Load) PV production.</p>

              <p className="font-semibold mt-2">PV planned</p>
              <p className="text-gray-600">Add your planned PV size in kWp. Select Gross Load.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        <RadioGroup
          onValueChange={handleHasExistingPvChange}
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
              min="0"
              step="0.1"
              placeholder="Enter size in kWp"
              className="mt-1 no-spinner"
              value={pvSize}
              onChange={handlePvSizeChange}
              onWheel={handleWheel}
            />
          </div>
          <div className="space-y-2">
            <Label>Load profile after PV generation?</Label>
            <RadioGroup
              onValueChange={handleIncludesPvGenerationChange}
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
    </div>
  );
};

export default ExistingPvSection;

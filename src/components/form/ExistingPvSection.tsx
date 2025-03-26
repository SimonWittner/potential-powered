
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Prevent wheel events from changing the input value
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
        <Label>Do you have an existing PV?</Label>
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

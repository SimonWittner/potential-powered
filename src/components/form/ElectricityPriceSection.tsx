
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface ElectricityPriceSectionProps {
  showElectricityPrice: boolean;
  onElectricityPriceChange: (value: string) => void;
  onGridPowerChargesChange: (value: string) => void;
  onKnowsElectricityPriceChange: (value: string) => void;
}

const ElectricityPriceSection = ({
  showElectricityPrice,
  onElectricityPriceChange,
  onGridPowerChargesChange,
  onKnowsElectricityPriceChange
}: ElectricityPriceSectionProps) => {
  const [electricityPrice, setElectricityPrice] = useState<string>("");
  const [gridPowerCharges, setGridPowerCharges] = useState<string>("");

  const handleElectricityPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (e.target.value === "" || (value >= 0)) {
      setElectricityPrice(e.target.value);
      onElectricityPriceChange(e.target.value);
    }
  };

  const handleGridPowerChargesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (e.target.value === "" || (value >= 0)) {
      setGridPowerCharges(e.target.value);
      onGridPowerChargesChange(e.target.value);
    }
  };

  // Prevent wheel events from changing the input value
  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label>Electricity price known?</Label>
          <HoverCard openDelay={100}>
            <HoverCardTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="text-sm p-4 bg-white shadow-lg rounded-md border border-gray-200 w-96">
              <p className="text-gray-600">If unknown, missing price data is approximated based on company size and region.</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        <RadioGroup
          onValueChange={onKnowsElectricityPriceChange}
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
              min="0"
              step="0.01"
              placeholder="Enter price in €/kWh"
              className="mt-1 no-spinner"
              value={electricityPrice}
              onChange={handleElectricityPriceChange}
              onWheel={handleWheel}
            />
          </div>
          <div>
            <Label htmlFor="gridPowerCharges">Grid Power Charges</Label>
            <Input
              id="gridPowerCharges"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price in €/kW/month"
              className="mt-1 no-spinner"
              value={gridPowerCharges}
              onChange={handleGridPowerChargesChange}
              onWheel={handleWheel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityPriceSection;

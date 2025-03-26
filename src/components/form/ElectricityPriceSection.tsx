
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
    setElectricityPrice(e.target.value);
    onElectricityPriceChange(e.target.value);
  };

  const handleGridPowerChargesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridPowerCharges(e.target.value);
    onGridPowerChargesChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Do you know your electricity price?</Label>
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
              placeholder="Enter price in €/kWh"
              className="mt-1"
              value={electricityPrice}
              onChange={handleElectricityPriceChange}
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
              onChange={handleGridPowerChargesChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectricityPriceSection;

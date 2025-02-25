
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
  companyName: string;
  onCompanyNameChange: (value: string) => void;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const CompanyInfoForm = ({ 
  address, 
  onAddressChange,
  companyName,
  onCompanyNameChange 
}: CompanyInfoFormProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddressInput = async (value: string) => {
    onAddressChange(value);
    
    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=de&limit=5`,
          {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'LovableEnergyApp/1.0'
            }
          }
        );
        const data = await response.json();
        setSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    onAddressChange(suggestion.display_name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Enter your company name"
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => handleAddressInput(e.target.value)}
          onFocus={() => address.length > 2 && setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoForm;


import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

interface AddressSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const AddressAutocomplete = ({ value, onChange }: AddressAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            "Accept-Language": "en", // Set language to English
            "User-Agent": "AddressAutocomplete/1.0", // Required by Nominatim usage policy
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error("Failed to fetch address suggestions:", response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    
    // Clear any existing timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    // Set a new timeout to debounce the API request
    debounceTimeout.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 300);
  };

  const handleSelectAddress = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.display_name);
    onChange(suggestion.display_name);
    setOpen(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="address"
              placeholder="Enter your address"
              value={inputValue}
              onChange={handleInputChange}
              onClick={() => setOpen(true)}
              className="w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setOpen(!open)}
            >
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          {loading ? (
            <div className="p-2 text-sm text-center">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-[200px] overflow-y-auto">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  className="flex items-center px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  <span className="flex-1 truncate text-sm">{suggestion.display_name}</span>
                  {inputValue === suggestion.display_name && (
                    <Check className="h-4 w-4 ml-2" />
                  )}
                </div>
              ))}
            </div>
          ) : inputValue.trim().length > 2 ? (
            <div className="p-2 text-sm text-center">No suggestions found</div>
          ) : (
            <div className="p-2 text-sm text-center">Type at least 3 characters to search</div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddressAutocomplete;

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AnalysisDialog from "@/components/AnalysisDialog";

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Index = () => {
  const [showElectricityPrice, setShowElectricityPrice] = useState(false);
  const [showLoadProfileUpload, setShowLoadProfileUpload] = useState(false);
  const [showYearlyConsumption, setShowYearlyConsumption] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState<[number, number]>([51.1657, 10.4515]); // Germany center
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

  const interests = [
    { id: "pv", label: "PV" },
    { id: "battery", label: "Battery" },
    { id: "evCharging", label: "EV Charging" },
    { id: "heatpump", label: "Heatpump" },
  ];

  const handleAddressChange = async (value: string) => {
    setAddress(value);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv") {
        toast.error("Please upload a CSV file");
        e.target.value = "";
        return;
      }
      toast.success("File uploaded successfully");
    }
  };

  const handleInterestChange = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Potential Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Analyse your potential for a PV and/or a battery. Get results in less
            than 5 minutes.
          </p>
        </div>

        <Card className="p-6 space-y-8 shadow-lg bg-white animate-fade-in">
          <div className="space-y-4">
            <div className="flex gap-8">
              <div className="w-1/2 space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter your company address"
                    className="mt-1"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-1/2 h-[200px]">
                <MapContainer
                  defaultCenter={coordinates}
                  defaultZoom={9}
                  className="h-full w-full rounded-lg"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={coordinates} />
                  <MapUpdater coordinates={coordinates} />
                </MapContainer>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What are you interested in?</Label>
              <div className="flex space-x-6">
                {interests.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={selectedInterests.includes(interest.id)}
                      onCheckedChange={() => handleInterestChange(interest.id)}
                    />
                    <Label htmlFor={interest.id}>{interest.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Do you know your electricity price?</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setShowElectricityPrice(value === "yes")
                }
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
              <div className="animate-fade-in">
                <Label htmlFor="electricityPrice">Electricity Price</Label>
                <Input
                  id="electricityPrice"
                  type="number"
                  placeholder="Enter price in €/kWh"
                  className="mt-1"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Do you know your load profile?</Label>
              <RadioGroup
                onValueChange={(value) => {
                  setShowLoadProfileUpload(value === "yes");
                  setShowYearlyConsumption(value === "no");
                }}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="profile-yes" />
                  <Label htmlFor="profile-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="profile-no" />
                  <Label htmlFor="profile-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            {showLoadProfileUpload && (
              <div className="animate-fade-in">
                <Label htmlFor="loadProfile">Upload Load Profile (CSV)</Label>
                <Input
                  id="loadProfile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="mt-1"
                />
              </div>
            )}

            {showYearlyConsumption && (
              <div className="animate-fade-in">
                <Label htmlFor="yearlyConsumption">
                  Average Yearly Consumption
                </Label>
                <Input
                  id="yearlyConsumption"
                  type="number"
                  placeholder="Enter consumption in kWh"
                  className="mt-1"
                />
              </div>
            )}

            <Button 
              className="w-full" 
              onClick={() => setShowAnalysisDialog(true)}
            >
              Analyse
            </Button>
          </div>
        </Card>

        <AnalysisDialog 
          open={showAnalysisDialog} 
          onOpenChange={setShowAnalysisDialog}
        />
      </div>
    </div>
  );
};

// Helper component to update map view when coordinates change
const MapUpdater = ({ coordinates }: { coordinates: [number, number] }) => {
  const map = useMap();
  map.setView(coordinates, 9);
  return null;
};

export default Index;

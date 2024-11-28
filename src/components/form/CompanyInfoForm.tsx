import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
}

// This component will handle map position updates
const MapUpdater = ({ address }: { address: string }) => {
  const map = useMap();

  useEffect(() => {
    if (address) {
      // Convert address to coordinates using geocoding
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data[0]) {
            const { lat, lon } = data[0];
            map.setView([parseFloat(lat), parseFloat(lon)], 13);
            console.log(`Map updated to coordinates: ${lat}, ${lon} for address: ${address}`);
          }
        })
        .catch(error => {
          console.error('Error geocoding address:', error);
        });
    }
  }, [address, map]);

  return null;
};

const CompanyInfoForm = ({ address, onAddressChange }: CompanyInfoFormProps) => {
  const mapRef = useRef<LeafletMap>(null);

  return (
    <div className="flex gap-8">
      {/* Form section - takes up half the width */}
      <div className="w-1/2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            placeholder="Enter your company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
      </div>

      {/* Map section - takes up the other half but with reduced height */}
      <div className="w-1/2 h-[100px] rounded-lg overflow-hidden">
        <MapContainer
          center={[51.1657, 10.4515]} // Germany's center coordinates
          zoom={6}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater address={address} />
          {address && <Marker position={[51.1657, 10.4515]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
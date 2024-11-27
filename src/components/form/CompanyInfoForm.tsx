import { useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
}

const CompanyInfoForm = ({ address, onAddressChange }: CompanyInfoFormProps) => {
  const mapRef = useRef<LeafletMap>(null);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="Enter your address"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>

      <div 
        className="relative rounded-lg overflow-hidden" 
        style={{ height: "300px" }}
      >
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          center={[51.505, -0.09]}
          zoom={13}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {address && <Marker position={[51.505, -0.09]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default CompanyInfoForm;
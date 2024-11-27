import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { useEffect, useRef } from "react"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
}

const CompanyInfoForm = ({ address, onAddressChange }: CompanyInfoFormProps) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (address && mapRef.current) {
      const map = mapRef.current;
      map.setView([51.1657, 10.4515], 6);
      
      if (address.length > 0) {
        map.setZoom(9);
      }
    }
  }, [address]);

  return (
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
            onChange={(e) => onAddressChange(e.target.value)}
          />
        </div>
      </div>

      <div className="w-1/2 h-[150px]">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[51.1657, 10.4515]}
          zoom={6}
          ref={mapRef}
          className="w-full h-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {address && <Marker position={[51.1657, 10.4515]} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default CompanyInfoForm;

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AddressAutocomplete from "./AddressAutocomplete";

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
  companyName: string;
  onCompanyNameChange: (value: string) => void;
}

const CompanyInfoForm = ({ 
  address, 
  onAddressChange,
  companyName,
  onCompanyNameChange 
}: CompanyInfoFormProps) => {
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

      <AddressAutocomplete 
        value={address} 
        onChange={onAddressChange} 
      />
    </div>
  );
};

export default CompanyInfoForm;

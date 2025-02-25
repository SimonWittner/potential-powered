import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  );
};

export default CompanyInfoForm;
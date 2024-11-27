import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
}

const CompanyInfoForm = ({ address, onAddressChange }: CompanyInfoFormProps) => {
  return (
    <div className="space-y-4">
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
  );
};

export default CompanyInfoForm;

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">{t('companyName')}</Label>
        <Input
          id="companyName"
          placeholder={t('enterCompanyName')}
          value={companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('address')}</Label>
        <Input
          id="address"
          placeholder={t('enterAddress')}
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;

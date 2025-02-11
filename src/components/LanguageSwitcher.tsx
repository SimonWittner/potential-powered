
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/context/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm">EN</span>
      <Switch
        checked={language === 'de'}
        onCheckedChange={(checked) => setLanguage(checked ? 'de' : 'en')}
      />
      <span className="text-white text-sm">DE</span>
    </div>
  );
};

export default LanguageSwitcher;

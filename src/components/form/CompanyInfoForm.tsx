import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface CompanyInfoFormProps {
  address: string;
  onAddressChange: (value: string) => void;
}

const CompanyInfoForm = ({ address, onAddressChange }: CompanyInfoFormProps) => {
  const [companyName, setCompanyName] = useState("");
  const { toast } = useToast();

  // Fetch initial company name
  useEffect(() => {
    const fetchCompanyName = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company name:', error);
        return;
      }

      if (data?.company_name) {
        setCompanyName(data.company_name);
      }
    };

    fetchCompanyName();
  }, []);

  // Update company name in Supabase
  const handleCompanyNameChange = async (value: string) => {
    setCompanyName(value);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from('profiles')
      .update({ company_name: value })
      .eq('id', session.user.id);

    if (error) {
      console.error('Error updating company name:', error);
      toast({
        title: "Error",
        description: "Failed to save company name. Please try again.",
        variant: "destructive"
      });
    } else {
      console.log('Company name updated successfully');
      toast({
        title: "Success",
        description: "Company name saved successfully.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          placeholder="Enter your company name"
          value={companyName}
          onChange={(e) => handleCompanyNameChange(e.target.value)}
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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0F0F]">
      <header className="p-4 fixed top-0 right-0 z-50 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-white hover:text-white/80"
        >
          <LogOut className="h-5 w-5" />
        </Button>
        <Link to="/">
          <img 
            src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png" 
            alt="Lumera Logo" 
            className="h-12 w-auto rounded-lg"
          />
        </Link>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
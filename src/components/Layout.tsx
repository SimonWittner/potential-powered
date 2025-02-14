
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state when component mounts
    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        // Clear any stored analysis when user signs in
        localStorage.removeItem('analysisFileName');
        localStorage.removeItem('electricityPrice');
        localStorage.removeItem('gridPowerCharges');
        localStorage.removeItem('pvPeak');
        localStorage.removeItem('loadsKwIsNet');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Checking session:", session);
      
      if (error) {
        console.error("Session error:", error);
        throw error;
      }

      if (!session) {
        navigate('/auth');
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication error. Please sign in again.");
      navigate('/auth');
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out");
    }
  };

  const handleLogoClick = () => {
    localStorage.removeItem('analysisFileName');
    localStorage.removeItem('electricityPrice');
    localStorage.removeItem('gridPowerCharges');
    localStorage.removeItem('pvPeak');
    localStorage.removeItem('loadsKwIsNet');
    navigate('/');
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
        <button onClick={handleLogoClick}>
          <img 
            src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png" 
            alt="Lumera Logo" 
            className="h-12 w-auto rounded-lg"
          />
        </button>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;

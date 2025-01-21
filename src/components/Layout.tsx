import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize session from local storage
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("Initial session check:", session);
      if (error) {
        console.error("Session error:", error);
        navigate('/auth');
        return;
      }
      
      if (!session) {
        navigate('/auth');
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        // Clear any application storage
        localStorage.clear();
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        navigate('/');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Error signing out");
      } else {
        localStorage.clear();
        toast.success("Signed out successfully");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out");
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
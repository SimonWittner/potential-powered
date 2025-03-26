
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Home, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

const Layout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check auth state when component mounts
    checkUser();

    // Subscribe to auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const checkUser = async () => {
    try {
      const {
        data: {
          session
        },
        error
      } = await supabase.auth.getSession();
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
      const {
        error
      } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        clearAllCachedData();
        navigate("/auth");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Error signing out");
    }
  };
  
  const handleLogoClick = () => {
    clearAllCachedData();
    navigate('/');
  };

  // Function to clear all cached data
  const clearAllCachedData = () => {
    // Analysis data
    localStorage.removeItem('analysisFileName');
    localStorage.removeItem('electricityPrice');
    localStorage.removeItem('gridPowerCharges');
    localStorage.removeItem('pvPeak');
    localStorage.removeItem('loadsKwIsNet');
    
    // Cached results and loading progress
    const cacheKeys = [
      'esgReportingData',
      'peakShavingCostData',
      'selfConsumptionCostData',
      'peakShavingBatteryData',
      'selfConsumptionBatteryData',
      'revenueCostsData',
      'revenueStackingBatteryData',
      'peakShavingProgress',
      'selfConsumptionProgress',
      'revenueStackingProgress',
      'peakShavingLoaded',
      'selfConsumptionLoaded',
      'revenueStackingLoaded',
      'resultsLoadingComplete'
    ];
    
    cacheKeys.forEach(key => localStorage.removeItem(key));
    console.log('All cached data cleared');
  };
  
  return (
    <div className="min-h-screen bg-[#1A0F0F] flex">
      {/* Vertical sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-16 bg-black flex flex-col items-center py-4 z-50">
        <div className="flex flex-col items-center gap-4 mt-20">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:text-white/80">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:text-white/80">
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-auto">
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white hover:text-white/80">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 ml-16">
        {/* Horizontal header */}
        <div className="fixed top-0 left-16 right-0 h-16 bg-black z-40 flex items-center">
          {/* Logo in top left of header */}
          <div className="p-2">
            <button onClick={handleLogoClick}>
              <img src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png" alt="Lumera Logo" className="h-12 w-auto" />
            </button>
          </div>
        </div>

        {/* Main content with padding to accommodate the header */}
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

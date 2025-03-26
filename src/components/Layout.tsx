
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
      {/* Left sidebar header */}
      <header className="fixed left-0 top-0 bottom-0 z-50 bg-black w-16 flex flex-col justify-between">
        <div className="flex flex-col items-center gap-4 mt-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:text-white/80">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="text-white hover:text-white/80">
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex flex-col items-center gap-4 mb-4">
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white hover:text-white/80">
            <LogOut className="h-5 w-5" />
          </Button>
          <button onClick={handleLogoClick}>
            <img src="/lovable-uploads/01a4e2f8-dfea-4c95-8dee-fe6cbabd21d4.png" alt="Lumera Logo" className="h-12 w-auto" />
          </button>
        </div>
      </header>
      <main className="flex-1 ml-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;

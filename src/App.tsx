
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Results from "./pages/Results";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#1A0F0F]" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'M PLUS 1',
        'url(https://fonts.gstatic.com/s/mplus1/v6/R70EjygA28ymD4HgBqGjN6KCh4Mo.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('M PLUS 1 font loaded successfully');
      } catch (error) {
        console.error('Error loading M PLUS 1 font:', error);
      }
    };

    loadFont();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Index />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <Layout>
                  <Results />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

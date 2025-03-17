
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ResultsError = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white space-y-4 text-center">
        <div className="text-xl">Error loading analysis results</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="text-white border-white hover:bg-white/10"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ResultsError;

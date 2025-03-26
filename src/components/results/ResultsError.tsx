
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ResultsError = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
      <div className="text-black space-y-4 text-center">
        <div className="text-xl">Error loading analysis results</div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="text-black border-black hover:bg-black/10"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ResultsError;

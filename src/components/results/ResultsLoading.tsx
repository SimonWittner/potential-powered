
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

const ResultsLoading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Set a fixed value for loaded progress if already loaded before
    const loadedValue = localStorage.getItem('resultsLoadingComplete');
    if (loadedValue === 'true') {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          localStorage.setItem('resultsLoadingComplete', 'true');
          return 100;
        }
        return prev + (100 / 15); // Divide 100 by 15 seconds to get the increment per second
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white space-y-4 w-64">
        <div>Loading analysis results...</div>
        <Progress value={progress} />
      </div>
    </div>
  );
};

export default ResultsLoading;

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / 15); // Divide 100 by 15 seconds to get the increment per second
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="space-y-8 text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-black">Analyzing your potential...</h2>
        <Progress value={progress} className="w-[300px]" />
        <p className="text-black">This might take a few minutes</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
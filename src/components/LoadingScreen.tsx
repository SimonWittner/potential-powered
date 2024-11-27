import { Progress } from "@/components/ui/progress"

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="space-y-8 text-center animate-fade-in">
        <h2 className="text-2xl font-semibold text-primary">Analyzing your potential...</h2>
        <Progress value={33} className="w-[300px]" />
        <p className="text-muted-foreground">This might take a few minutes</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
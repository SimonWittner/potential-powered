
import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoadingScreen from "./LoadingScreen"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface AnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalysisDialog = ({ open, onOpenChange }: AnalysisDialogProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onOpenChange(false);
        navigate("/results");
      }, 5000); // Changed to 5000 milliseconds (5 seconds)

      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange, navigate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-none bg-transparent shadow-none">
        <LoadingScreen />
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;

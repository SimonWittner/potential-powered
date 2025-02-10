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
      }, 5000); // Changed from 15000 to 60000 milliseconds (60 seconds) - SIMON: not working!?

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
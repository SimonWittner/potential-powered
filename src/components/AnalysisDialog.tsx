import { Dialog, DialogContent } from "@/components/ui/dialog"
import LoadingScreen from "./LoadingScreen"

interface AnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalysisDialog = ({ open, onOpenChange }: AnalysisDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-none bg-transparent shadow-none">
        <LoadingScreen />
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDialog;
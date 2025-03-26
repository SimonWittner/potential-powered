
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const handleEmailClick = () => {
    window.location.href = "mailto:simon@lumeraenergy.de";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Contact Us</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="outline" 
            onClick={handleEmailClick} 
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            Contact
          </Button>
          <span className="text-sm font-medium">simon@lumeraenergy.de</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;

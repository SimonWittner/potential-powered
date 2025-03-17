
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2pdf from 'html2pdf.js';
import { toast } from "sonner";

const ExportButton = () => {
  const handleExport = async () => {
    try {
      console.log("Starting PDF export...");
      const element = document.getElementById('results-content');
      if (!element) {
        console.error("Results content element not found");
        toast.error("Could not generate PDF");
        return;
      }
      const opt = {
        margin: 10,
        filename: 'analysis-results.pdf',
        image: {
          type: 'jpeg',
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };
      toast.promise(html2pdf().set(opt).from(element).save(), {
        loading: 'Generating PDF...',
        success: 'PDF downloaded successfully',
        error: 'Failed to generate PDF'
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="flex justify-center mt-8 pb-32">
      <Button variant="secondary" size="lg" onClick={handleExport} className="w-48">
        <Download className="h-4 w-4 mr-2" />
        Export Analysis
      </Button>
    </div>
  );
};

export default ExportButton;

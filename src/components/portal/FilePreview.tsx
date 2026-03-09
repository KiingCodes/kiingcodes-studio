import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
}

export function FilePreview({ open, onOpenChange, fileUrl, fileName, fileType }: FilePreviewProps) {
  const isPDF = fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const isImage = fileType.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{fileName}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4">
          {isPDF ? (
            <iframe
              src={fileUrl}
              className="w-full h-full min-h-[500px] rounded border"
              title={fileName}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Preview not available for this file type. Please download to view.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

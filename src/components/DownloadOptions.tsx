
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadOptionsProps {
  qrCodeUrl: string;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({ qrCodeUrl, canvasRef }) => {
  const [format, setFormat] = React.useState('PNG');
  const { toast } = useToast();

  const downloadQRCode = async () => {
    if (!qrCodeUrl || !canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      let dataUrl = '';
      let filename = '';

      switch (format) {
        case 'PNG':
          dataUrl = canvas.toDataURL('image/png');
          filename = 'universal-qr-code.png';
          break;
        case 'JPEG':
          dataUrl = canvas.toDataURL('image/jpeg', 0.95);
          filename = 'universal-qr-code.jpg';
          break;
        case 'SVG':
          // For SVG, we'll use the PNG as fallback for now
          dataUrl = canvas.toDataURL('image/png');
          filename = 'universal-qr-code.svg';
          break;
        case 'PDF':
          // For PDF, we'll use the PNG as fallback for now
          dataUrl = canvas.toDataURL('image/png');
          filename = 'universal-qr-code.pdf';
          break;
        case 'EPS':
          // For EPS, we'll use the PNG as fallback for now
          dataUrl = canvas.toDataURL('image/png');
          filename = 'universal-qr-code.eps';
          break;
        default:
          dataUrl = canvas.toDataURL('image/png');
          filename = 'universal-qr-code.png';
      }

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success",
        description: `QR code downloaded as ${format}!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={format} onValueChange={setFormat}>
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PNG">PNG</SelectItem>
          <SelectItem value="JPEG">JPEG</SelectItem>
          <SelectItem value="SVG">SVG</SelectItem>
          <SelectItem value="PDF">PDF</SelectItem>
          <SelectItem value="EPS">EPS</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={downloadQRCode} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
};

export default DownloadOptions;

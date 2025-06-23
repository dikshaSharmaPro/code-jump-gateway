
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Download, Copy, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  onQRGenerated: (url: string) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onQRGenerated }) => {
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/your-app');
  const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=your.app');
  const [fallbackUrl, setFallbackUrl] = useState('https://yourwebsite.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customization, setCustomization] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
    margin: 4,
    width: 256
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const generateRedirectUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      ios: appStoreUrl,
      android: playStoreUrl,
      fallback: fallbackUrl
    });
    return `${baseUrl}/redirect?${params.toString()}`;
  };

  const generateQRCode = async () => {
    try {
      const redirectUrl = generateRedirectUrl();
      const canvas = canvasRef.current;
      
      if (canvas) {
        await QRCode.toCanvas(canvas, redirectUrl, {
          errorCorrectionLevel: customization.errorCorrectionLevel,
          type: 'image/png',
          quality: 0.92,
          margin: customization.margin,
          color: {
            dark: customization.foregroundColor,
            light: customization.backgroundColor,
          },
          width: customization.width,
        });
        
        const dataUrl = canvas.toDataURL();
        setQrCodeUrl(dataUrl);
        onQRGenerated(redirectUrl);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please check your URLs.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [appStoreUrl, playStoreUrl, fallbackUrl, customization]);

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = 'universal-qr-code.png';
      link.href = qrCodeUrl;
      link.click();
      
      toast({
        title: "Success",
        description: "QR code downloaded successfully!",
      });
    }
  };

  const copyRedirectUrl = async () => {
    try {
      await navigator.clipboard.writeText(generateRedirectUrl());
      toast({
        title: "Copied!",
        description: "Redirect URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            QR Code Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* App Store URLs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="ios-url">iOS App Store URL</Label>
              <Input
                id="ios-url"
                value={appStoreUrl}
                onChange={(e) => setAppStoreUrl(e.target.value)}
                placeholder="https://apps.apple.com/app/your-app"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="android-url">Google Play Store URL</Label>
              <Input
                id="android-url"
                value={playStoreUrl}
                onChange={(e) => setPlayStoreUrl(e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=your.app"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="fallback-url">Fallback URL</Label>
              <Input
                id="fallback-url"
                value={fallbackUrl}
                onChange={(e) => setFallbackUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Customization Options */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customization</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fg-color">Foreground Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    id="fg-color"
                    value={customization.foregroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={customization.foregroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, foregroundColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    id="bg-color"
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="w-12 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Error Correction Level</Label>
              <Select
                value={customization.errorCorrectionLevel}
                onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => 
                  setCustomization(prev => ({ ...prev, errorCorrectionLevel: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Margin: {customization.margin}px</Label>
              <Slider
                value={[customization.margin]}
                onValueChange={([value]) => setCustomization(prev => ({ ...prev, margin: value }))}
                max={10}
                min={0}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Size: {customization.width}px</Label>
              <Slider
                value={[customization.width]}
                onValueChange={([value]) => setCustomization(prev => ({ ...prev, width: value }))}
                max={512}
                min={128}
                step={32}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Preview */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>QR Code Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center p-8 bg-gray-50 rounded-lg">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto border rounded shadow-sm"
            />
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={downloadQRCode} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" onClick={copyRedirectUrl} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy URL
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Scan this QR code to test the redirect functionality
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;

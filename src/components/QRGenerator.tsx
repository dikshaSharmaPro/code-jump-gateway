
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Download, Copy, Eye, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRGeneratorProps {
  onQRGenerated: (url: string) => void;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ onQRGenerated }) => {
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/your-app');
  const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=your.app');
  const [fallbackUrl, setFallbackUrl] = useState('https://yourwebsite.com');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');
  const [customization, setCustomization] = useState({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
    margin: 4,
    width: 256,
    dotStyle: 'square' as 'square' | 'dots' | 'rounded',
    cornerStyle: 'square' as 'square' | 'dot' | 'rounded',
    logoSize: 20
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const applyCustomStyles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const moduleSize = canvas.width / 25; // Approximate module size

    // Apply dot style customization
    if (customization.dotStyle === 'dots') {
      for (let y = 0; y < canvas.height; y += Math.floor(moduleSize)) {
        for (let x = 0; x < canvas.width; x += Math.floor(moduleSize)) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx] === 0) { // Black pixel
            ctx.fillStyle = customization.foregroundColor;
            ctx.beginPath();
            ctx.arc(x + moduleSize/2, y + moduleSize/2, moduleSize/3, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    } else if (customization.dotStyle === 'rounded') {
      for (let y = 0; y < canvas.height; y += Math.floor(moduleSize)) {
        for (let x = 0; x < canvas.width; x += Math.floor(moduleSize)) {
          const idx = (y * canvas.width + x) * 4;
          if (data[idx] === 0) { // Black pixel
            ctx.fillStyle = customization.foregroundColor;
            ctx.beginPath();
            ctx.roundRect(x, y, moduleSize * 0.8, moduleSize * 0.8, moduleSize * 0.2);
            ctx.fill();
          }
        }
      }
    }
  };

  const addLogoToQR = async (canvas: HTMLCanvasElement) => {
    if (!logoDataUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    return new Promise<void>((resolve) => {
      const logo = new Image();
      logo.onload = () => {
        const logoSize = (canvas.width * customization.logoSize) / 100;
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        // Add white background for logo
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 8, y - 8, logoSize + 16, logoSize + 16);

        // Draw logo
        ctx.drawImage(logo, x, y, logoSize, logoSize);
        resolve();
      };
      logo.src = logoDataUrl;
    });
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

        const ctx = canvas.getContext('2d');
        if (ctx && customization.dotStyle !== 'square') {
          // Clear canvas and redraw with custom styles
          ctx.fillStyle = customization.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          applyCustomStyles(ctx, canvas);
        }

        // Add logo if available
        if (logoDataUrl) {
          await addLogoToQR(canvas);
        }
        
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

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoDataUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Logo uploaded",
        description: "Your logo has been added to the QR code.",
      });
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoDataUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [appStoreUrl, playStoreUrl, fallbackUrl, customization, logoDataUrl]);

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

          {/* Logo Upload Section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Logo</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Logo
                </Button>
                {logoFile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              {logoFile && (
                <div className="text-sm text-muted-foreground">
                  {logoFile.name}
                </div>
              )}

              {logoDataUrl && (
                <div>
                  <Label>Logo Size: {customization.logoSize}%</Label>
                  <Slider
                    value={[customization.logoSize]}
                    onValueChange={([value]) => setCustomization(prev => ({ ...prev, logoSize: value }))}
                    max={30}
                    min={10}
                    step={2}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Design Customization */}
          <div className="space-y-4">
            <h3 className="font-semibold">Design & Style</h3>
            
            <div>
              <Label>Dot Style</Label>
              <Select
                value={customization.dotStyle}
                onValueChange={(value: 'square' | 'dots' | 'rounded') => 
                  setCustomization(prev => ({ ...prev, dotStyle: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Corner Style</Label>
              <Select
                value={customization.cornerStyle}
                onValueChange={(value: 'square' | 'dot' | 'rounded') => 
                  setCustomization(prev => ({ ...prev, cornerStyle: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dot">Dot</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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

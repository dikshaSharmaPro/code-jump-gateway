
import React, { useState } from 'react';
import QRGenerator from '@/components/QRGenerator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Globe, Zap, Shield, Palette, QrCode } from 'lucide-react';

const Index = () => {
  const [generatedUrl, setGeneratedUrl] = useState('');

  const features = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Smart Device Detection",
      description: "Automatically detects iOS and Android devices for seamless redirects"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Universal Compatibility",
      description: "Works across all browsers and devices with fallback support"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Redirects",
      description: "Lightning-fast redirects to the appropriate app store"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Reliable Fallbacks",
      description: "Multiple backup options ensure users never hit a dead end"
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Full Customization",
      description: "Customize colors, patterns, size, and error correction levels"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "High-Quality Codes",
      description: "Generate crisp, scannable QR codes with professional quality"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Universal QR</h1>
                <p className="text-sm text-muted-foreground">Smart App Store Redirects</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Free Forever
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="mb-4">
              ✨ No Registration Required
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              One QR Code,
              <br />
              Every Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate a single QR code that intelligently redirects users to the right app store 
              based on their device. No more multiple QR codes, no more confusion.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">iOS App Store</Badge>
            <Badge variant="outline">Google Play</Badge>
            <Badge variant="outline">Custom Fallback</Badge>
            <Badge variant="outline">Device Detection</Badge>
          </div>
        </div>
      </section>

      {/* Main Generator */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <QRGenerator onQRGenerated={setGeneratedUrl} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-3xl font-bold">Why Choose Universal QR?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for developers, marketers, and businesses who need reliable, 
              professional QR code solutions that just work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg text-blue-600">
                      {feature.icon}
                    </div>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h3 className="text-3xl font-bold">How It Works</h3>
            <p className="text-muted-foreground">Simple, fast, and reliable in just 3 steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Configure URLs",
                description: "Enter your iOS App Store, Google Play, and fallback URLs"
              },
              {
                step: "2", 
                title: "Customize Design",
                description: "Adjust colors, size, error correction, and other visual elements"
              },
              {
                step: "3",
                title: "Download & Share",
                description: "Get your QR code and start directing users to the right place"
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full text-xl font-bold">
                  {item.step}
                </div>
                <h4 className="text-xl font-semibold">{item.title}</h4>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 py-8 px-4 mt-16">
        <div className="container mx-auto text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-sm text-muted-foreground">
              Generate unlimited QR codes with smart device detection
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

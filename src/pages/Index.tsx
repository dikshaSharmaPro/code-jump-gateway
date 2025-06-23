
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRGenerator from "@/components/QRGenerator";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { QrCode, BarChart3 } from "lucide-react";

const Index = () => {
  const [generatedUrl, setGeneratedUrl] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Universal QR Code Generator
          </h1>
          <p className="text-lg text-gray-600">
            Create smart QR codes that redirect users to the right app store based on their device
          </p>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Generator
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <QRGenerator onQRGenerated={setGeneratedUrl} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

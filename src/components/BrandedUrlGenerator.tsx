
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BrandedUrlGeneratorProps {
  originalUrl: string;
}

const BrandedUrlGenerator: React.FC<BrandedUrlGeneratorProps> = ({ originalUrl }) => {
  const [customDomain, setCustomDomain] = useState('myapp.co');
  const [customSlug, setCustomSlug] = useState('app');
  const { toast } = useToast();

  const generateShortUrl = () => {
    return `https://${customDomain}/${customSlug}`;
  };

  const copyShortUrl = async () => {
    try {
      await navigator.clipboard.writeText(generateShortUrl());
      toast({
        title: "Copied!",
        description: "Branded URL copied to clipboard.",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Branded Short URL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="domain">Custom Domain</Label>
            <Input
              id="domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="myapp.co"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="slug">Custom Slug</Label>
            <Input
              id="slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              placeholder="app"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-blue-600">{generateShortUrl()}</span>
            <Button variant="outline" size="sm" onClick={copyShortUrl}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground">
          Note: Custom domain requires DNS configuration and SSL setup
        </p>
      </CardContent>
    </Card>
  );
};

export default BrandedUrlGenerator;

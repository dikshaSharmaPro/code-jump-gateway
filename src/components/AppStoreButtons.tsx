
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AppStoreButtonsProps {
  iosUrl: string;
  androidUrl: string;
  fallbackUrl: string;
}

const AppStoreButtons: React.FC<AppStoreButtonsProps> = ({ iosUrl, androidUrl, fallbackUrl }) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold">Download Our App</h2>
        <p className="text-muted-foreground">Choose your platform to download the app</p>
        
        <div className="space-y-3">
          <Button 
            asChild 
            className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-lg"
          >
            <a href={iosUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-semibold">App Store</div>
                </div>
              </div>
            </a>
          </Button>

          <Button 
            asChild 
            variant="outline" 
            className="w-full h-14 border-2 hover:bg-green-50 rounded-lg"
          >
            <a href={androidUrl} target="_blank" rel="noopener noreferrer">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1519l-2.0223 3.5033c-1.3693-.6539-2.9114-1.0141-4.5308-1.0141s-3.1615.3602-4.5308 1.0141L6.0434 5.4392a.4161.4161 0 00-.5972-.1519.416.416 0 00-.1518.5972L7.284 9.3214C4.1469 11.1106 2.0228 14.5869 2.0228 18.5631H22.0228c0-3.9762-2.1241-7.4525-5.2614-9.2417"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-semibold">Google Play</div>
                </div>
              </div>
            </a>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">
            Don't have a mobile device?
          </p>
          <Button variant="link" asChild>
            <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">
              Visit our website instead
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppStoreButtons;


import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { redirectToAppStore } from '@/utils/deviceDetection';
import AppStoreButtons from '@/components/AppStoreButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Redirect = () => {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const [showButtons, setShowButtons] = useState(false);

  const iosUrl = searchParams.get('ios') || 'https://apps.apple.com';
  const androidUrl = searchParams.get('android') || 'https://play.google.com';
  const fallbackUrl = searchParams.get('fallback') || 'https://google.com';

  useEffect(() => {
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          // Attempt automatic redirect
          redirectToAppStore(iosUrl, androidUrl, fallbackUrl);
          // Show manual buttons after redirect attempt
          setTimeout(() => setShowButtons(true), 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [iosUrl, androidUrl, fallbackUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {!showButtons ? (
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
                <h1 className="text-2xl font-bold">Redirecting...</h1>
                <p className="text-muted-foreground">
                  We're taking you to the right app store for your device
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">{countdown}</div>
                <p className="text-sm text-muted-foreground">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-yellow-800">
                  Automatic redirect didn't work? No problem! Choose your platform below:
                </p>
              </CardContent>
            </Card>
            
            <AppStoreButtons 
              iosUrl={iosUrl}
              androidUrl={androidUrl}
              fallbackUrl={fallbackUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Redirect;

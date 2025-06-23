
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { redirectToAppStore } from '@/utils/deviceDetection';
import { trackScan } from '@/utils/analytics';

const Redirect = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const iosUrl = searchParams.get('ios') || 'https://apps.apple.com';
    const androidUrl = searchParams.get('android') || 'https://play.google.com';
    const fallbackUrl = searchParams.get('fallback') || 'https://google.com';
    
    // Track the scan before redirecting
    trackScan();
    
    // Small delay to ensure tracking completes
    setTimeout(() => {
      redirectToAppStore(iosUrl, androidUrl, fallbackUrl);
    }, 100);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to the appropriate app store...</p>
      </div>
    </div>
  );
};

export default Redirect;

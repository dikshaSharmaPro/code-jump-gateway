
export const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor;
  
  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  // Check for mobile browsers that might not be caught above
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    // Default to android for unknown mobile devices
    return 'android';
  }
  
  return 'desktop';
};

export const redirectToAppStore = (iosUrl: string, androidUrl: string, fallbackUrl: string) => {
  const device = detectDevice();
  
  console.log('Device detected:', device);
  console.log('Redirecting to:', device === 'ios' ? iosUrl : device === 'android' ? androidUrl : fallbackUrl);
  
  switch (device) {
    case 'ios':
      window.location.href = iosUrl;
      break;
    case 'android':
      window.location.href = androidUrl;
      break;
    default:
      window.location.href = fallbackUrl;
  }
};

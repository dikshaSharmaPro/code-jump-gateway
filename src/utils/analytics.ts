
export interface ScanData {
  id: string;
  timestamp: Date;
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown';
    browser?: string;
  };
  userAgent: string;
  isRepeatUser: boolean;
  redirectedTo: 'ios' | 'android' | 'fallback';
}

export const trackScan = async (redirectUrl: string): Promise<ScanData> => {
  const userAgent = navigator.userAgent;
  const timestamp = new Date();
  
  // Device detection
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/mobile|phone/i.test(userAgent)) return 'mobile';
    return 'desktop';
  };

  const getOS = (): 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown' => {
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
    if (/android/i.test(userAgent)) return 'android';
    if (/windows/i.test(userAgent)) return 'windows';
    if (/macintosh|mac os x/i.test(userAgent)) return 'mac';
    if (/linux/i.test(userAgent)) return 'linux';
    return 'unknown';
  };

  const getBrowser = (): string => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  // Check if repeat user
  const userId = localStorage.getItem('qr_user_id') || `user_${Date.now()}_${Math.random()}`;
  const isRepeatUser = localStorage.getItem('qr_user_id') !== null;
  localStorage.setItem('qr_user_id', userId);

  const scanData: ScanData = {
    id: `scan_${Date.now()}_${Math.random()}`,
    timestamp,
    device: {
      type: getDeviceType(),
      os: getOS(),
      browser: getBrowser(),
    },
    userAgent,
    isRepeatUser,
    redirectedTo: getOS() === 'ios' ? 'ios' : getOS() === 'android' ? 'android' : 'fallback',
  };

  // Try to get location (with user permission)
  try {
    if (navigator.geolocation) {
      await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            scanData.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(position);
          },
          () => resolve(null),
          { timeout: 5000 }
        );
      });
    }
  } catch (error) {
    console.log('Location access denied or unavailable');
  }

  // Store scan data locally
  const existingScans = JSON.parse(localStorage.getItem('qr_scan_data') || '[]');
  existingScans.push(scanData);
  localStorage.setItem('qr_scan_data', JSON.stringify(existingScans));

  console.log('Scan tracked:', scanData);
  return scanData;
};

export const getScanAnalytics = (): ScanData[] => {
  return JSON.parse(localStorage.getItem('qr_scan_data') || '[]');
};

export const exportAnalyticsCSV = (scans: ScanData[]): string => {
  if (scans.length === 0) return '';

  const headers = [
    'Timestamp',
    'Device Type',
    'Operating System',
    'Browser',
    'Location',
    'Repeat User',
    'Redirected To',
    'User Agent'
  ];

  const rows = scans.map(scan => [
    scan.timestamp.toISOString(),
    scan.device.type,
    scan.device.os,
    scan.device.browser || 'Unknown',
    scan.location ? `${scan.location.latitude}, ${scan.location.longitude}` : 'Unknown',
    scan.isRepeatUser ? 'Yes' : 'No',
    scan.redirectedTo,
    `"${scan.userAgent}"`
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

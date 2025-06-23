
export interface ScanData {
  id: string;
  timestamp: number;
  userAgent: string;
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown';
    browser: string;
  };
  location?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  isRepeatUser: boolean;
  redirectedTo: 'ios' | 'android' | 'fallback';
}

const STORAGE_KEY = 'qr_scan_analytics';
const USER_TRACKING_KEY = 'qr_user_tracking';

const detectDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  let os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown' = 'unknown';
  let browser = 'Unknown';

  // Device type detection
  if (/iPad/.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = 'mobile';
  }

  // OS detection
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    os = 'ios';
  } else if (/android/i.test(userAgent)) {
    os = 'android';
  } else if (/Win/.test(userAgent)) {
    os = 'windows';
  } else if (/Mac/.test(userAgent)) {
    os = 'mac';
  } else if (/Linux/.test(userAgent)) {
    os = 'linux';
  }

  // Browser detection
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Edge')) {
    browser = 'Edge';
  }

  return { deviceType, os, browser };
};

const determineRedirectDestination = (): 'ios' | 'android' | 'fallback' => {
  const userAgent = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return 'ios';
  } else if (/android/i.test(userAgent)) {
    return 'android';
  }
  return 'fallback';
};

const checkIfRepeatUser = (): boolean => {
  const existingUser = localStorage.getItem(USER_TRACKING_KEY);
  if (!existingUser) {
    // Generate a unique user ID and store it
    const userId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    localStorage.setItem(USER_TRACKING_KEY, userId);
    return false;
  }
  return true;
};

const getLocationInfo = async (): Promise<ScanData['location']> => {
  try {
    // Try to get location from browser geolocation API
    if (navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            // If geolocation fails, try IP-based location (simplified)
            resolve(undefined);
          },
          { timeout: 5000 }
        );
      });
    }
  } catch (error) {
    console.log('Location detection failed:', error);
  }
  return undefined;
};

export const trackScan = async (): Promise<void> => {
  try {
    const deviceInfo = detectDeviceInfo();
    const location = await getLocationInfo();
    const isRepeatUser = checkIfRepeatUser();
    const redirectedTo = determineRedirectDestination();

    const scanData: ScanData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      device: {
        type: deviceInfo.deviceType,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
      },
      location,
      isRepeatUser,
      redirectedTo,
    };

    // Store scan data
    const existingData = getScanAnalytics();
    const updatedData = [scanData, ...existingData].slice(0, 1000); // Keep last 1000 scans
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    console.log('Scan tracked:', scanData);
  } catch (error) {
    console.error('Failed to track scan:', error);
  }
};

export const getScanAnalytics = (): ScanData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to retrieve analytics:', error);
    return [];
  }
};

export const exportAnalyticsCSV = (scans: ScanData[]): string | null => {
  if (scans.length === 0) return null;

  const headers = [
    'ID',
    'Timestamp',
    'Date',
    'Time',
    'Device Type',
    'OS',
    'Browser',
    'Location (Lat)',
    'Location (Long)',
    'Repeat User',
    'Redirected To',
    'User Agent'
  ];

  const rows = scans.map(scan => [
    scan.id,
    scan.timestamp,
    new Date(scan.timestamp).toLocaleDateString(),
    new Date(scan.timestamp).toLocaleTimeString(),
    scan.device.type,
    scan.device.os,
    scan.device.browser,
    scan.location?.latitude || '',
    scan.location?.longitude || '',
    scan.isRepeatUser ? 'Yes' : 'No',
    scan.redirectedTo,
    `"${scan.userAgent.replace(/"/g, '""')}"` // Escape quotes in user agent
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  return csvContent;
};

export const clearAnalytics = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_TRACKING_KEY);
};

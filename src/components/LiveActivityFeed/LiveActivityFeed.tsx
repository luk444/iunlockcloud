import React, { useState, useEffect } from 'react';
import { CheckCircle, Smartphone, Watch, Tablet } from 'lucide-react';

interface Activity {
  id: string;
  username: string;
  device: string;
  timestamp: Date;
  icon: 'phone' | 'watch' | 'tablet';
}

const LiveActivityFeed: React.FC = () => {
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Sample usernames and devices for realistic simulation
  const usernames = [
    'aronpal', 'techguru92', 'mobilefixer', 'iphonepro', 'unlockmaster',
    'devicehero', 'techsavvy', 'phonewiz', 'unlockpro', 'mobileguru',
    'techexpert', 'iphoneking', 'devicepro', 'unlockgenius', 'phonehacker',
    'mobilepro', 'techmaster', 'devicewiz', 'iphoneguru', 'unlockstar',
    'gastonfavb', 'hernanagu', 'alexdub', 'deadisla', 'javienot',
    'techlover', 'mobilefix', 'unlockking', 'deviceexpert', 'phonegenius',
    'techwizard', 'mobilehero', 'unlockpro', 'deviceking', 'phoneexpert',
    'techmaster', 'mobileguru', 'unlockwiz', 'devicehero', 'phonemaster',
    'maria_garcia', 'carlos_rodriguez', 'ana_martinez', 'juan_lopez', 'lucia_fernandez',
    'diego_sanchez', 'sofia_ramirez', 'pablo_gonzalez', 'camila_torres', 'mateo_ruiz',
    'valentina_morales', 'santiago_herrera', 'isabella_jimenez', 'daniel_vargas', 'emma_castro',
    'adrian_reyes', 'valeria_ortiz', 'sebastian_cruz', 'luna_mendoza', 'nicolas_aguilar',
    'sofia_vega', 'alejandro_rios', 'emilia_silva', 'david_medina', 'lucia_rojas',
    'andres_guerra', 'camila_flores', 'felipe_reyes', 'valentina_mejia', 'gabriel_parra'
  ];

  const devices = [
    { name: 'iPhone 16 Pro', icon: 'phone' as const },
    { name: 'iPhone 16', icon: 'phone' as const },
    { name: 'iPhone 16 Plus', icon: 'phone' as const },
    { name: 'iPhone 16 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 15 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 15 Pro', icon: 'phone' as const },
    { name: 'iPhone 15 Plus', icon: 'phone' as const },
    { name: 'iPhone 15', icon: 'phone' as const },
    { name: 'iPhone 14 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 14 Pro', icon: 'phone' as const },
    { name: 'iPhone 14 Plus', icon: 'phone' as const },
    { name: 'iPhone 14', icon: 'phone' as const },
    { name: 'iPhone 13 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 13 Pro', icon: 'phone' as const },
    { name: 'iPhone 13', icon: 'phone' as const },
    { name: 'iPhone 13 mini', icon: 'phone' as const },
    { name: 'iPhone 12 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 12 Pro', icon: 'phone' as const },
    { name: 'iPhone 12', icon: 'phone' as const },
    { name: 'iPhone 12 mini', icon: 'phone' as const },
    { name: 'iPhone 11 Pro Max', icon: 'phone' as const },
    { name: 'iPhone 11 Pro', icon: 'phone' as const },
    { name: 'iPhone 11', icon: 'phone' as const },
    { name: 'iPhone XS Max', icon: 'phone' as const },
    { name: 'iPhone XS', icon: 'phone' as const },
    { name: 'iPhone XR', icon: 'phone' as const },
    { name: 'iPhone X', icon: 'phone' as const },
    { name: 'iPhone 8 Plus', icon: 'phone' as const },
    { name: 'iPhone 8', icon: 'phone' as const },
    { name: 'iPhone 7 Plus', icon: 'phone' as const },
    { name: 'iPhone 7', icon: 'phone' as const },
    { name: 'iPhone 6s Plus', icon: 'phone' as const },
    { name: 'iPhone 6s', icon: 'phone' as const },
    { name: 'iPhone 6 Plus', icon: 'phone' as const },
    { name: 'iPhone 6', icon: 'phone' as const },
    { name: 'iPhone SE (3rd gen)', icon: 'phone' as const },
    { name: 'iPhone SE (2nd gen)', icon: 'phone' as const },
    { name: 'iPhone SE (1st gen)', icon: 'phone' as const },
    { name: 'iPhone 5s', icon: 'phone' as const },
    { name: 'Apple Watch Series 9', icon: 'watch' as const },
    { name: 'Apple Watch Ultra 2', icon: 'watch' as const },
    { name: 'Apple Watch SE', icon: 'watch' as const },
    { name: 'iPad Pro 12.9"', icon: 'tablet' as const },
    { name: 'iPad Air 5th gen', icon: 'tablet' as const },
    { name: 'iPad mini 6th gen', icon: 'tablet' as const }
  ];

  const usedCombinations = new Set<string>();

  const generateActivity = (): Activity => {
    let attempts = 0;
    let randomUsername: string;
    let randomDevice: typeof devices[0];
    let combinationKey: string;

    // Try to find a unique combination
    do {
      randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
      randomDevice = devices[Math.floor(Math.random() * devices.length)];
      combinationKey = `${randomUsername}-${randomDevice.name}`;
      attempts++;
    } while (usedCombinations.has(combinationKey) && attempts < 50);

    // If we found a unique combination, add it to the set
    if (!usedCombinations.has(combinationKey)) {
      usedCombinations.add(combinationKey);
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      username: randomUsername,
      device: randomDevice.name,
      icon: randomDevice.icon,
      timestamp: new Date()
    };
  };

  const getDeviceIcon = (iconType: 'phone' | 'watch' | 'tablet') => {
    switch (iconType) {
      case 'phone':
        return <Smartphone size={14} className="text-green-200" />;
      case 'watch':
        return <Watch size={14} className="text-green-200" />;
      case 'tablet':
        return <Tablet size={14} className="text-green-200" />;
      default:
        return <Smartphone size={14} className="text-green-200" />;
    }
  };

  useEffect(() => {
    // Generate initial activity immediately
    const initialActivity = generateActivity();
    setCurrentActivity(initialActivity);

    // Set up interval to generate new activities
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        const newActivity = generateActivity();
        setCurrentActivity(newActivity);
        setIsVisible(true);
      }, 300);
    }, 6000); // New activity every 6 seconds

    return () => clearInterval(interval);
  }, []);

  if (!currentActivity) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white shadow-sm border-b border-green-400" style={{ height: 'var(--live-feed-height)' }}>
      <div className="max-w-6xl mx-auto h-full px-3 sm:px-4">
        <div className={`flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 h-full ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}`}>
          <CheckCircle size={12} className="text-green-200 animate-pulse flex-shrink-0" />
          
          {/* Desktop version */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
            <span className="font-bold text-green-100">{currentActivity.username}</span>
            <span className="text-green-50">just successfully registered</span>
            {getDeviceIcon(currentActivity.icon)}
            <span className="font-bold text-green-100">{currentActivity.device}</span>
            <span className="text-green-300">•</span>
            <span className="text-green-200 text-xs">
              {currentActivity.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          {/* Mobile version */}
          <div className="sm:hidden flex items-center gap-1.5 text-xs font-medium">
            <span className="font-bold text-green-100 truncate max-w-[60px]">{currentActivity.username}</span>
            <span className="text-green-50 text-[10px]">registered</span>
            {getDeviceIcon(currentActivity.icon)}
            <span className="font-bold text-green-100 truncate max-w-[80px] text-[10px]">
              {currentActivity.device.includes('iPhone') 
                ? currentActivity.device.replace('iPhone ', '') 
                : currentActivity.device.includes('Apple Watch') 
                ? currentActivity.device.replace('Apple Watch ', '') 
                : currentActivity.device.includes('iPad') 
                ? currentActivity.device.replace('iPad ', '') 
                : currentActivity.device
              }
            </span>
            <span className="text-green-300 text-[10px]">•</span>
            <span className="text-green-200 text-[10px]">
              {currentActivity.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
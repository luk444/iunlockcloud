import React, { useState, useEffect, useRef } from 'react';
import { Shield, Smartphone, Lock, CheckCircle, X, Watch, Tablet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registerDevice } from '../../services/deviceService';
import { registerSerialDevice } from '../../services/serialDeviceService';
import { Device, SerialDevice } from '../../types';
import Modal from '../Modal/Modal';
import UnlockFMI from '../UnlockFMI/UnlockFMI';
import toast from 'react-hot-toast';

interface PhoneDataProps {
  imei: string;
  device: Device | SerialDevice;
  onClose: () => void;
}

const PhoneData: React.FC<PhoneDataProps> = ({ imei, device, onClose }) => {
  const [showUnlock, setShowUnlock] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { currentUser } = useAuth();
  const phoneDataRef = useRef<HTMLDivElement>(null);

  const isSerialDevice = (dev: Device | SerialDevice): dev is SerialDevice => {
    return 'deviceType' in dev;
  };

  useEffect(() => {
    if (phoneDataRef.current) {
      phoneDataRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    const registerUserDevice = async () => {
      if (!currentUser || registering || isRegistered) return;
      
      setRegistering(true);
      try {
        if (isSerialDevice(device)) {
          // Register serial device (Apple Watch/iPad)
          await registerSerialDevice(currentUser.uid, {
            serialNumber: imei,
            model: device.model,
            modelName: device.modelName,
            imageUrl: device.imageUrl,
            deviceType: device.deviceType,
            status: {
              fmiStatus: 'ON',
              blacklistStatus: 'Clean',
              activationLock: 'Active',
              icloudStatus: 'Locked'
            }
          }, device.credits);
        } else {
          // Register iPhone device
          await registerDevice(currentUser.uid, {
            imei,
            model: device.model,
            modelName: device.modelName,
            imageUrl: device.imageUrl,
            status: {
              fmiStatus: 'ON',
              blacklistStatus: 'Clean',
              activationLock: 'Active',
              icloudStatus: 'Locked'
            }
          }, device.credits);
        }
        
        setIsRegistered(true);
        
        // Show success notification with credits deducted
        if (!currentUser.isAdmin) {
          toast.success(
            `✅ Device registered successfully! -${device.credits} credits`,
            {
              duration: 4000,
              style: {
                background: '#10B981',
                color: 'white',
                fontWeight: '500',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#10B981',
              },
            }
          );
        } else {
          toast.success(
            `✅ Device registered successfully!`,
            {
              duration: 3000,
              style: {
                background: '#10B981',
                color: 'white',
                fontWeight: '500',
              },
            }
          );
        }
      } catch (error: any) {
        console.error('Error registering device:', error);
        toast.error(
          error.message || 'Error registering device',
          {
            duration: 4000,
            style: {
              background: '#EF4444',
              color: 'white',
              fontWeight: '500',
            },
          }
        );
      } finally {
        setRegistering(false);
      }
    };

    registerUserDevice();
  }, [currentUser, imei, device]);

  const handleUnlock = () => {
    setShowUnlock(true);
  };

  const handleCloseUnlock = () => {
    setShowUnlock(false);
  };

  const getDeviceIcon = () => {
    if (isSerialDevice(device)) {
      return device.deviceType === 'applewatch' ? 
        <Watch className="text-blue-500" size={20} /> : 
        <Tablet className="text-blue-500" size={20} />;
    }
    return <Smartphone className="text-blue-500" size={20} />;
  };

  const getIdentifierLabel = () => {
    return isSerialDevice(device) ? 'Serial Number' : 'IMEI';
  };

  return (
    <div 
      ref={phoneDataRef} 
      className="max-w-sm max-h-[85vh] overflow-y-auto mx-auto my-4 bg-white rounded-xl shadow-lg fade-in"
    >
      <div className="relative">
        <img 
          src={device.imageUrl} 
          alt={device.modelName} 
          className="w-full h-36 object-contain bg-gray-50 p-3"
        />
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4 justify-center text-center">
          {getDeviceIcon()}
          <h2 className="text-lg font-semibold text-gray-800">{device.modelName}</h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded-full">
                <Shield className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{getIdentifierLabel()}</p>
                <p className="font-medium text-gray-900">{imei}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <p className="text-xs text-gray-500">Find My iPhone</p>
              <p className="font-medium text-red-600 text-sm">ON</p>
            </div>
            
            <div className="p-2 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500">Blacklist Status</p>
              <p className="font-medium text-green-600 text-sm">Clean</p>
            </div>

            <div className="p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500">Activation Lock</p>
              <p className="font-medium text-blue-600 text-sm">Active</p>
            </div>

            <div className="p-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-500">iCloud Status</p>
              <p className="font-medium text-purple-600 text-sm">Locked</p>
            </div>
          </div>

          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Credits Required</p>
            <p className="font-medium text-blue-600 text-sm">{device.credits} Credits</p>
          </div>

          <button
            onClick={handleUnlock}
            disabled={registering || !isRegistered}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lock size={14} />
            {registering ? 'Registering...' : 'Unlock Device'}
          </button>

          {registering && (
            <div className="flex justify-center mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
                Registering Device...
              </span>
            </div>
          )}

          {isRegistered && (
            <div className="flex justify-center mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                <CheckCircle size={14} />
                Device Registered
              </span>
            </div>
          )}
        </div>
      </div>

      {showUnlock && (
        <Modal onClose={handleCloseUnlock}>
          <UnlockFMI deviceInfo={{ 
            model: device.modelName, 
            imei, 
            img: device.imageUrl 
          }} />
        </Modal>
      )}
    </div>
  );
};

export default PhoneData;
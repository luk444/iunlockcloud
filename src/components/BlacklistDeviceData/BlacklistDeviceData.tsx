import React, { useState, useEffect, useRef } from 'react';
import { Shield, Smartphone, AlertTriangle, CheckCircle, X, Watch, Tablet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registerDevice } from '../../services/deviceService';
import { registerSerialDevice } from '../../services/serialDeviceService';
import { Device, SerialDevice } from '../../types';
import Modal from '../Modal/Modal';
import BlacklistRemovalProcess from '../BlacklistRemovalProcess/BlacklistRemovalProcess';
import toast from 'react-hot-toast';

interface BlacklistDeviceDataProps {
  imei: string;
  device: Device | SerialDevice;
  onClose: () => void;
}

const BlacklistDeviceData: React.FC<BlacklistDeviceDataProps> = ({ imei, device, onClose }) => {
  const [showRemoval, setShowRemoval] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const { currentUser } = useAuth();
  const deviceDataRef = useRef<HTMLDivElement>(null);

  const isSerialDevice = (dev: Device | SerialDevice): dev is SerialDevice => {
    return 'deviceType' in dev;
  };

  useEffect(() => {
    if (deviceDataRef.current) {
      deviceDataRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
              blacklistStatus: 'Reported',
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
              blacklistStatus: 'Reported',
              activationLock: 'Active',
              icloudStatus: 'Locked'
            }
          }, device.credits);
        }
        
        setIsRegistered(true);
        
        // Show success notification with credits deducted
        if (!currentUser.isAdmin) {
          toast.success(
            `✅ Dispositivo registrado para remoción de blacklist! -${device.credits} créditos`,
            {
              duration: 4000,
              style: {
                background: '#DC2626',
                color: 'white',
                fontWeight: '500',
              },
              iconTheme: {
                primary: 'white',
                secondary: '#DC2626',
              },
            }
          );
        } else {
          toast.success(
            `✅ Dispositivo registrado para remoción de blacklist!`,
            {
              duration: 3000,
              style: {
                background: '#DC2626',
                color: 'white',
                fontWeight: '500',
              },
            }
          );
        }
      } catch (error: any) {
        console.error('Error registering device:', error);
        toast.error(
          error.message || 'Error al registrar dispositivo para blacklist',
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

  const handleRemoval = () => {
    setShowRemoval(true);
  };

  const handleCloseRemoval = () => {
    setShowRemoval(false);
  };

  const getDeviceIcon = () => {
    if (isSerialDevice(device)) {
      return device.deviceType === 'applewatch' ? 
        <Watch className="text-red-500" size={20} /> : 
        <Tablet className="text-red-500" size={20} />;
    }
    return <Smartphone className="text-red-500" size={20} />;
  };

  const getIdentifierLabel = () => {
    return isSerialDevice(device) ? 'Serial Number' : 'IMEI';
  };

  return (
    <div
      ref={deviceDataRef}
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
              <div className="p-1 bg-red-100 rounded-full">
                <Shield className="text-red-600" size={16} />
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
            <div className="p-2 bg-red-50 rounded-lg">
              <p className="text-xs text-gray-500">Blacklist Status</p>
              <p className="font-medium text-red-600 text-sm">Reported</p>
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
  
          <div className="p-2 bg-red-50 rounded-lg">
            <p className="text-xs text-gray-500">Credits Required</p>
            <p className="font-medium text-red-600 text-sm">{device.credits} Credits</p>
          </div>
  
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="font-medium text-red-700 text-sm">Blacklist Warning</p>
            </div>
            <p className="text-red-600 text-xs">
              This device has been reported and is currently blacklisted. Professional removal service required.
            </p>
          </div>
  
          <button
            onClick={handleRemoval}
            disabled={registering || !isRegistered}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium text-sm rounded-lg hover:from-red-600 hover:to-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield size={14} />
            {registering ? 'Registering...' : 'Remove from Blacklist'}
          </button>
  
          {registering && (
            <div className="flex justify-center mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-500 border-t-transparent"></div>
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
  
      {showRemoval && (
        <Modal onClose={handleCloseRemoval}>
          <BlacklistRemovalProcess
            deviceInfo={{
              model: device.modelName,
              imei,
              img: device.imageUrl
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default BlacklistDeviceData;
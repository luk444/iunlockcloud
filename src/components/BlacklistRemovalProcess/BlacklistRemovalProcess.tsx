import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { ShieldCheck, AlertCircle, Shield, Ticket, Smartphone, Wifi, Server, CheckCircle2, Database } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';
import { useProcessTiming } from '../../hooks/useProcessTiming';

interface DeviceInfo {
  model: string;
  imei: string;
  img: string;
}

interface BlacklistRemovalProcessProps {
  deviceInfo: DeviceInfo;
}

const BlacklistRemovalProcess: React.FC<BlacklistRemovalProcessProps> = ({ deviceInfo }) => {
  const [loadMessage, setLoadMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [secondMsg, setSecondMsg] = useState<boolean>(false);
  const [showTicketForm, setShowTicketForm] = useState<boolean>(false);
  const [ticketText, setTicketText] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const { currentUser } = useAuth();
  const { getRandomTime, getStepDistribution } = useProcessTiming();

  const handleRemoval = () => {
    setLoadMessage("Validating device eligibility");
    
    // Generar tiempo total aleatorio entre 5-15 minutos
    const totalTime = getRandomTime('blacklist');
    const distribution = getStepDistribution('blacklist', 1);
    
    // Dividir el tiempo en pasos proporcionales
    const step1Time = Math.floor(totalTime * (distribution.step1 / 100));
    const step2Time = Math.floor(totalTime * (distribution.step2 / 100));
    const step3Time = Math.floor(totalTime * (distribution.step3 / 100));
    const step4Time = Math.floor(totalTime * (distribution.step4 / 100));
    
    const steps = [
      { message: "Connecting to blacklist database", delay: step1Time },
      { message: "Analyzing report status", delay: step2Time },
      { message: "Preparing removal token", delay: step3Time },
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
    setLoadMessage("Processing blacklist removal");
    
    // Generar tiempo total aleatorio entre 5-15 minutos para la segunda fase
    const totalTime = getRandomTime('blacklist');
    const distribution = getStepDistribution('blacklist', 2);
    
    // Dividir el tiempo en pasos proporcionales
    const step1Time = Math.floor(totalTime * (distribution.step1 / 100));
    const step2Time = Math.floor(totalTime * (distribution.step2 / 100));
    const step3Time = Math.floor(totalTime * (distribution.step3 / 100));
    const step4Time = Math.floor(totalTime * (distribution.step4 / 100));
    
    const steps = [
      { message: "Verifying with external validation tools", delay: step1Time },
      { message: "Cross-referencing security databases", delay: step2Time },
      { message: "Finalizing removal process", delay: step3Time },
      { action: () => { setLoadMessage(null); setSecondMsg(false); setError(true); }, delay: step4Time }
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
        title: `Blacklist removal failed for ${deviceInfo.model}`,
        description: `Blacklist removal failed: ${ticketText}`,
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
    <div className="p-4">
      {/* Device Header */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
        <div className="relative">
          <img 
            src={deviceInfo.img} 
            alt={deviceInfo.model} 
            className="w-12 h-12 object-contain bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-2 shadow-md"
          />
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border border-gray-900"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white truncate">{deviceInfo.model}</h3>
          <p className="text-gray-400 text-xs font-mono truncate">IMEI: {deviceInfo.imei}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-xs">Blacklisted</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loadMessage ? (
          <div className="flex flex-col items-center w-full transition-all duration-500 ease-in-out">
            <div className="relative mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 w-12 h-12 border-2 border-red-500/30 rounded-full animate-ping"></div>
            </div>
            <div className="text-center">
              <p className="text-gray-300 text-sm font-medium mb-1">{loadMessage}</p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-3 text-center">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertCircle size={18} className="text-red-400" />
              </div>
              <h3 className="text-red-400 font-bold text-sm mb-1">BLACKLIST REMOVAL FAILED</h3>
              <p className="text-red-300 text-xs leading-relaxed">
                Device failed external validation checks. Report found in security database.
              </p>
            </div>
            
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-3">
              <p className="text-red-300 text-xs text-center leading-relaxed">
                <strong>Solution:</strong> This device can only be processed using IMEI 2 eSIM functionality. 
                Standard blacklist removal is not available for devices with external security reports.
              </p>
            </div>
            
            {!showTicketForm ? (
              <button
                onClick={handleCreateTicket}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-[1.01]"
              >
                <Ticket size={16} />
                Create Support Ticket
              </button>
            ) : !ticketSubmitted ? (
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 p-2 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Ticket size={10} className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">Support Ticket</h4>
                    <p className="text-gray-400 text-sm">Processed within 3 business days</p>
                  </div>
                </div>
                <textarea
                  value={ticketText}
                  onChange={(e) => setTicketText(e.target.value)}
                  placeholder="Describe your issue or request IMEI 2 eSIM service..."
                  className="w-full bg-gray-700/50 text-white rounded-lg p-2 text-sm border border-gray-600/50 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                  rows={2}
                />
                <button 
                  onClick={handleSubmitTicket}
                  className="w-full py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-[1.01]"
                >
                  Submit Ticket
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 p-3 rounded-lg text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                </div>
                <h4 className="text-green-400 font-medium text-sm mb-1">Ticket Submitted!</h4>
                <p className="text-green-300 text-xs">
                  We'll contact you within 24-48 hours with IMEI 2 eSIM options.
                </p>
              </div>
            )}
          </div>
        ) : secondMsg ? (
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-3 text-center">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone size={18} className="text-red-400" />
              </div>
              <h3 className="text-red-400 font-medium text-sm mb-1">Next Steps</h3>
              <p className="text-red-300 text-xs leading-relaxed">
                Ensure device is powered on and connected to network
              </p>
            </div>
            <button 
              onClick={handleSecondMessage}
              className="w-full py-2.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transform hover:scale-[1.01]"
            >
              <Wifi size={16} />
              Continue Validation
            </button>
          </div>
        ) : (
          <button 
            onClick={handleRemoval}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:via-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
          >
            <Shield size={16} />
            START BLACKLIST REMOVAL
          </button>
        )}

        {/* Security Info */}
        {!loadMessage && !error && (
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-700/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-red-500/20 rounded-full flex items-center justify-center">
                <ShieldCheck size={14} className="text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium text-xs">Professional Service</p>
                <p className="text-gray-400 text-xs">Advanced Security Validation</p>
              </div>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Advanced blacklist removal with external validation and security database verification. 
              Professional service with comprehensive security checks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlacklistRemovalProcess;
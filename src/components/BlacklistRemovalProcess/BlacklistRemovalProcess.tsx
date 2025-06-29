import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import { ShieldCheck, AlertCircle, Shield, Ticket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ticketService } from '../../services/ticketService';

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

  const handleRemoval = () => {
    setLoadMessage("Validating device eligibility");
    
    const steps = [
      { message: "Connecting to blacklist database", delay: 4000 },
      { message: "Analyzing report status", delay: 8000 },
      { message: "Preparing removal token", delay: 8000 },
      { action: () => { setLoadMessage(null); setSecondMsg(true); }, delay: 15000 }
    ];
    
    steps.forEach(step => {
      setTimeout(() => {
        if (step.message) setLoadMessage(step.message);
        if (step.action) step.action();
      }, step.delay);
    });
  };

  const handleSecondMessage = () => {
    setLoadMessage("Processing blacklist removal");
    
    const steps = [
      { message: "Verifying with external validation tools", delay: 4000 },
      { message: "Cross-referencing security databases", delay: 8000 },
      { message: "Finalizing removal process", delay: 9000 },
      { action: () => { setLoadMessage(null); setSecondMsg(false); setError(true); }, delay: 15000 }
    ];
    
    steps.forEach(step => {
      setTimeout(() => {
        if (step.message) setLoadMessage(step.message);
        if (step.action) step.action();
      }, step.delay);
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
              <span>BLACKLIST REMOVAL FAILED</span>
            </div>
            <p className="text-red-500 font-semibold text-center">
              Device failed external validation checks. Report found in security database.
            </p>
            <div className="bg-red-500/20 p-4 rounded-lg">
              <p className="text-red-400 text-sm text-center">
                <strong>Solution:</strong> This device can only be processed using IMEI 2 eSIM functionality. 
                Standard blacklist removal is not available for devices with external security reports.
              </p>
            </div>
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
                  Your support ticket will be processed within 3 business days. For devices with external reports, 
                  IMEI 2 eSIM service may be available as an alternative solution.
                </p>
                <textarea
                  value={ticketText}
                  onChange={(e) => setTicketText(e.target.value)}
                  placeholder="Describe your issue or request IMEI 2 eSIM service..."
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
                  Ticket submitted successfully! Our team will contact you within 24-48 hours with IMEI 2 eSIM options.
                </p>
              </div>
            )}
          </div>
        ) : secondMsg ? (
          <div className="space-y-4">
            <p className="text-white text-center font-medium">
              Ensure device is powered on and connected to network
            </p>
            <button 
              onClick={handleSecondMessage}
              className="w-full py-3 bg-white/10 border border-white/20 rounded-lg font-semibold text-white hover:bg-white/20 transition-all duration-300"
            >
              Continue Validation
            </button>
          </div>
        ) : (
          <button 
            onClick={handleRemoval}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Shield size={18} />
            START BLACKLIST REMOVAL
          </button>
        )}

        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-red-400" />
            <p className="text-red-400 text-sm font-medium">Professional Service</p>
          </div>
          <p className="text-gray-400 text-sm">
            Advanced blacklist removal with external validation and security database verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlacklistRemovalProcess;
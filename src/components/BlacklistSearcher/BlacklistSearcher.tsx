import React, { useState } from 'react';
import { Search, HelpCircle, CreditCard, Smartphone, AlertCircle, Shield, CheckCircle, Clock, Star, Zap, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getDeviceByImei } from '../../services/deviceService';
import { getDeviceBySerial } from '../../services/serialDeviceService';
import { Device, SerialDevice } from '../../types';
import toast from 'react-hot-toast';

interface BlacklistSearcherProps {
  onSearch: (imei: string) => void;
  onSelectDevice: (device: Device | SerialDevice) => void;
}

const BlacklistSearcher: React.FC<BlacklistSearcherProps> = ({ onSearch, onSelectDevice }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const isNumeric = (str: string) => /^\d+$/.test(str);
  const isValidImei = (str: string) => isNumeric(str) && str.length === 15;
  const isValidSerial = (str: string) => /^[A-Z0-9]+$/.test(str) && str.length >= 8 && str.length <= 12;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    
    // Allow alphanumeric characters for serial numbers
    const filteredValue = value.replace(/[^A-Z0-9]/g, '');
    
    // Limit length based on input type
    const maxLength = isNumeric(filteredValue) ? 15 : 12;
    const finalValue = filteredValue.slice(0, maxLength);
    
    setInput(finalValue);
  };

  const isValidInput = (str: string) => {
    return isValidImei(str) || isValidSerial(str);
  };

  const handleSearch = async () => {
    if (!isValidInput(input)) {
      toast.error('Please enter a valid IMEI (15 digits) or Serial Number (8-12 characters)');
      return;
    }

    setLoading(true);
    try {
      let device = null;
      
      if (isNumeric(input)) {
        // IMEI lookup - now uses the enhanced service that checks API
        device = await getDeviceByImei(input);
      } else {
        // Serial number lookup
        device = await getDeviceBySerial(input);
      }
      
      if (device) {
        if (!currentUser || (currentUser && !currentUser.isAdmin && (!currentUser.credits || currentUser.credits < device.credits))) {
          toast.error(`You need ${device.credits} credits to process this device`);
          return;
        }
        onSearch(input);
        onSelectDevice(device);
      } else {
        toast.error('Device not found in our database or API');
      }
    } catch (error) {
      console.error('Error searching device:', error);
      toast.error('Error searching for device');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getPlaceholderText = () => {
    if (isNumeric(input)) {
      return "Enter your IMEI (15 digits)";
    }
    return "Enter IMEI (15 digits) or Serial Number (8-12 chars)";
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 mt-4 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 text-blue-500">
          <CreditCard size={20} />
          <span className="font-semibold">
            CREDITS: {currentUser ? currentUser.credits : 0}
          </span>
        </div>
        
        {!currentUser ? (
          <div>
            <Link
              to="/login"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Login to access all features
            </Link>
          </div>
        ) : currentUser.credits === 0 && !currentUser.isAdmin ? (
          <div>
            <Link
              to="/credits"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Purchase credits to process devices
            </Link>
          </div>
        ) : null}
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Blacklist Removal</h2>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={getPlaceholderText()}
              className="input"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              disabled={!isValidInput(input) || loading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Search size={20} />
              )}
            </button>
            <Link to="/guide" className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors transform hover:scale-105">
              <HelpCircle size={20} className="text-gray-600" />
            </Link>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>• iPhone: Enter 15-digit IMEI number</p>
            <p>• Apple Watch/iPad: Enter 8-12 character serial number</p>
            <p>• Device info automatically detected via API</p>
          </div>
        </div>
      </div>

      {!currentUser?.isAdmin && currentUser?.credits === 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle size={20} />
            <p className="font-medium">You need credits to process blacklist removal</p>
          </div>
          <p className="mt-2 text-red-600">
            Please purchase credits to remove devices from blacklist. Each device requires a specific amount of credits for processing.
          </p>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-8 text-center">Service Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            {
              icon: <Shield className="text-gray-700" size={20} />,
              title: "Professional Service",
              description: "Expert blacklist removal for reported devices"
            },
            {
              icon: <Smartphone className="text-gray-700" size={20} />,
              title: "Advanced Detection",
              description: "AI-powered validation with automatic recognition"
            },
            {
              icon: <AlertCircle className="text-gray-700" size={20} />,
              title: "Secure Processing",
              description: "Enterprise-grade security protocols"
            },
            {
              icon: <Zap className="text-gray-700" size={20} />,
              title: "Instant Results",
              description: "Get blacklist status in seconds"
            },
            {
              icon: <Lock className="text-gray-700" size={20} />,
              title: "Secure API",
              description: "Protected and encrypted data transmission"
            },
            {
              icon: <Globe className="text-gray-700" size={20} />,
              title: "Global Access",
              description: "Available worldwide with 24/7 support"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default BlacklistSearcher;
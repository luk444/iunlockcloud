import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-1 text-gray-400 hover:text-white transition-colors bg-gray-800/50 rounded-full"
        >
          <X size={18} />
        </button>
        <div className="overflow-y-auto max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, CreditCard, Smartphone, Wifi, RotateCcw, MessageSquare, DollarSign } from 'lucide-react';

const UnlockGuide: React.FC = () => {
  const steps = [
    {
      title: "Check Your Device",
      description: "First, verify your device information using our device checker to confirm compatibility and see the required credits.",
      icon: <Smartphone className="text-blue-500" size={24} />,
      details: [
        "Go to the 'Check Device' section",
        "Enter your device's IMEI number",
        "Review device information and credit requirements"
      ]
    },
    {
      title: "Load Credits (USDT)",
      description: "Purchase credits in USDT to process your device unlock. Contact our moderator via Telegram or send directly to our wallet.",
      icon: <CreditCard className="text-green-500" size={24} />,
      details: [
        "Contact moderator via Telegram for assistance",
        "Or send USDT directly to our specified wallet address",
        "Wait for credit confirmation in your account"
      ]
    },
    {
      title: "Register Your Device",
      description: "Once you have sufficient credits, register your device using the IMEI number.",
      icon: <Shield className="text-purple-500" size={24} />,
      details: [
        "Go to 'Register Device' section",
        "Paste your device's IMEI number",
        "Confirm device registration"
      ]
    },
    {
      title: "Start Unlock Process",
      description: "Turn off your device and initiate the unlock process.",
      icon: <Clock className="text-orange-500" size={24} />,
      details: [
        "Turn OFF your device completely",
        "Click 'Unlock Device' button",
        "Click 'Send Token Activation'",
        "Wait for the tool to request device power on"
      ]
    },
    {
      title: "Device Activation",
      description: "When prompted, turn on your device and connect to internet.",
      icon: <Wifi className="text-cyan-500" size={24} />,
      details: [
        "Turn ON your device when requested",
        "Connect to WiFi network",
        "Or insert SIM card (if you have numeric passcode)",
        "Click 'Continue' and wait for unlock result"
      ]
    },
    {
      title: "Complete Process",
      description: "Handle the unlock result and finalize the process.",
      icon: <CheckCircle className="text-green-500" size={24} />,
      details: [
        "If successful: Restart device (or factory reset if in passcode)",
        "If error: Generate support ticket for verification",
        "Configure device from scratch if factory reset was needed"
      ]
    }
  ];

  const importantNotes = [
    {
      icon: <AlertTriangle className="text-red-500" size={20} />,
      title: "Password Changes",
      text: "If the device owner changed the password recently, NO REFUND will be issued. We only charge for the token generation, and password changes are beyond our control."
    },
    {
      icon: <DollarSign className="text-blue-500" size={20} />,
      title: "Operational Costs",
      text: "Due to operational expenses, refunds are not available for password-related issues or owner-initiated changes."
    },
    {
      icon: <MessageSquare className="text-purple-500" size={20} />,
      title: "Support Tickets",
      text: "Create a support ticket if the unlock fails validation. Our team will verify the issue and provide assistance."
    },
    {
      icon: <RotateCcw className="text-orange-500" size={20} />,
      title: "Factory Reset",
      text: "If your device has a passcode, you'll need to perform a factory reset after successful unlock to configure it from scratch."
    }
  ];

  const requirements = [
    "Device must be powered off before starting",
    "Stable internet connection (WiFi or cellular)",
    "Sufficient credits in your account",
    "Device should not have recent password changes",
    "Do not attempt password changes during unlock process"
  ];

  const successTips = [
    "Keep device powered on during the entire process",
    "Ensure stable internet connection throughout",
    "Follow instructions exactly as provided",
    "Do not interrupt the process once started",
    "Contact support immediately if issues arise"
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">iPhone Unlock Process Guide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete step-by-step guide to unlock your iPhone using our professional service. 
            Follow these instructions carefully for the best results.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Unlock Process Steps</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-shrink-0">{step.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-gray-500 flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements and Tips */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-blue-600" />
              Requirements
            </h3>
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="text-blue-800 flex items-start gap-2">
                  <CheckCircle size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center gap-2">
              <Shield size={24} className="text-green-600" />
              Success Tips
            </h3>
            <ul className="space-y-3">
              {successTips.map((tip, index) => (
                <li key={index} className="text-green-800 flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Important Notes & Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {importantNotes.map((note, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start gap-3 mb-2">
                  {note.icon}
                  <h4 className="font-semibold text-gray-900">{note.title}</h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you encounter any issues during the unlock process or have questions about our service, 
            don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://t.me/idelete_creditos_mod"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <MessageSquare size={20} />
              Contact via Telegram
            </a>
            <button className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              <Shield size={20} />
              Create Support Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockGuide;
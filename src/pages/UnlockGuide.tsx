import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, CreditCard, Smartphone, Wifi, RotateCcw, MessageSquare, DollarSign, HelpCircle } from 'lucide-react';

const UnlockGuide: React.FC = () => {
  const steps = [
    {
      title: "Check Your Device",
      description: "First, verify your device information using our device checker to confirm compatibility and see the required credits.",
      icon: <Smartphone className="text-gray-700" size={24} />,
      details: [
        "Go to the 'Check Device' section",
        "Enter your device's IMEI number",
        "Review device information and credit requirements"
      ]
    },
    {
      title: "Load Credits (USDT)",
      description: "Purchase credits in USDT to process your device unlock. Contact our moderator via Telegram or send directly to our wallet.",
      icon: <CreditCard className="text-gray-700" size={24} />,
      details: [
        "Contact moderator via Telegram for assistance",
        "Or send USDT directly to our specified wallet address",
        "Wait for credit confirmation in your account"
      ]
    },
    {
      title: "Register Your Device",
      description: "Once you have sufficient credits, register your device using the IMEI number.",
      icon: <Shield className="text-gray-700" size={24} />,
      details: [
        "Go to 'Register Device' section",
        "Paste your device's IMEI number",
        "Confirm device registration"
      ]
    },
    {
      title: "Start Unlock Process",
      description: "Turn off your device and initiate the unlock process.",
      icon: <Clock className="text-gray-700" size={24} />,
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
      icon: <Wifi className="text-gray-700" size={24} />,
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
      icon: <CheckCircle className="text-gray-700" size={24} />,
      details: [
        "If successful: Restart device (or factory reset if in passcode)",
        "If error: Generate support ticket for verification",
        "Configure device from scratch if factory reset was needed"
      ]
    }
  ];

  const importantNotes = [
    {
      icon: <AlertTriangle className="text-gray-700" size={20} />,
      title: "Password Changes",
      text: "If the device owner changed the password recently, NO REFUND will be issued. We only charge for the token generation, and password changes are beyond our control."
    },
    {
      icon: <DollarSign className="text-gray-700" size={20} />,
      title: "Operational Costs",
      text: "Due to operational expenses, refunds are not available for password-related issues or owner-initiated changes."
    },
    {
      icon: <MessageSquare className="text-gray-700" size={20} />,
      title: "Support Tickets",
      text: "Create a support ticket if the unlock fails validation. Our team will verify the issue and provide assistance."
    },
    {
      icon: <RotateCcw className="text-gray-700" size={20} />,
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
    "Keep the device off when starting the process.",
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
          <div className="rounded-xl p-6 border border-gray-200" style={{ backgroundColor: 'rgb(29 41 109 / 15%)' }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-gray-700" />
              Requirements
            </h3>
            <ul className="space-y-3">
              {requirements.map((req, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <CheckCircle size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-6 border border-gray-200" style={{ backgroundColor: 'rgb(29 109 65 / 15%)' }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Shield size={24} className="text-gray-700" />
              Success Tips
            </h3>
            <ul className="space-y-3">
              {successTips.map((tip, index) => (
                <li key={index} className="text-gray-700 flex items-start gap-2">
                  <CheckCircle size={16} className="text-gray-600 mt-0.5 flex-shrink-0" />
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

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "How long does the unlock process take?",
                answer: "The unlock process typically takes 10-35 minutes once you have sufficient credits and follow all steps correctly."
              },
              {
                question: "What if the unlock fails?",
                answer: "If the unlock fails, create a support ticket. Our team will verify the issue and provide assistance or refund if applicable."
              },
              {
                question: "Do I need to factory reset my device?",
                answer: "Factory reset is only required if your device has a passcode. For devices without passcode, a simple restart is sufficient."
              },
              {
                question: "Can I get a refund if it doesn't work?",
                answer: "Refunds are not available for password-related issues or owner-initiated changes. We only charge for token generation."
              },
              {
                question: "What devices are supported?",
                answer: "We support all iPhone models from iPhone 5 to iPhone 16 Pro Max, including Apple Watch and iPad serial numbers."
              }
            ].map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle size={20} className="text-gray-700" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Need Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-gray-700" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
              If you encounter any issues during the unlock process or have questions about our service, don't hesitate to contact our support team.
            </p>
            <a
              href="https://t.me/idelete_creditos_mod"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="20" height="20">
                <path d="M9.993 16.485l-.402 5.647c.575 0 .824-.247 1.127-.544l2.7-2.57 5.594 4.08c1.024.564 1.762.267 2.03-.952L23.99 3.668c.371-1.506-.544-2.096-1.546-1.74L1.11 9.72c-1.463.55-1.448 1.337-.25 1.694l5.818 1.82 13.49-8.517c.635-.419 1.214-.188.738.233L9.993 16.485z" />
              </svg>
              Contact via Telegram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockGuide;
import React, { useState, useEffect } from 'react';
import { Wallet, CreditCard, AlertCircle, Copy, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';

const AddCredits: React.FC = () => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletIndex, setWalletIndex] = useState(0);
  const { currentUser } = useAuth();

  // Admin wallet addresses - replace with your actual wallets
  const ADMIN_WALLETS = [
    "0x55d398326f99059fF775485246999027B3197955",
    "0xbfdc4c848e38abd2d4d31324aff756c2351cc43f"
  ];

  const currentWallet = ADMIN_WALLETS[walletIndex];

  useEffect(() => {
    checkPendingPayments();
  }, [currentUser]);

  const checkPendingPayments = async () => {
    if (!currentUser) return;
    
    try {
      const userPayments = await paymentService.getUserPayments(currentUser.uid);
      const pendingPayment = userPayments.find(payment => payment.status === 'pending');
      setHasPendingPayment(!!pendingPayment);
    } catch (error) {
      console.error('Error checking pending payments:', error);
      // No mostrar error al usuario, solo log
    }
  };

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount < 1) {
      setError('Minimum amount is 1 USDT');
      return false;
    }
    
    if (!walletAddress.trim()) {
      setError('Please enter your wallet address');
      return false;
    }
    
    if (walletAddress.length < 26) {
      setError('Please enter a valid wallet address');
      return false;
    }
    
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    
    if (hasPendingPayment) {
      setError('You already have a pending payment. Please wait for it to be processed.');
      return;
    }
    
    setError('');
    setStep('payment');
  };

  const handleSubmit = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError('');
      
      const paymentId = await paymentService.createPaymentRequest(
        currentUser.uid,
        currentUser.email || '',
        parseFloat(amount),
        walletAddress
      );

      setStep('success');
      setHasPendingPayment(true);
      
      // Show success notification
      toast.success(
        `💰 Credit request submitted! ${parseFloat(amount)} credits will be processed`,
        {
          duration: 5000,
          style: {
            background: '#059669',
            color: 'white',
            fontWeight: '500',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#059669',
          },
        }
      );
    } catch (err: any) {
      console.error(err);
      
      if (err.message.includes('pending payment')) {
        setError('You already have a pending payment. Please wait for it to be processed.');
      } else {
        setError('Error processing payment request. Please try again.');
      }
      
      // Show error notification
      toast.error(
        'Error processing payment request',
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
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentWallet);
      setCopied(true);
      toast.success(
        '📋 Address copied to clipboard!',
        {
          duration: 2000,
          style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '500',
          },
        }
      );
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Error copying address');
    }
  };

  const refreshWallet = () => {
    setWalletIndex((prevIndex) => (prevIndex + 1) % ADMIN_WALLETS.length);
    setCopied(false);
    toast.success(
      `🔄 Switched to wallet ${walletIndex + 2 > ADMIN_WALLETS.length ? 1 : walletIndex + 2}`,
      {
        duration: 2000,
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '500',
        },
      }
    );
  };

  const resetForm = () => {
    setStep('form');
    setAmount('');
    setWalletAddress('');
    setError('');
  };

  return (
    <div className="bg-gray-50 mt-16">
      <div className="max-w-md mx-auto px-4 pt-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="text-blue-500" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Add Credits</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-2" size={16} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {hasPendingPayment && step === 'form' && (
            <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
              <div className="flex items-center">
                <Clock className="text-yellow-500 mr-2" size={16} />
                <p className="text-sm text-yellow-700">
                  You have a pending payment being processed. Please wait for confirmation before creating a new order.
                </p>
              </div>
            </div>
          )}

          {step === 'form' && (
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (USDT) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount in USDT"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: 1 USDT • You will receive {amount ? parseFloat(amount) : 0} credits
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Wallet Address (Source) *
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your USDT wallet address"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The wallet address from which you will send USDT
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={hasPendingPayment}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Wallet size={18} />
                Continue
              </button>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                1 USDT = 1 Credit
              </p>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Don't have a wallet or USDT?
                </p>
                <a
                  href="https://t.me/idelete_creditos_mod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#229ED9] hover:bg-[#1b8cb8] text-white font-medium transition-colors duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M9.993 16.485l-.402 5.647c.575 0 .824-.247 1.127-.544l2.7-2.57 5.594 4.08c1.024.564 1.762.267 2.03-.952L23.99 3.668c.371-1.506-.544-2.096-1.546-1.74L1.11 9.72c-1.463.55-1.448 1.337-.25 1.694l5.818 1.82 13.49-8.517c.635-.419 1.214-.188.738.233L9.993 16.485z" />
                  </svg>
                  Contact via Telegram
                </a>
              </div>

            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Payment Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Amount:</strong> {amount} USDT</p>
                  <p><strong>Credits:</strong> {parseFloat(amount)}</p>
                  <p><strong>Your Wallet:</strong> {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 6)}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Send USDT to this address:</h3>
                <div className="flex items-center gap-2 p-2 bg-white border rounded-lg">
                  <code className="flex-1 text-sm font-mono break-all">{currentWallet}</code>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                    title="Copy address"
                  >
                    {copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                  <button
                    onClick={refreshWallet}
                    className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                    title="Switch to alternative wallet"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 If the first wallet doesn't work, click the refresh button to try the alternative wallet
                </p>
              </div>

              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <div className="flex items-start">
                  <AlertCircle className="text-red-500 mr-2 mt-0.5" size={16} />
                  <div className="text-sm text-red-700">
                    <p className="font-medium mb-1">⚠️ Important Network Warning</p>
                    <p>Only send USDT via <strong>BEP20 (Binance Smart Chain) network</strong>. If you use any other network, you will permanently lose your money.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      I sent the money
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="text-green-500" size={32} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Perfect!</h3>
                <p className="text-gray-700 mb-4">
                  Your order is being processed. Credits will be added to your account once the transaction is confirmed.
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-left">
                <h4 className="font-medium text-green-800 mb-2">What's next?</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Our team will verify your transaction</li>
                  <li>• Credits will be added within 24-48 hours</li>
                  <li>• You'll see the balance update in your account</li>
                  <li>• Check the "Tickets" section for updates</li>
                </ul>
              </div>

              <button
                onClick={resetForm}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                Create Another Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCredits;
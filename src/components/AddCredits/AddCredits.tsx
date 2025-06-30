import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  CreditCard, 
  AlertCircle, 
  Copy, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Shield,
  Zap,
  Star,
  ChevronRight,
  Info,
  TrendingUp,
  Users,
  Award,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Target,
  Gift,
  Crown,
  Coffee,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentService } from '../../services/paymentService';
import { ticketService } from '../../services/ticketService';
import toast from 'react-hot-toast';

const AddCredits: React.FC = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<'info' | 'form' | 'payment' | 'success'>('info');
  const [amount, setAmount] = useState('');
  const [totalCredits, setTotalCredits] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasPendingPayment, setHasPendingPayment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [walletIndex, setWalletIndex] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<{amount: number, credits: number, description: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isVisible, setIsVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'usdt' | 'kofi'>('usdt');
  const [paymentId, setPaymentId] = useState<string>('');

  // Admin wallet addresses
  const ADMIN_WALLETS = [
    "0x55d398326f99059fF775485246999027B3197955",
    "0xbfdc4c848e38abd2d4d31324aff756c2351cc43f"
  ];

  const currentWallet = ADMIN_WALLETS[walletIndex];

  // Entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check for pending payments on component mount
  useEffect(() => {
    if (currentUser) {
      checkPendingPayments();
    }
  }, [currentUser]);

  const checkPendingPayments = async () => {
    try {
      const userPayments = await paymentService.getUserPayments(currentUser!.uid);
      const hasPending = userPayments.some(payment => payment.status === 'pending');
      setHasPendingPayment(hasPending);
    } catch (error) {
      console.error('Error checking pending payments:', error);
    }
  };

  // Real iPhone pricing data with actual images
  const iphoneModels = [
    { name: "iPhone 15 Pro Max", price: 68, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-pro-max-family.240x240.png", difficulty: "Extreme", year: "2023" },
    { name: "iPhone 15 Pro", price: 65, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-pro-family.240x240.png", difficulty: "Extreme", year: "2023" },
    { name: "iPhone 15 Plus", price: 63, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-plus-family.240x240.png", difficulty: "Hard", year: "2023" },
    { name: "iPhone 15", price: 63, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/images/iphone-15-family.240x240.png", difficulty: "Hard", year: "2023" },
    { name: "iPhone 14 Pro Max", price: 60, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone14-pro-max.240x240.png", difficulty: "Hard", year: "2022" },
    { name: "iPhone 14 Pro", price: 58, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone14-pro.240x240.png", difficulty: "Hard", year: "2022" },
    { name: "iPhone 14 Plus", price: 55, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-14-plus-family.240x240.png", difficulty: "Medium", year: "2022" },
    { name: "iPhone 14", price: 54, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-14-family.240x240.png", difficulty: "Medium", year: "2022" },
    { name: "iPhone 13 Pro Max", price: 50, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-pro-max-colors.240x240.png", difficulty: "Medium", year: "2021" },
    { name: "iPhone SE 2023", price: 50, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se-3rd-gen-colors.240x240.png", difficulty: "Medium", year: "2023" },
    { name: "iPhone 8", price: 50, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-8.240x240.png", difficulty: "Medium", year: "2017" },
    { name: "iPhone 13 Pro", price: 48, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-pro-colors.240x240.png", difficulty: "Medium", year: "2021" },
    { name: "iPhone 13 Mini", price: 45, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-mini-colors.240x240.png", difficulty: "Easy", year: "2021" },
    { name: "iPhone 13", price: 45, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone13-colors.240x240.png", difficulty: "Easy", year: "2021" },
    { name: "iPhone 12 Pro Max", price: 43, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12promax.240x240.png", difficulty: "Easy", year: "2020" },
    { name: "iPhone 12 Pro", price: 42, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12pro.240x240.png", difficulty: "Easy", year: "2020" },
    { name: "iPhone 12", price: 40, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12.240x240.png", difficulty: "Easy", year: "2020" },
    { name: "iPhone 12 Mini", price: 39, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-12-mini.240x240.png", difficulty: "Easy", year: "2020" },
    { name: "iPhone 11 Pro Max", price: 38, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11promax.240x240.png", difficulty: "Easy", year: "2019" },
    { name: "iPhone 11 Pro", price: 36, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11pro.240x240.png", difficulty: "Easy", year: "2019" },
    { name: "iPhone SE 2020", price: 35, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se-3rd-gen-colors.240x240.png", difficulty: "Easy", year: "2020" },
    { name: "iPhone 11", price: 35, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-11.240x240.png", difficulty: "Easy", year: "2019" },
    { name: "iPhone XR", price: 33, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xr.240x240.png", difficulty: "Easy", year: "2018" },
    { name: "iPhone XS", price: 33, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xs.240x240.png", difficulty: "Easy", year: "2018" },
    { name: "iPhone XS Max", price: 33, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-xsmax.240x240.png", difficulty: "Easy", year: "2018" },
    { name: "iPhone X", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-x.240x240.png", difficulty: "Easy", year: "2017" },
    { name: "iPhone SE", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-se.240x240.png", difficulty: "Easy", year: "2016" },
    { name: "iPhone 8 Plus", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-8plus.240x240.png", difficulty: "Easy", year: "2017" },
    { name: "iPhone 7", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-7.240x240.png", difficulty: "Easy", year: "2016" },
    { name: "iPhone 7 Plus", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-7plus.240x240.png", difficulty: "Easy", year: "2016" },
    { name: "iPhone 6", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6.240x240.png", difficulty: "Easy", year: "2014" },
    { name: "iPhone 6s", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6s.240x240.png", difficulty: "Easy", year: "2015" },
    { name: "iPhone 6s Plus", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6splus.240x240.png", difficulty: "Easy", year: "2015" },
    { name: "iPhone 6 Plus", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-6plus.240x240.png", difficulty: "Easy", year: "2014" },
    { name: "iPhone 5", price: 25, imageUrl: "https://cdsassets.apple.com/live/I2F2FLC5/iphone/iphone-5.240x240.png", difficulty: "Easy", year: "2012" }
  ];

  const creditPackages = [
    {
      amount: 25,
      bonus: 0,
      popular: false,
      description: "Perfect for 1 device",
      icon: Target,
      savings: 0,
      color: "gray",
      features: ["1 iPhone", "24/7 Support", "Guaranteed"]
    },
    {
      amount: 50,
      bonus: 5,
      popular: false,
      description: "Great for 2-3 devices",
      icon: Zap,
      savings: 10,
      color: "slate",
      features: ["2-3 iPhones", "Bonus +5 credits", "Fast process"]
    },
    {
      amount: 100,
      bonus: 15,
      popular: true,
      description: "Most popular choice",
      icon: Star,
      savings: 15,
      color: "zinc",
      features: ["5-6 iPhones", "Bonus +15 credits", "High priority"]
    },
    {
      amount: 200,
      bonus: 40,
      popular: false,
      description: "Best value package",
      icon: Gift,
      savings: 20,
      color: "neutral",
      features: ["10-12 iPhones", "Bonus +40 credits", "VIP support"]
    },
    {
      amount: 500,
      bonus: 125,
      popular: false,
      description: "Professional package",
      icon: Crown,
      savings: 25,
      color: "stone",
      features: ["25+ iPhones", "Bonus +125 credits", "Dedicated support"]
    }
  ];

  // Filter and sort iPhone models
  const filteredModels = iphoneModels
    .filter(model => 
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc' 
          ? a.price - b.price
          : b.price - a.price;
      }
    });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentWallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed');
    }
  };

  const refreshWallet = () => {
    setWalletIndex((prevIndex) => (prevIndex + 1) % ADMIN_WALLETS.length);
    setCopied(false);
  };

  const handlePackageSelect = (packageAmount: number, bonus: number) => {
    const totalCredits = packageAmount + bonus;
    setAmount(packageAmount.toString());
    setTotalCredits(totalCredits.toString());
    setSelectedPlan({
      amount: packageAmount,
      credits: totalCredits,
      description: `${packageAmount} ${paymentMethod === 'usdt' ? 'USDT' : 'USD'} → ${totalCredits} credits${bonus > 0 ? ` (+${bonus} bonus)` : ''}`
    });
    setStep('form');
  };

  const handleDeviceSelect = (devicePrice: number) => {
    setAmount(devicePrice.toString());
    setTotalCredits(devicePrice.toString());
    setSelectedPlan({
      amount: devicePrice,
      credits: devicePrice,
      description: `${devicePrice} ${paymentMethod === 'usdt' ? 'USDT' : 'USD'} → ${devicePrice} credits`
    });
    setStep('form');
  };

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || isNaN(numAmount)) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount < 1) {
      setError(`Minimum amount is 1 ${paymentMethod === 'usdt' ? 'USDT' : 'USD'}`);
      return false;
    }
    
    if (paymentMethod === 'usdt' && !walletAddress.trim()) {
      setError('Please enter your wallet address');
      return false;
    }
    
    if (paymentMethod === 'usdt' && walletAddress.length < 26) {
      setError('Please enter a valid wallet address');
      return false;
    }
    
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    setError('');
    setStep('payment');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!currentUser) {
        setError('You must be logged in to make a payment');
        return;
      }

      const numAmount = parseFloat(amount);
      const creditsToReceive = selectedPlan ? selectedPlan.credits : numAmount;
      
      let createdPaymentId: string;

      if (paymentMethod === 'usdt') {
        // Create USDT payment request
        createdPaymentId = await paymentService.createPaymentRequest(
          currentUser.uid,
          currentUser.email!,
          numAmount,
          walletAddress,
          'usdt'
        );
      } else {
        // For Ko-fi payments, we need to create a special payment record
        // that will be manually verified by admin
        createdPaymentId = await paymentService.createPaymentRequest(
          currentUser.uid,
          currentUser.email!,
          numAmount,
          'ko-fi-payment', // Special identifier for Ko-fi payments
          'kofi'
        );
      }

      setPaymentId(createdPaymentId);

      // Create a support ticket for tracking
      await ticketService.createTicket(
        currentUser.uid,
        currentUser.email!,
        {
          type: 'credit_loading',
          title: `Credit Purchase - ${paymentMethod.toUpperCase()} Payment`,
          description: `User purchased ${creditsToReceive} credits for $${numAmount} ${paymentMethod === 'usdt' ? 'USDT' : 'USD'} via ${paymentMethod.toUpperCase()}. Payment ID: ${createdPaymentId}`,
          priority: 'medium',
          paymentId: createdPaymentId,
          requestedCredits: creditsToReceive
        }
      );

      // Update payment record with ticket reference
      // Note: This would require adding a ticketId field to the payment service
      
      setStep('success');
      setHasPendingPayment(true);
      
      toast.success(
        `Payment request submitted successfully! You'll receive ${creditsToReceive} credits once confirmed.`,
        {
          duration: 5000,
          style: {
            background: '#059669',
            color: 'white',
            fontWeight: '500',
          },
        }
      );

    } catch (err: any) {
      console.error('Error processing payment request:', err);
      setError(err.message || 'Error processing payment request. Please try again.');
      
      toast.error(
        'Error processing payment request. Please try again.',
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

  const resetForm = () => {
    setStep('info');
    setAmount('');
    setTotalCredits('');
    setWalletAddress('');
    setError('');
    setSelectedPlan(null);
    setPaymentMethod('usdt');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Hard': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Extreme': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Authentication Check */}
      {!currentUser && (
        <div className="relative z-10 flex items-center justify-center min-h-[90vh]">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Authentication Required
            </h2>
            <p className="text-gray-600 mb-6">
              You must be logged in to purchase credits. Please log in to continue.
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Go to Login
            </a>
          </div>
        </div>
      )}

      {/* Main Content - Only show if authenticated */}
      {currentUser && (
        <>
          {/* Hero Section */}
          {step === 'info' && (
            <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="max-w-7xl mx-auto px-4 pt-20 pb-16">
                {/* Header */}
                <div className="text-center mb-20 transform transition-all duration-700 delay-200">
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-100 hover:bg-blue-100 transition-all duration-300">
                    <Shield size={16} className="animate-pulse" />
                    Professional iPhone Unlocking Service
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                    <span className="inline-block animate-fade-in-up">Unlock Any iPhone</span>
                    <span className="block text-4xl md:text-6xl text-blue-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      Instantly & Securely
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    Professional iPhone unlocking service with <span className="text-blue-600 font-semibold">guaranteed results</span>. 
                    Support for all iPhone models from iPhone 5 to iPhone 15 Pro Max.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
                    {[
                      { icon: Users, value: "150K+", label: "iPhones Unlocked", color: "green", delay: "0.6s" },
                      { icon: TrendingUp, value: "99.9%", label: "Success Rate", color: "blue", delay: "0.8s" },
                      { icon: Award, value: "24/7", label: "Expert Support", color: "purple", delay: "1s" }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="text-center bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-500 animate-fade-in-up group"
                        style={{ animationDelay: stat.delay }}
                      >
                        <div className={`inline-flex items-center justify-center w-16 h-16 bg-${stat.color}-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className={`text-${stat.color}-600`} size={32} />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                        <div className="text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Credit Packages */}
                <div className="mb-20">
                  <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Choose Your Credits
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Select the perfect credit package for your needs. <span className="text-gray-800 font-semibold">Bigger packages include bonus credits!</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {creditPackages.map((pkg, index) => (
                      <div
                        key={index}
                        className={`relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in-up ${pkg.popular ? 'scale-105 z-10' : ''}`}
                        onClick={() => handlePackageSelect(pkg.amount, pkg.bonus)}
                        style={{ animationDelay: `${1.4 + index * 0.1}s` }}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg animate-bounce">
                              ⭐ Most Popular
                            </div>
                          </div>
                        )}
                        
                        <div className={`bg-white rounded-2xl p-4 text-center h-full shadow-lg border border-gray-200 transition-all duration-500 group-hover:shadow-2xl ${pkg.popular ? 'border-gray-300 shadow-xl ring-1 ring-gray-200' : 'hover:border-gray-300 hover:shadow-xl'}`}
                          style={{ minHeight: '380px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                          {/* Header minimalista */}
                          <div className="mb-4">
                            <div className="transform group-hover:scale-110 transition-transform duration-300 mb-3">
                              <pkg.icon className="mx-auto text-gray-700" size={28} />
                            </div>
                            
                            <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors duration-300">
                              {pkg.amount + pkg.bonus}
                            </div>
                            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Total Credits</div>
                            
                            {pkg.bonus > 0 && (
                              <div className="bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-medium mb-2">
                                +{pkg.bonus} Bonus
                              </div>
                            )}
                          </div>

                          {/* Precio */}
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-gray-900 mb-1">
                              ${pkg.amount}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">{pkg.description}</div>
                            
                            {pkg.savings > 0 && (
                              <div className="text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-full mb-2">
                                Save {pkg.savings}%
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div className="mb-4 flex-1">
                            <div className="space-y-1.5">
                              {pkg.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Botón */}
                          <button className="w-full py-2.5 px-3 bg-gray-900 text-white rounded-xl font-medium transition-all duration-300 hover:bg-gray-800 hover:shadow-lg transform hover:scale-105 group-hover:shadow-xl text-sm">
                            Select Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* iPhone Pricing Grid */}
                <div className="mb-20">
                  <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '2s' }}>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      iPhone Unlock Pricing
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                      Transparent pricing for all iPhone models with <span className="text-gray-800 font-semibold">real device images</span>.
                    </p>

                    {/* Search and Filter Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
                      <div className="relative group">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors" size={20} />
                        <input
                          type="text"
                          placeholder="Search iPhone model..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSortBy('price');
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                        >
                          <Filter size={16} />
                          Price {sortBy === 'price' && (sortOrder === 'asc' ? <ArrowUp size={16} className="text-gray-600" /> : <ArrowDown size={16} className="text-gray-600" />)}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSortBy('name');
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          }}
                          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:border-gray-300 hover:shadow-sm"
                        >
                          Name {sortBy === 'name' && (sortOrder === 'asc' ? <ArrowUp size={16} className="text-gray-600" /> : <ArrowDown size={16} className="text-gray-600" />)}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* iPhone Models Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
                    {filteredModels.map((model, index) => (
                      <div 
                        key={index}
                        className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-500 hover:scale-105 hover:-translate-y-1 animate-fade-in-up cursor-pointer"
                        style={{ animationDelay: `${2.2 + (index % 8) * 0.05}s` }}
                        onClick={() => handleDeviceSelect(model.price)}
                      >
                        <div className="text-center">
                          <div className="relative mb-4">
                            <img 
                              src={model.imageUrl} 
                              alt={model.name}
                              className="w-16 h-16 mx-auto object-contain group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/240x240/f3f4f6/6b7280?text=iPhone';
                              }}
                            />
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-gray-700 transition-colors duration-300">
                            {model.name}
                          </h3>
                          
                          <div className="text-xs text-gray-500 mb-3 bg-gray-50 px-2 py-1 rounded-full">{model.year}</div>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">
                              {model.price}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Credits</div>
                          </div>
                          
                          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                            {model.difficulty === 'Easy' && <CheckCircle size={12} className="text-gray-600" />}
                            {model.difficulty === 'Medium' && <Clock size={12} className="text-gray-600" />}
                            {model.difficulty === 'Hard' && <Shield size={12} className="text-gray-600" />}
                            {model.difficulty === 'Extreme' && <AlertCircle size={12} className="text-gray-600" />}
                            <span>
                              {model.difficulty === 'Easy' ? 'Quick unlock' : 
                               model.difficulty === 'Medium' ? 'Standard process' : 
                               model.difficulty === 'Hard' ? 'Advanced security' :
                               'Maximum security'}
                            </span>
                          </div>

                          <button className="w-full py-2.5 px-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm">
                            Buy {model.price} Credits
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Option */}
                <div className="text-center animate-fade-in-up" style={{ animationDelay: '2.5s' }}>
                  <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-105">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Need a Custom Amount?
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Purchase any amount of credits starting from just <span className="text-gray-800 font-semibold">$1 USDT</span>
                    </p>
                    <button 
                      onClick={() => setStep('form')}
                      className="bg-gray-900 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-3 mx-auto transform hover:scale-105 hover:shadow-lg"
                    >
                      <CreditCard size={24} />
                      Custom Amount
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Step */}
          {step === 'form' && (
            <div className="max-w-lg mx-auto px-4 pt-10 animate-fade-in-up">
              <button 
                onClick={() => setStep('info')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium transition-colors duration-300 hover:translate-x-1"
              >
                ← Back to Packages
              </button>
              
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-500 max-h-screen overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gray-100 rounded-xl">
                    <CreditCard className="text-gray-700" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Credits</h2>
                </div>

                {selectedPlan && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl animate-slide-in">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <Info size={16} />
                      <span className="font-medium">Selected: {selectedPlan.description}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="text-red-600" size={16} />
                      <p className="text-red-700 font-medium text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <form className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Payment Method *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('usdt')}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          paymentMethod === 'usdt' 
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <DollarSign size={24} />
                        <div className="text-center">
                          <div className="font-semibold text-sm">USDT Crypto</div>
                          <div className="text-xs opacity-80">Binance Smart Chain</div>
                        </div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('kofi')}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          paymentMethod === 'kofi' 
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg' 
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <Coffee size={24} />
                        <div className="text-center">
                          <div className="font-semibold text-sm">Ko-fi</div>
                          <div className="text-xs opacity-80">Credit Card / PayPal</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Amount to Pay ({paymentMethod === 'usdt' ? 'USDT' : 'USD'}) *
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        if (!selectedPlan) {
                          setTotalCredits(e.target.value);
                        }
                      }}
                      min="1"
                      step="0.01"
                      className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base transition-all duration-300 hover:border-gray-300"
                      placeholder={`Enter amount in ${paymentMethod === 'usdt' ? 'USDT' : 'USD'}`}
                      required
                    />
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-gray-700 space-y-1 text-sm">
                        <div className="flex justify-between items-center">
                          <span>💰 You pay:</span>
                          <span className="font-bold text-gray-900">${amount || '0'} {paymentMethod === 'usdt' ? 'USDT' : 'USD'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>🎯 You receive:</span>
                          <span className="font-bold text-gray-900">{selectedPlan ? selectedPlan.credits : (amount ? parseFloat(amount) : 0)} credits</span>
                        </div>
                        {selectedPlan && selectedPlan.credits > selectedPlan.amount && (
                          <div className="flex justify-between items-center text-gray-700">
                            <span>🎁 Bonus:</span>
                            <span className="font-bold">+{selectedPlan.credits - selectedPlan.amount} free credits!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'usdt' && (
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Your Wallet Address (Source) *
                      </label>
                      <input
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                        placeholder="Enter your USDT wallet address"
                        required
                      />
                      <p className="text-gray-500 mt-1 flex items-center gap-1 text-xs">
                        <Info size={12} />
                        The wallet address from which you will send USDT
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 font-semibold transform hover:scale-105 hover:shadow-lg animate-fade-in-up"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <Wallet size={18} />
                    Continue to Payment
                    <ChevronRight size={18} />
                  </button>
                </form>

                <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 mb-3 text-sm">
                      {paymentMethod === 'usdt' 
                        ? 'Need help or don\'t have USDT?' 
                        : 'Need help with payment or have questions?'
                      }
                    </p>
                    <a
                      href="https://t.me/idelete_creditos_mod"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900 text-white font-medium transition-all duration-300 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M9.993 16.485l-.402 5.647c.575 0 .824-.247 1.127-.544l2.7-2.57 5.594 4.08c1.024.564 1.762.267 2.03-.952L23.99 3.668c.371-1.506-.544-2.096-1.546-1.74L1.11 9.72c-1.463.55-1.448 1.337-.25 1.694l5.818 1.82 13.49-8.517c.635-.419 1.214-.188.738.233L9.993 16.485z" />
                      </svg>
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === 'payment' && (
            <div className="max-w-lg mx-auto px-4 pt-10 animate-fade-in-up">
              <button 
                onClick={() => setStep('form')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium transition-all duration-300 hover:translate-x-1"
              >
                ← Back to Form
              </button>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-500 overflow-hidden max-h-[150vh]">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mb-2 animate-pulse">
                    {paymentMethod === 'usdt' ? <Wallet className="text-gray-700" size={20} /> : <Coffee className="text-gray-700" size={20} />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Complete Payment</h2>
                  <p className="text-gray-600 text-xs">
                    {paymentMethod === 'usdt' 
                      ? 'Send USDT to the address below to complete your purchase'
                      : 'Complete your payment through Ko-fi to receive your credits'
                    }
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl animate-slide-in">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-xs">
                      <Info size={14} />
                      Payment Summary
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">💰 Amount to pay:</span>
                        <span className="font-bold text-gray-900">${amount} {paymentMethod === 'usdt' ? 'USDT' : 'USD'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">🎯 Credits you'll receive:</span>
                        <span className="font-bold text-gray-900">{selectedPlan ? selectedPlan.credits : parseFloat(amount || '0')}</span>
                      </div>
                      {selectedPlan && selectedPlan.credits > selectedPlan.amount && (
                        <div className="flex justify-between items-center text-gray-700">
                          <span>🎁 Bonus credits:</span>
                          <span className="font-bold">+{selectedPlan.credits - selectedPlan.amount} FREE!</span>
                        </div>
                      )}
                      {paymentMethod === 'usdt' && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">📱 Your Wallet:</span>
                          <span className="font-mono text-xs text-gray-500">{walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {paymentMethod === 'usdt' ? (
                    <>
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-xs">Send USDT to:</h3>
                          <div className="flex gap-1">
                            <button
                              onClick={copyToClipboard}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-all duration-300 rounded hover:bg-white transform hover:scale-110"
                              title="Copy address"
                            >
                              {copied ? <CheckCircle size={14} className="text-gray-600 animate-bounce" /> : <Copy size={14} />}
                            </button>
                            <button
                              onClick={refreshWallet}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-all duration-300 rounded hover:bg-white transform hover:scale-110"
                              title="Switch wallet"
                            >
                              <RefreshCw size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-white border border-gray-200 rounded-lg font-mono text-xs break-all text-gray-900 hover:bg-gray-50 transition-colors duration-300">
                          {currentWallet}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <RefreshCw size={10} />
                          Having trouble? Click refresh to try our backup wallet
                        </p>
                      </div>

                      <div className="p-2 bg-red-50 border border-red-200 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-start gap-2">
                          <AlertCircle className="text-red-600 mt-0.5 animate-pulse" size={14} />
                          <div className="text-red-700 text-xs">
                            <p className="font-semibold mb-1">⚠️ CRITICAL: Network Requirements</p>
                            <div className="space-y-0.5">
                              <p>• Only use <strong>BEP20 (Binance Smart Chain)</strong> network</p>
                              <p>• Wrong network = <strong>permanent loss of funds</strong></p>
                              <p>• Verify network before sending</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-xs">
                        <Coffee size={14} />
                        Ko-fi Payment
                      </h3>
                      <p className="text-gray-700 text-xs mb-2">
                        Complete your payment through Ko-fi using your preferred payment method (Credit Card, PayPal, etc.)
                      </p>
                      <div className="bg-white border border-gray-200 rounded-lg p-1 overflow-hidden min-h-screen">
                        <iframe 
                          id='kofiframe' 
                          src='https://ko-fi.com/iunlockers/?hidefeed=true&widget=true&embed=true&preview=true' 
                          style={{
                            border: 'none',
                            width: '100%',
                            height: '900px',
                            background: '#f9f9f9',
                            borderRadius: '6px'
                          }}
                          title='iunlockers'
                          scrolling="no"
                          className="w-full"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Info size={10} />
                        If the payment form doesn't load, please refresh the page or contact support
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <button
                      onClick={() => setStep('form')}
                      className="py-2 px-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-xs transform hover:scale-105"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="py-2 px-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-xs transform hover:scale-105 hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          {paymentMethod === 'usdt' ? 'I Sent the Payment' : 'I Completed Payment'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="max-w-lg mx-auto px-4 pt-10 animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center hover:shadow-xl transition-all duration-500 max-h-screen overflow-hidden">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle className="text-gray-700" size={32} />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-3 animate-fade-in-up">
                  🎉 Payment Submitted!
                </h2>
                
                <p className="text-gray-600 mb-6 text-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Your credit purchase is being processed. You'll receive <span className="font-semibold text-gray-900">{selectedPlan ? selectedPlan.credits : parseFloat(amount || '0')} credits</span> once the transaction is confirmed.
                </p>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-left mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                    <Clock size={16} />
                    What happens next?
                  </h4>
                  <div className="space-y-2 text-sm">
                    {paymentMethod === 'usdt' ? [
                      "Our team will verify your USDT transaction",
                      "Credits will be added to your account within 24-48 hours",
                      "You'll see the updated balance in your dashboard",
                      "Check \"Support Tickets\" for real-time updates"
                    ] : [
                      "Our team will verify your Ko-fi payment",
                      "Credits will be added to your account within 2-4 hours",
                      "You'll see the updated balance in your dashboard",
                      "Check \"Support Tickets\" for real-time updates"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                        <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 text-xs">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={resetForm}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-lg animate-fade-in-up text-sm"
                    style={{ animationDelay: '0.7s' }}
                  >
                    Purchase More Credits
                  </button>
                  
                  <a
                    href="https://t.me/idelete_creditos_mod"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transform hover:scale-105 hover:shadow-lg animate-fade-in-up text-sm"
                    style={{ animationDelay: '0.8s' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="16" height="16">
                      <path d="M9.993 16.485l-.402 5.647c.575 0 .824-.247 1.127-.544l2.7-2.57 5.594 4.08c1.024.564 1.762.267 2.03-.952L23.99 3.668c.371-1.506-.544-2.096-1.546-1.74L1.11 9.72c-1.463.55-1.448 1.337-.25 1.694l5.818 1.82 13.49-8.517c.635-.419 1.214-.188.738.233L9.993 16.485z" />
                    </svg>
                    Contact Support
                  </a>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Animaciones y estilos */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AddCredits;
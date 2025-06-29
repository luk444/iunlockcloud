import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shield, Clock, CheckCircle2, ArrowRight, Lock, Unlock, Server, RefreshCw, Apple, Users, TrendingUp, Globe, Headphones, Star, Award, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const [unlockStep, setUnlockStep] = useState(0);
  const [counters, setCounters] = useState({ devices: 0, success: 0, countries: 0 });

  // Auto-start animation and loop it
  useEffect(() => {
    const runAnimation = () => {
      setUnlockStep(0);
      
      // Animation sequence with automatic progression
      setTimeout(() => setUnlockStep(1), 2000); // Generate token
      setTimeout(() => setUnlockStep(2), 4000); // Send to server
      setTimeout(() => setUnlockStep(3), 6000); // Verify token
      setTimeout(() => setUnlockStep(4), 8000); // Success
      setTimeout(() => setUnlockStep(0), 11000); // Reset
    };

    // Start immediately
    runAnimation();
    
    // Loop every 13 seconds
    const interval = setInterval(runAnimation, 13000);
    
    return () => clearInterval(interval);
  }, []);

  // Counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      const targets = { devices: 547, success: 99.9, countries: 152 };
      const duration = 2000;
      const steps = 60;
      const stepTime = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setCounters({
          devices: Math.floor(targets.devices * progress),
          success: Math.min(targets.success, (targets.success * progress)),
          countries: Math.floor(targets.countries * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setCounters(targets);
        }
      }, stepTime);
    };

    // Start counter animation after a short delay
    const timeout = setTimeout(animateCounters, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 sm:-right-64 -top-2 sm:-top-64 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
          <div className="absolute -left-32 sm:-left-64 -bottom-32 sm:-bottom-64 w-64 sm:w-96 lg:w-[500px] h-64 sm:h-96 lg:h-[500px] rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <Apple className="h-6 sm:h-8 w-6 sm:w-8 text-gray-800" />
                <span className="text-lg sm:text-xl font-medium text-gray-800">iCloud Unlock Service</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Unlock Your iPhone's <span className="text-blue-500">Full Potential</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Professional iCloud unlocking service with secure token verification and instant results.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="inline-flex items-center justify-center px-6 py-4 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                  <Smartphone className="mr-2" size={20} />
                  Register Device
                </Link>
              </div>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative">
                <div className="relative w-40 sm:w-48 md:w-56">
                  {/* iPhone-style device */}
                  <div className="bg-[#1C1C1E] rounded-[32px] sm:rounded-[38px] p-1.5 sm:p-2 shadow-2xl relative">
                    <div className="absolute inset-0 rounded-[32px] sm:rounded-[38px] overflow-hidden bg-gradient-to-br from-gray-800/20 to-transparent"></div>
                    <div className="bg-black rounded-[28px] sm:rounded-[34px] overflow-hidden aspect-[9/19] flex items-center justify-center relative">
                      <div className="absolute top-1.5 sm:top-2 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-black rounded-full flex items-center justify-center">
                        <div className="w-10 sm:w-12 h-2.5 sm:h-3 bg-[#1C1C1E] rounded-full"></div>
                      </div>
                      
                      {/* Demo Content */}
                      <div className="text-center p-3 sm:p-4">
                        {unlockStep === 0 && (
                          <div className="animate-pulse space-y-2">
                            <Lock className="w-8 sm:w-12 h-8 sm:h-12 mx-auto text-blue-500 mb-2" />
                            <div className="text-xs text-gray-400">Initiating unlock...</div>
                          </div>
                        )}
                        {unlockStep === 1 && (
                          <div className="fade-in space-y-2">
                            <RefreshCw className="w-8 sm:w-12 h-8 sm:h-12 mx-auto text-blue-500 mb-2 animate-spin" />
                            <div className="text-xs text-gray-400">Generating token...</div>
                          </div>
                        )}
                        {unlockStep === 2 && (
                          <div className="fade-in space-y-2">
                            <Server className="w-8 sm:w-12 h-8 sm:h-12 mx-auto text-purple-500 mb-2" />
                            <div className="text-xs text-gray-400">Verifying with iCloud...</div>
                          </div>
                        )}
                        {unlockStep === 3 && (
                          <div className="fade-in space-y-2">
                            <Shield className="w-8 sm:w-12 h-8 sm:h-12 mx-auto text-green-500 mb-2" />
                            <div className="text-xs text-gray-400">Security check...</div>
                          </div>
                        )}
                        {unlockStep === 4 && (
                          <div className="fade-in space-y-2">
                            <Unlock className="w-8 sm:w-12 h-8 sm:h-12 mx-auto text-green-500 mb-2" />
                            <div className="text-sm font-medium text-white">Unlocked!</div>
                            <div className="text-xs text-gray-400">Device verified</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Reflection effect */}
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 w-[80%] h-12 sm:h-16 bg-black/20 blur-xl rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Process Section */}
      <section className="py-16 sm:py-20 bg-white overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Unlocking Process</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced iCloud unlocking with secure token verification
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <Shield className="h-10 sm:h-12 w-10 sm:w-12 text-blue-500" />,
                title: "Device Verification",
                description: "We verify your device's eligibility for unlocking"
              },
              {
                icon: <RefreshCw className="h-10 sm:h-12 w-10 sm:w-12 text-blue-500" />,
                title: "Token Generation",
                description: "A secure unlock token is generated for your device"
              },
              {
                icon: <Server className="h-10 sm:h-12 w-10 sm:w-12 text-blue-500" />,
                title: "iCloud Verification",
                description: "Token is verified with Apple's activation servers"
              },
              {
                icon: <Unlock className="h-10 sm:h-12 w-10 sm:w-12 text-blue-500" />,
                title: "Instant Activation",
                description: "Your device is unlocked and ready to use"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-4 sm:mb-5">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced Stats Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 sm:px-4 py-2 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="h-4 w-4" />
              Trusted Worldwide
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Leading Performance
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Our numbers speak for themselves - join thousands of satisfied customers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: <Users className="h-6 sm:h-8 w-6 sm:w-8 text-blue-500" />,
                number: `${counters.devices}K+`, 
                label: "Devices Unlocked",
                description: "Successfully processed",
                color: "blue"
              },
              { 
                icon: <Award className="h-6 sm:h-8 w-6 sm:w-8 text-emerald-500" />,
                number: `${counters.success.toFixed(1)}%`, 
                label: "Success Rate",
                description: "Guaranteed results",
                color: "emerald"
              },
              { 
                icon: <Headphones className="h-6 sm:h-8 w-6 sm:w-8 text-purple-500" />,
                number: "24/7", 
                label: "Expert Support",
                description: "Always available",
                color: "purple"
              },
              { 
                icon: <Globe className="h-6 sm:h-8 w-6 sm:w-8 text-orange-500" />,
                number: `${counters.countries}+`, 
                label: "Countries Served",
                description: "Global coverage",
                color: "orange"
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-${stat.color}-100 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-${stat.color}-600 mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{stat.description}</div>
                </div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-${stat.color}-400 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-60">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Shield className="h-4 sm:h-5 w-4 sm:w-5 text-green-500" />
                SSL Encrypted
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Star className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-500" />
                4.9/5 Rating
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <Zap className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500" />
                Instant Processing
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute -top-12 sm:-top-24 -right-12 sm:-right-24 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 sm:-bottom-24 -left-12 sm:-left-24 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 sm:px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6">
              <Zap className="h-4 w-4" />
              Quick & Secure Process
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Unlock Your iPhone in 
              <span className="block text-blue-200">Minutes, Not Hours</span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto">
              Join over 500,000 satisfied customers who've unlocked their devices with our premium service. 
              Fast, secure, and guaranteed results.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 sm:mb-12">
              <Link 
                to="/register" 
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Smartphone className="mr-2 h-5 w-5" />
                Start Unlocking Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/guide" 
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
              >
                Learn How It Works
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-2 border-white"></div>
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-pink-400 to-red-500 border-2 border-white"></div>
                  <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                    +
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-medium">2,847 unlocked this week</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-xs sm:text-sm font-medium ml-2">4.9/5 from 12K+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
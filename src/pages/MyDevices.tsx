import React, { useState, useEffect } from 'react';
import { Smartphone, Trash, Shield, AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDevices, deleteRegisteredDevice } from '../services/deviceService';
import { RegisteredDevice } from '../types';
import toast from 'react-hot-toast';

type FilterType = 'all' | 'blacklist' | 'fmi' | 'clean';

const MyDevices: React.FC = () => {
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingDevice, setDeletingDevice] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { currentUser } = useAuth();

  useEffect(() => {
    loadUserDevices();
  }, [currentUser]);

  const loadUserDevices = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const userDevices = await getUserDevices(currentUser.uid);
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Error loading your devices');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!currentUser) return;
    
    setDeletingDevice(deviceId);
    try {
      await deleteRegisteredDevice(currentUser.uid, deviceId);
      setDevices(devices.filter(device => device.id !== deviceId));
      toast.success('Device removed successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Error removing device');
    } finally {
      setDeletingDevice(null);
    }
  };

  const formatCreatedAt = (createdAt: any): string => {
    try {
      if (!createdAt) return 'Unknown';
      if (createdAt instanceof Date) return createdAt.toLocaleDateString('en-US');
      if (createdAt.toDate) return createdAt.toDate().toLocaleDateString('en-US'); // Firebase Timestamp
      if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString('en-US'); // Raw seconds
      return 'Unknown';
    } catch {
      return 'Invalid Date';
    }
  };

  // Filtros
  const getFilteredDevices = () => {
    switch (activeFilter) {
      case 'blacklist':
        return devices.filter(device => 
          device.status.blacklistStatus === 'Blacklisted' || 
          device.status.blacklistStatus === 'Reported'
        );
      case 'fmi':
        return devices.filter(device => device.status.fmiStatus === 'ON');
      case 'clean':
        return devices.filter(device => 
          device.status.blacklistStatus === 'Clean' && 
          device.status.fmiStatus === 'OFF'
        );
      default:
        return devices;
    }
  };

  const getFilterStats = () => {
    const blacklistCount = devices.filter(device => 
      device.status.blacklistStatus === 'Blacklisted' || 
      device.status.blacklistStatus === 'Reported'
    ).length;
    
    const fmiCount = devices.filter(device => 
      device.status.fmiStatus === 'ON'
    ).length;
    
    const cleanCount = devices.filter(device => 
      device.status.blacklistStatus === 'Clean' && 
      device.status.fmiStatus === 'OFF'
    ).length;

    return { blacklistCount, fmiCount, cleanCount, total: devices.length };
  };

  const stats = getFilterStats();
  const filteredDevices = getFilteredDevices();

  const filters = [
    { id: 'all' as FilterType, label: 'All Devices', count: stats.total, icon: Smartphone },
    { id: 'blacklist' as FilterType, label: 'Blacklist', count: stats.blacklistCount, icon: AlertTriangle, color: 'text-red-600' },
    { id: 'fmi' as FilterType, label: 'FMI Locked', count: stats.fmiCount, icon: Shield, color: 'text-orange-600' },
    { id: 'clean' as FilterType, label: 'Clean', count: stats.cleanCount, icon: CheckCircle, color: 'text-green-600' },
  ];

  const DeviceCard: React.FC<{ device: RegisteredDevice }> = ({ device }) => (
    <div key={device.id} className="card fade-in hover:shadow-md transition-shadow">
      <div className="flex mb-4">
        <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center p-2 mr-4 flex-shrink-0">
          <img 
            src={device.imageUrl} 
            alt={device.modelName} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{device.modelName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Shield size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-sm text-gray-500 font-mono">IMEI: {device.imei}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              device.status.fmiStatus === 'ON' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              FMI: {device.status.fmiStatus}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              device.status.blacklistStatus === 'Clean' 
                ? 'bg-green-100 text-green-800' 
                : device.status.blacklistStatus === 'Reported'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {device.status.blacklistStatus}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t pt-3 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {formatCreatedAt(device.createdAt)}
        </span>

        <button 
          onClick={() => handleDeleteDevice(device.id!)}
          disabled={deletingDevice === device.id}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove device"
        >
          {deletingDevice === device.id ? (
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500"></div>
          ) : (
            <Trash size={16} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Devices</h1>
              <p className="text-gray-600 text-sm">Manage your registered devices</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter size={16} />
            <span>{filteredDevices.length} of {stats.total} devices</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="card text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 rounded-full">
                <Smartphone size={32} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">No Devices Found</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You haven't registered any devices yet. Search for a device using its IMEI to add it to your collection.
            </p>
            <a
              href="/register"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <Smartphone size={16} />
              Register a Device
            </a>
          </div>
        ) : (
          <div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-xl shadow-sm border">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent size={16} className={filter.color || 'text-gray-500'} />
                    <span>{filter.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeFilter === filter.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {filter.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Devices Grid */}
            {filteredDevices.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                  <Filter size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No devices found</h3>
                <p className="text-gray-600">
                  {activeFilter === 'all' 
                    ? 'No devices registered yet'
                    : `No devices match the "${filters.find(f => f.id === activeFilter)?.label}" filter`
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map((device) => (
                  <DeviceCard key={device.id} device={device} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDevices;
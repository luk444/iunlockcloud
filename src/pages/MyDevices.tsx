import React, { useState, useEffect } from 'react';
import { Smartphone, Trash, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDevices } from '../services/deviceService';
import { RegisteredDevice } from '../types';
import toast from 'react-hot-toast';

const MyDevices: React.FC = () => {
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [loading, setLoading] = useState(true);
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
      toast.error('Error al cargar tus dispositivos');
    } finally {
      setLoading(false);
    }
  };

  const formatCreatedAt = (createdAt: any): string => {
  try {
    if (!createdAt) return 'Desconocido';
    if (createdAt instanceof Date) return createdAt.toLocaleDateString('es-ES');
    if (createdAt.toDate) return createdAt.toDate().toLocaleDateString('es-ES'); // Firebase Timestamp
    if (createdAt.seconds) return new Date(createdAt.seconds * 1000).toLocaleDateString('es-ES'); // Raw seconds
    return 'Desconocido';
  } catch {
    return 'Fecha Inválida';
  }
};


  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 mb-6">
          <Smartphone className="text-blue-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Mis Dispositivos</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="card text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Smartphone size={24} className="text-blue-600" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-2">No se Encontraron Dispositivos</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Aún no has registrado ningún dispositivo. Busca un dispositivo usando su IMEI para agregarlo a tu colección.
            </p>
            <a
              href="/register"
              className="btn btn-primary inline-flex"
            >
              Registrar un Dispositivo
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devices.map((device) => (
              <div key={device.id} className="card fade-in">
                <div className="flex mb-4">
                  <div className="w-28 h-28 bg-gray-50 rounded-md flex items-center justify-center p-2 mr-4">
                    <img 
                      src={device.imageUrl} 
                      alt={device.modelName} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{device.modelName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Shield size={14} className="text-blue-500" />
                      <span className="text-sm text-gray-500">IMEI: {device.imei}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
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
                        {device.status.blacklistStatus === 'Clean' ? 'Limpio' : 
                         device.status.blacklistStatus === 'Reported' ? 'Reportado' : 
                         device.status.blacklistStatus === 'Blacklisted' ? 'En Lista Negra' : 
                         device.status.blacklistStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatCreatedAt(device.createdAt)}
                  </span>

                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDevices;
import React, { useState, useEffect } from 'react';
import { Shield, Users, CreditCard, Plus, Minus, Mail, Search, AlertCircle, CheckCircle, Smartphone, Watch, Tablet, Edit, Trash2, Eye, Globe, MessageSquare, Clock, X, Settings, Save, RotateCcw, Coffee, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { paymentService } from '../services/paymentService';
import { userService } from '../services/userService';
import { ticketService } from '../services/ticketService';
import { getAllSerialDevices, addSerialDevice, updateSerialDevice, deleteSerialDevice, addSerialToDevice, removeSerialFromDevice } from '../services/serialDeviceService';
import { getAllDevices } from '../services/deviceService';
import { getProcessTimingConfig, updateProcessTimingConfig, resetProcessTimingConfig, ProcessTimingConfig } from '../services/configService';
import { PaymentRequest, SerialDevice, Device, Ticket, User } from '../types';
import toast from 'react-hot-toast';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'payments' | 'credits' | 'iphone-devices' | 'watch-ipad' | 'api-models' | 'tickets' | 'timing-config' | 'users'>('payments');
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [refundDecision, setRefundDecision] = useState<boolean | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  
  // Credit management states
  const [userEmail, setUserEmail] = useState('');
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditAction, setCreditAction] = useState<'add' | 'remove'>('add');
  const [creditLoading, setCreditLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState<any>(null);
  
  // Device management states
  const [serialDevices, setSerialDevices] = useState<SerialDevice[]>([]);
  const [iPhoneDevices, setIPhoneDevices] = useState<Device[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState<SerialDevice | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<SerialDevice | null>(null);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  
  // New device form states
  const [newDevice, setNewDevice] = useState({
    modelName: '',
    model: '',
    imageUrl: '',
    deviceType: 'ipad' as 'ipad' | 'applewatch',
    credits: 45,
    serialNumbers: [] as string[]
  });

  // Timing configuration states
  const [timingConfig, setTimingConfig] = useState<ProcessTimingConfig | null>(null);
  const [timingLoading, setTimingLoading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  
  // Users management states
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  
  const { currentUser } = useAuth();

  useEffect(() => {
    if (activeTab === 'payments') {
      loadPayments();
    } else if (activeTab === 'watch-ipad') {
      loadSerialDevices();
    } else if (activeTab === 'iphone-devices') {
      loadIPhoneDevices();
    } else if (activeTab === 'tickets') {
      loadTickets();
    } else if (activeTab === 'timing-config') {
      loadTimingConfig();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const allPayments = await paymentService.getAllPayments();
      setPayments(allPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    try {
      setLoading(true);
      const allTickets = await ticketService.getAllTickets();
      setTickets(allTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadSerialDevices = async () => {
    try {
      setLoading(true);
      const devices = await getAllSerialDevices();
      setSerialDevices(devices);
    } catch (error) {
      console.error('Error loading serial devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const loadIPhoneDevices = async () => {
    try {
      setLoading(true);
      const devices = await getAllDevices();
      setIPhoneDevices(devices);
    } catch (error) {
      console.error('Error loading iPhone devices:', error);
      toast.error('Failed to load iPhone devices');
    } finally {
      setLoading(false);
    }
  };

  const loadTimingConfig = async () => {
    try {
      setTimingLoading(true);
      const config = await getProcessTimingConfig();
      setTimingConfig(config);
    } catch (error) {
      console.error('Error loading timing config:', error);
      toast.error('Failed to load timing configuration');
    } finally {
      setTimingLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);
      const allUsers = await userService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    // Prevenir que el admin se elimine a sí mismo
    if (userId === currentUser?.uid) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }

    // Confirmar la eliminación
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar la cuenta de ${userEmail}?\n\nEsta acción no se puede deshacer y eliminará todos los datos del usuario.`
    );

    if (!confirmed) return;

    try {
      setDeletingUser(userId);
      await userService.deleteUser(userId);
      
      toast.success(
        `✅ Usuario ${userEmail} eliminado exitosamente`,
        {
          duration: 4000,
          style: {
            background: '#DC2626',
            color: 'white',
            fontWeight: '500',
          },
        }
      );
      
      // Recargar la lista de usuarios
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(
        'Error al eliminar usuario',
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
      setDeletingUser(null);
    }
  };

  const handleSaveTimingConfig = async () => {
    if (!timingConfig) return;
    
    try {
      setSavingConfig(true);
      await updateProcessTimingConfig(timingConfig);
      toast.success('Timing configuration saved successfully');
    } catch (error) {
      console.error('Error saving timing config:', error);
      toast.error('Failed to save timing configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleResetTimingConfig = async () => {
    try {
      setSavingConfig(true);
      await resetProcessTimingConfig();
      await loadTimingConfig();
      toast.success('Timing configuration reset to defaults');
    } catch (error) {
      console.error('Error resetting timing config:', error);
      toast.error('Failed to reset timing configuration');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      setProcessingPayment(paymentId);
      
      // Find the payment to get its details
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // For Ko-fi payments, we might want to add additional verification
      if (payment.paymentMethod === 'kofi') {
        // You could add additional verification steps here
        // For example, checking if the user has provided proof of payment
        console.log('Confirming Ko-fi payment:', payment);
      }

      await paymentService.confirmPayment(paymentId, payment.paymentMethod === 'kofi' ? 'ko-fi-confirmation' : 'manual-confirmation');
      
      toast.success(
        `✅ Payment confirmed! ${payment.credits} credits added to ${payment.userEmail}`,
        {
          duration: 4000,
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: '500',
          },
        }
      );
      
      await loadPayments();
    } catch (error) {
      console.error('Error confirming payment:', error);
      toast.error(
        'Error al confirmar el pago',
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
      setProcessingPayment(null);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      setProcessingPayment(paymentId);
      await paymentService.rejectPayment(paymentId);
      
      toast.success(
        '❌ Pago rechazado',
        {
          duration: 3000,
          style: {
            background: '#DC2626',
            color: 'white',
            fontWeight: '500',
          },
        }
      );
      
      await loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleTicketResponse = async () => {
    if (!selectedTicket || !adminResponse.trim()) {
      toast.error('Please provide a response');
      return;
    }

    try {
      const updates: any = {
        status: 'resolved',
        adminResponse: adminResponse.trim(),
        adminUserId: currentUser?.uid
      };

      // Handle refund decision for unlock complaints
      if (selectedTicket.type === 'unlock_complaint' && refundDecision !== null) {
        updates.refundApproved = refundDecision;
        if (refundDecision && refundAmount) {
          updates.refundAmount = parseFloat(refundAmount);
          updates.refundReason = refundReason || 'Refund approved by admin';
          
          // Add credits back to user if refund approved
          await userService.addCreditsToUser(selectedTicket.userId, parseFloat(refundAmount));
        } else if (!refundDecision) {
          updates.refundReason = refundReason || 'Refund denied by admin';
        }
      }

      await ticketService.updateTicket(selectedTicket.id!, updates);
      
      toast.success('Ticket updated successfully');
      setSelectedTicket(null);
      setAdminResponse('');
      setRefundDecision(null);
      setRefundAmount('');
      setRefundReason('');
      
      await loadTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleSearchUser = async () => {
    if (!userEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setCreditLoading(true);
      const user = await userService.getUserByEmail(userEmail.trim());
      if (user) {
        setSearchedUser(user);
        toast.success('User found');
      } else {
        setSearchedUser(null);
        toast.error('User not found');
      }
    } catch (error) {
      console.error('Error searching user:', error);
      toast.error('Error searching for user');
      setSearchedUser(null);
    } finally {
      setCreditLoading(false);
    }
  };

  const handleCreditManagement = async () => {
    if (!searchedUser) {
      toast.error('Please search for a user first');
      return;
    }

    if (!creditAmount || isNaN(Number(creditAmount)) || Number(creditAmount) <= 0) {
      toast.error('Please enter a valid credit amount');
      return;
    }

    try {
      setCreditLoading(true);
      const amount = Number(creditAmount);
      
      if (creditAction === 'add') {
        await userService.addCreditsToUser(searchedUser.uid, amount);
        toast.success(
          `✅ ${amount} credits successfully added to ${searchedUser.email}`,
          {
            duration: 4000,
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
      } else {
        await userService.addCreditsToUser(searchedUser.uid, -amount);
        toast.success(
          `✅ ${amount} credits successfully removed from ${searchedUser.email}`,
          {
            duration: 4000,
            style: {
              background: '#DC2626',
              color: 'white',
              fontWeight: '500',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#DC2626',
            },
          }
        );
      }
      
      await handleSearchUser();
      setCreditAmount(0);
    } catch (error) {
      console.error('Error managing credits:', error);
      toast.error(
        'Error updating credits',
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
      setCreditLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!newDevice.modelName || !newDevice.model || !newDevice.imageUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Add "Apple" prefix to modelName if it doesn't already have it
    const formattedModelName = newDevice.modelName.toLowerCase().includes('apple') 
      ? newDevice.modelName 
      : `Apple ${newDevice.modelName}`;

    try {
      await addSerialDevice({
        modelName: formattedModelName,
        model: newDevice.model,
        imageUrl: newDevice.imageUrl,
        deviceType: newDevice.deviceType,
        credits: newDevice.credits,
        serialNumbers: []
      });

      toast.success('Device added successfully');
      setShowAddDevice(false);
      setNewDevice({
        modelName: '',
        model: '',
        imageUrl: '',
        deviceType: 'ipad',
        credits: 45,
        serialNumbers: []
      });
      await loadSerialDevices();
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    }
  };

  const handleUpdateDevice = async () => {
    if (!editingDevice || !editingDevice.id) return;

    // Add "Apple" prefix to modelName if it doesn't already have it
    const formattedModelName = editingDevice.modelName.toLowerCase().includes('apple') 
      ? editingDevice.modelName 
      : `Apple ${editingDevice.modelName}`;

    try {
      await updateSerialDevice(editingDevice.id, {
        modelName: formattedModelName,
        model: editingDevice.model,
        imageUrl: editingDevice.imageUrl,
        deviceType: editingDevice.deviceType,
        credits: editingDevice.credits
      });

      toast.success('Device updated successfully');
      setEditingDevice(null);
      await loadSerialDevices();
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Failed to update device');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      await deleteSerialDevice(deviceId);
      toast.success('Device deleted successfully');
      await loadSerialDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
    }
  };

  const handleAddSerial = async () => {
    if (!selectedDevice || !selectedDevice.id || !newSerialNumber.trim()) {
      toast.error('Please enter a valid serial number');
      return;
    }

    try {
      await addSerialToDevice(selectedDevice.id, newSerialNumber.trim().toUpperCase());
      toast.success('Serial number added successfully');
      setNewSerialNumber('');
      await loadSerialDevices();
      
      // Update selected device
      const updatedDevices = await getAllSerialDevices();
      const updatedDevice = updatedDevices.find(d => d.id === selectedDevice.id);
      if (updatedDevice) {
        setSelectedDevice(updatedDevice);
      }
    } catch (error) {
      console.error('Error adding serial number:', error);
      toast.error('Failed to add serial number');
    }
  };

  const handleRemoveSerial = async (serialNumber: string) => {
    if (!selectedDevice || !selectedDevice.id) return;

    try {
      await removeSerialFromDevice(selectedDevice.id, serialNumber);
      toast.success('Serial number removed successfully');
      await loadSerialDevices();
      
      // Update selected device
      const updatedDevices = await getAllSerialDevices();
      const updatedDevice = updatedDevices.find(d => d.id === selectedDevice.id);
      if (updatedDevice) {
        setSelectedDevice(updatedDevice);
      }
    } catch (error) {
      console.error('Error removing serial number:', error);
      toast.error('Failed to remove serial number');
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatUserRegistrationDate = (timestamp: any) => {
    if (!timestamp) return 'Fecha no disponible';
    
    try {
      const date = timestamp.toDate();
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const generateRejectionMessage = (ticket: Ticket) => {
    return `🔐 iCloud Unlock Request – Validation & Security Report
Ticket ID: #${ticket.id?.substring(0, 8)}
Customer Email: ${ticket.userEmail}
Device IMEI: ${ticket.imei || 'N/A'}
Device Model: ${ticket.model || 'N/A'}
Unlock Status: ❌ Failed – Server Validation Rejected

✅ Token Generation Summary
Token Generated: ✅ Yes

Token Format: ✅ Valid

Token Transmission: ✅ Successful

Apple Server Response: ❌ Rejected (Security Conflict)

❌ Validation Failure Analysis
Our system successfully generated and submitted the token for the iCloud unlinking process. However, the Apple server rejected the request due to a security state conflict related to the associated iCloud account.

This conflict is caused by a password change on the Apple ID linked to the device, which alters the internal security state and invalidates any unlinking request.

🔍 Automated Detection Logs
Conflict Type: Detected Apple ID Password Change

Account Status: Password modified after device was locked or lost

Token Status: Automatically invalidated during validation phase

Server Response Code: [REJECTED:SECURITY_POLICY_VIOLATION]

Final Result: Unlock process blocked due to compromised token integrity

Please note: The password change may not have occurred recently. It could have happened at the time of loss, during any recovery attempt, or at any moment in the past.
Once a password is changed, Apple's security system marks the device as high-risk and blocks all unlinking requests through token-based validation.

📘 Reference to User Guide & Policies
This behavior is explicitly outlined in our official unlock guide, under the "Important Notes & Policies" section:

"If the device owner changed the password recently, NO REFUND will be issued. We only charge for the token generation, and password changes are beyond our control."
"Apple's system automatically invalidates tokens if a password reset or two-factor change is detected, regardless of when the change occurred."

By proceeding with the unlock request, users agree to these terms and confirm that the account has not been altered post-lock.

🧾 Final Notes
✅ The token was properly generated and sent

❌ Apple's server rejected the request due to a past account change

🔁 Refunds are not issued in these cases, as operational costs are incurred regardless of success

📄 This case is closed as "Rejected due to password-related account conflict"

✉️ Language Note
For faster and more accurate assistance in the future, please contact us in English. This helps our support team respond more efficiently and avoid misunderstandings.

Thank you for using iUnlock Cloud.
— Technical Validation Department
https://iunlock-cloud.org`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketTypeIcon = (type: string) => {
    switch (type) {
      case 'unlock_complaint':
        return <Smartphone size={16} className="text-red-500" />;
      case 'credit_loading':
        return <CreditCard size={16} className="text-green-500" />;
      default:
        return <MessageSquare size={16} className="text-blue-500" />;
    }
  };

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case 'unlock_complaint':
        return 'Unlock Complaint';
      case 'credit_loading':
        return 'Credit Loading';
      default:
        return 'General Support';
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="text-blue-500" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'payments'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="inline mr-2" size={18} />
            Pagos
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'tickets'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="inline mr-2" size={18} />
            Tickets
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'credits'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="inline mr-2" size={18} />
            Credit Management
          </button>
          <button
            onClick={() => setActiveTab('iphone-devices')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'iphone-devices'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Smartphone className="inline mr-2" size={18} />
            iPhone Devices
          </button>
          <button
            onClick={() => setActiveTab('watch-ipad')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'watch-ipad'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Watch className="inline mr-2" size={18} />
            Apple Watch & iPad
          </button>
          <button
            onClick={() => setActiveTab('api-models')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'api-models'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Globe className="inline mr-2" size={18} />
            Modelos API
          </button>
          <button
            onClick={() => setActiveTab('timing-config')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'timing-config'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Settings className="inline mr-2" size={18} />
            Configuración de Tiempos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="inline mr-2" size={18} />
            Usuarios Registrados
          </button>
        </div>

        {/* Payment Management Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Solicitudes de Pago</h2>
              <p className="text-gray-600 mt-1">Gestionar solicitudes de pago de usuarios y adición de créditos</p>
              
              {/* Payment Statistics */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Pending</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {payments.filter(p => p.status === 'pending').length}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">USDT Pending</div>
                  <div className="text-2xl font-bold text-green-900">
                    {payments.filter(p => p.status === 'pending' && p.paymentMethod === 'usdt').length}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Ko-fi Pending</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {payments.filter(p => p.status === 'pending' && p.paymentMethod === 'kofi').length}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium">Completed Today</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {payments.filter(p => p.status === 'completed' && 
                      new Date(p.confirmedAt?.seconds * 1000).toDateString() === new Date().toDateString()
                    ).length}
                  </div>
                </div>
              </div>

              {/* Ko-fi Payment Instructions */}
              {payments.some(p => p.status === 'pending' && p.paymentMethod === 'kofi') && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start">
                    <Coffee className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800 mb-2">Ko-fi Payment Instructions</h4>
                      <div className="text-sm text-orange-700 space-y-1">
                        <p>• Ko-fi payments require manual verification</p>
                        <p>• Check your Ko-fi dashboard for incoming payments</p>
                        <p>• Verify payment amount and user email match</p>
                        <p>• Click the checkmark to confirm payment and add credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-20">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay solicitudes de pago</h3>
                <p className="text-gray-600">Todas las solicitudes de pago aparecerán aquí</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet/Referencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {payment.userEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                {payment.credits} credits
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${payment.amount} {payment.paymentMethod === 'kofi' ? 'USD' : 'USDT'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {payment.paymentMethod === 'kofi' ? (
                              <Coffee className="h-4 w-4 text-orange-500 mr-2" />
                            ) : (
                              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              payment.paymentMethod === 'kofi' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {payment.paymentMethod === 'kofi' ? 'Ko-fi' : 'USDT'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {payment.paymentMethod === 'kofi' ? (
                              <span className="text-orange-600">Ko-fi Payment</span>
                            ) : (
                              <>
                                {payment.walletAddress.substring(0, 10)}...
                                {payment.walletAddress.substring(payment.walletAddress.length - 6)}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleConfirmPayment(payment.id!)}
                                disabled={processingPayment === payment.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                title={payment.paymentMethod === 'kofi' ? 'Confirm Ko-fi payment' : 'Confirm USDT payment'}
                              >
                                {processingPayment === payment.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
                                ) : (
                                  <CheckCircle size={18} />
                                )}
                              </button>
                              <button
                                onClick={() => handleRejectPayment(payment.id!)}
                                disabled={processingPayment === payment.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Reject payment"
                              >
                                <AlertCircle size={18} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tickets Management Tab */}
        {activeTab === 'tickets' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Gestión de Tickets</h2>
              <p className="text-gray-600 mt-1">Gestionar tickets de soporte, reclamos de unlock y carga de créditos</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tickets</h3>
                <p className="text-gray-600">Todos los tickets de soporte aparecerán aquí</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                #{ticket.id?.substring(0, 8)}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {ticket.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.userEmail}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTicketTypeIcon(ticket.type)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getTicketTypeLabel(ticket.type)}
                            </span>
                          </div>
                          {ticket.type === 'unlock_complaint' && ticket.imei && (
                            <div className="text-xs text-gray-500">
                              IMEI: {ticket.imei}
                            </div>
                          )}
                          {ticket.type === 'credit_loading' && ticket.requestedCredits && (
                            <div className="text-xs text-gray-500">
                              Credits: {ticket.requestedCredits}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTicketStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          {ticket.refundApproved !== undefined && (
                            <div className="mt-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                ticket.refundApproved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                Refund {ticket.refundApproved ? 'Approved' : 'Denied'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                            <button
                              onClick={() => setSelectedTicket(ticket)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Credit Management Tab */}
        {activeTab === 'credits' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Credit Management</h3>
                <p className="text-gray-600 mt-1">Manage user payment requests and credit addition</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Usuario por Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="usuario@ejemplo.com"
                  />
                  <button
                    onClick={handleSearchUser}
                    disabled={creditLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {creditLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    ) : (
                      <Search size={18} />
                    )}
                    Buscar
                  </button>
                </div>
              </div>

              {searchedUser && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Usuario Encontrado</h3>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Email:</strong> {searchedUser.email}</p>
                    <p><strong>Créditos Actuales:</strong> {searchedUser.credits || 0}</p>
                    <p><strong>Admin:</strong> {searchedUser.isAdmin ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              )}

              {searchedUser && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Acción
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="add"
                          checked={creditAction === 'add'}
                          onChange={(e) => setCreditAction(e.target.value as 'add' | 'remove')}
                          className="mr-2"
                        />
                        <Plus size={16} className="text-green-500 mr-1" />
                        Add Credits
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="remove"
                          checked={creditAction === 'remove'}
                          onChange={(e) => setCreditAction(e.target.value as 'add' | 'remove')}
                          className="mr-2"
                        />
                        <Minus size={16} className="text-red-500 mr-1" />
                        Remove Credits
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Credit Amount
                    </label>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Credit amount"
                    />
                  </div>

                  <button
                    onClick={handleCreditManagement}
                    disabled={creditLoading || !creditAmount}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      creditAction === 'add'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {creditLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Procesando...
                      </div>
                    ) : (
                      <>
                        {creditAction === 'add' ? (
                          <>
                            <Plus size={16} className="inline mr-2" />
                            Add {creditAmount} Credits
                          </>
                        ) : (
                          <>
                            <Minus size={16} className="inline mr-2" />
                            Remove {creditAmount} Credits
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* iPhone Devices Tab */}
        {activeTab === 'iphone-devices' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">iPhone Devices</h2>
              <p className="text-gray-600 mt-1">Manage manually registered iPhone devices</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {iPhoneDevices.map((device) => (
                    <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <img 
                          src={device.imageUrl} 
                          alt={device.modelName}
                          className="w-16 h-16 object-contain mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{device.modelName}</h3>
                          <p className="text-sm text-gray-500">{device.model}</p>
                          <p className="text-sm text-blue-600">{device.credits} credits</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        TACs: {device.tacs?.join(', ') || 'Ninguno'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Apple Watch & iPad Tab */}
        {activeTab === 'watch-ipad' && (
          <div className="space-y-6">
            {/* Add Device Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Apple Watch & iPad</h2>
                <button
                  onClick={() => setShowAddDevice(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Agregar Dispositivo
                </button>
              </div>

              {/* Add Device Form */}
              {showAddDevice && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Agregar Nuevo Dispositivo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Dispositivo *
                      </label>
                      <input
                        type="text"
                        value={newDevice.modelName}
                        onChange={(e) => setNewDevice({...newDevice, modelName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="iPad Air 11\"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identificador del Modelo *
                      </label>
                      <input
                        type="text"
                        value={newDevice.model}
                        onChange={(e) => setNewDevice({...newDevice, model: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ipad_air_11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de la Imagen *
                      </label>
                      <input
                        type="url"
                        value={newDevice.imageUrl}
                        onChange={(e) => setNewDevice({...newDevice, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Dispositivo *
                      </label>
                      <select
                        value={newDevice.deviceType}
                        onChange={(e) => setNewDevice({...newDevice, deviceType: e.target.value as 'ipad' | 'applewatch'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ipad">iPad</option>
                        <option value="applewatch">Apple Watch</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Cost *
                      </label>
                      <input
                        type="number"
                        value={newDevice.credits}
                        onChange={(e) => setNewDevice({...newDevice, credits: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Credit cost"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddDevice}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Guardar Dispositivo
                    </button>
                    <button
                      onClick={() => setShowAddDevice(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Devices List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : serialDevices.length === 0 ? (
                <div className="text-center py-20">
                  <Watch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No devices registered</h3>
                  <p className="text-gray-600">Add Apple Watch or iPad devices to get started</p>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serialDevices.map((device) => (
                      <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <img 
                              src={device.imageUrl} 
                              alt={device.modelName}
                              className="w-16 h-16 object-contain mr-3"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">{device.modelName}</h3>
                              <p className="text-xs text-gray-500">{device.model}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {device.deviceType === 'applewatch' ? (
                                  <Watch size={12} className="text-blue-500" />
                                ) : (
                                  <Tablet size={12} className="text-blue-500" />
                                )}
                                <span className="text-xs text-blue-600 capitalize">{device.deviceType}</span>
                              </div>
                              <p className="text-xs text-green-600 font-medium">{device.credits} credits</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 mb-3">
                          Números de serie: {device.serialNumbers?.length || 0}
                        </div>
                        
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingDevice(device)}
                            className="flex-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center gap-1"
                          >
                            <Edit size={12} />
                            Editar
                          </button>
                          <button
                            onClick={() => setSelectedDevice(device)}
                            className="flex-1 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-1"
                          >
                            <Eye size={12} />
                            Ver Series
                          </button>
                          <button
                            onClick={() => handleDeleteDevice(device.id!)}
                            className="flex-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center gap-1"
                          >
                            <Trash2 size={12} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Edit Device Modal */}
            {editingDevice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Editar Dispositivo</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Dispositivo
                      </label>
                      <input
                        type="text"
                        value={editingDevice.modelName}
                        onChange={(e) => setEditingDevice({...editingDevice, modelName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identificador del Modelo
                      </label>
                      <input
                        type="text"
                        value={editingDevice.model}
                        onChange={(e) => setEditingDevice({...editingDevice, model: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de la Imagen
                      </label>
                      <input
                        type="url"
                        value={editingDevice.imageUrl}
                        onChange={(e) => setEditingDevice({...editingDevice, imageUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credit Cost
                      </label>
                      <input
                        type="number"
                        value={editingDevice.credits}
                        onChange={(e) => setEditingDevice({...editingDevice, credits: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={handleUpdateDevice}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={() => setEditingDevice(null)}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Serial Numbers Modal */}
            {selectedDevice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Números de Serie - {selectedDevice.modelName}
                  </h3>
                  
                  {/* Add Serial Number */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agregar Nuevo Número de Serie
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSerialNumber}
                        onChange={(e) => setNewSerialNumber(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="FVXLL79LM4"
                      />
                      <button
                        onClick={handleAddSerial}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>

                  {/* Serial Numbers List */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Números de Serie Registrados ({selectedDevice.serialNumbers?.length || 0})
                    </h4>
                    {selectedDevice.serialNumbers && selectedDevice.serialNumbers.length > 0 ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedDevice.serialNumbers.map((serial, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="font-mono text-sm">{serial}</span>
                            <button
                              onClick={() => handleRemoveSerial(serial)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No hay números de serie registrados</p>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedDevice(null)}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Models Tab */}
        {activeTab === 'api-models' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Modelos API</h2>
              <p className="text-gray-600">Información sobre modelos disponibles a través de la API externa</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="text-blue-500" size={20} />
                <h3 className="font-medium text-blue-800">API Externa</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Los dispositivos iPhone se obtienen automáticamente de la API externa cuando los usuarios buscan por IMEI. 
                Los modelos Apple Watch e iPad deben agregarse manualmente desde la sección correspondiente.
              </p>
            </div>
          </div>
        )}

        {/* Ticket Response Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Responder Ticket #{selectedTicket.id?.substring(0, 8)}
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">Detalles del Ticket</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Usuario:</strong> {selectedTicket.userEmail}</p>
                    <p><strong>Tipo:</strong> {getTicketTypeLabel(selectedTicket.type)}</p>
                    <p><strong>Título:</strong> {selectedTicket.title}</p>
                    <p><strong>Descripción:</strong> {selectedTicket.description}</p>
                    {selectedTicket.imei && (
                      <p><strong>IMEI:</strong> {selectedTicket.imei}</p>
                    )}
                    {selectedTicket.model && (
                      <p><strong>Modelo:</strong> {selectedTicket.model}</p>
                    )}
                    {selectedTicket.requestedCredits && (
                      <p><strong>Créditos Solicitados:</strong> {selectedTicket.requestedCredits}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Respuesta del Administrador *
                  </label>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTicket) {
                          setAdminResponse(generateRejectionMessage(selectedTicket));
                          setRefundReason('Rejected due to password-related account conflict');
                        }
                      }}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Aplicar Mensaje de Rechazo
                    </button>
                  </div>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escribe tu respuesta al usuario..."
                  />
                </div>

                {selectedTicket.type === 'unlock_complaint' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Decisión de Reintegro
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="refundDecision"
                            checked={refundDecision === true}
                            onChange={() => setRefundDecision(true)}
                            className="mr-2"
                          />
                          <CheckCircle size={16} className="text-green-500 mr-1" />
                          Aprobar Reintegro
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="refundDecision"
                            checked={refundDecision === false}
                            onChange={() => {
                              setRefundDecision(false);
                              if (selectedTicket) {
                                setAdminResponse(generateRejectionMessage(selectedTicket));
                                setRefundReason('Rejected due to password-related account conflict');
                              }
                            }}
                            className="mr-2"
                          />
                          <X size={16} className="text-red-500 mr-1" />
                          Rechazar Reintegro
                        </label>
                      </div>
                    </div>

                    {refundDecision === true && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cantidad de Créditos a Reintegrar
                        </label>
                        <input
                          type="number"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Cantidad de créditos"
                          min="1"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Razón de la Decisión
                      </label>
                      <input
                        type="text"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Explica la razón de tu decisión"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleTicketResponse}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Enviar Respuesta
                </button>
                <button
                  onClick={() => {
                    setSelectedTicket(null);
                    setAdminResponse('');
                    setRefundDecision(null);
                    setRefundAmount('');
                    setRefundReason('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timing Configuration Tab */}
        {activeTab === 'timing-config' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Configuración de Tiempos de Proceso</h2>
                  <p className="text-gray-600">Configurar tiempos de carga para procesos de desbloqueo iCloud y blacklist</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetTimingConfig}
                    disabled={savingConfig || timingLoading}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Restablecer
                  </button>
                  <button
                    onClick={handleSaveTimingConfig}
                    disabled={savingConfig || timingLoading || !timingConfig}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save size={16} />
                    {savingConfig ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>

            {timingLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : timingConfig ? (
              <div className="space-y-6">
                {/* Configuración General */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Configuración General</h3>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={timingConfig.enabled}
                        onChange={(e) => setTimingConfig({...timingConfig, enabled: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Habilitar configuración personalizada</span>
                    </label>
                  </div>
                </div>

                {/* Tiempos de Desbloqueo iCloud */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-800 mb-4">Desbloqueo iCloud</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo mínimo (minutos)
                      </label>
                      <input
                        type="number"
                        value={timingConfig.unlockMinMinutes}
                        onChange={(e) => setTimingConfig({...timingConfig, unlockMinMinutes: parseInt(e.target.value) || 5})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo máximo (minutos)
                      </label>
                      <input
                        type="number"
                        value={timingConfig.unlockMaxMinutes}
                        onChange={(e) => setTimingConfig({...timingConfig, unlockMaxMinutes: parseInt(e.target.value) || 15})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="60"
                      />
                    </div>
                  </div>
                </div>

                {/* Tiempos de Blacklist */}
                <div className="bg-red-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-800 mb-4">Remoción de Blacklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo mínimo (minutos)
                      </label>
                      <input
                        type="number"
                        value={timingConfig.blacklistMinMinutes}
                        onChange={(e) => setTimingConfig({...timingConfig, blacklistMinMinutes: parseInt(e.target.value) || 5})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiempo máximo (minutos)
                      </label>
                      <input
                        type="number"
                        value={timingConfig.blacklistMaxMinutes}
                        onChange={(e) => setTimingConfig({...timingConfig, blacklistMaxMinutes: parseInt(e.target.value) || 15})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        min="1"
                        max="60"
                      />
                    </div>
                  </div>
                </div>

                {/* Información de última actualización */}
                {timingConfig.lastUpdated && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="text-gray-500" size={16} />
                      <span className="text-sm text-gray-600">
                        Última actualización: {formatDate(timingConfig.lastUpdated)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20">
                <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar configuración</h3>
                <p className="text-gray-600">No se pudo cargar la configuración de tiempos</p>
              </div>
            )}
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Usuarios Registrados</h2>
              <p className="text-gray-600 mt-1">Gestionar usuarios registrados y verificar su estado</p>
              
              {/* User Statistics */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Usuarios</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {users.length}
                  </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Email Verificado</div>
                  <div className="text-2xl font-bold text-green-900">
                    {users.filter(u => u.emailVerified).length}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium">Administradores</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {users.filter(u => u.isAdmin).length}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <div className="text-sm text-orange-600 font-medium">Con Créditos</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {users.filter(u => u.credits > 0).length}
                  </div>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="text-sm text-indigo-600 font-medium">Registrados Hoy</div>
                  <div className="text-2xl font-bold text-indigo-900">
                    {users.filter(u => {
                      if (!u.createdAt) return false;
                      const userDate = u.createdAt.toDate();
                      const today = new Date();
                      return userDate.toDateString() === today.toDateString();
                    }).length}
                  </div>
                </div>
              </div>
            </div>

            {usersLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-20">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios registrados</h3>
                <p className="text-gray-600">Los usuarios aparecerán aquí una vez que se registren</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créditos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de Registro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.email}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {user.uid.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {user.emailVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.emailVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {user.emailVerified ? 'Verificado' : 'Pendiente'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.credits} créditos
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.credits > 0 ? 'Activo' : 'Sin créditos'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isAdmin 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isAdmin ? 'Administrador' : 'Usuario'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatUserRegistrationDate(user.createdAt)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.createdAt ? 'Registrado' : 'Fecha no disponible'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setUserEmail(user.email || '');
                                setSearchedUser(user);
                                setActiveTab('credits');
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Gestionar créditos"
                            >
                              <CreditCard size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.email || '')}
                              disabled={deletingUser === user.uid || user.uid === currentUser?.uid}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={user.uid === currentUser?.uid ? "No puedes eliminar tu propia cuenta" : "Eliminar usuario"}
                            >
                              {deletingUser === user.uid ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
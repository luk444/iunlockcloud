import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ticketService } from '../services/ticketService';
import { Ticket as TicketType } from '../types';
import { 
  Ticket, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Smartphone, 
  CreditCard, 
  Plus,
  MessageSquare,
  Filter,
  Search,
  User,
  Calendar,
  Eye,
  X
} from 'lucide-react';
import Loader from '../components/Loader/Loader';
import toast from 'react-hot-toast';

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'unlock_complaint' | 'credit_loading' | 'general_support'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  
  // Create ticket form state
  const [newTicket, setNewTicket] = useState({
    type: 'general_support' as 'unlock_complaint' | 'credit_loading' | 'general_support',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    imei: '',
    model: '',
    requestedCredits: ''
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  const fetchTickets = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userTickets = await ticketService.getUserTickets(currentUser.uid);
      setTickets(userTickets);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Error loading your tickets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!currentUser || !newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    try {
      const ticketData: any = {
        type: newTicket.type,
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority
      };

      if (newTicket.type === 'unlock_complaint' && newTicket.imei && newTicket.model) {
        ticketData.imei = newTicket.imei;
        ticketData.model = newTicket.model;
      }

      if (newTicket.type === 'credit_loading' && newTicket.requestedCredits) {
        ticketData.requestedCredits = parseInt(newTicket.requestedCredits);
      }

      await ticketService.createTicket(currentUser.uid, currentUser.email || '', ticketData);
      
      toast.success('¡Ticket created successfully!');
      setShowCreateTicket(false);
      setNewTicket({
        type: 'general_support',
        title: '',
        description: '',
        priority: 'medium',
        imei: '',
        model: '',
        requestedCredits: ''
      });
      
      await fetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Error creating ticket. Please try again..');
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: <Clock size={14} className="text-blue-500" />,
          label: 'Open'
        };
      case 'in_progress':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          icon: <Clock size={14} className="text-yellow-500" />,
          label: 'In progress'
        };
      case 'resolved':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: <CheckCircle size={14} className="text-green-500" />,
          label: 'Resolved'
        };
      case 'closed':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <CheckCircle size={14} className="text-gray-500" />,
          label: 'Closed'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: <Clock size={14} className="text-gray-500" />,
          label: status
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unlock_complaint':
        return <Smartphone size={16} className="text-red-500" />;
      case 'credit_loading':
        return <CreditCard size={16} className="text-green-500" />;
      default:
        return <MessageSquare size={16} className="text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'unlock_complaint':
        return 'Unlock Claim';
      case 'credit_loading':
        return 'Credit Loading';
      default:
        return 'General Support';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const typeMatch = filterType === 'all' || ticket.type === filterType;
    const statusMatch = filterStatus === 'all' || ticket.status === filterStatus;
    return typeMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Support tickets</h1>
            <p className="text-gray-600 mt-2">View and manage your support requests</p>
          </div>
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={18} />
            Create Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="unlock_complaint">Unlocking Claims</option>
                <option value="credit_loading">Credit Loading</option>
                <option value="general_support">General Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progres</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Ticket className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">You don't have any support tickets yet.</h3>
            <p className="text-gray-600 mb-6">
              Create a support ticket if you need help unlocking your device or loading credits.
            </p>
            <button
              onClick={() => setShowCreateTicket(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              Create your First Ticket
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => {
                    const statusBadge = getStatusBadge(ticket.status);
                    
                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Ticket className="flex-shrink-0 h-5 w-5 text-gray-500" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                #{ticket.id?.substring(0, 8)}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {ticket.title}
                              </div>
                              {ticket.adminResponse && (
                                <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                  <User size={12} />
                                  Admin response
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTypeIcon(ticket.type)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getTypeLabel(ticket.type)}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.icon}
                            <span className="ml-1">{statusBadge.label}</span>
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
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye size={16} />
                            See Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ticket Details Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      Ticket #{selectedTicket.id?.substring(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedTicket.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-sm text-gray-900">{getTypeLabel(selectedTicket.type)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedTicket.status).bg} ${getStatusBadge(selectedTicket.status).text}`}>
                        {getStatusBadge(selectedTicket.status).label}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                        {getPriorityLabel(selectedTicket.priority)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Creation Date</label>
                      <p className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</p>
                    </div>
                  </div>

                  {selectedTicket.type === 'unlock_complaint' && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTicket.imei && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">IMEI</label>
                          <p className="text-sm text-gray-900">{selectedTicket.imei}</p>
                        </div>
                      )}
                      {selectedTicket.model && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Model</label>
                          <p className="text-sm text-gray-900">{selectedTicket.model}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTicket.type === 'credit_loading' && selectedTicket.requestedCredits && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Requested Credits</label>
                      <p className="text-sm text-gray-900">{selectedTicket.requestedCredits}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {selectedTicket.adminResponse && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User size={16} className="text-blue-500" />
                        Admin Response
                      </label>
                      <div className="mt-1 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                        <p className="text-sm text-blue-900 whitespace-pre-wrap">{selectedTicket.adminResponse}</p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.refundApproved !== undefined && (
                    <div className={`p-4 rounded-lg ${selectedTicket.refundApproved ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedTicket.refundApproved ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <X className="text-red-500" size={20} />
                        )}
                        <h4 className={`font-medium ${selectedTicket.refundApproved ? 'text-green-800' : 'text-red-800'}`}>
                          Refund {selectedTicket.refundApproved ? 'Approved' : 'Denied'}
                        </h4>
                      </div>
                      {selectedTicket.refundAmount && (
                        <p className={`text-sm ${selectedTicket.refundApproved ? 'text-green-700' : 'text-red-700'}`}>
                          Amount: {selectedTicket.refundAmount} credits
                        </p>
                      )}
                      {selectedTicket.refundReason && (
                        <p className={`text-sm ${selectedTicket.refundApproved ? 'text-green-700' : 'text-red-700'}`}>
                          Reason: {selectedTicket.refundReason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Ticket Modal */}
        {showCreateTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Create Support Ticket</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Type *
                  </label>
                  <select
                    value={newTicket.type}
                    onChange={(e) => setNewTicket({...newTicket, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general_support">General Support</option>
                    <option value="unlock_complaint">Unlocking Process Claim</option>
                    <option value="credit_loading">Credit Loading Problem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of your problem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed description of your problem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                {newTicket.type === 'unlock_complaint' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IMEI Device
                      </label>
                      <input
                        type="text"
                        value={newTicket.imei}
                        onChange={(e) => setNewTicket({...newTicket, imei: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="IMEI number of the deviceo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model Device
                      </label>
                      <input
                        type="text"
                        value={newTicket.model}
                        onChange={(e) => setNewTicket({...newTicket, model: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="iPhone Model"
                      />
                    </div>
                  </>
                )}

                {newTicket.type === 'credit_loading' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requested Credits
                    </label>
                    <input
                      type="number"
                      value={newTicket.requestedCredits}
                      onChange={(e) => setNewTicket({...newTicket, requestedCredits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Number of credits"
                      min="1"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleCreateTicket}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => setShowCreateTicket(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
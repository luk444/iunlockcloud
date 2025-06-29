import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  orderBy,
  doc,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { Ticket } from '../types';

export const ticketService = {
  // Create a new ticket
  async createTicket(userId: string, userEmail: string, data: {
    type: 'unlock_complaint' | 'credit_loading' | 'general_support';
    title: string;
    description: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    deviceId?: string;
    imei?: string;
    model?: string;
    paymentId?: string;
    requestedCredits?: number;
  }): Promise<string> {
    try {
      const now = Timestamp.now();
      const ticketRef = await addDoc(collection(db, 'tickets'), {
        userId,
        userEmail,
        ...data,
        priority: data.priority || 'medium',
        status: 'open',
        createdAt: now,
        updatedAt: now
      });
      return ticketRef.id;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Get all tickets for a user
  async getUserTickets(userId: string): Promise<Ticket[]> {
    try {
      const q = query(
        collection(db, 'tickets'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tickets: Ticket[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ticket, 'id'>;
        tickets.push({
          id: doc.id,
          ...data
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Error getting user tickets:', error);
      throw error;
    }
  },

  // Get all tickets (admin only)
  async getAllTickets(): Promise<Ticket[]> {
    try {
      const q = query(
        collection(db, 'tickets'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tickets: Ticket[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ticket, 'id'>;
        tickets.push({
          id: doc.id,
          ...data
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Error getting all tickets:', error);
      throw error;
    }
  },

  // Update ticket status and admin response
  async updateTicket(ticketId: string, updates: {
    status?: 'open' | 'in_progress' | 'resolved' | 'closed';
    adminResponse?: string;
    adminUserId?: string;
    refundApproved?: boolean;
    refundAmount?: number;
    refundReason?: string;
  }): Promise<void> {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      if (updates.status === 'resolved' || updates.status === 'closed') {
        updateData.resolvedAt = Timestamp.now();
      }

      await updateDoc(ticketRef, updateData);
    } catch (error) {
      console.error('Error updating ticket:', error);
      throw error;
    }
  },

  // Get tickets by type
  async getTicketsByType(type: 'unlock_complaint' | 'credit_loading' | 'general_support'): Promise<Ticket[]> {
    try {
      const q = query(
        collection(db, 'tickets'),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tickets: Ticket[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ticket, 'id'>;
        tickets.push({
          id: doc.id,
          ...data
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Error getting tickets by type:', error);
      throw error;
    }
  },

  // Get pending tickets
  async getPendingTickets(): Promise<Ticket[]> {
    try {
      const q = query(
        collection(db, 'tickets'),
        where('status', 'in', ['open', 'in_progress']),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const tickets: Ticket[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ticket, 'id'>;
        tickets.push({
          id: doc.id,
          ...data
        });
      });
      
      return tickets;
    } catch (error) {
      console.error('Error getting pending tickets:', error);
      throw error;
    }
  }
};
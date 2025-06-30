import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { PaymentRequest } from '../types';
import { userService } from './userService';

export const paymentService = {
  async createPaymentRequest(
    userId: string, 
    userEmail: string, 
    amount: number, 
    walletAddress: string,
    paymentMethod: 'usdt' | 'kofi' = 'usdt'
  ): Promise<string> {
    try {
      // Verificar si ya tiene un pago pendiente
      const existingPayments = await this.getUserPayments(userId);
      const hasPendingPayment = existingPayments.some(payment => payment.status === 'pending');
      
      if (hasPendingPayment) {
        throw new Error('You already have a pending payment. Please wait for it to be processed.');
      }

      const credits = Math.floor(amount); // 1 USDT = 1 crédito

      
      const paymentData = {
        userId,
        userEmail,
        amount,
        credits,
        walletAddress,
        paymentMethod,
        status: 'pending' as const,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  },

  async getUserPayments(userId: string): Promise<PaymentRequest[]> {
    try {
      // Consulta simple sin orderBy para evitar índices complejos
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const payments: PaymentRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          amount: data.amount,
          credits: data.credits,
          walletAddress: data.walletAddress,
          paymentMethod: data.paymentMethod || 'usdt',
          status: data.status,
          transactionId: data.transactionId,
          rejectionReason: data.rejectionReason,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          confirmedAt: data.confirmedAt,
          rejectedAt: data.rejectedAt
        });
      });

      // Ordenar en el cliente por fecha de creación (más reciente primero)
      return payments.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  },

  async getAllPayments(): Promise<PaymentRequest[]> {
    try {
      // Consulta simple sin orderBy
      const querySnapshot = await getDocs(collection(db, 'payments'));
      const payments: PaymentRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          amount: data.amount,
          credits: data.credits,
          walletAddress: data.walletAddress,
          paymentMethod: data.paymentMethod || 'usdt',
          status: data.status,
          transactionId: data.transactionId,
          rejectionReason: data.rejectionReason,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          confirmedAt: data.confirmedAt,
          rejectedAt: data.rejectedAt
        });
      });

      // Ordenar en el cliente por fecha de creación (más reciente primero)
      return payments.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw error;
    }
  },

  async confirmPayment(paymentId: string, transactionId?: string): Promise<void> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      const paymentDoc = await getDoc(paymentRef);
      
      if (!paymentDoc.exists()) {
        throw new Error('Payment not found');
      }

      const paymentData = paymentDoc.data() as PaymentRequest;
      
      if (paymentData.status !== 'pending') {
        throw new Error('Payment is not pending');
      }

      // Update payment status
      await updateDoc(paymentRef, {
        status: 'completed',
        transactionId: transactionId || 'manual-confirmation',
        updatedAt: Timestamp.now(),
        confirmedAt: Timestamp.now()
      });

      // Add credits to user
      await userService.addCreditsToUser(paymentData.userId, paymentData.credits);
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  async rejectPayment(paymentId: string, reason?: string): Promise<void> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      
      await updateDoc(paymentRef, {
        status: 'rejected',
        rejectionReason: reason || 'Payment rejected by admin',
        updatedAt: Timestamp.now(),
        rejectedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error rejecting payment:', error);
      throw error;
    }
  },

  async getPendingPayments(): Promise<PaymentRequest[]> {
    try {
      const q = query(
        collection(db, 'payments'),
        where('status', '==', 'pending')
      );

      const querySnapshot = await getDocs(q);
      const payments: PaymentRequest[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        payments.push({
          id: doc.id,
          userId: data.userId,
          userEmail: data.userEmail,
          amount: data.amount,
          credits: data.credits,
          walletAddress: data.walletAddress,
          paymentMethod: data.paymentMethod || 'usdt',
          status: data.status,
          transactionId: data.transactionId,
          rejectionReason: data.rejectionReason,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          confirmedAt: data.confirmedAt,
          rejectedAt: data.rejectedAt
        });
      });

      // Ordenar en el cliente por fecha de creación (más reciente primero)
      return payments.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  }
};
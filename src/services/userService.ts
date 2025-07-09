import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, runTransaction, deleteDoc } from 'firebase/firestore';
import { User } from '../types';

export const userService = {
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        uid: userDoc.id,
        ...userDoc.data()
      } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
          emailVerified: data.emailVerified || false,
          isAdmin: data.isAdmin || false,
          credits: data.credits || 0,
          createdAt: data.createdAt
        } as User);
      });
      
      // Ordenar por fecha de creación (más recientes primero)
      return users.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          const aTime = a.createdAt.seconds || 0;
          const bTime = b.createdAt.seconds || 0;
          return bTime - aTime; // Más recientes primero
        }
        // Si no hay createdAt, ordenar por email
        return (a.email || '').localeCompare(b.email || '');
      });
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      // Eliminar el documento del usuario
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async addCreditsToUser(userId: string, creditsToAdd: number): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', userId);
        const userDoc = await transaction.get(userRef);
        
        if (!userDoc.exists()) {
          throw new Error('User not found');
        }
        
        const currentCredits = userDoc.data().credits || 0;
        const newCredits = Math.max(0, currentCredits + creditsToAdd); // Ensure credits don't go below 0
        
        transaction.update(userRef, {
          credits: newCredits
        });
      });
    } catch (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  }
};
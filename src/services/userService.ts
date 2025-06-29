import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, updateDoc, getDoc, runTransaction } from 'firebase/firestore';
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
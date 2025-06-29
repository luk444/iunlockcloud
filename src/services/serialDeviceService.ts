import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { SerialDevice, RegisteredSerialDevice } from '../types';

const serialDevicesCollection = collection(db, 'serialDevices');
const registeredSerialDevicesCollection = collection(db, 'registeredSerialDevices');

export const getAllSerialDevices = async (): Promise<SerialDevice[]> => {
  const snapshot = await getDocs(serialDevicesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SerialDevice[];
};

export const getDeviceBySerial = async (serialNumber: string): Promise<SerialDevice | null> => {
  const q = query(serialDevicesCollection, where('serialNumbers', 'array-contains', serialNumber));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data()
  } as SerialDevice;
};

export const addSerialDevice = async (device: Omit<SerialDevice, 'id'>): Promise<string> => {
  const docRef = await addDoc(serialDevicesCollection, {
    ...device,
    credits: device.credits || 100
  });
  return docRef.id;
};

export const updateSerialDevice = async (id: string, device: Partial<SerialDevice>): Promise<void> => {
  const deviceRef = doc(db, 'serialDevices', id);
  await updateDoc(deviceRef, device);
};

export const deleteSerialDevice = async (id: string): Promise<void> => {
  const deviceRef = doc(db, 'serialDevices', id);
  await deleteDoc(deviceRef);
};

export const addSerialToDevice = async (deviceId: string, serialNumber: string): Promise<void> => {
  const deviceRef = doc(db, 'serialDevices', deviceId);
  const deviceDoc = await getDoc(deviceRef);

  if (deviceDoc.exists()) {
    const deviceData = deviceDoc.data() as SerialDevice;
    if (!deviceData.serialNumbers) {
      deviceData.serialNumbers = [];
    }
    if (!deviceData.serialNumbers.includes(serialNumber)) {
      await updateDoc(deviceRef, {
        serialNumbers: [...deviceData.serialNumbers, serialNumber],
      });
    }
  } else {
    throw new Error('Device not found');
  }
};

export const removeSerialFromDevice = async (deviceId: string, serialNumber: string): Promise<void> => {
  const deviceRef = doc(db, 'serialDevices', deviceId);
  const deviceDoc = await getDoc(deviceRef);

  if (deviceDoc.exists()) {
    const deviceData = deviceDoc.data() as SerialDevice;
    if (!deviceData.serialNumbers) {
      return;
    }
    const updatedSerials = deviceData.serialNumbers.filter((s) => s !== serialNumber);
    await updateDoc(deviceRef, {
      serialNumbers: updatedSerials,
    });
  } else {
    throw new Error('Device not found');
  }
};

export const registerSerialDevice = async (userId: string, deviceData: Omit<RegisteredSerialDevice, 'id' | 'userId' | 'createdAt'>, deviceCredits: number): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // Check if device is already registered
    const existingQuery = query(
      registeredSerialDevicesCollection, 
      where('userId', '==', userId),
      where('serialNumber', '==', deviceData.serialNumber)
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      return existingDocs.docs[0].id;
    }

    // Get user document
    const userRef = doc(db, 'users', userId);
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const currentCredits = userData.credits || 0;

    // Check if user has enough credits (admin bypass)
    if (!userData.isAdmin && currentCredits < deviceCredits) {
      throw new Error(`Insufficient credits. You need ${deviceCredits} credits but only have ${currentCredits}.`);
    }

    // Deduct credits if not admin
    if (!userData.isAdmin) {
      transaction.update(userRef, {
        credits: currentCredits - deviceCredits
      });
    }

    // Register the device
    const device = {
      ...deviceData,
      userId,
      createdAt: serverTimestamp()
    };
    
    const deviceRef = doc(registeredSerialDevicesCollection);
    transaction.set(deviceRef, device);
    
    return deviceRef.id;
  });
};

export const getUserSerialDevices = async (userId: string): Promise<RegisteredSerialDevice[]> => {
  const q = query(registeredSerialDevicesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as RegisteredSerialDevice[];
};

export const updateSerialDeviceUnlockResult = async (userId: string, deviceId: string, unlockResult: 'success' | 'token_denied' | 'failed' | 'pending'): Promise<void> => {
  const deviceRef = doc(db, 'registeredSerialDevices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  
  if (!deviceDoc.exists() || deviceDoc.data()?.userId !== userId) {
    throw new Error('Device not found or unauthorized');
  }
  
  await updateDoc(deviceRef, {
    unlockResult,
    updatedAt: serverTimestamp()
  });
};
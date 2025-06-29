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
  setDoc,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Device, RegisteredDevice } from '../types';
import { deviceApiService } from './deviceApiService';

const devicesCollection = collection(db, 'devices');
const registeredDevicesCollection = collection(db, 'registeredDevices');

export const getAllDevices = async (): Promise<Device[]> => {
  const snapshot = await getDocs(devicesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Device[];
};

export const getDeviceByTac = async (tac: string): Promise<Device | null> => {
  // First check manually created devices
  const q = query(devicesCollection, where('tacs', 'array-contains', tac));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as Device;
  }
  
  // If not found in manual devices, try API with full IMEI
  // We need the full IMEI for API call, but we only have TAC here
  // This will be handled in the search components
  return null;
};

export const getDeviceByImei = async (imei: string): Promise<Device | null> => {
  const tac = imei.substring(0, 8);
  
  // Always try API first for iPhone devices to get fresh data with proper formatting
  const apiDevice = await deviceApiService.getDeviceByImei(imei);
  if (apiDevice) {
    // Update or save to database for future reference
    try {
      // Check if device already exists in database
      const existingDevice = await getDeviceByTac(tac);
      if (existingDevice) {
        // Update existing device with fresh data
        await updateDevice(existingDevice.id!, {
          modelName: apiDevice.modelName,
          imageUrl: apiDevice.imageUrl,
          credits: apiDevice.credits
        });
      } else {
        // Save new device to database
        await addDevice(apiDevice);
      }
      return apiDevice;
    } catch (error) {
      console.error('Error saving/updating API device to database:', error);
      // Return the device even if we can't save it
      return apiDevice;
    }
  }
  
  // If API doesn't return a device, check manually created devices
  const manualDevice = await getDeviceByTac(tac);
  if (manualDevice) {
    return manualDevice;
  }
  
  return null;
};

export const addDevice = async (device: Omit<Device, 'id'>): Promise<string> => {
  const docRef = await addDoc(devicesCollection, {
    ...device,
    credits: device.credits || 100 // Default credits if not specified
  });
  return docRef.id;
};

export const updateDevice = async (id: string, device: Partial<Device>): Promise<void> => {
  const deviceRef = doc(db, 'devices', id);
  await updateDoc(deviceRef, device);
};

export const deleteDevice = async (id: string): Promise<void> => {
  const deviceRef = doc(db, 'devices', id);
  await deleteDoc(deviceRef);
};

export const registerDevice = async (userId: string, deviceData: Omit<RegisteredDevice, 'id' | 'userId' | 'createdAt'>, deviceCredits: number): Promise<string> => {
  return await runTransaction(db, async (transaction) => {
    // Check if device is already registered
    const existingQuery = query(
      registeredDevicesCollection, 
      where('userId', '==', userId),
      where('imei', '==', deviceData.imei)
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
    
    const deviceRef = doc(registeredDevicesCollection);
    transaction.set(deviceRef, device);
    
    return deviceRef.id;
  });
};

export const deleteRegisteredDevice = async (userId: string, deviceId: string): Promise<void> => {
  const deviceRef = doc(db, 'registeredDevices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  
  if (!deviceDoc.exists() || deviceDoc.data()?.userId !== userId) {
    throw new Error('Device not found or unauthorized');
  }
  
  await deleteDoc(deviceRef);
};

export const getUserDevices = async (userId: string): Promise<RegisteredDevice[]> => {
  const q = query(registeredDevicesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as RegisteredDevice[];
};

export const checkDeviceByImei = async (imei: string): Promise<Device | null> => {
  return getDeviceByImei(imei);
};

export const addTacToDevice = async (deviceId: string, tac: string): Promise<void> => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceDoc = await getDoc(deviceRef);

  if (deviceDoc.exists()) {
    const deviceData = deviceDoc.data() as Device;
    if (!deviceData.tacs) {
      deviceData.tacs = [];
    }
    if (!deviceData.tacs.includes(tac)) {
      await updateDoc(deviceRef, {
        tacs: [...deviceData.tacs, tac],
      });
    }
  } else {
    throw new Error('Device not found');
  }
};

export const removeTacFromDevice = async (deviceId: string, tac: string): Promise<void> => {
  const deviceRef = doc(db, 'devices', deviceId);
  const deviceDoc = await getDoc(deviceRef);

  if (deviceDoc.exists()) {
    const deviceData = deviceDoc.data() as Device;
    if (!deviceData.tacs) {
      return;
    }
    const updatedTacs = deviceData.tacs.filter((t) => t !== tac);
    await updateDoc(deviceRef, {
      tacs: updatedTacs,
    });
  } else {
    throw new Error('Device not found');
  }
};

export const updateDeviceUnlockResult = async (userId: string, deviceId: string, unlockResult: 'success' | 'token_denied' | 'failed' | 'pending'): Promise<void> => {
  const deviceRef = doc(db, 'registeredDevices', deviceId);
  const deviceDoc = await getDoc(deviceRef);
  
  if (!deviceDoc.exists() || deviceDoc.data()?.userId !== userId) {
    throw new Error('Device not found or unauthorized');
  }
  
  await updateDoc(deviceRef, {
    unlockResult,
    updatedAt: serverTimestamp()
  });
};
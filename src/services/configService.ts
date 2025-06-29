import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface ProcessTimingConfig {
  // Tiempos mínimos y máximos en minutos
  unlockMinMinutes: number;
  unlockMaxMinutes: number;
  blacklistMinMinutes: number;
  blacklistMaxMinutes: number;
  
  // Distribución de pasos (porcentajes)
  unlockPhase1Distribution: {
    step1: number; // Connecting with server
    step2: number; // Sending token
    step3: number; // Waiting for confirmation
    step4: number; // Transition to phase 2
  };
  unlockPhase2Distribution: {
    step1: number; // Waiting for confirmation from the network
    step2: number; // Server data validation
    step3: number; // Waiting for server confirmation
    step4: number; // Final result
  };
  blacklistPhase1Distribution: {
    step1: number; // Connecting to blacklist database
    step2: number; // Analyzing report status
    step3: number; // Preparing removal token
    step4: number; // Transition to phase 2
  };
  blacklistPhase2Distribution: {
    step1: number; // Verifying with external validation tools
    step2: number; // Cross-referencing security databases
    step3: number; // Finalizing removal process
    step4: number; // Final result
  };
  
  // Configuración general
  enabled: boolean;
  lastUpdated: any;
}

const defaultConfig: ProcessTimingConfig = {
  unlockMinMinutes: 5,
  unlockMaxMinutes: 15,
  blacklistMinMinutes: 5,
  blacklistMaxMinutes: 15,
  unlockPhase1Distribution: {
    step1: 20,
    step2: 30,
    step3: 30,
    step4: 20
  },
  unlockPhase2Distribution: {
    step1: 25,
    step2: 35,
    step3: 25,
    step4: 15
  },
  blacklistPhase1Distribution: {
    step1: 25,
    step2: 35,
    step3: 25,
    step4: 15
  },
  blacklistPhase2Distribution: {
    step1: 20,
    step2: 40,
    step3: 25,
    step4: 15
  },
  enabled: true,
  lastUpdated: null
};

const configCollection = 'systemConfig';
const configDoc = 'processTiming';

export const getProcessTimingConfig = async (): Promise<ProcessTimingConfig> => {
  try {
    const configRef = doc(db, configCollection, configDoc);
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      return configSnap.data() as ProcessTimingConfig;
    } else {
      // Si no existe, crear con valores por defecto
      await setDoc(configRef, {
        ...defaultConfig,
        lastUpdated: serverTimestamp()
      });
      return defaultConfig;
    }
  } catch (error) {
    console.error('Error getting process timing config:', error);
    return defaultConfig;
  }
};

export const updateProcessTimingConfig = async (config: Partial<ProcessTimingConfig>): Promise<void> => {
  try {
    const configRef = doc(db, configCollection, configDoc);
    await updateDoc(configRef, {
      ...config,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating process timing config:', error);
    throw error;
  }
};

export const resetProcessTimingConfig = async (): Promise<void> => {
  try {
    const configRef = doc(db, configCollection, configDoc);
    await setDoc(configRef, {
      ...defaultConfig,
      lastUpdated: serverTimestamp()
    });
  } catch (error) {
    console.error('Error resetting process timing config:', error);
    throw error;
  }
}; 
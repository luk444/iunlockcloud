import { useState, useEffect } from 'react';
import { getProcessTimingConfig, ProcessTimingConfig } from '../services/configService';

export const useProcessTiming = () => {
  const [config, setConfig] = useState<ProcessTimingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const timingConfig = await getProcessTimingConfig();
      setConfig(timingConfig);
    } catch (err) {
      console.error('Error loading process timing config:', err);
      setError('Error loading configuration');
    } finally {
      setLoading(false);
    }
  };

  const getRandomTime = (processType: 'unlock' | 'blacklist') => {
    if (!config || !config.enabled) {
      // Valores por defecto si no hay configuración
      const minMinutes = 5;
      const maxMinutes = 15;
      const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
      return randomMinutes * 60 * 1000;
    }

    const minMinutes = processType === 'unlock' ? config.unlockMinMinutes : config.blacklistMinMinutes;
    const maxMinutes = processType === 'unlock' ? config.unlockMaxMinutes : config.blacklistMaxMinutes;
    
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    return randomMinutes * 60 * 1000; // Convertir a milisegundos
  };

  const getStepDistribution = (processType: 'unlock' | 'blacklist', phase: 1 | 2) => {
    if (!config) {
      // Distribuciones por defecto
      if (processType === 'unlock') {
        return phase === 1 
          ? { step1: 20, step2: 30, step3: 30, step4: 20 }
          : { step1: 25, step2: 35, step3: 25, step4: 15 };
      } else {
        return phase === 1
          ? { step1: 25, step2: 35, step3: 25, step4: 15 }
          : { step1: 20, step2: 40, step3: 25, step4: 15 };
      }
    }

    if (processType === 'unlock') {
      return phase === 1 ? config.unlockPhase1Distribution : config.unlockPhase2Distribution;
    } else {
      return phase === 1 ? config.blacklistPhase1Distribution : config.blacklistPhase2Distribution;
    }
  };

  return {
    config,
    loading,
    error,
    getRandomTime,
    getStepDistribution,
    reloadConfig: loadConfig
  };
}; 
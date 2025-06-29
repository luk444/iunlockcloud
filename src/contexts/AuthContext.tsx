import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  sendPasswordResetEmail,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resendVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
  verifyEmail: (oobCode: string) => Promise<void>;
  checkActionCode: (oobCode: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousCredits, setPreviousCredits] = useState<number | null>(null);

  const fetchUserData = async (firebaseUser: FirebaseUser, forceRefresh = false) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      const baseData = {
        uid: firebaseUser.uid,
      };

      if (userSnap.exists()) {
        const userData = userSnap.data() as Omit<User, 'uid'>;
        const updatedUser: User = {
          ...baseData,
          ...userData,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
        };
        
        console.log('Actualizando usuario con emailVerified:', firebaseUser.emailVerified);
        setCurrentUser(updatedUser);
        
        if (previousCredits === null) {
          setPreviousCredits(userData.credits ?? 0);
        }
      } else {
        const newUser: Omit<User, 'uid'> = {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          emailVerified: firebaseUser.emailVerified,
          isAdmin: false,
          credits: 0,
        };

        await setDoc(userRef, newUser);
        const fullUser: User = { ...baseData, ...newUser };
        console.log('Creando nuevo usuario con emailVerified:', firebaseUser.emailVerified);
        setCurrentUser(fullUser);
        setPreviousCredits(0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshUser = async () => {
    try {
      if (auth.currentUser) {
        // Forzar recarga del usuario desde Firebase
        await reload(auth.currentUser);
        
        // Verificar el estado de verificación de email
        const refreshedUser = auth.currentUser;
        console.log('Usuario recargado - emailVerified:', refreshedUser.emailVerified);
        
        // Actualizar los datos del usuario
        await fetchUserData(refreshedUser, true);
        
        // Verificar si el estado cambió
        if (currentUser && currentUser.emailVerified !== refreshedUser.emailVerified) {
          console.log('Estado de verificación cambió:', currentUser.emailVerified, '->', refreshedUser.emailVerified);
        }
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/verify-email`,
          handleCodeInApp: false,
        });
      } else {
        throw new Error('No user logged in or email already verified');
      }
    } catch (error: any) {
      if (error.code === 'auth/too-many-requests') {
        throw new Error('too-many-requests');
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Limpiar suscripción anterior si existe
        if (unsubscribeUser) {
          unsubscribeUser();
        }

        const userRef = doc(db, 'users', user.uid);

        unsubscribeUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as Omit<User, 'uid'>;
            const updatedUser: User = {
              uid: user.uid,
              ...userData,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
            };

            // Detectar cambios de créditos para mostrar notificaciones
            if (previousCredits !== null && userData.credits !== undefined) {
              const creditDifference = userData.credits - previousCredits;
              if (creditDifference > 0) {
                toast.success(`💰 Credits added! +${creditDifference} credits`, {
                  duration: 5000,
                  style: {
                    background: '#059669',
                    color: 'white',
                    fontWeight: '500',
                  },
                  iconTheme: {
                    primary: 'white',
                    secondary: '#059669',
                  },
                });
              } else if (creditDifference < 0) {
                toast(`📉 ${Math.abs(creditDifference)} credits used`, {
                  duration: 3000,
                  style: {
                    background: '#3B82F6',
                    color: 'white',
                    fontWeight: '500',
                  },
                });
              }
              setPreviousCredits(userData.credits);
            }

            setCurrentUser(updatedUser);
          }
        });

        await fetchUserData(user);
      } else {
        setCurrentUser(null);
        setPreviousCredits(null);
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = null;
        }
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) unsubscribeUser();
    };
  }, []);

  const register = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(result.user, {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: false,
    });

    await fetchUserData(result.user);
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Recargar el usuario para obtener el estado más reciente
    await reload(result.user);

    if (!result.user.emailVerified) {
      throw new Error('Please verify your email before logging in.');
    }

    await fetchUserData(result.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: false,
    });
  };

  const confirmPasswordResetAction = async (oobCode: string, newPassword: string) => {
    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const verifyEmailAction = async (oobCode: string) => {
    await applyActionCode(auth, oobCode);
  };

  const checkActionCodeAction = async (oobCode: string) => {
    return await checkActionCode(auth, oobCode);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
    resendVerification,
    sendPasswordReset,
    confirmPasswordReset: confirmPasswordResetAction,
    verifyEmail: verifyEmailAction,
    checkActionCode: checkActionCodeAction,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload
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
      // Si forceRefresh es true, recargamos el usuario de Firebase Auth
      if (forceRefresh) {
        await reload(firebaseUser);
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userRef);

      const baseData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified,
      };

      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<User, 'uid'>;
        
        // Actualizamos el estado de verificación en Firestore si ha cambiado
        if (userData.emailVerified !== firebaseUser.emailVerified) {
          await updateDoc(userRef, { emailVerified: firebaseUser.emailVerified });
          userData.emailVerified = firebaseUser.emailVerified;
        }

        const updatedUser: User = { ...baseData, ...userData };
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
        await reload(auth.currentUser);
        await fetchUserData(auth.currentUser, true);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const resendVerification = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser, {
          url: `${window.location.origin}/login`,
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
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified, // Siempre usar el estado de Firebase Auth
              ...userData,
              emailVerified: user.emailVerified, // Sobrescribir con el valor de Firebase Auth
            };

            // Detectar cambios de créditos para mostrar notificaciones
            if (previousCredits !== null && userData.credits !== undefined) {
              const creditDifference = userData.credits - previousCredits;
              if (creditDifference > 0) {
                toast.success(`💰 ¡Créditos agregados! +${creditDifference} créditos`, {
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
                toast(`📉 ${Math.abs(creditDifference)} créditos utilizados`, {
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
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });

    await fetchUserData(result.user);
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // Recargar el usuario para obtener el estado más reciente
    await reload(result.user);

    if (!result.user.emailVerified) {
      throw new Error('Por favor, verifica tu correo antes de iniciar sesión.');
    }

    await fetchUserData(result.user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
    resendVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
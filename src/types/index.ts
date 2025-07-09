export interface Device {
  id?: string;
  model: string;
  modelName: string;
  imageUrl: string;
  tacs: string[];
  modelNumbers?: string[];
  credits: number; // Credits required to unlock this device
}

export interface SerialDevice {
  id?: string;
  model: string;
  modelName: string;
  imageUrl: string;
  serialNumbers: string[];
  credits: number;
  deviceType: 'applewatch' | 'ipad';
}

export interface DeviceStatus {
  fmiStatus: 'ON' | 'OFF';
  blacklistStatus: 'Clean' | 'Blacklisted' | 'Reported';
  activationLock: 'Active' | 'Inactive';
  icloudStatus: 'Locked' | 'Unlocked';
}

export interface RegisteredDevice {
  id?: string;
  imei: string;
  model: string;
  modelName: string;
  imageUrl: string;
  status: DeviceStatus;
  userId: string;
  createdAt: Date;
  unlockResult?: 'success' | 'token_denied' | 'failed' | 'pending';
}

export interface RegisteredSerialDevice {
  id?: string;
  serialNumber: string;
  model: string;
  modelName: string;
  imageUrl: string;
  status: DeviceStatus;
  userId: string;
  deviceType: 'applewatch' | 'ipad';
  createdAt: Date;
  unlockResult?: 'success' | 'token_denied' | 'failed' | 'pending';
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  credits: number;
  createdAt?: any; // Firebase Timestamp
}

export interface PaymentRequest {
  id?: string;
  userId: string;
  userEmail: string;
  amount: number;
  walletAddress: string;
  paymentMethod?: 'usdt' | 'kofi';
  status: 'pending' | 'completed' | 'rejected';
  transactionId?: string;
  rejectionReason?: string;
  credits: number;
  createdAt: any;
  updatedAt?: any;
  confirmedAt?: any;
  rejectedAt?: any;
}

export interface Ticket {
  id?: string;
  userId: string;
  userEmail: string;
  type: 'unlock_complaint' | 'credit_loading' | 'general_support';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Device related fields (for unlock complaints)
  deviceId?: string;
  imei?: string;
  model?: string;
  
  // Credit loading related fields
  paymentId?: string;
  requestedCredits?: number;
  
  // Admin response fields
  adminResponse?: string;
  adminUserId?: string;
  refundApproved?: boolean;
  refundAmount?: number;
  refundReason?: string;
  
  createdAt: any;
  updatedAt: any;
  resolvedAt?: any;
}
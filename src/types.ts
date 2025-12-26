export enum BookingStatus {
  Inquiry = 'Inquiry',
  TourScheduled = 'Tour Scheduled',
  ContractSent = 'Contract Sent',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}

export enum EventType {
  Wedding = 'Wedding',
  Birthday = 'Birthday Party',
  Corporate = 'Corporate Event',
  Anniversary = 'Anniversary',
  Engagement = 'Engagement Party',
  BabyShower = 'Baby Shower',
  Holiday = 'Holiday Party',
  Conference = 'Conference',
  Custom = 'Custom Event',
  Other = 'Other'
}

export interface Individual {
  id: string;
  eventType: string;
  eventName?: string;
  name: string;
  partnerName?: string;
  email: string;
  phone: string;
  weddingDate: string;
  eventTime?: string;
  dueDate?: string;
  venue?: string; 
  district?: string;
  city?: string;
  country?: string;
  guestCount: number;
  budget?: number;
  currency?: string;
  status: BookingStatus;
  notes: string;
  preferences: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Food' | 'Drink' | 'Appetizer' | 'Dessert' | 'Other';
}

export interface ServiceItem {
  name: string;
  amount: number;
  currency: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  rating: number;
  reviews: number;
  status: 'Active' | 'Pending' | 'Inactive';
  joinedDate: string; // ADDED THIS FIELD
  verified: boolean;
  services: ServiceItem[];
  description: string;
  imageUrl: string;
  gallery: string[];
  videoUrl?: string;
  mapsUrl?: string;
  directions?: string;
}

export interface VendorInquiry {
  id: string;
  individualId: string;
  businessId: string;
  businessName: string;
  businessCategory: string;
  message: string;
  dateSent: string;
  status: 'Sent' | 'Read' | 'Replied';
}

export type View = 'dashboard' | 'individuals' | 'businesses' | 'inquiries' | 'profile';

export interface ChartData {
  name: string;
  value: number;
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'business' | 'individual' | 'owner';
  country: string;
  currency: string;
  businessCategory?: string;
  createdAt: string;
  isPaid: boolean;
  businessId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: 'business' | 'individual' | 'owner';
  actionType: 'create' | 'update' | 'delete' | 'inquiry' | 'login' | 'payment' | 'other';
  description: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userRole: 'business' | 'individual';
  amount: number;
  currency: string;
  timestamp: string;
  description: string;
}

export interface Suggestion {
  id: string;
  userId: string;
  userName: string;
  userRole: 'business' | 'individual';
  content: string;
  status: 'new' | 'reviewed';
  timestamp: string;
}

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
  eventType: string; // Using string to allow flexibility but typically from EventType
  eventName?: string;
  name: string;
  partnerName?: string;
  email: string;
  phone: string;
  weddingDate: string; // Keeping variable name for compatibility, UI will show "Event Date"
  eventTime?: string;
  dueDate?: string;
  
  // Location Details
  venue?: string; 
  district?: string;
  city?: string;
  country?: string;
  
  // Financials
  guestCount: number;
  budget?: number;
  currency?: string; // e.g., 'USD', 'GBP', 'PKR', 'AED'

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
  timeCategory: string;
  description?: string;
  menuItems?: MenuItem[]; // Added for catering details
}

export interface Business {
  id: string;
  name: string;
  category: string; // 'Hall Services' | 'Decoration' | 'Photography' | 'Catering' | 'Car Rental'
  contactName: string;
  email: string;
  phone: string;
  rating: number;
  
  // Location for filtering
  country?: string;
  city: string;
  district?: string;

  // Details
  description?: string;
  services?: ServiceItem[];
  images?: string[]; // URLs
  videoUrl?: string; // New field for video

  // Maps & Directions
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
  businessCategory?: string; // Optional field for business users
  createdAt: string; // ISO Date string
  isPaid: boolean;
  businessId?: string; // Link to business profile
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
  timestamp: string;
  status: 'new' | 'reviewed';
}

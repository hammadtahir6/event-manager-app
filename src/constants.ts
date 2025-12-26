import { Individual, Business, BookingStatus, EventType } from './types';

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export const BUSINESS_CATEGORIES = [
  'Venue/Hall',
  'Catering',
  'Photography',
  'Florist',
  'Music/DJ',
  'Decor/Lighting',
  'Planner/Coordinator',
  'Bakery/Cake',
  'Makeup/Hair',
  'Transportation'
];

export const SERVICE_TIME_CATEGORIES = [
  'Morning',
  'Afternoon',
  'Evening',
  'All Day'
];

export const COMMON_SERVICE_OPTIONS = [
  'Basic Package',
  'Premium Package',
  'Deluxe Package',
  'Custom Service'
];

export const STATUS_COLORS = {
  [BookingStatus.Inquiry]: 'bg-blue-100 text-blue-800',
  [BookingStatus.TourScheduled]: 'bg-purple-100 text-purple-800',
  [BookingStatus.ContractSent]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.Confirmed]: 'bg-green-100 text-green-800',
  [BookingStatus.Completed]: 'bg-gray-100 text-gray-800',
  [BookingStatus.Cancelled]: 'bg-red-100 text-red-800'
};

// FIXED PRICING: $15 for Individuals, $30 for Business
// These values are hardcoded for all regions as requested.
export const COUNTRIES_CURRENCIES = [
  { country: 'United States', currency: 'USD', symbol: '$', rate: 1, flag: '🇺🇸', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'United Kingdom', currency: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'Canada', currency: 'CAD', symbol: 'C$', rate: 1.36, flag: '🇨🇦', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'Australia', currency: 'AUD', symbol: 'A$', rate: 1.52, flag: '🇦🇺', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'European Union', currency: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'Pakistan', currency: 'PKR', symbol: '₨', rate: 278.50, flag: '🇵🇰', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'India', currency: 'INR', symbol: '₹', rate: 83.50, flag: '🇮🇳', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ', rate: 3.67, flag: '🇦🇪', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'Saudi Arabia', currency: 'SAR', symbol: '﷼', rate: 3.75, flag: '🇸🇦', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'China', currency: 'CNY', symbol: '¥', rate: 7.23, flag: '🇨🇳', fixedIndividual: 15, fixedBusiness: 30 },
  { country: 'Japan', currency: 'JPY', symbol: '¥', rate: 151.50, flag: '🇯🇵', fixedIndividual: 15, fixedBusiness: 30 },
];

export const LOCATION_DATA = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
  'Pakistan': ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
};

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Grand Royal Hall',
    category: 'Venue/Hall',
    contactPerson: 'Sarah Jenkins',
    email: 'contact@grandroyal.com',
    phone: '+1 555-0123',
    address: '123 Wedding Ave, New York, NY',
    rating: 4.8,
    reviews: 124,
    status: 'Active',
    joinedDate: '2023-01-15',
    verified: true,
    services: [
      { name: 'Full Hall Rental', amount: 5000, currency: 'USD' },
      { name: 'Catering Package', amount: 3500, currency: 'USD' }
    ],
    description: 'A luxurious venue for your dream wedding.',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    gallery: []
  },
  {
    id: 'b2',
    name: 'Elegant Moments Photography',
    category: 'Photography',
    contactPerson: 'Mike Ross',
    email: 'mike@elegantmoments.com',
    phone: '+1 555-0199',
    address: '45 Creative Blvd, Los Angeles, CA',
    rating: 4.9,
    reviews: 89,
    status: 'Active',
    joinedDate: '2023-03-10',
    verified: true,
    services: [
      { name: 'Wedding Photography', amount: 2500, currency: 'USD' },
      { name: 'Engagement Shoot', amount: 800, currency: 'USD' }
    ],
    description: 'Capturing your precious moments forever.',
    imageUrl: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    gallery: []
  }
];

export const MOCK_INDIVIDUALS: Individual[] = [
  {
    id: 'i1',
    eventType: EventType.Wedding,
    eventName: 'Johnson Wedding',
    name: 'Emily Johnson',
    partnerName: 'Michael Smith',
    email: 'emily.j@example.com',
    phone: '+1 555-0101',
    weddingDate: '2024-06-15',
    eventTime: '16:00',
    venue: 'Grand Royal Hall',
    guestCount: 150,
    budget: 25000,
    currency: 'USD',
    status: BookingStatus.Confirmed,
    notes: 'Vegetarian options required.',
    preferences: 'Modern theme, White & Gold colors',
    city: 'New York',
    country: 'United States'
  },
  {
    id: 'i2',
    eventType: EventType.Birthday,
    eventName: 'Sara\'s 16th',
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 555-0102',
    weddingDate: '2024-07-20',
    eventTime: '18:00',
    venue: 'Sunset Gardens',
    guestCount: 50,
    budget: 5000,
    currency: 'USD',
    status: BookingStatus.Inquiry,
    notes: 'Outdoor setup needed.',
    preferences: 'Casual, Garden Party',
    city: 'Los Angeles',
    country: 'United States'
  }
];
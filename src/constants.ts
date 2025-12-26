import { Individual, Business, BookingStatus, EventType } from './types';

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

export const BUSINESS_CATEGORIES = [
  'Venue/Hall', 'Catering', 'Photography', 'Florist', 'Music/DJ',
  'Decor/Lighting', 'Planner/Coordinator', 'Bakery/Cake', 'Makeup/Hair', 'Transportation'
];

export const SERVICE_TIME_CATEGORIES = ['Morning', 'Afternoon', 'Evening', 'All Day'];
export const COMMON_SERVICE_OPTIONS = ['Basic Package', 'Premium Package', 'Deluxe Package', 'Custom Service'];

export const STATUS_COLORS = {
  [BookingStatus.Inquiry]: 'bg-blue-100 text-blue-800',
  [BookingStatus.TourScheduled]: 'bg-purple-100 text-purple-800',
  [BookingStatus.ContractSent]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.Confirmed]: 'bg-green-100 text-green-800',
  [BookingStatus.Completed]: 'bg-gray-100 text-gray-800',
  [BookingStatus.Cancelled]: 'bg-red-100 text-red-800'
};

// Fixed Pricing Logic (~$30 USD Base)
const BASE_PRICE = 30;

export const COUNTRIES_CURRENCIES = [
  { country: 'United States', currency: 'USD', symbol: '$', rate: 1, flag: '🇺🇸', fixedIndividual: 30, fixedBusiness: 30 },
  { country: 'United Kingdom', currency: 'GBP', symbol: '£', rate: 0.79, flag: '🇬🇧', fixedIndividual: 25, fixedBusiness: 25 },
  { country: 'Canada', currency: 'CAD', symbol: 'C$', rate: 1.36, flag: '🇨🇦', fixedIndividual: 40, fixedBusiness: 40 },
  { country: 'Australia', currency: 'AUD', symbol: 'A$', rate: 1.52, flag: '🇦🇺', fixedIndividual: 45, fixedBusiness: 45 },
  { country: 'European Union', currency: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺', fixedIndividual: 28, fixedBusiness: 28 },
  { country: 'Pakistan', currency: 'PKR', symbol: '₨', rate: 278.50, flag: '🇵🇰', fixedIndividual: 8500, fixedBusiness: 8500 },
  { country: 'India', currency: 'INR', symbol: '₹', rate: 83.50, flag: '🇮🇳', fixedIndividual: 2500, fixedBusiness: 2500 },
  { country: 'United Arab Emirates', currency: 'AED', symbol: 'د.إ', rate: 3.67, flag: '🇦🇪', fixedIndividual: 110, fixedBusiness: 110 },
  { country: 'Saudi Arabia', currency: 'SAR', symbol: '﷼', rate: 3.75, flag: '🇸🇦', fixedIndividual: 115, fixedBusiness: 115 },
  { country: 'China', currency: 'CNY', symbol: '¥', rate: 7.23, flag: '🇨🇳', fixedIndividual: 220, fixedBusiness: 220 },
  { country: 'Japan', currency: 'JPY', symbol: '¥', rate: 151.50, flag: '🇯🇵', fixedIndividual: 4500, fixedBusiness: 4500 },
];

export const LOCATION_DATA = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
  'Pakistan': ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary']
};

export const MOCK_BUSINESSES: Business[] = [];
export const MOCK_INDIVIDUALS: Individual[] = [];
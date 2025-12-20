
import { BookingStatus, Individual, Business, EventType } from './types';

export const TIME_SLOTS = [
  { id: 'Morning', label: 'Morning (7am - 11am)', startTime: '07:00' },
  { id: 'Day', label: 'Day (12pm - 5pm)', startTime: '12:00' },
  { id: 'Evening', label: 'Evening/Night (6pm - 2am)', startTime: '18:00' }
];

export const SERVICE_TIME_CATEGORIES = [
  'Per hour',
  'Per day',
  '6 hours',
  'Morning (7am - 12pm)',
  'Day (1pm - 6pm)',
  'Evening (8pm - 2am)',
  'Fixed Price',
  'Other'
];

export const COMMON_SERVICE_OPTIONS = [
  'Full Venue Rental',
  'Ballroom Access',
  'Catering (Plated)',
  'Catering (Buffet)',
  'Photography',
  'Event Planning (Consultation)',
  'Decoration Setup',
  'Car Rental (Premium)',
  'Live Band / Entertainment',
  'Standard Audio/Visual Setup',
  'Cleaning Services',
  'Other'
];

export const BUSINESS_CATEGORIES = [
  'Venue / Hall Services',
  'Catering Services',
  'Photography & Videography',
  'Decoration & Floral',
  'Event Planning',
  'Music & DJ',
  'Makeup & Hair',
  'Transportation / Car Rental',
  'Lighting & Sound',
  'Bakery & Cake',
  'Invitation & Printing',
  'Attire & Bridal',
  'Jewelry',
  'Entertainment',
  'Officiant',
  'Security Services',
  'Cleaning Services',
  'Other'
];

export const COUNTRIES_CURRENCIES = [
  { country: "Afghanistan", currency: "AFN", symbol: "؋", rate: 71.0, dialCode: "+93", flag: "🇦🇫" },
  { country: "Albania", currency: "ALL", symbol: "L", rate: 93.0, dialCode: "+355", flag: "🇦🇱" },
  { country: "Algeria", currency: "DZD", symbol: "د.ج", rate: 134.0, dialCode: "+213", flag: "🇩🇿" },
  { country: "Andorra", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+376", flag: "🇦🇩" },
  { country: "Angola", currency: "AOA", symbol: "Kz", rate: 830.0, dialCode: "+244", flag: "🇦🇴" },
  { country: "Argentina", currency: "ARS", symbol: "$", rate: 850.0, dialCode: "+54", flag: "🇦🇷" },
  { country: "Australia", currency: "AUD", symbol: "$", rate: 1.52, dialCode: "+61", flag: "🇦🇺" },
  { country: "Austria", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+43", flag: "🇦🇹" },
  { country: "Bahrain", currency: "BHD", symbol: ".د.ب", rate: 0.38, fixedIndividual: 10, fixedBusiness: 90, dialCode: "+973", flag: "🇧🇭" },
  { country: "Bangladesh", currency: "BDT", symbol: "৳", rate: 110.0, dialCode: "+880", flag: "🇧🇩" },
  { country: "Belgium", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+32", flag: "🇧🇪" },
  { country: "Brazil", currency: "BRL", symbol: "R$", rate: 4.97, dialCode: "+55", flag: "🇧🇷" },
  { country: "Canada", currency: "CAD", symbol: "$", rate: 1.35, dialCode: "+1", flag: "🇨🇦" },
  { country: "China", currency: "CNY", symbol: "¥", rate: 7.2, dialCode: "+86", flag: "🇨🇳" },
  { country: "Denmark", currency: "DKK", symbol: "kr", rate: 6.8, dialCode: "+45", flag: "🇩🇰" },
  { country: "Egypt", currency: "EGP", symbol: "£", rate: 47.0, dialCode: "+20", flag: "🇪🇬" },
  { country: "Finland", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+358", flag: "🇫🇮" },
  { country: "France", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+33", flag: "🇫🇷" },
  { country: "Germany", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+49", flag: "🇩🇪" },
  { country: "Greece", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+30", flag: "🇬🇷" },
  { country: "India", currency: "INR", symbol: "₹", rate: 83.0, dialCode: "+91", flag: "🇮🇳" },
  { country: "Indonesia", currency: "IDR", symbol: "Rp", rate: 15500.0, dialCode: "+62", flag: "🇮🇩" },
  { country: "Ireland", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+353", flag: "🇮🇪" },
  { country: "Italy", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+39", flag: "🇮🇹" },
  { country: "Japan", currency: "JPY", symbol: "¥", rate: 150.0, dialCode: "+81", flag: "🇯🇵" },
  { country: "Kuwait", currency: "KWD", symbol: "د.ك", rate: 0.31, dialCode: "+965", flag: "🇰🇼" },
  { country: "Mexico", currency: "MXN", symbol: "$", rate: 16.7, dialCode: "+52", flag: "🇲🇽" },
  { country: "Netherlands", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+31", flag: "🇳🇱" },
  { country: "New Zealand", currency: "NZD", symbol: "$", rate: 1.65, dialCode: "+64", flag: "🇳🇿" },
  { country: "Norway", currency: "NOK", symbol: "kr", rate: 10.5, dialCode: "+47", flag: "🇳🇴" },
  { country: "Pakistan", currency: "PKR", symbol: "Rs", rate: 278.0, fixedIndividual: 500, fixedBusiness: 2500, dialCode: "+92", flag: "🇵🇰" },
  { country: "Philippines", currency: "PHP", symbol: "₱", rate: 56.0, dialCode: "+63", flag: "🇵🇭" },
  { country: "Poland", currency: "PLN", symbol: "zł", rate: 3.95, dialCode: "+48", flag: "🇵🇱" },
  { country: "Portugal", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+351", flag: "🇵🇹" },
  { country: "Qatar", currency: "QAR", symbol: "ر.ق", rate: 3.64, fixedIndividual: 10, fixedBusiness: 90, dialCode: "+974", flag: "🇶🇦" },
  { country: "Russia", currency: "RUB", symbol: "₽", rate: 92.0, dialCode: "+7", flag: "🇷🇺" },
  { country: "Saudi Arabia", currency: "SAR", symbol: "ر.س", rate: 3.75, fixedIndividual: 10, fixedBusiness: 90, dialCode: "+966", flag: "🇸🇦" },
  { country: "Singapore", currency: "SGD", symbol: "$", rate: 1.34, dialCode: "+65", flag: "🇸🇬" },
  { country: "South Africa", currency: "ZAR", symbol: "R", rate: 18.8, dialCode: "+27", flag: "🇿🇦" },
  { country: "South Korea", currency: "KRW", symbol: "₩", rate: 1330.0, dialCode: "+82", flag: "🇰🇷" },
  { country: "Spain", currency: "EUR", symbol: "€", rate: 0.92, dialCode: "+34", flag: "🇪🇸" },
  { country: "Sweden", currency: "SEK", symbol: "kr", rate: 10.3, dialCode: "+46", flag: "🇸🇪" },
  { country: "Switzerland", currency: "CHF", symbol: "Fr", rate: 0.88, dialCode: "+41", flag: "🇨🇭" },
  { country: "Thailand", currency: "THB", symbol: "฿", rate: 35.5, dialCode: "+66", flag: "🇹🇭" },
  { country: "Turkey", currency: "TRY", symbol: "₺", rate: 32.0, dialCode: "+90", flag: "🇹🇷" },
  { country: "United Arab Emirates", currency: "AED", symbol: "د.إ", rate: 3.67, fixedIndividual: 10, fixedBusiness: 90, dialCode: "+971", flag: "🇦🇪" },
  { country: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.79, dialCode: "+44", flag: "🇬🇧" },
  { country: "United States", currency: "USD", symbol: "$", rate: 1.0, fixedIndividual: 5, fixedBusiness: 40, dialCode: "+1", flag: "🇺🇸" },
  { country: "Vietnam", currency: "VND", symbol: "₫", rate: 24500.0, dialCode: "+84", flag: "🇻🇳" }
];

export const MOCK_INDIVIDUALS: Individual[] = [
  {
    id: '1',
    eventType: EventType.Wedding,
    eventName: 'Clarke & Wilson Wedding',
    name: 'Emily Clarke',
    partnerName: 'James Wilson',
    email: 'emily.clarke@example.com',
    phone: '555-0101',
    weddingDate: '2024-06-15',
    eventTime: 'Day',
    dueDate: '2024-05-15',
    venue: 'Royal Hall Services',
    district: 'Downtown',
    city: 'New York',
    country: 'United States',
    guestCount: 150,
    budget: 25000,
    currency: 'USD',
    status: BookingStatus.Confirmed,
    notes: 'Vegetarian menu required for 20 guests.',
    preferences: 'Rustic theme, outdoor ceremony, pastel colors'
  },
  {
    id: '2',
    eventType: EventType.Wedding,
    eventName: 'Connor Reception',
    name: 'Sarah Connor',
    partnerName: 'Kyle Reese',
    email: 'sarah.c@example.com',
    phone: '555-0102',
    weddingDate: '2024-08-20',
    eventTime: 'Evening',
    dueDate: '2024-07-01',
    venue: 'Eternal Moments',
    district: 'West End',
    city: 'London',
    country: 'United Kingdom',
    guestCount: 80,
    budget: 15000,
    currency: 'GBP',
    status: BookingStatus.Inquiry,
    notes: 'Looking for available dates in August.',
    preferences: 'Modern industrial, minimal decor'
  },
  {
    id: '3',
    eventType: EventType.Corporate,
    eventName: 'Scott Winter Gala',
    name: 'Michael Scott',
    partnerName: 'Holly Flax',
    email: 'm.scott@example.com',
    phone: '555-0103',
    weddingDate: '2024-12-05',
    eventTime: 'Evening',
    dueDate: '2024-11-01',
    venue: 'Main Hall',
    district: 'Scranton Business Park',
    city: 'Scranton',
    country: 'United States',
    guestCount: 200,
    budget: 40000,
    currency: 'USD',
    status: BookingStatus.TourScheduled,
    notes: 'Wants to see the grand ballroom.',
    preferences: 'Winter wonderland, lots of lights, classy'
  }
];

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Royal Hall Services',
    category: 'Venue / Hall Services',
    contactName: 'Elena Rose',
    email: 'elena@royalhall.com',
    phone: '(555) 234-5678',
    rating: 4.9,
    city: 'New York',
    district: 'Downtown',
    country: 'United States',
    description: "Experience luxury and elegance at Royal Hall Services. Located in the heart of Downtown, our historic venue offers a blend of classic charm and modern amenities.",
    services: [
      { name: "Full Venue Rental", amount: 5000, currency: "USD", timeCategory: "6 hours", description: "Includes tables & chairs." },
      { name: "Catering (Buffet)", amount: 120, currency: "USD", timeCategory: "Fixed Price", description: "3-course meal, open bar." },
      { name: "Standard Audio/Visual Setup", amount: 1500, currency: "USD", timeCategory: "Per day", description: "Professional lighting setup." }
    ],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: '2',
    name: 'Saadeddin Pastry',
    category: 'Catering Services',
    contactName: 'Saad Sales',
    email: 'orders@saadeddin.com',
    phone: '+966 9200 17070',
    rating: 4.7,
    city: 'Riyadh',
    district: 'Al Malaz',
    country: 'Saudi Arabia',
    description: "Famous for traditional Arabic sweets and western pastries.",
    services: [
      { name: "Other", amount: 50, currency: "SAR", timeCategory: "Fixed Price", description: "Per person dessert assortment." }
    ],
    images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600"]
  }
];

export const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "United States": {
    "New York": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Downtown"],
    "Los Angeles": ["Hollywood", "Venice", "Downtown", "Beverly Hills"],
    "Scranton": ["Downtown", "Farms", "Business Park"],
    "Chicago": ["Loop", "Lincoln Park", "Wicker Park"]
  },
  "United Kingdom": {
    "London": ["West End", "City of London", "Camden", "Greenwich", "Soho"],
    "Manchester": ["Northern Quarter", "Deansgate", "Castlefield"]
  },
  "United Arab Emirates": {
    "Dubai": ["Marina", "Downtown", "Palm Jumeirah", "JLT", "Deira"],
    "Abu Dhabi": ["Corniche", "Yas Island", "Saadiyat"]
  },
  "Saudi Arabia": {
    "Riyadh": ["Al Olaya", "Al Malaz", "Al Maather", "Al Hada", "Al Takhassusi", "As Sulimaniyah", "Al Mohammadiyah", "Al Nakheel", "Al Diriyah", "King Abdullah Financial District", "Al Murabba", "As Sahafah", "Business Gate", "Diplomatic Quarter", "Al Rahmaniyah"],
    "Jeddah": ["Al Hamra", "Al Rawdah", "Al Shatie"],
    "Dammam": ["Al Faisaliyah", "Al Rakah"]
  }
};

export const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.Inquiry]: 'bg-blue-100 text-blue-800',
  [BookingStatus.TourScheduled]: 'bg-purple-100 text-purple-800',
  [BookingStatus.ContractSent]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.Confirmed]: 'bg-green-100 text-green-800',
  [BookingStatus.Completed]: 'bg-gray-100 text-gray-800',
  [BookingStatus.Cancelled]: 'bg-red-100 text-red-800',
};

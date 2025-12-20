import React, { useState, useEffect, useMemo } from 'react';
import { Individual, BookingStatus, EventType } from '../types';
import { COUNTRIES_CURRENCIES, MOCK_BUSINESSES, TIME_SLOTS, LOCATION_DATA } from '../constants';
import { X, Save } from 'lucide-react';

interface CustomerFormProps {
  initialData?: Individual;
  onSave: (individual: Individual) => void;
  onCancel: () => void;
  isOpen: boolean;
  existingEvents?: Individual[];
}

const CustomerForm: React.FC<CustomerFormProps> = ({ initialData, onSave, onCancel, isOpen, existingEvents = [] }) => {
  const [formData, setFormData] = useState<Partial<Individual>>({
    eventType: EventType.Wedding,
    eventName: '',
    name: '',
    partnerName: '',
    email: '',
    phone: '',
    weddingDate: '',
    eventTime: '',
    dueDate: '',
    venue: '',
    district: '',
    city: '',
    country: '',
    currency: 'USD',
    guestCount: 0,
    budget: 0,
    status: BookingStatus.Inquiry,
    notes: '',
    preferences: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        eventType: EventType.Wedding,
        eventName: '',
        name: '',
        partnerName: '',
        email: '',
        phone: '',
        weddingDate: '',
        eventTime: '',
        dueDate: '',
        venue: '',
        district: '',
        city: '',
        country: '',
        currency: 'USD',
        guestCount: 0,
        budget: 0,
        status: BookingStatus.Inquiry,
        notes: '',
        preferences: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Name and Email are required");
      return;
    }
    onSave({
      ...formData,
      id: initialData?.id || crypto.randomUUID(),
    } as Individual);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'country') {
      const selected = COUNTRIES_CURRENCIES.find(c => c.country === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        city: '', // Reset city
        district: '', // Reset district
        currency: selected ? selected.currency : 'USD'
      }));
    } else if (name === 'city') {
       setFormData(prev => ({
        ...prev,
        city: value,
        district: '' // Reset district
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'guestCount' || name === 'budget' ? Number(value) : value
      }));
    }
  };

  const standardTypes = Object.values(EventType).filter(t => t !== EventType.Other);
  const isCustomEvent = !standardTypes.includes(formData.eventType as EventType);

   // Available Locations Logic
   const availableCities = formData.country && LOCATION_DATA[formData.country] ? Object.keys(LOCATION_DATA[formData.country]) : [];
   
   const availableDistricts = formData.country && formData.city && LOCATION_DATA[formData.country] && LOCATION_DATA[formData.country][formData.city] 
     ? LOCATION_DATA[formData.country][formData.city] 
     : [];

  // Available Venues Logic
  const availableVenues = MOCK_BUSINESSES.filter(b => {
    if (b.category !== 'Hall Services') return false;
    
    // Location Matching
    const matchCountry = !formData.country || (b.country === formData.country);
    const matchCity = !formData.city || (b.city.toLowerCase() === formData.city.toLowerCase());
    const matchDistrict = !formData.district || (b.district && b.district.toLowerCase() === formData.district.toLowerCase());
    
    if (!matchCountry || !matchCity || !matchDistrict) return false;

    // Availability Check
    const isBooked = existingEvents.some(e => {
      // Don't check against self if editing
      if (e.id === formData.id) return false;
      
      // Ignore cancelled bookings
      if (e.status === BookingStatus.Cancelled) return false;

      // Must be same date and venue to potentially conflict
      if (e.weddingDate !== formData.weddingDate) return false;
      if (e.venue !== b.name) return false;

      // Time Slot Logic
      // 1. If existing event has no time set, assume it blocks the whole day
      if (!e.eventTime) return true;

      // 2. If current form has a time selected, check for exact match
      if (formData.eventTime && e.eventTime === formData.eventTime) return true;

      return false;
    });

    return !isBooked;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-serif font-bold text-gray-800">
              {initialData ? 'Edit Event Details' : 'New Event'}
            </h2>
            <button 
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-1">
              <h3 className="text-sm font-semibold text-wedding-600 uppercase tracking-wide">Client Details</h3>
              <div className="h-px bg-wedding-100 w-full mb-4"></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                placeholder="Jane Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
              <input
                type="text"
                name="partnerName"
                value={formData.partnerName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                placeholder="jane@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Event Details */}
            <div className="md:col-span-2 space-y-1 mt-4">
              <h3 className="text-sm font-semibold text-wedding-600 uppercase tracking-wide">Event Logistics</h3>
              <div className="h-px bg-wedding-100 w-full mb-4"></div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
              <select
                name="eventType"
                value={isCustomEvent ? EventType.Other : formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
              >
                {standardTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value={EventType.Other}>Other</option>
              </select>
              {isCustomEvent && (
                 <input
                   type="text"
                   placeholder="Please specify event type"
                   value={formData.eventType === EventType.Other ? '' : formData.eventType}
                   onChange={(e) => setFormData(prev => ({...prev, eventType: e.target.value}))}
                   className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                 />
              )}
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                placeholder="e.g. Smith-Jones Wedding"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                name="eventTime"
                value={formData.eventTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select Slot</option>
                {TIME_SLOTS.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.label}</option>
                ))}
              </select>
            </div>

            {/* Location Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select Country</option>
                {COUNTRIES_CURRENCIES.map(c => (
                  <option key={c.country} value={c.country}>{c.country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              {availableCities.length > 0 ? (
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select City</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                  placeholder={formData.country ? "Enter City" : "Select Country First"}
                />
              )}
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              {availableDistricts.length > 0 ? (
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                >
                   <option value="">Select District</option>
                   {availableDistricts.map(dist => (
                     <option key={dist} value={dist}>{dist}</option>
                   ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                  placeholder={formData.city ? "Enter District" : "Select City First"}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue / Room</label>
              {formData.city ? (
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select Available Venue</option>
                  {availableVenues.map(v => (
                    <option key={v.id} value={v.name}>{v.name}</option>
                  ))}
                  <option value="other">Other (Manual Entry)</option>
                </select>
              ) : (
                <div className="px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-400 text-sm">
                   Select location to view venues
                </div>
              )}
               {/* Fallback text input */}
               {(formData.venue === 'other' || (formData.venue && !availableVenues.find(v => v.name === formData.venue) && formData.venue !== '')) && (
                 <input
                   type="text"
                   name="venue"
                   value={formData.venue === 'other' ? '' : formData.venue}
                   onChange={handleChange}
                   className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                   placeholder="Grand Ballroom"
                 />
               )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Guests</label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget ({formData.currency})</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                min="0"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
              >
                {Object.values(BookingStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferences / Theme</label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none resize-none"
                placeholder="E.g., Rustic, Outdoor, Italian food..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none resize-none"
                placeholder="Any special requests or details..."
              />
            </div>

          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 font-medium transition-colors flex items-center shadow-sm"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
import React, { useState, useEffect, useMemo } from 'react';
import { Individual, BookingStatus, EventType } from '../types';
import { COUNTRIES_CURRENCIES, MOCK_BUSINESSES, TIME_SLOTS } from '../constants';
// Added Mail to the imports below to fix the "Cannot find name 'Mail'" error
import { X, Calendar, MapPin, Users, ArrowRight, ArrowLeft, Check, Sparkles, User, Globe, Tag, Clock, Phone, Mail } from 'lucide-react';

interface CreateEventWizardProps {
  onSave: (individual: Individual) => void;
  onCancel: () => void;
  isOpen: boolean;
  initialEmail?: string;
  initialPhone?: string;
  existingEvents?: Individual[];
}

const steps = [
  { id: 1, title: 'The Event', icon: Calendar, description: 'Type & basic details' },
  { id: 2, title: 'Time & Place', icon: MapPin, description: 'Location, Country & City' },
  { id: 3, title: 'The Client', icon: User, description: 'Contact information' },
];

const CreateEventWizard: React.FC<CreateEventWizardProps> = ({ onSave, onCancel, isOpen, initialEmail, initialPhone, existingEvents = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Individual>>({
    eventType: EventType.Wedding,
    eventName: '',
    name: '',
    partnerName: '',
    email: initialEmail || '',
    phone: initialPhone || '',
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

  // Reset form when opening/closing or initial props change
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData(prev => ({
        ...prev,
        eventType: EventType.Wedding,
        email: initialEmail || prev.email || '',
        phone: initialPhone || prev.phone || '',
        country: '', 
        currency: 'USD'
      }));
    }
  }, [isOpen, initialEmail, initialPhone]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-update currency if country changes
    if (name === 'country') {
      const selected = COUNTRIES_CURRENCIES.find(c => c.country === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        currency: selected ? selected.currency : 'USD'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'guestCount' || name === 'budget' ? Number(value) : value
      }));
    }
  };

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!formData.eventType) {
        alert("Please select an event type.");
        return;
      }
      if (!formData.eventName) {
        setFormData(prev => ({...prev, eventName: `${prev.eventType} Event`})); // Default if empty
      }
      if (!formData.weddingDate) {
        alert("Please select a date.");
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.country || !formData.city) {
         alert("Please select a Country and City.");
         return;
      }
    }
    if (currentStep === 3) {
      if (!formData.name || (!formData.email && !formData.phone)) {
        alert("Client Name and either Email or Phone are required.");
        return;
      }
      handleSubmit();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: crypto.randomUUID(),
    } as Individual);
  };

  const standardTypes = Object.values(EventType).filter(t => t !== EventType.Other);
  const isCustomEvent = !standardTypes.includes(formData.eventType as EventType);

  // Available Venues Logic
  const availableVenues = MOCK_BUSINESSES.filter(b => {
    if (b.category !== 'Hall Services') return false;
    
    const matchCountry = !formData.country || (b.country === formData.country);
    const matchCity = !formData.city || (b.city.toLowerCase() === formData.city.toLowerCase());
    
    if (!matchCountry || !matchCity) return false;

    const isBooked = existingEvents.some(e => 
      e.weddingDate === formData.weddingDate && 
      e.venue === b.name && 
      e.status !== BookingStatus.Cancelled
    );

    return !isBooked;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col md:flex-row overflow-hidden animate-fadeIn h-[650px]">
        
        {/* Sidebar / Progress */}
        <div className="bg-wedding-50 p-8 md:w-1/3 flex flex-col justify-between border-r border-wedding-100">
          <div>
            <div className="flex items-center space-x-2 mb-8">
               <Sparkles className="w-6 h-6 text-wedding-600" />
               <h2 className="text-xl font-serif font-bold text-gray-800">New Event</h2>
            </div>
            
            <div className="space-y-8 relative">
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200 -z-10"></div>

              {steps.map((step) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                return (
                  <div key={step.id} className="flex items-start space-x-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      isActive ? 'bg-wedding-600 text-white shadow-lg shadow-wedding-200' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-400'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : <span>{step.id}</span>}
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{step.title}</p>
                      <p className="text-xs text-gray-400">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-xs text-gray-400 mt-8">
            Step {currentStep} of 3
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex justify-end p-4">
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                   <h3 className="text-2xl font-serif font-bold text-gray-800">What are we celebrating?</h3>
                   <p className="text-gray-500">Let's start with the event basics.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                    <div className="relative">
                       <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                       <select
                        name="eventType"
                        value={isCustomEvent ? EventType.Other : formData.eventType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                       >
                         {standardTypes.map((type) => (
                           <option key={type} value={type}>{type}</option>
                         ))}
                         <option value={EventType.Other}>Other</option>
                       </select>
                    </div>
                    {isCustomEvent && (
                      <input
                        type="text"
                        placeholder="Please specify event type"
                        value={formData.eventType === EventType.Other ? '' : formData.eventType}
                        onChange={(e) => setFormData(prev => ({...prev, eventType: e.target.value}))}
                        className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-shadow"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      placeholder="e.g. The Thompson Wedding"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
                    <input
                      type="date"
                      name="weddingDate"
                      value={formData.weddingDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                    >
                      {Object.values(BookingStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="text-center mb-8">
                   <h3 className="text-2xl font-serif font-bold text-gray-800">Where & When?</h3>
                   <p className="text-gray-500">Logistics for the big day.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <div className="relative">
                       <Globe className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                       <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                       >
                         <option value="">Select Country</option>
                         {COUNTRIES_CURRENCIES.map(c => (
                           <option key={c.country} value={c.country}>{c.country} ({c.currency})</option>
                         ))}
                       </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. New York"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g. Downtown"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      {formData.city ? (
                        <select
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                        >
                          <option value="">Select Available Venue</option>
                          {availableVenues.map(v => (
                            <option key={v.id} value={v.name}>{v.name}</option>
                          ))}
                          <option value="other">Other (Manual Entry)</option>
                        </select>
                      ) : (
                         <div className="w-full pl-10 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-400 text-sm">
                           Select Location first to see venues
                         </div>
                      )}
                      
                    </div>
                     {(formData.venue === 'other' || (formData.venue && !availableVenues.find(v => v.name === formData.venue) && formData.venue !== '')) && (
                       <input
                         type="text"
                         name="venue"
                         value={formData.venue === 'other' ? '' : formData.venue}
                         onChange={handleChange}
                         placeholder="Enter Venue Name Manually"
                         className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                       />
                     )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time Slot</label>
                    <div className="relative">
                       <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                       <select
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white"
                       >
                         <option value="">Select Slot</option>
                         {TIME_SLOTS.map(slot => (
                           <option key={slot.id} value={slot.id}>{slot.label}</option>
                         ))}
                       </select>
                    </div>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget ({formData.currency})</label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>

                   <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guest Count</label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferences / Theme</label>
                    <textarea
                      name="preferences"
                      value={formData.preferences}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none resize-none"
                      placeholder="E.g., Rustic, Black Tie, etc."
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                 <div className="text-center mb-8">
                   <h3 className="text-2xl font-serif font-bold text-gray-800">Who is the client?</h3>
                   <p className="text-gray-500">Primary contact details.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="client@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                    <input
                      type="text"
                      name="partnerName"
                      value={formData.partnerName}
                      onChange={handleChange}
                      placeholder="Partner Name (Optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-between bg-gray-50">
            <button
              onClick={prevStep}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                currentStep === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-200 bg-white border border-gray-200'
              }`}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 font-medium transition-colors flex items-center shadow-md hover:shadow-lg"
            >
              {currentStep === steps.length ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Event
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventWizard;
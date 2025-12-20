
import React, { useState, useEffect, useMemo } from 'react';
import { LogOut, Calendar, MapPin, Users, Clock, CheckCircle, MessageSquare, Plus, Search, Building2, Star, Mail, X, Send, Edit2, Save, DollarSign, Flag, Sparkles, Trash2, Image as ImageIcon, Upload, Tag, MessageCircle, AlertCircle, ChevronDown, ChevronUp, Activity, History, List, Filter, BrainCircuit } from 'lucide-react';
import { MOCK_BUSINESSES, COUNTRIES_CURRENCIES, TIME_SLOTS } from '../constants';
import { Business, Individual, EventType, VendorInquiry, ActivityLog, BookingStatus } from '../types';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { findVendorsWithAI } from '../services/geminiService';

interface CustomerPortalProps {
  onLogout: () => void;
  userName: string;
  onAddEvent: () => void;
  events: Individual[]; 
  onUpdateEvent: (updated: Individual) => void;
  onDeleteEvent: (id: string) => void;
  activeTab: 'overview' | 'vendors' | 'gallery' | 'events';
  setActiveTab: (tab: 'overview' | 'vendors' | 'gallery' | 'events') => void;
  vendorInquiries: VendorInquiry[];
  onSendVendorInquiry: (inquiry: VendorInquiry) => void;
  activities: ActivityLog[];
  onOpenUnlimited: () => void;
  onSendSuggestion: (content: string) => void;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  onLogout, 
  userName, 
  onAddEvent, 
  events, 
  onUpdateEvent, 
  onDeleteEvent,
  activeTab,
  setActiveTab,
  vendorInquiries,
  onSendVendorInquiry,
  activities,
  onOpenUnlimited,
  onSendSuggestion
}) => {
  const { t } = useLanguage();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isEventSelectorOpen, setIsEventSelectorOpen] = useState(false);
  
  const [suggestionText, setSuggestionText] = useState('');
  const [showSuggestionAlert, setShowSuggestionAlert] = useState(false);

  // Determine active event
  const activeEvent = events.find(e => e.id === selectedEventId) || events[0] || null;

  // Update selection if events change
  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
    if (selectedEventId && !events.find(e => e.id === selectedEventId)) {
       setSelectedEventId(events.length > 0 ? events[0].id : null);
    }
  }, [events, selectedEventId]);


  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState<Business | null>(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  
  // AI Vendor Search State
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiVendorResults, setAiVendorResults] = useState<{ text: string, links: {title: string, uri: string}[] } | null>(null);

  // Gallery State
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Individual | null>(null);

  useEffect(() => {
    if (activeEvent) {
      setEditForm(activeEvent);
      setIsEditing(false); 
      setAiVendorResults(null); // Reset AI results when event changes
      const savedImages = localStorage.getItem(`gallery_${activeEvent.id}`);
      if (savedImages) {
        try {
          setGalleryImages(JSON.parse(savedImages));
        } catch (e) {
          console.error("Error loading images", e);
          setGalleryImages([]);
        }
      } else {
        setGalleryImages([]);
      }
    } else {
      setEditForm(null);
      setGalleryImages([]);
      setAiVendorResults(null);
    }
  }, [activeEvent]);

  const displayName = userName || activeEvent?.name || 'Guest';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeEvent) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large for local storage demo (limit 2MB).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const newImages = [...galleryImages, base64];
        setGalleryImages(newImages);
        try {
          localStorage.setItem(`gallery_${activeEvent.id}`, JSON.stringify(newImages));
        } catch (err) {
          alert("Storage limit reached. Image saved for this session only.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (index: number) => {
    if (window.confirm("Delete this image?")) {
      const newImages = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(newImages);
      if (activeEvent) {
        localStorage.setItem(`gallery_${activeEvent.id}`, JSON.stringify(newImages));
      }
    }
  };

  const weddingDate = activeEvent ? new Date(activeEvent.weddingDate) : new Date();
  const daysRemaining = activeEvent ? Math.ceil((weddingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const myInquiries = activeEvent ? vendorInquiries.filter(i => i.individualId === activeEvent.id) : [];

  const activityFeed = useMemo(() => {
    const list = [];

    // 1. Actions from ActivityLog
    activities.forEach(act => {
      let icon = Activity;
      let color = 'text-gray-600';
      let bgColor = 'bg-gray-50';

      switch(act.actionType) {
        case 'create': icon = Plus; color = 'text-green-600'; bgColor = 'bg-green-50'; break;
        case 'update': icon = Edit2; color = 'text-blue-600'; bgColor = 'bg-blue-50'; break;
        case 'delete': icon = Trash2; color = 'text-red-600'; bgColor = 'bg-red-50'; break;
        case 'inquiry': icon = Mail; color = 'text-purple-600'; bgColor = 'bg-purple-50'; break;
        case 'payment': icon = DollarSign; color = 'text-yellow-600'; bgColor = 'bg-yellow-50'; break;
        case 'login': icon = CheckCircle; color = 'text-teal-600'; bgColor = 'bg-teal-50'; break;
      }

      list.push({
        id: act.id,
        title: act.description,
        subtitle: new Date(act.timestamp).toLocaleTimeString(),
        date: act.timestamp,
        icon,
        color,
        bgColor,
        isAction: true
      });
    });

    // 2. Future Events (Only if activeEvent exists)
    if (activeEvent) {
       // Event Date
       if (activeEvent.weddingDate) {
         list.push({
           id: 'event-date',
           title: 'Event Day',
           subtitle: activeEvent.eventName || 'Big Day',
           date: activeEvent.weddingDate,
           icon: Calendar,
           color: 'text-wedding-600',
           bgColor: 'bg-wedding-50',
           isAction: false
         });
       }
    }

    // Sort: Newest actions/future dates first
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities, activeEvent]);


  // Vendor Filtering Logic
  const filteredBusinesses = MOCK_BUSINESSES.filter(b => {
    const cityMatch = activeEvent?.city ? b.city.toLowerCase() === activeEvent.city.toLowerCase() : true;
    const searchMatch = b.name.toLowerCase().includes(vendorSearchTerm.toLowerCase()) || 
                        b.category.toLowerCase().includes(vendorSearchTerm.toLowerCase()) ||
                        b.city.toLowerCase().includes(vendorSearchTerm.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || b.category === selectedCategory;

    return cityMatch && searchMatch && categoryMatch;
  });

  const uniqueCategories = useMemo(() => {
    const cats = new Set(MOCK_BUSINESSES.map(b => b.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVendor && activeEvent) {
        const newInquiry: VendorInquiry = {
            id: crypto.randomUUID(),
            individualId: activeEvent.id,
            businessId: selectedVendor.id,
            businessName: selectedVendor.name,
            businessCategory: selectedVendor.category,
            message: inquiryMessage,
            dateSent: new Date().toISOString(),
            status: 'Sent'
        };
        onSendVendorInquiry(newInquiry);
        alert(`Inquiry sent to ${selectedVendor.name}!`);
        setSelectedVendor(null);
        setInquiryMessage('');
    } else {
      alert("Please select an event first to send inquiries.");
    }
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const countryData = COUNTRIES_CURRENCIES.find(c => c.country === editForm.country);
    const updated = {
      ...editForm,
      currency: countryData ? countryData.currency : (editForm.currency || 'USD')
    };
    onUpdateEvent(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(activeEvent || null);
    setIsEditing(false);
  };

  const handleAiVendorSearch = async () => {
    if (!activeEvent?.city) {
      alert("Please ensure your event has a city set to search for vendors.");
      return;
    }
    
    setIsAiSearching(true);
    setAiVendorResults(null);
    
    const category = selectedCategory === 'All' ? 'event vendors (venues, catering, photography, etc.)' : selectedCategory;
    const results = await findVendorsWithAI(activeEvent.city, category, activeEvent.eventType, activeEvent.preferences);
    
    setAiVendorResults(results);
    setIsAiSearching(false);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    onSendSuggestion(suggestionText);
    setSuggestionText('');
    setShowSuggestionAlert(true);
    setTimeout(() => setShowSuggestionAlert(false), 3000);
  };

  const getTimeSlotLabel = (slotId?: string) => {
    const slot = TIME_SLOTS.find(s => s.id === slotId);
    return slot ? slot.label : slotId || 'TBD';
  };

  // Helper for status colors in event list
  const getStatusColor = (status: BookingStatus) => {
      switch (status) {
          case BookingStatus.Inquiry: return 'bg-blue-100 text-blue-800';
          case BookingStatus.TourScheduled: return 'bg-purple-100 text-purple-800';
          case BookingStatus.ContractSent: return 'bg-yellow-100 text-yellow-800';
          case BookingStatus.Confirmed: return 'bg-green-100 text-green-800';
          case BookingStatus.Completed: return 'bg-gray-100 text-gray-800';
          case BookingStatus.Cancelled: return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
      }
  };

  const renderVendorCard = (vendor: Business) => (
      <div key={vendor.id} onClick={() => setSelectedVendor(vendor)} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-wedding-200 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
              <div>
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-wedding-600 transition-colors">{vendor.name}</h3>
                  <p className="text-sm text-gray-500">{vendor.category} • {vendor.city}</p>
              </div>
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
                  <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
                  {vendor.rating}
              </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{vendor.description}</p>
          <div className="flex items-center text-xs text-gray-400">
              <MapPin className="w-3 h-3 mr-1" />
              {vendor.district ? `${vendor.district}, ` : ''}{vendor.city}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="cursor-pointer hover:scale-110 transition-transform text-wedding-600" onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}>
                    <Logo className="w-6 h-6" />
                </div>
                <span className="font-serif font-black tracking-tighter text-xl text-gray-800">{t('app.name')}</span>
              </div>
              
              {/* Event Selector - Only show if not on 'events' tab to avoid clutter */}
              {activeTab !== 'events' && events.length > 0 && (
                <div className="relative">
                  <button 
                    onClick={() => setIsEventSelectorOpen(!isEventSelectorOpen)}
                    className="flex items-center space-x-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 px-3 py-1.5 rounded-lg transition-all text-sm font-medium text-gray-700 min-w-[200px] justify-between"
                  >
                    <span className="truncate max-w-[150px]">{activeEvent?.eventName || activeEvent?.eventType || 'Select Event'}</span>
                    {isEventSelectorOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>

                  {isEventSelectorOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30">
                       <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wide">Your Events</div>
                       {events.map(evt => (
                         <button
                           key={evt.id}
                           onClick={() => {
                             setSelectedEventId(evt.id);
                             setIsEventSelectorOpen(false);
                           }}
                           className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${evt.id === activeEvent?.id ? 'text-wedding-600 font-bold bg-wedding-50' : 'text-gray-700'}`}
                         >
                           <span className="truncate">{evt.eventName || evt.eventType}</span>
                           {evt.id === activeEvent?.id && <CheckCircle className="w-3 h-3" />}
                         </button>
                       ))}
                       <div className="border-t border-gray-100 my-1"></div>
                       <button
                         onClick={() => {
                           onAddEvent();
                           setIsEventSelectorOpen(false);
                         }}
                         className="w-full text-left px-4 py-2 text-sm text-wedding-600 font-medium hover:bg-wedding-50 flex items-center"
                       >
                         <Plus className="w-3 h-3 mr-2" />
                         Create New Event
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onAddEvent}
                  className="flex items-center bg-wedding-600 text-white px-3 py-1.5 rounded-lg hover:bg-wedding-700 transition-colors shadow-sm text-sm font-medium whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Add Event</span>
                </button>
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-700">{displayName}</span>
                  <span className="text-xs text-gray-400">Individual Account</span>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut 
                    className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" 
                    onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
                />
              </button>
            </div>
          </div>

          <div className="flex space-x-8 mt-4 overflow-x-auto scrollbar-hide border-t border-gray-100 pt-2">
             <button 
               onClick={() => setActiveTab('overview')}
               className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                 activeTab === 'overview' ? 'text-wedding-600' : 'text-gray-400 hover:text-gray-700'
               }`}
             >
               Dashboard
               {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-wedding-600 rounded-t-full"></div>}
             </button>
             <button 
               onClick={() => setActiveTab('events')}
               className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                 activeTab === 'events' ? 'text-wedding-600' : 'text-gray-400 hover:text-gray-700'
               }`}
             >
               My Events
               {activeTab === 'events' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-wedding-600 rounded-t-full"></div>}
             </button>
             <button 
               onClick={() => setActiveTab('vendors')}
               className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                 activeTab === 'vendors' ? 'text-wedding-600' : 'text-gray-400 hover:text-gray-700'
               }`}
             >
               Find Vendors
               {activeTab === 'vendors' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-wedding-600 rounded-t-full"></div>}
             </button>
             <button 
               onClick={() => setActiveTab('gallery')}
               className={`pb-2 text-sm font-bold transition-all relative whitespace-nowrap ${
                 activeTab === 'gallery' ? 'text-wedding-600' : 'text-gray-400 hover:text-gray-700'
               }`}
             >
               Gallery
               {activeTab === 'gallery' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-wedding-600 rounded-t-full"></div>}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6 flex-1 w-full">
        
        {/* EVENT LIST TAB */}
        {activeTab === 'events' && (
           <div className="animate-fadeIn">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">My Saved Events</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and track all your upcoming celebrations.</p>
                  </div>
                  <button 
                    onClick={onAddEvent}
                    className="flex items-center px-4 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors shadow-sm text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Plan New Event
                  </button>
               </div>
               
               {events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {events.map(event => (
                          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative group hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center justify-center w-12 h-12 bg-wedding-50 text-wedding-600 rounded-full">
                                     <Calendar className="w-6 h-6" />
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(event.status)}`}>
                                      {event.status}
                                  </span>
                              </div>
                              
                              <h3 className="text-lg font-bold text-gray-800 mb-1">{event.eventName || event.eventType}</h3>
                              <p className="text-sm text-gray-500 mb-4">{new Date(event.weddingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              
                              <div className="space-y-2 mb-6">
                                  <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                      <span className="truncate">{event.venue || 'Venue not set'}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                                      <span>{event.guestCount} Guests</span>
                                  </div>
                              </div>
                              
                              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                                  <button 
                                      onClick={() => {
                                          setSelectedEventId(event.id);
                                          setActiveTab('overview');
                                      }}
                                      className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-wedding-50 hover:text-wedding-700 text-sm font-medium transition-colors"
                                  >
                                      Dashboard
                                  </button>
                                  <button 
                                      onClick={() => onDeleteEvent(event.id)}
                                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete Event"
                                  >
                                      <Trash2 className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      ))}
                      
                      {/* Add New Card */}
                      <button 
                          onClick={onAddEvent}
                          className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-wedding-300 hover:text-wedding-600 hover:bg-wedding-50/50 transition-all group min-h-[250px]"
                      >
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                              <Plus className="w-8 h-8" />
                          </div>
                          <h3 className="font-bold text-lg mb-1">Add Another Event</h3>
                          <p className="text-sm text-center px-4">Start planning a new celebration</p>
                      </button>
                  </div>
               ) : (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <List className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">No Saved Events</h3>
                      <p className="text-gray-500 mb-6">You haven't created any events yet.</p>
                      <button 
                        onClick={onAddEvent}
                        className="px-6 py-3 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors shadow-lg font-medium"
                      >
                        Create Your First Event
                      </button>
                  </div>
               )}
           </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-fadeIn">
            {!activeEvent || !editForm ? (
              <div className="flex flex-col items-center justify-center py-16">
                 <div className="max-w-md w-full text-center space-y-8">
                  <div className="relative inline-block">
                     <div className="absolute inset-0 bg-wedding-200 rounded-full blur-2xl opacity-50"></div>
                     <div className="relative bg-white p-6 rounded-full shadow-xl ring-4 ring-wedding-50">
                       <Sparkles 
                            className="w-12 h-12 text-wedding-600 cursor-pointer hover:scale-110 transition-transform" 
                            onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Welcome, {displayName}</h1>
                    <p className="text-gray-500">You don't have any active events. Start planning your big day!</p>
                  </div>

                   <button
                    onClick={onAddEvent}
                    className="group relative w-full flex items-center justify-center px-8 py-4 bg-wedding-600 text-white rounded-xl hover:bg-wedding-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <Plus className="w-6 h-6 mr-3" />
                    <span className="font-bold text-lg">Create New Event</span>
                  </button>
                </div>
              </div>
            ) : (
               <div className="space-y-6">
                 <div className="bg-gradient-to-br from-wedding-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-3xl font-bold mb-2">{activeEvent.eventName || 'Your Event'}</h1>
                            <p className="text-wedding-100 flex items-center">
                            <Calendar 
                                className="w-4 h-4 mr-2 cursor-pointer hover:text-white" 
                                onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
                            />
                            {new Date(activeEvent.weddingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="text-left md:text-right">
                            <div className="text-4xl font-bold">{daysRemaining}</div>
                            <div className="text-wedding-200 text-sm uppercase tracking-wider font-medium">Days To Go</div>
                        </div>
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all relative">
                           <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-serif font-bold text-gray-800">Event Details</h2>
                                
                                {!isEditing ? (
                                <div className="flex items-center space-x-3">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                    {activeEvent.status}
                                    </span>
                                    <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="p-1.5 text-gray-400 hover:text-wedding-600 hover:bg-wedding-50 rounded-full transition-colors"
                                    title="Edit Details"
                                    >
                                    <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                    onClick={() => onDeleteEvent(activeEvent.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Event"
                                    >
                                    <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                ) : (
                                <div className="flex items-center space-x-2">
                                    <button onClick={handleCancelEdit} className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                    <button onClick={handleSaveEdit} className="flex items-center px-3 py-1.5 text-xs font-bold bg-wedding-600 text-white rounded-lg shadow-sm hover:bg-wedding-700 transition-colors">
                                        <Save className="w-3 h-3 mr-1" /> Save
                                    </button>
                                </div>
                                )}
                           </div>
                           
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3 col-span-1 sm:col-span-2">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-1 cursor-pointer hover:scale-105" onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}>
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Event Type</p>
                                        {!isEditing ? <p className="text-gray-800 font-medium">{activeEvent.eventType || 'Wedding'}</p> : null}
                                        {isEditing ? <select className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white" value={editForm?.eventType} onChange={(e) => setEditForm(prev => prev ? ({...prev, eventType: e.target.value}) : null)}>{Object.values(EventType).map(t => <option key={t} value={t}>{t}</option>)}</select> : null}
                                    </div>
                                </div>
                           </div>
                        </div>
                        
                        {/* Suggestion Column for Individual */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-serif font-bold text-gray-800 mb-4 flex items-center">
                                <MessageCircle className="w-5 h-5 mr-2 text-wedding-600" />
                                Admin Suggestion Box
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Have an idea for our platform? Send it directly to our administration team.</p>
                            
                            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                                <textarea
                                    value={suggestionText}
                                    onChange={(e) => setSuggestionText(e.target.value)}
                                    placeholder="Tell us what features you'd like to see..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none resize-none transition-all h-24 text-sm"
                                    required
                                />
                                <div className="flex items-center justify-between">
                                    {showSuggestionAlert ? (
                                        <span className="text-xs text-green-600 font-bold flex items-center animate-bounce">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Suggestion sent to Admin!
                                        </span>
                                    ) : <div></div>}
                                    <button 
                                        type="submit" 
                                        className="px-6 py-2 bg-wedding-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-wedding-700 transition-all flex items-center"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Suggestion
                                    </button>
                                </div>
                            </form>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center">
                                <History 
                                    className="w-4 h-4 mr-2 cursor-pointer hover:text-wedding-600 transition-colors" 
                                    onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
                                />
                                Recent Activity
                            </h3>
                             <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {activityFeed.length > 0 ? (
                                <ul className="relative border-l border-gray-200 ml-2 space-y-4">
                                    {activityFeed.map((item, idx) => (
                                    <li key={item.id + idx} className="ml-4">
                                        <div className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border border-white ${item.bgColor.replace('bg-', 'bg-')}`}></div>
                                        <div className="flex items-start">
                                            <div 
                                                className={`p-1.5 rounded-md mr-3 ${item.bgColor} ${item.color} cursor-pointer hover:scale-110`}
                                                onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
                                            >
                                            <item.icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                            <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                            {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
                                            <p className="text-xs text-gray-400 mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                                ) : <div className="text-center py-4 text-gray-400 text-sm">No recent activity</div>}
                            </div>
                        </div>
                     </div>
                 </div>
               </div>
            )}
          </div>
        )}

        {/* VENDORS TAB */}
        {activeTab === 'vendors' && (
             <div className="animate-fadeIn w-full space-y-8">
                  {/* AI Recommendation Banner */}
                  {activeEvent && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-1 shadow-lg transform transition-all hover:scale-[1.01]">
                      <div className="bg-white rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                            <BrainCircuit className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-gray-800 mb-1 flex items-center">
                              Smart Match AI Recommendation
                              <span className="ml-3 bg-blue-100 text-blue-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-200">
                                Powered by Gemini
                              </span>
                            </h3>
                            <p className="text-gray-500 text-sm max-w-xl">
                              Our AI will analyze your <strong>{activeEvent.eventType}</strong> in <strong>{activeEvent.city || 'your area'}</strong> and match you with vendors that fit your <strong>"{activeEvent.preferences || 'General Style'}"</strong> preferences.
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={handleAiVendorSearch} 
                          disabled={isAiSearching}
                          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 flex items-center whitespace-nowrap disabled:opacity-50"
                        >
                          {isAiSearching ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                          ) : (
                            <Sparkles className="w-5 h-5 mr-3" />
                          )}
                          Personalized Search
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters */}
                    <div className="w-full md:w-72 flex-shrink-0 space-y-8">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search by name..." 
                                    value={vendorSearchTerm}
                                    onChange={(e) => setVendorSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                                />
                            </div>
                            
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Filter className="w-3 h-3" />
                                    Categories
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                    {uniqueCategories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${selectedCategory === cat ? 'bg-wedding-600 text-white font-bold shadow-md shadow-wedding-100' : 'text-gray-500 hover:bg-gray-50 hover:text-wedding-600'}`}
                                        >
                                            <span>{cat}</span>
                                            {selectedCategory === cat && <CheckCircle className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex-1 space-y-12">
                        {aiVendorResults && (
                          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden animate-fadeIn">
                            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                               <div className="flex items-center space-x-2">
                                  <Sparkles className="w-5 h-5 text-blue-600" />
                                  <h3 className="font-serif font-bold text-blue-800">AI Tailored Suggestions</h3>
                               </div>
                               <button onClick={() => setAiVendorResults(null)} className="text-blue-400 hover:text-blue-600">
                                  <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="prose prose-blue max-w-none whitespace-pre-wrap font-sans text-gray-700 mb-8 leading-relaxed">
                                   {aiVendorResults.text}
                                </div>
                                {aiVendorResults.links.length > 0 && (
                                   <div className="pt-6 border-t border-gray-100">
                                      <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                        Suggested Locations on Google Maps:
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {aiVendorResults.links.map((link, i) => (
                                          <a key={i} href={link.uri} target="_blank" rel="noreferrer" className="flex items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
                                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm group-hover:scale-110 transition-transform">
                                              <MapPin className="w-4 h-4 text-red-500"/> 
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors truncate">{link.title}</span>
                                          </a>
                                        ))}
                                      </div>
                                   </div>
                                )}
                            </div>
                          </div>
                        )}

                        {filteredBusinesses.length > 0 ? (
                           <>
                             {(selectedCategory === 'All' ? uniqueCategories.filter(c => c !== 'All') : [selectedCategory]).map(category => {
                                const categoryVendors = filteredBusinesses.filter(b => b.category === category);
                                if (categoryVendors.length === 0) return null;
                                
                                return (
                                  <div key={category} className="space-y-6 animate-fadeIn">
                                     <div className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                                         <h3 className="text-xl font-serif font-bold text-gray-800">{category}</h3>
                                         <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{categoryVendors.length}</span>
                                     </div>
                                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                         {categoryVendors.map(vendor => renderVendorCard(vendor))}
                                     </div>
                                  </div>
                                )
                             })}
                           </>
                        ) : (
                            !aiVendorResults && (
                              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm px-6 text-center">
                                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                                    <Search className="w-10 h-10" />
                                  </div>
                                  <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">No Registered Vendors Found</h3>
                                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    We couldn't find any verified <strong>"{selectedCategory}"</strong> vendors in <strong>{activeEvent?.city || 'your area'}</strong>. 
                                    Try searching the wider web with our specialized AI agent.
                                  </p>
                                  <button 
                                    onClick={handleAiVendorSearch} 
                                    disabled={isAiSearching}
                                    className="px-10 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all flex items-center shadow-2xl disabled:opacity-50 font-bold"
                                  >
                                    {isAiSearching ? (
                                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                    ) : (
                                      <BrainCircuit className="w-6 h-6 mr-3" />
                                    )}
                                    Search {activeEvent?.city || 'the Area'} with AI
                                  </button>
                              </div>
                            )
                        )}
                    </div>
                  </div>
             </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn w-full space-y-6">
             <div className="flex justify-between items-center">
                <div>
                   <h2 className="text-2xl font-serif font-bold text-gray-800">Inspiration Gallery</h2>
                   <p className="text-gray-500 text-sm mt-1">Upload and organize your mood board for this event.</p>
                </div>
                <label className="cursor-pointer bg-wedding-600 text-white px-4 py-2 rounded-lg hover:bg-wedding-700 transition-colors shadow-md flex items-center font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
             </div>

             {galleryImages.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                      <img src={img} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                            onClick={() => handleDeleteImage(idx)}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors shadow-lg"
                         >
                            <Trash2 className="w-6 h-6" />
                         </button>
                      </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-lg">Your mood board is empty.</p>
                  <p className="text-sm">Start uploading images to build your event vision.</p>
               </div>
             )}
          </div>
        )}
      </main>
      
      {/* Inquiry Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-fadeIn overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                      <h3 className="font-serif font-bold text-xl text-gray-800">Contact Vendor</h3>
                      <p className="text-sm text-gray-500">{selectedVendor.name}</p>
                    </div>
                    <button onClick={() => setSelectedVendor(null)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSendInquiry} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                            <textarea 
                                required
                                rows={5}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none resize-none transition-all"
                                placeholder={`Hi ${selectedVendor.contactName}, I'm interested in your services for my event on ${new Date(activeEvent?.weddingDate || '').toLocaleDateString()}...`}
                                value={inquiryMessage}
                                onChange={(e) => setInquiryMessage(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="w-full py-4 bg-wedding-600 text-white rounded-2xl hover:bg-wedding-700 font-bold flex items-center justify-center shadow-lg shadow-wedding-100 transition-all">
                                <Send className="w-5 h-5 mr-2" />
                                Send Inquiry
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
           <span>&copy; {new Date().getFullYear()} Event Manager. All rights reserved.</span>
           <div className="flex gap-6">
              <button className="hover:text-wedding-600 transition-colors">Privacy Policy</button>
              <button className="hover:text-wedding-600 transition-colors">Terms of Service</button>
              <button className="hover:text-wedding-600 transition-colors">Contact Support</button>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerPortal;

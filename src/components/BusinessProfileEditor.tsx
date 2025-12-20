
import React, { useState, useRef } from 'react';
import { Business, ServiceItem, MenuItem } from '../types';
import { Save, Plus, Trash2, Image as ImageIcon, Video, DollarSign, Building2, MapPin, Phone, Mail, User, Info, Clock, Globe, Upload, CheckCircle2, Utensils, Coffee, IceCream, Pizza, FileVideo, X, Navigation } from 'lucide-react';
import { BUSINESS_CATEGORIES, COUNTRIES_CURRENCIES, SERVICE_TIME_CATEGORIES, COMMON_SERVICE_OPTIONS } from '../constants';

interface BusinessProfileEditorProps {
  business: Business;
  onSave: (updated: Business) => void;
}

const BusinessProfileEditor: React.FC<BusinessProfileEditorProps> = ({ business, onSave }) => {
  const [formData, setFormData] = useState<Business>(business);
  const [newImage, setNewImage] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'services' | 'gallery'>('details');
  const [isSaving, setIsSaving] = useState(false);
  
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddService = () => {
    const newService: ServiceItem = { 
      name: COMMON_SERVICE_OPTIONS[0], 
      amount: 0, 
      currency: formData.country ? (COUNTRIES_CURRENCIES.find(c => c.country === formData.country)?.currency || 'USD') : 'USD', 
      timeCategory: SERVICE_TIME_CATEGORIES[0], 
      description: '',
      menuItems: []
    };
    setFormData(prev => ({
      ...prev,
      services: [...(prev.services || []), newService]
    }));
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
    const updatedServices = [...(formData.services || [])];
    
    let finalValue = value;
    if (field === 'name') {
        const lowerName = value.toLowerCase();
        const isFixedPrice = lowerName.includes('catering') || lowerName.includes('decoration');
        if (isFixedPrice) {
            updatedServices[index].timeCategory = 'Fixed Price';
        }
    }

    updatedServices[index] = { ...updatedServices[index], [field]: finalValue };
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleRemoveService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index)
    }));
  };

  const handleAddMenuItem = (serviceIndex: number) => {
    const updatedServices = [...(formData.services || [])];
    const newItem: MenuItem = { id: crypto.randomUUID(), name: '', category: 'Food' };
    updatedServices[serviceIndex].menuItems = [...(updatedServices[serviceIndex].menuItems || []), newItem];
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleMenuItemChange = (serviceIndex: number, itemIndex: number, field: keyof MenuItem, value: any) => {
    const updatedServices = [...(formData.services || [])];
    const updatedMenuItems = [...(updatedServices[serviceIndex].menuItems || [])];
    updatedMenuItems[itemIndex] = { ...updatedMenuItems[itemIndex], [field]: value };
    updatedServices[serviceIndex].menuItems = updatedMenuItems;
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleRemoveMenuItem = (serviceIndex: number, itemIndex: number) => {
    const updatedServices = [...(formData.services || [])];
    updatedServices[serviceIndex].menuItems = updatedServices[serviceIndex].menuItems?.filter((_, i) => i !== itemIndex);
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleAddImageUrl = () => {
    if (newImage && !formData.images?.includes(newImage)) {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), newImage]
      }));
      setNewImage('');
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size for gallery images is 2MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), base64String]
        }));
      };
      reader.readAsDataURL(file);
    });
    if (imageFileInputRef.current) imageFileInputRef.current.value = '';
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(`The video file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please keep videos under 10MB for this demo.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({
        ...prev,
        videoUrl: base64String
      }));
    };
    reader.readAsDataURL(file);
    if (videoFileInputRef.current) videoFileInputRef.current.value = '';
  };

  const handleRemoveImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== url)
    }));
  };

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, videoUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      alert('Business profile updated successfully!');
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`px-8 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'details' ? 'bg-white text-wedding-600 border-b-2 border-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Info className="w-4 h-4 mr-2" />
          Business Details
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('services')}
          className={`px-8 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'services' ? 'bg-white text-wedding-600 border-b-2 border-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Services & Prices
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-8 py-4 text-sm font-bold flex items-center transition-all ${activeTab === 'gallery' ? 'bg-white text-wedding-600 border-b-2 border-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Gallery & Video
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        {activeTab === 'details' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all bg-white"
                >
                  {BUSINESS_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Business Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all resize-none"
                placeholder="Tell your potential customers about your services, history, and what makes you special..."
              ></textarea>
            </div>

            {/* Maps & Directions Section */}
            <div className="pt-6 border-t border-gray-100">
               <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-4 flex items-center">
                  <Navigation className="w-4 h-4 mr-2 text-wedding-600" />
                  Location & Access
               </h3>
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Google Maps / Apple Maps Link</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name="mapsUrl"
                        value={formData.mapsUrl || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all"
                        placeholder="e.g. https://goo.gl/maps/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Arrival Directions</label>
                    <textarea
                      name="directions"
                      value={formData.directions || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none transition-all resize-none"
                      placeholder="e.g. Turn right at the fountain, entry through Gate 2. Parking is complimentary in the North Lot."
                    ></textarea>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Service Packages</h3>
                <p className="text-sm text-gray-500">List your services and pricing.</p>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center px-4 py-2 bg-wedding-50 text-wedding-600 rounded-lg font-bold text-sm hover:bg-wedding-100 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>

            <div className="space-y-6">
              {formData.services?.map((service, sIdx) => {
                const lowerName = service.name.toLowerCase();
                const isCatering = lowerName.includes('catering');
                const isDecoration = lowerName.includes('decoration');
                const isFixedPriceService = isCatering || isDecoration;

                return (
                  <div key={sIdx} className="p-6 bg-gray-50 border border-gray-200 rounded-2xl relative group hover:border-wedding-200 transition-colors">
                    <button
                      type="button"
                      onClick={() => handleRemoveService(sIdx)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className={isFixedPriceService ? "lg:col-span-3" : "lg:col-span-2"}>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Service Name</label>
                        <select
                          value={service.name}
                          onChange={(e) => handleServiceChange(sIdx, 'name', e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none"
                        >
                          {COMMON_SERVICE_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      {!isFixedPriceService && (
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> Time Category
                          </label>
                          <select
                            value={service.timeCategory}
                            onChange={(e) => handleServiceChange(sIdx, 'timeCategory', e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none"
                          >
                            {SERVICE_TIME_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" /> Amount
                          </label>
                          <input
                            type="number"
                            value={service.amount}
                            onChange={(e) => handleServiceChange(sIdx, 'amount', Number(e.target.value))}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none"
                            placeholder="0.00"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center">
                            <Globe className="w-3 h-3 mr-1" /> Currency
                          </label>
                          <select
                            value={service.currency}
                            onChange={(e) => handleServiceChange(sIdx, 'currency', e.target.value)}
                            className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none text-xs font-bold"
                          >
                            {COUNTRIES_CURRENCIES.map(c => (
                              <option key={c.currency} value={c.currency}>{c.currency}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {isCatering && (
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-4 animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xs font-black text-wedding-600 uppercase tracking-widest flex items-center">
                            <Utensils className="w-3 h-3 mr-2" />
                            Menu Items & Options
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleAddMenuItem(sIdx)}
                            className="text-[10px] bg-wedding-50 text-wedding-700 px-3 py-1.5 rounded-full font-bold hover:bg-wedding-100 transition-all flex items-center"
                          >
                            <Plus className="w-2.5 h-2.5 mr-1" />
                            Add Item
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {service.menuItems?.map((item, iIdx) => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group/item transition-all hover:bg-gray-100/50">
                              <div className="w-full sm:w-48">
                                <select
                                  value={item.category}
                                  onChange={(e) => handleMenuItemChange(sIdx, iIdx, 'category', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-wedding-500 outline-none"
                                >
                                  <option value="Food">🍲 Food</option>
                                  <option value="Drink">🍹 Drink</option>
                                  <option value="Appetizer">🥨 Appetizer</option>
                                  <option value="Dessert">🍰 Dessert</option>
                                  <option value="Other">✨ Other</option>
                                </select>
                              </div>
                              <div className="flex-1 w-full">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleMenuItemChange(sIdx, iIdx, 'name', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs focus:ring-2 focus:ring-wedding-500 outline-none"
                                  placeholder="e.g. Signature Beef Wellington"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveMenuItem(sIdx, iIdx)}
                                className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-item-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          {!service.menuItems?.length && (
                            <p className="text-[10px] text-gray-400 text-center py-4 italic">No specific menu items added.</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Detailed Description (Optional)</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleServiceChange(sIdx, 'description', e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none"
                        placeholder="What's included in this service?"
                      />
                    </div>
                  </div>
                );
              })}
              {!formData.services?.length && (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                  <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400">No services added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-12 animate-fadeIn">
            {/* Photos Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2 text-wedding-600" />
                    Showcase Gallery
                  </h3>
                  <p className="text-sm text-gray-500">Upload high-quality photos.</p>
                </div>
                <div className="flex gap-2">
                   <label className="cursor-pointer group">
                    <div className="flex items-center gap-2 px-4 py-2 bg-wedding-50 text-wedding-600 border border-wedding-100 rounded-xl font-bold hover:bg-wedding-100 transition-all text-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photos</span>
                    </div>
                    <input 
                      type="file" 
                      ref={imageFileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageFileUpload} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1 relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-500 outline-none text-sm"
                    placeholder="Or paste image URL here..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!newImage}
                  className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                >
                  Add URL
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-100 shadow-sm">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!formData.images?.length && (
                  <div className="col-span-full py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No photos yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Video Section */}
            <div className="pt-10 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                    <Video className="w-5 h-5 mr-2 text-wedding-600" />
                    Featured Video
                  </h3>
                  <p className="text-sm text-gray-500">Provide a showreel.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                   <label className="flex-1 sm:flex-none cursor-pointer group">
                    <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-wedding-600 text-white rounded-xl font-bold hover:bg-wedding-700 transition-all text-sm shadow-md">
                      <FileVideo className="w-4 h-4" />
                      <span>Upload Video</span>
                    </div>
                    <input 
                      type="file" 
                      ref={videoFileInputRef}
                      className="hidden" 
                      accept="video/*" 
                      onChange={handleVideoFileUpload} 
                    />
                  </label>
                </div>
              </div>

              {formData.videoUrl ? (
                <div className="space-y-4 animate-fadeIn">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-xl group max-w-2xl mx-auto">
                    {formData.videoUrl.startsWith('data:video') ? (
                      <video 
                        src={formData.videoUrl} 
                        className="w-full h-full object-cover" 
                        controls 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white p-8">
                         <Globe className="w-12 h-12 mb-4 opacity-50" />
                         <p className="font-bold text-center mb-2">Remote Link Active</p>
                         <p className="text-xs text-white/60 text-center truncate w-full">{formData.videoUrl}</p>
                         <a href={formData.videoUrl} target="_blank" rel="noreferrer" className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm backdrop-blur-md transition-all">Preview URL</a>
                      </div>
                    )}
                    <button 
                      type="button"
                      onClick={handleRemoveVideo}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg z-10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-gray-300 shadow-sm mb-4">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-gray-400 mb-6">No video featured yet.</p>
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        name="videoUrl"
                        value={formData.videoUrl || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-wedding-500 outline-none text-sm shadow-sm"
                        placeholder="Paste YouTube or Vimeo URL here..."
                      />
                    </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
              <span className="font-medium">All changes are drafted for this session.</span>
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center px-10 py-4 bg-wedding-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-wedding-700 shadow-xl shadow-wedding-200 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
          >
            {isSaving ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Full Profile
                </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessProfileEditor;

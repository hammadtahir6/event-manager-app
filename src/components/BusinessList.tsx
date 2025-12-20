
import React, { useState } from 'react';
import { Business, ServiceItem } from '../types';
import { Search, Plus, Phone, Mail, Star, Building2, Filter, ChevronDown, ChevronUp, Sparkles, Image as ImageIcon, DollarSign, Info, Grid, Video, Clock, Utensils, Coffee, IceCream, Pizza, MapPin, ExternalLink, Navigation, X } from 'lucide-react';
import { generateBusinessEmailDraft } from '../services/geminiService';

interface BusinessListProps {
  businesses: Business[];
  onAddBusiness: () => void;
}

// Fix: Missing export default and completed truncated return statement
const BusinessList: React.FC<BusinessListProps> = ({ businesses, onAddBusiness }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'gallery'>('overview');

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState('');

  const standardCategories = ['Hall Services', 'Catering Services', 'Florist', 'Photography', 'Decoration Services'];
  const allCategoriesSet = new Set(['All', ...standardCategories, ...businesses.map(b => b.category)]);
  const categories = Array.from(allCategoriesSet).sort();

  const allCitiesSet = new Set(['All', ...businesses.map(b => b.city)]);
  const cities = Array.from(allCitiesSet).sort();

  const filteredBusinesses = businesses.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    const matchesCity = cityFilter === 'All' || b.city === cityFilter;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setActiveTab('overview');
    }
  };

  const handleDraftInquiry = async (e: React.MouseEvent, business: Business) => {
    e.stopPropagation();
    setAiTitle(`Inquiry for ${business.name}`);
    setAiContent('Generating draft...');
    setAiLoading(true);
    setAiModalOpen(true);
    const draft = await generateBusinessEmailDraft(business);
    setAiContent(draft);
    setAiLoading(false);
  };

  const getMenuIcon = (cat: string) => {
    switch (cat) {
      case 'Food': return <Pizza className="w-3 h-3" />;
      case 'Drink': return <Coffee className="w-3 h-3" />;
      case 'Dessert': return <IceCream className="w-3 h-3" />;
      case 'Appetizer': return <Utensils className="w-3 h-3 text-wedding-400" />;
      default: return <Sparkles className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wedding-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
               <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wedding-500 appearance-none bg-white cursor-pointer text-gray-700"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
            </div>
          </div>
          <button
            onClick={onAddBusiness}
            className="flex items-center px-4 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors shadow-sm whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Business
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-wedding-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => {
          const isExpanded = expandedId === business.id;
          return (
            <div 
              key={business.id} 
              className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-wedding-100 shadow-xl col-span-1 md:col-span-2 lg:col-span-3' : 'hover:shadow-md cursor-pointer'}`}
              onClick={() => !isExpanded && toggleExpand(business.id)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-wedding-100 text-wedding-700' : 'bg-wedding-50 text-wedding-600 group-hover:bg-wedding-100'}`}>
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-serif font-bold text-lg text-gray-800 leading-tight truncate">{business.name}</h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] uppercase font-bold tracking-wider rounded-full mt-1 border border-gray-200">
                        {business.category}
                        </span>
                    </div>
                    </div>
                    
                    <div className="shrink-0">
                      {business.rating !== undefined && business.rating > 0 ? (
                        <div className="flex items-center bg-yellow-400 px-3 py-1.5 rounded-xl text-yellow-900 border border-yellow-500 shadow-lg">
                            <Star className="w-5 h-5 mr-1 fill-yellow-900 text-yellow-900" />
                            <span className="text-lg font-black">{Number(business.rating).toFixed(1)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-xl text-gray-400 border border-gray-200">
                            <span className="text-xs font-black uppercase tracking-tighter">Unrated</span>
                        </div>
                      )}
                    </div>
                </div>
                {!isExpanded && (
                    <div className="flex justify-center mt-4 text-gray-300">
                    <ChevronDown className="w-4 h-4" />
                    </div>
                )}
              </div>
              
              {isExpanded && (
                <div className="animate-fadeIn border-t border-gray-100 bg-gray-50/50">
                   <div className="flex border-b border-gray-200 bg-white px-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTab('overview'); }}
                        className={`py-3 mr-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-wedding-600 text-wedding-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <div className="flex items-center">
                             <Info className="w-4 h-4 mr-2" />
                             Overview
                         </div>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTab('services'); }}
                        className={`py-3 mr-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'services' ? 'border-wedding-600 text-wedding-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <div className="flex items-center">
                             <DollarSign className="w-4 h-4 mr-2" />
                             Services & Pricing
                         </div>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveTab('gallery'); }}
                        className={`py-3 mr-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'gallery' ? 'border-wedding-600 text-wedding-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <div className="flex items-center">
                             <Grid className="w-4 h-4 mr-2" />
                             Gallery
                         </div>
                      </button>
                   </div>

                   <div className="p-6">
                      {activeTab === 'overview' && (
                          <div className="space-y-8 animate-fadeIn">
                             {business.rating > 0 && (
                               <div className="flex items-center space-x-1 bg-yellow-50 p-3 rounded-xl border border-yellow-100 w-fit">
                                 {[1, 2, 3, 4, 5].map((star) => (
                                   <Star 
                                     key={star} 
                                     className={`w-5 h-5 ${star <= Math.round(business.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
                                   />
                                 ))}
                                 <span className="ml-2 font-black text-yellow-800">{business.rating.toFixed(1)} Excellent</span>
                               </div>
                             )}
                             {business.description && (
                                 <div>
                                     <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">About the Vendor</h4>
                                     <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">{business.description}</p>
                                 </div>
                             )}

                             {(business.mapsUrl || business.directions) && (
                               <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                                     <Navigation className="w-4 h-4 mr-2 text-wedding-600" />
                                     Location & Directions
                                  </h4>
                                  <div className="flex flex-col md:flex-row gap-6">
                                     {business.mapsUrl && (
                                       <div className="flex-shrink-0">
                                          <a 
                                            href={business.mapsUrl} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="inline-flex items-center px-6 py-3 bg-wedding-600 text-white rounded-xl font-bold hover:bg-wedding-700 transition-all shadow-md group"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <MapPin className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                                            Open in Maps
                                            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                                          </a>
                                       </div>
                                     )}
                                     {business.directions && (
                                       <div className="flex-1">
                                          <div className="flex items-start text-sm text-gray-600 italic">
                                             <Info className="w-4 h-4 mr-2 text-gray-300 mt-0.5 flex-shrink-0" />
                                             <span>"{business.directions}"</span>
                                          </div>
                                       </div>
                                     )}
                                  </div>
                               </div>
                             )}

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3 text-sm text-gray-600 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h5 className="font-black text-gray-400 uppercase tracking-widest mb-4">Contact Details</h5>
                                    <div className="flex items-center">
                                        <span className="font-medium mr-2 text-gray-900 w-20">Person:</span>
                                        {business.contactName}
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                        <a href={`mailto:${business.email}`} className="hover:text-wedding-600 transition-colors" onClick={(e) => e.stopPropagation()}>{business.email}</a>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <a href={`tel:${business.phone}`} className="hover:text-wedding-600 transition-colors" onClick={(e) => e.stopPropagation()}>{business.phone}</a>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button 
                                        onClick={(e) => handleDraftInquiry(e, business)}
                                        className="w-full py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors flex items-center justify-center font-bold shadow-xl shadow-gray-200"
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Draft Inquiry with AI
                                    </button>
                                </div>
                             </div>
                          </div>
                      )}

                      {activeTab === 'services' && (
                          <div className="animate-fadeIn">
                             {business.services && business.services.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {business.services.map((service, idx) => {
                                        const lowerName = service.name.toLowerCase();
                                        const isCatering = lowerName.includes('catering');
                                        const isDecoration = lowerName.includes('decoration');
                                        const isFixedPriceService = isCatering || isDecoration;

                                        return (
                                          <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                                              <div className="flex justify-between items-start mb-4">
                                                  <h5 className="font-bold text-gray-800 text-lg">{service.name}</h5>
                                                  <div className="flex flex-col items-end">
                                                     <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: service.currency }).format(service.amount)}
                                                     </span>
                                                     {!isFixedPriceService && (
                                                       <span className="text-[10px] text-gray-400 font-medium mt-1 flex items-center">
                                                          <Clock className="w-3 h-3 mr-1" /> {service.timeCategory}
                                                       </span>
                                                     )}
                                                  </div>
                                              </div>
                                              
                                              {service.menuItems && service.menuItems.length > 0 && (
                                                <div className="mt-2 mb-4 p-3 bg-wedding-50/50 rounded-lg border border-wedding-100">
                                                  <p className="text-[10px] font-black text-wedding-700 uppercase tracking-widest mb-2 flex items-center">
                                                    <Utensils className="w-2.5 h-2.5 mr-1" /> Menu Highlights
                                                  </p>
                                                  <div className="flex flex-wrap gap-2">
                                                    {service.menuItems.map(item => (
                                                      <span key={item.id} className="inline-flex items-center px-2 py-1 bg-white border border-wedding-100 text-[10px] text-wedding-900 rounded-md font-medium shadow-sm">
                                                        <span className="mr-1">{getMenuIcon(item.category)}</span>
                                                        {item.name}
                                                      </span>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}

                                              {service.description && (
                                                  <p className="text-sm text-gray-500 mt-auto pt-2 border-t border-gray-50 italic">"{service.description}"</p>
                                              )}
                                          </div>
                                        );
                                    })}
                                </div>
                             ) : (
                                 <div className="text-center py-8 text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                                     <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                     <p>No specific service packages listed.</p>
                                 </div>
                             )}
                          </div>
                      )}

                      {activeTab === 'gallery' && (
                          <div className="animate-fadeIn">
                             {business.images && business.images.length > 0 ? (
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     {business.images.map((img, idx) => (
                                         <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                             <img src={img} alt={`${business.name} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                                         </div>
                                     ))}
                                      {business.videoUrl && (
                                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center group cursor-pointer border border-gray-200">
                                            <Video className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                                            <div className="absolute bottom-2 text-xs text-white/70 font-medium">Showreel Active</div>
                                        </div>
                                      )}
                                 </div>
                             ) : (
                                <div className="text-center py-8 text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
                                     <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                     <p>No images available in gallery.</p>
                                </div>
                             )}
                          </div>
                      )}
                   </div>

                   <div className="flex justify-center p-2 bg-gray-50 border-t border-gray-200" onClick={(e) => { e.stopPropagation(); toggleExpand(business.id); }}>
                       <ChevronUp className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                   </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {aiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-wedding-50 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-wedding-600" />
                <h3 className="text-xl font-serif font-bold text-gray-800">{aiTitle}</h3>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-wedding-100 border-t-wedding-600"></div>
                  <p className="text-gray-500 animate-pulse font-medium">Generating draft...</p>
                </div>
              ) : (
                <div className="prose prose-pink max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm leading-relaxed shadow-inner">
                    {aiContent}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => setAiModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(aiContent);
                  alert('Draft copied to clipboard!');
                }}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
              >
                Copy Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessList;

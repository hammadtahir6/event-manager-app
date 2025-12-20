import React, { useState } from 'react';
import { Individual, BookingStatus } from '../types';
import { STATUS_COLORS, TIME_SLOTS } from '../constants';
import { Search, Plus, Mail, Sparkles, Edit2, Trash2, MapPin, Filter, Clock, Lightbulb, X, User, Phone, DollarSign, FileText, Calendar, Building2, Music, Gift, Zap } from 'lucide-react';
import { generateEmailDraft, generateEventIdeas, generateUpgradesAndServices, generateEventTimeline, generateEntertainmentSuggestions, generateGiftsAndFavors } from '../services/geminiService';

interface CustomerListProps {
  individuals: Individual[];
  onAddIndividual: () => void;
  onEditIndividual: (individual: Individual) => void;
  onDeleteIndividual: (id: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ individuals, onAddIndividual, onEditIndividual, onDeleteIndividual }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [viewingIndividual, setViewingIndividual] = useState<Individual | null>(null);
  
  // AI State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState('');

  const filteredIndividuals = individuals.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.eventName && c.eventName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleAiEmail = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Draft Email for ${individual.name}`);
    setAiContent('Generating draft...');
    setAiLoading(true);
    setAiModalOpen(true);
    
    // Determine context based on status
    let context = "General follow up";
    if (individual.status === BookingStatus.Inquiry) context = "Thank them for the inquiry and schedule a tour.";
    if (individual.status === BookingStatus.TourScheduled) context = "Confirm tour details and express excitement.";
    if (individual.status === BookingStatus.ContractSent) context = "Follow up on the contract signing process.";
    if (individual.status === BookingStatus.Confirmed) context = "Confirm receipt of payment and start planning next steps.";
    if (individual.status === BookingStatus.Completed) context = "Thank them for choosing us and ask for a review.";

    const draft = await generateEmailDraft(individual, context);
    setAiContent(draft);
    setAiLoading(false);
  };

  const handleAiIdeas = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Event Concepts for ${individual.name}`);
    setAiContent('Brainstorming themes and menus...');
    setAiLoading(true);
    setAiModalOpen(true);

    const ideas = await generateEventIdeas(individual);
    setAiContent(ideas);
    setAiLoading(false);
  };

  const handleAiUpgrades = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Upsell Strategy for ${individual.name}`);
    setAiContent('Analyzing event profile for high-value add-ons...');
    setAiLoading(true);
    setAiModalOpen(true);

    const suggestions = await generateUpgradesAndServices(individual);
    setAiContent(suggestions);
    setAiLoading(false);
  };

  const handleAiGifts = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Gifts & Favor Ideas for ${individual.name}`);
    setAiContent('Curating personalized gift suggestions...');
    setAiLoading(true);
    setAiModalOpen(true);

    const suggestions = await generateGiftsAndFavors(individual);
    setAiContent(suggestions);
    setAiLoading(false);
  };

  const handleAiTimeline = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Proposed Timeline for ${individual.name}`);
    setAiContent('Constructing day-of schedule...');
    setAiLoading(true);
    setAiModalOpen(true);

    const timeline = await generateEventTimeline(individual);
    setAiContent(timeline);
    setAiLoading(false);
  };

  const handleAiEntertainment = async (e: React.MouseEvent, individual: Individual) => {
    e.stopPropagation();
    setAiTitle(`Entertainment Ideas for ${individual.name}`);
    setAiContent('Curating entertainment options...');
    setAiLoading(true);
    setAiModalOpen(true);

    const suggestions = await generateEntertainmentSuggestions(individual);
    setAiContent(suggestions);
    setAiLoading(false);
  };

  const handleEdit = (e: React.MouseEvent | null, individual: Individual) => {
    if (e) e.stopPropagation();
    onEditIndividual(individual);
    setViewingIndividual(null); // Close view modal if open
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteIndividual(id);
  };

  const getTimeLabel = (id?: string) => {
    const slot = TIME_SLOTS.find(s => s.id === id);
    return slot ? slot.label : id || 'TBD';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events, clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-wedding-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={onAddIndividual}
            className="flex items-center px-4 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Event
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              statusFilter === 'All' 
                ? 'bg-gray-800 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {Object.values(BookingStatus).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-wedding-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event / Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Venue</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Due</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredIndividuals.map((individual) => (
                <tr 
                  key={individual.id} 
                  className="hover:bg-wedding-50 transition-colors group cursor-pointer"
                  onClick={() => setViewingIndividual(individual)}
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      {individual.eventName && <span className="font-serif font-bold text-gray-800 mb-1">{individual.eventName}</span>}
                      <span className={`text-sm ${individual.eventName ? 'text-gray-600' : 'font-medium text-gray-900'}`}>{individual.name}</span>
                      <span className="text-xs text-gray-400">{individual.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[individual.status]}`}>
                      {individual.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span>{new Date(individual.weddingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {individual.venue && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {individual.venue}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {individual.dueDate ? (
                       <div className="flex items-center text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded w-fit whitespace-nowrap">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(individual.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                    ) : (
                       <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {individual.guestCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleAiUpgrades(e, individual)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full" 
                        title="AI Service Upgrades & Upsell"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleAiEmail(e, individual)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" 
                        title="Draft Email (AI)"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleAiIdeas(e, individual)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-full" 
                        title="Generate Themes & Menus (AI)"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleAiTimeline(e, individual)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-full" 
                        title="Generate Timeline (AI)"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleEdit(e, individual)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" 
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, individual.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredIndividuals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No individuals found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingIndividual && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <h2 className="text-2xl font-serif font-bold text-gray-800">
                  {viewingIndividual.eventName || viewingIndividual.eventType}
                </h2>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${STATUS_COLORS[viewingIndividual.status]}`}>
                    {viewingIndividual.status}
                  </span>
                  <span className="text-gray-400 text-sm">|</span>
                  <span className="text-gray-500 text-sm">{viewingIndividual.eventType}</span>
                </div>
              </div>
              <button 
                onClick={() => setViewingIndividual(null)}
                className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm border border-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              
              {/* Client Information */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <User className="w-4 h-4 mr-2" /> Client Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Primary Contact</p>
                    <p className="font-medium text-gray-800">{viewingIndividual.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Partner</p>
                    <p className="font-medium text-gray-800">{viewingIndividual.partnerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-gray-400" />
                      <a href={`mailto:${viewingIndividual.email}`} className="text-blue-600 hover:underline">{viewingIndividual.email}</a>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1 text-gray-400" />
                      <a href={`tel:${viewingIndividual.phone}`} className="text-blue-600 hover:underline">{viewingIndividual.phone || 'N/A'}</a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Event Logistics */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" /> Logistics
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium text-gray-800">{new Date(viewingIndividual.weddingDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium text-gray-800">{getTimeLabel(viewingIndividual.eventTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Guest Count</p>
                    <p className="font-medium text-gray-800">{viewingIndividual.guestCount} Guests</p>
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                    <p className="text-xs text-gray-500">Location</p>
                    <div className="flex items-center text-gray-800 font-medium">
                      <MapPin className="w-4 h-4 mr-1 text-wedding-600" />
                      {viewingIndividual.venue ? `${viewingIndividual.venue}, ` : ''} 
                      {viewingIndividual.city}
                      {viewingIndividual.country ? `, ${viewingIndividual.country}` : ''}
                    </div>
                  </div>
                </div>
              </section>

              {/* Financials & Specifics */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" /> Financials
                  </h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase">Estimated Budget</p>
                    <p className="text-2xl font-bold text-green-700">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: viewingIndividual.currency || 'USD' }).format(viewingIndividual.budget || 0)}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" /> Venue
                  </h3>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                     <p className="text-xs text-purple-600 font-bold uppercase">Venue Name</p>
                     <p className="font-bold text-purple-700">{viewingIndividual.venue || 'TBD'}</p>
                  </div>
                </div>
              </section>

              {/* Notes & Preferences */}
              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" /> Preferences / Theme
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 border border-gray-100">
                    {viewingIndividual.preferences || "No specific preferences listed."}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Internal Notes
                  </h3>
                  <div className="bg-yellow-50 p-4 rounded-lg text-sm text-gray-700 border border-yellow-100">
                    {viewingIndividual.notes || "No notes available."}
                  </div>
                </div>
              </section>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button 
                onClick={() => setViewingIndividual(null)}
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => handleEdit(null, viewingIndividual)}
                className="px-6 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 font-medium transition-colors flex items-center shadow-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Result Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-wedding-50 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-wedding-600" />
                <h3 className="text-xl font-serif font-bold text-gray-800">{aiTitle}</h3>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-wedding-600"></div>
                  <p className="text-gray-500 animate-pulse">Consulting the event muse...</p>
                </div>
              ) : (
                <div className="prose prose-pink max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm leading-relaxed">
                    {aiContent}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => setAiModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(aiContent);
                  alert('Copied to clipboard!');
                }}
                disabled={aiLoading}
                className="px-4 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 disabled:opacity-50"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
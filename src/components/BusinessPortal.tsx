
import React, { useState } from 'react';
import Layout from './Layout';
import DashboardStats from './DashboardStats';
import CustomerList from './CustomerList';
import BusinessList from './BusinessList';
import CustomerForm from './CustomerForm';
import CreateEventWizard from './CreateEventWizard';
import BusinessProfileEditor from './BusinessProfileEditor';
import { Individual, View, Business, ActivityLog } from '../types';
import { BookingStatus } from '../types';
import { AlertCircle, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

interface BusinessPortalProps {
  onLogout: () => void;
  userName: string;
  individuals: Individual[];
  businesses: Business[];
  onAddIndividual: () => void;
  onEditIndividual: (individual: Individual) => void;
  onDeleteIndividual: (id: string) => void;
  onSaveIndividual: (individual: Individual) => void;
  onAddBusiness: () => void;
  // Wizard props for adding new events directly
  isWizardOpen: boolean;
  setIsWizardOpen: (open: boolean) => void;
  onSaveNewEvent: (individual: Individual) => void;
  
  // Trial Props
  trialDaysRemaining?: number;
  isPaid?: boolean;
  activities: ActivityLog[];
  onOpenUnlimited: () => void;
  // User context
  userCountry?: string;
  userCategory?: string;
  // Business Profile
  myBusinessProfile: Business;
  onUpdateBusinessProfile: (updated: Business) => void;
  onSendSuggestion: (content: string) => void;
}

const BusinessPortal: React.FC<BusinessPortalProps> = ({
  onLogout,
  userName,
  individuals,
  businesses,
  onAddIndividual,
  onEditIndividual,
  onDeleteIndividual,
  onSaveIndividual,
  onAddBusiness,
  isWizardOpen,
  setIsWizardOpen,
  onSaveNewEvent,
  trialDaysRemaining = 0,
  isPaid = false,
  activities,
  onOpenUnlimited,
  userCountry,
  userCategory,
  myBusinessProfile,
  onUpdateBusinessProfile,
  onSendSuggestion
}) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndividual, setEditingIndividual] = useState<Individual | undefined>(undefined);
  
  const [suggestionText, setSuggestionText] = useState('');
  const [showSuggestionAlert, setShowSuggestionAlert] = useState(false);

  const handleEditWrapper = (individual: Individual) => {
    setEditingIndividual(individual);
    setIsFormOpen(true);
  };

  const handleSaveWrapper = (individual: Individual) => {
    onSaveIndividual(individual);
    setIsFormOpen(false);
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;
    onSendSuggestion(suggestionText);
    setSuggestionText('');
    setShowSuggestionAlert(true);
    setTimeout(() => setShowSuggestionAlert(false), 3000);
  };

  // Filter for specific "Inquiries" view
  const inquiryIndividuals = individuals.filter(i => i.status === BookingStatus.Inquiry);

  const showTrialBanner = !isPaid && trialDaysRemaining >= 0;

  // Profile completion check
  const isProfileIncomplete = !myBusinessProfile.description || !myBusinessProfile.services?.length || !myBusinessProfile.images?.length;

  const businessContext = {
      name: myBusinessProfile.name,
      category: myBusinessProfile.category || userCategory || 'Venue',
      city: myBusinessProfile.city || userCountry || 'United States'
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Trial Banner */}
      {showTrialBanner && (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white text-sm py-2 px-4 text-center z-50 flex items-center justify-center shadow-md">
           <AlertCircle 
                className="w-4 h-4 mr-2 text-yellow-400 cursor-pointer hover:scale-110" 
                onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
           />
           <span className="font-medium">
             Free Trial Active: <span className="text-yellow-400 font-bold">{trialDaysRemaining} days remaining</span>. 
             Upgrade anytime to unlock full features.
           </span>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Layout 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          onLogout={onLogout}
          userName={userName}
          onOpenUnlimited={onOpenUnlimited}
          role="business"
        >
          {currentView === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
                <DashboardStats 
                    individuals={individuals} 
                    activities={activities} 
                    onOpenUnlimited={onOpenUnlimited}
                    businessContext={businessContext}
                    isProfileIncomplete={isProfileIncomplete}
                    onGoToProfile={() => setCurrentView('profile')}
                />
                
                {/* Admin Suggestion Box for Business */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 bg-wedding-50 rounded-xl text-wedding-600">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-bold text-gray-800">Admin Suggestion Box</h3>
                            <p className="text-gray-500 text-sm">Help us build the perfect platform for your venue business.</p>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                        <textarea
                            value={suggestionText}
                            onChange={(e) => setSuggestionText(e.target.value)}
                            placeholder="Share your feature requests or improvements with our development team..."
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none resize-none transition-all h-32 text-sm leading-relaxed"
                            required
                        />
                        <div className="flex items-center justify-between">
                            {showSuggestionAlert ? (
                                <span className="text-sm text-green-600 font-bold flex items-center animate-bounce">
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                    Suggestion received. Thank you!
                                </span>
                            ) : <div></div>}
                            <button 
                                type="submit" 
                                className="px-8 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-all flex items-center"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Submit to Admin
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          )}

          {currentView === 'individuals' && (
            <CustomerList 
              individuals={individuals} 
              onAddIndividual={onAddIndividual}
              onEditIndividual={handleEditWrapper}
              onDeleteIndividual={onDeleteIndividual}
            />
          )}

          {/* Dedicated Inquiries View for Business */}
          {currentView === 'inquiries' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-gray-800">New Inquiries</h2>
              <p className="text-gray-500">Manage incoming requests from potential clients.</p>
              <CustomerList 
                individuals={inquiryIndividuals} 
                onAddIndividual={onAddIndividual}
                onEditIndividual={handleEditWrapper}
                onDeleteIndividual={onDeleteIndividual}
              />
            </div>
          )}

          {currentView === 'businesses' && (
            <BusinessList 
              businesses={businesses} 
              onAddBusiness={onAddBusiness} 
            />
          )}

          {currentView === 'profile' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-800">Manage Business Profile</h2>
                  <p className="text-gray-500">Add pictures, services, and pricing to help clients find you.</p>
                </div>
              </div>
              <BusinessProfileEditor 
                business={myBusinessProfile} 
                onSave={onUpdateBusinessProfile} 
              />
            </div>
          )}

          <CustomerForm 
            isOpen={isFormOpen}
            initialData={editingIndividual}
            onSave={handleSaveWrapper}
            onCancel={() => setIsFormOpen(false)}
            existingEvents={individuals}
          />

          <CreateEventWizard 
            isOpen={isWizardOpen}
            onSave={onSaveNewEvent}
            onCancel={() => setIsWizardOpen(false)}
            existingEvents={individuals}
          />
        </Layout>
      </div>
    </div>
  );
};

export default BusinessPortal;

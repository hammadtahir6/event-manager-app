import React, { useState, useEffect } from 'react';
import CustomerPortal from './components/CustomerPortal';
import BusinessPortal from './components/BusinessPortal';
import OwnerPortal from './components/OwnerPortal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import LandingPage from './components/LandingPage';
import CreateEventWizard from './components/CreateEventWizard';
import BillingModal from './components/BillingModal';
import UnlimitedSolutions from './components/UnlimitedSolutions';
import { MOCK_INDIVIDUALS, MOCK_BUSINESSES, COUNTRIES_CURRENCIES } from './constants';
import { Individual, Business, UserProfile, VendorInquiry, ActivityLog, Transaction, Suggestion } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // --- LOCAL STORAGE DATA ---
  // We use this to simulate a database for the demo
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('eventManager_users');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('eventManager_users', JSON.stringify(users));
  }, [users]);

  const [individuals, setIndividuals] = useState<Individual[]>(() => {
    try {
      const saved = localStorage.getItem('eventManager_individuals');
      return saved ? JSON.parse(saved) : MOCK_INDIVIDUALS;
    } catch { return MOCK_INDIVIDUALS; }
  });

  useEffect(() => {
    localStorage.setItem('eventManager_individuals', JSON.stringify(individuals));
  }, [individuals]);

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const saved = localStorage.getItem('eventManager_businesses');
      return saved ? JSON.parse(saved) : MOCK_BUSINESSES;
    } catch { return MOCK_BUSINESSES; }
  });

  useEffect(() => {
    localStorage.setItem('eventManager_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // ... (Keep existing state for suggestions, activities, etc.) ...
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => {
    try { return JSON.parse(localStorage.getItem('eventManager_suggestions') || '[]'); } catch { return []; }
  });
  useEffect(() => localStorage.setItem('eventManager_suggestions', JSON.stringify(suggestions)), [suggestions]);

  const [myBusinessProfile, setMyBusinessProfile] = useState<Business | null>(null);
  const [vendorInquiries, setVendorInquiries] = useState<VendorInquiry[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [portalActiveTab, setPortalActiveTab] = useState<'overview' | 'vendors' | 'gallery' | 'events'>('overview');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [pendingWizardAction, setPendingWizardAction] = useState(false); 
  const [showUnlimited, setShowUnlimited] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState(15); 

  // Helper to Log Activity
  const logActivity = (
    actionType: ActivityLog['actionType'],
    description: string,
    overrideUser?: { name: string; email: string; role: 'business' | 'individual' | 'owner' }
  ) => {
    const user = overrideUser || currentUser;
    if (!user) return;
    const newActivity: ActivityLog = {
      id: crypto.randomUUID(),
      userId: user.email,
      userName: user.name,
      userRole: user.role,
      actionType,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev]);
  };

  useEffect(() => {
    if (currentUser?.role === 'business') {
      const profile = businesses.find(b => b.email === currentUser.email);
      if (profile) {
        setMyBusinessProfile(profile);
      } else {
        const newProfile: Business = {
          id: crypto.randomUUID(),
          name: currentUser.name,
          category: currentUser.businessCategory || 'Hall Services',
          contactPerson: currentUser.name,
          email: currentUser.email,
          phone: '',
          rating: 0,
          reviews: 0,
          status: 'Active',
          joinedDate: new Date().toISOString(),
          verified: false,
          address: currentUser.country,
          imageUrl: '',
          gallery: [],
          description: '',
          services: []
        };
        setMyBusinessProfile(newProfile);
        setBusinesses(prev => [...prev, newProfile]);
      }

      if (!currentUser.isPaid) {
        const created = new Date(currentUser.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - created.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const remaining = 15 - diffDays; 
        setTrialDaysRemaining(remaining);
        if (remaining <= 0) setIsBillingModalOpen(true);
      }
    } else {
      setMyBusinessProfile(null);
    }
  }, [currentUser, businesses]);

  const handleOpenUnlimited = () => setShowUnlimited(true);

  // --- MOCK AUTH HANDLERS (No Backend Required) ---
  
  const handleLogin = (role: 'business' | 'individual' | 'owner', identifier: string) => {
    setPortalActiveTab('overview');
    
    // Admin Login Logic
    if (identifier.toLowerCase() === 'admin@eventmanager.com') {
      const ownerUser: UserProfile = {
        name: 'Super Admin',
        email: 'admin@eventmanager.com',
        role: 'owner',
        country: 'United States',
        currency: 'USD',
        createdAt: new Date().toISOString(),
        isPaid: true
      };
      setCurrentUser(ownerUser);
      logActivity('login', 'Owner Access Granted', ownerUser);
      setShowLanding(false);
      return;
    }

    // Check Local Storage Users
    const existingUser = users.find(u => u.email.toLowerCase() === identifier.toLowerCase());
    
    if (existingUser) {
        // Enforce Role Match (Client requirement: strict login)
        if (existingUser.role !== role) {
            alert(`This email is registered as a ${existingUser.role}. Please switch tabs.`);
            return;
        }
        setCurrentUser(existingUser);
        logActivity('login', 'Logged in successfully', existingUser);
        setShowLanding(false);
    } else {
        alert('User not found. Please sign up first.');
    }
  };

  const handleSignup = (role: 'business' | 'individual', name: string, identifier: string, country: string, businessType?: string) => {
    setPortalActiveTab('overview');
    
    const exists = users.find(u => u.email.toLowerCase() === identifier.toLowerCase());
    if (exists) {
        alert('User already exists! Please login.');
        setAuthView('login');
        return;
    }

    const selectedCurrency = COUNTRIES_CURRENCIES.find(c => c.country === country)?.currency || 'USD';
    const newUser: UserProfile = { 
      name, 
      email: identifier, 
      role, 
      country,
      currency: selectedCurrency,
      businessCategory: businessType,
      createdAt: new Date().toISOString(), 
      isPaid: false 
    };
    
    // Save to Local Storage
    setUsers(prev => [...prev, newUser]);
    
    // Auto Login
    setCurrentUser(newUser);
    logActivity('signup' as any, `Created account from ${country}`, newUser);
    setShowLanding(false); 
  };

  const handleLogout = () => {
    if (currentUser) logActivity('login', 'Logged out');
    setCurrentUser(null);
    setShowLanding(true);
    setPortalActiveTab('overview');
    setIsBillingModalOpen(false);
  };

  // ... (Other handlers like UpdateBusinessProfile, SaveIndividual, etc. remain the same) ...
  const handleUpdateBusinessProfile = (updated: Business) => {
    setBusinesses(prev => prev.map(b => b.id === updated.id ? updated : b));
    setMyBusinessProfile(updated);
    logActivity('update', `Updated business profile: ${updated.name}`);
  };

  const handleSaveNewEvent = (individual: Individual) => {
    setIndividuals(prev => [individual, ...prev]);
    logActivity('create', `Created new event: ${individual.eventName || individual.eventType}`);
    setIsWizardOpen(false);
    setPortalActiveTab('overview'); 
    if (currentUser?.role === 'individual' && currentUser.isPaid) {
       // Optional: Reset paid status if it was a one-time fee, or keep it if subscription
    }
  };

  const handleSaveIndividual = (individual: Individual) => {
    setIndividuals(prev => {
      const exists = prev.find(c => c.id === individual.id);
      if (exists) return prev.map(c => c.id === individual.id ? individual : c);
      return [individual, ...prev];
    });
    logActivity('update', `Updated event details: ${individual.eventName || individual.eventType}`);
  };

  const handleDeleteIndividual = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const event = individuals.find(i => i.id === id);
      setIndividuals(prev => prev.filter(c => c.id !== id));
      if (event) logActivity('delete', `Deleted event: ${event.eventName || event.eventType}`);
    }
  };

  const handleAddBusiness = () => {
    alert('Add Business functionality coming soon!');
    logActivity('other', 'Attempted to add business');
  };

  const handleSendVendorInquiry = (inquiry: VendorInquiry) => {
    setVendorInquiries(prev => [...prev, inquiry]);
    logActivity('inquiry', `Sent inquiry to ${inquiry.businessName}`);
  };

  const handleIndividualAddEventRequest = () => {
    if (!currentUser) return;
    const userEvents = individuals.filter(i => i.email === currentUser.email);
    
    // TRIAL LIMIT: 1 Event for Free Users
    if (userEvents.length >= 1 && !currentUser.isPaid) {
      setPendingWizardAction(true);
      setIsBillingModalOpen(true);
    } else {
      setIsWizardOpen(true);
    }
  };

  const handlePaymentSuccess = (amount: number, currency: string) => {
    if (currentUser) {
      // Update User Paid Status in Local Storage too!
      const updatedUser = { ...currentUser, isPaid: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.email === currentUser.email ? updatedUser : u));

      logActivity('payment', `Processed payment of ${currency} ${amount}`);
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        userId: currentUser.email,
        userName: currentUser.name,
        userRole: currentUser.role as 'business' | 'individual',
        amount: amount,
        currency: currency,
        timestamp: new Date().toISOString(),
        description: currentUser.role === 'business' ? 'Monthly Subscription' : 'Event Inquiry Fee'
      };
      setTransactions(prev => [newTransaction, ...prev]);
      setIsBillingModalOpen(false);
      if (pendingWizardAction) {
        setIsWizardOpen(true);
        setPendingWizardAction(false);
      }
    }
  };

  const handleBillingClose = () => {
    setIsBillingModalOpen(false);
    setPendingWizardAction(false);
  };

  const handleSendSuggestion = (content: string) => {
    if (!currentUser) return;
    const newSuggestion: Suggestion = {
      id: crypto.randomUUID(),
      userId: currentUser.email,
      userName: currentUser.name,
      userRole: currentUser.role as 'business' | 'individual',
      content,
      timestamp: new Date().toISOString(),
      status: 'new'
    };
    setSuggestions(prev => [newSuggestion, ...prev]);
    logActivity('other', `Submitted a suggestion: ${content.slice(0, 30)}...`);
  };

  const handleUpdateSuggestionStatus = (id: string, status: 'new' | 'reviewed') => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const filterUserEvents = (userId: string) => {
      return individuals.filter(i => i.email.toLowerCase() === userId.toLowerCase() || i.phone === userId);
  };

  return (
    <LanguageProvider>
      <UnlimitedSolutions isOpen={showUnlimited} onClose={() => setShowUnlimited(false)} />
      
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} onOpenUnlimited={handleOpenUnlimited} />
      ) : !currentUser ? (
        authView === 'login' 
          ? <LoginPage onLogin={handleLogin} onNavigateToSignup={() => setAuthView('signup')} onOpenUnlimited={handleOpenUnlimited} />
          : <SignupPage onSignup={handleSignup} onNavigateToLogin={() => setAuthView('login')} onOpenUnlimited={handleOpenUnlimited} />
      ) : currentUser.role === 'owner' ? (
        <OwnerPortal
          onLogout={handleLogout}
          userName={currentUser.name}
          activities={activities}
          transactions={transactions}
          suggestions={suggestions}
          onUpdateSuggestionStatus={handleUpdateSuggestionStatus}
          usersCount={users.length}
          onOpenUnlimited={handleOpenUnlimited}
        />
      ) : currentUser.role === 'individual' ? (
        <>
          <CustomerPortal 
            onLogout={handleLogout} 
            userName={currentUser.name}
            onAddEvent={handleIndividualAddEventRequest} 
            events={filterUserEvents(currentUser.email)}
            onUpdateEvent={handleSaveIndividual}
            onDeleteEvent={handleDeleteIndividual}
            activeTab={portalActiveTab}
            setActiveTab={setPortalActiveTab}
            vendorInquiries={vendorInquiries}
            onSendVendorInquiry={handleSendVendorInquiry}
            activities={activities.filter(a => a.userId === currentUser.email)}
            onOpenUnlimited={handleOpenUnlimited}
            onSendSuggestion={handleSendSuggestion}
          />
          <CreateEventWizard 
            isOpen={isWizardOpen}
            onSave={handleSaveNewEvent}
            onCancel={() => setIsWizardOpen(false)}
            initialEmail={currentUser.email}
            initialPhone=""
            existingEvents={individuals}
          />
          <BillingModal 
            isOpen={isBillingModalOpen}
            role="individual"
            onClose={handleBillingClose}
            onSuccess={handlePaymentSuccess}
            initialCountry={currentUser.country}
          />
        </>
      ) : (
        <>
          {myBusinessProfile && (
            <BusinessPortal 
              onLogout={handleLogout}
              userName={currentUser.name}
              individuals={individuals}
              businesses={businesses}
              onAddIndividual={() => setIsWizardOpen(true)}
              onEditIndividual={() => {}} 
              onDeleteIndividual={handleDeleteIndividual}
              onSaveIndividual={handleSaveIndividual}
              onAddBusiness={handleAddBusiness}
              isWizardOpen={isWizardOpen}
              setIsWizardOpen={setIsWizardOpen}
              onSaveNewEvent={handleSaveNewEvent}
              trialDaysRemaining={trialDaysRemaining}
              isPaid={currentUser.isPaid}
              activities={activities.filter(a => a.userId === currentUser.email)}
              onOpenUnlimited={handleOpenUnlimited}
              userCountry={currentUser.country}
              userCategory={currentUser.businessCategory}
              myBusinessProfile={myBusinessProfile}
              onUpdateBusinessProfile={handleUpdateBusinessProfile}
              onSendSuggestion={handleSendSuggestion}
            />
          )}
          <BillingModal 
              isOpen={isBillingModalOpen}
              role="business"
              onClose={handleBillingClose}
              onSuccess={handlePaymentSuccess}
              initialCountry={currentUser.country}
          />
        </>
      )}
    </LanguageProvider>
  );
};

const App: React.FC = () => {
  return (
    <AppContent />
  );
};

export default App;
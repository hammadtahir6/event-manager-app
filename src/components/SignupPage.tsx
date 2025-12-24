import React, { useState } from 'react';
import { Building2, Users, ArrowRight, Phone, Mail, Globe, ChevronDown, Briefcase, Smartphone } from 'lucide-react';
import PolicyModal from './PolicyModal';
import Logo from './Logo';
import { COUNTRIES_CURRENCIES, BUSINESS_CATEGORIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface SignupPageProps {
  onSignup: (role: 'business' | 'individual', name: string, identifier: string, country: string, businessType?: string) => void;
  onNavigateToLogin: () => void;
  onOpenUnlimited: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onNavigateToLogin, onOpenUnlimited }) => {
  const [activeTab, setActiveTab] = useState<'business' | 'individual'>('business');
  const [signupMethod, setSignupMethod] = useState<'email' | 'mobile'>('email');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [selectedDialCode, setSelectedDialCode] = useState('+1');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('United States');
  const [businessType, setBusinessType] = useState(BUSINESS_CATEGORIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();
  
  const [agreed, setAgreed] = useState(false);
  const [policyType, setPolicyType] = useState<'privacy' | 'terms' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setIsLoading(true);

    // 1. Construct Full Identifier
    const fullIdentifier = signupMethod === 'email' 
      ? identifier 
      : `${selectedDialCode}${identifier.replace(/\D/g, '')}`;

    try {
      // 2. Call the Real Backend API
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: fullIdentifier, // Sending as 'email' to match backend schema
          password: password,
          role: activeTab,
          country: country,
          // Sending businessType if it's a business user (backend might need to be updated to store this if not already)
          businessType: activeTab === 'business' ? businessType : undefined 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. Success Logic
        alert('Account created successfully! Please log in.');
        onNavigateToLogin();
      } else {
        // 4. Handle Server Errors (e.g., "User already exists")
        alert(data.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      // 5. Handle Network Errors
      console.error('Signup error:', error);
      alert('Network error. Is the backend server running on port 5000?');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMethod = () => {
    setSignupMethod(prev => prev === 'email' ? 'mobile' : 'email');
    setIdentifier('');
  };

  return (
    <div className="min-h-screen bg-wedding-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <PolicyModal 
        isOpen={!!policyType} 
        type={policyType} 
        onClose={() => setPolicyType(null)} 
      />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-wedding-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-white/50 backdrop-blur-sm">
        <div className="p-8 pb-6 text-center">
          <div className="flex justify-center mb-6">
            <div 
                className="w-14 h-14 bg-wedding-100 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-wedding-200 transition-colors shadow-sm"
                onClick={onOpenUnlimited}
            >
              <div className="text-wedding-600">
                  <Logo className="w-8 h-8" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-1">
            {activeTab === 'business' ? t('signup.title.business') : t('signup.title.individual')}
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Join Event Manager Today</p>
        </div>

        <div className="px-8 mb-4">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('business')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'business' ? 'bg-white text-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              {t('login.business')}
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 flex items-center justify-center py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'individual' ? 'bg-white text-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4 mr-2" />
              {t('login.individual')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
          <div className="space-y-3.5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('signup.country')}</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    const selected = COUNTRIES_CURRENCIES.find(c => c.country === e.target.value);
                    if (selected) setSelectedDialCode(selected.dialCode);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none appearance-none cursor-pointer transition-all text-sm"
                >
                  {COUNTRIES_CURRENCIES.map(c => (
                    <option key={c.country} value={c.country}>{c.country}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                {activeTab === 'business' ? t('signup.businessName') : t('signup.fullName')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none transition-all text-sm"
                placeholder={activeTab === 'business' ? "Grand Venue Hall" : "Jane Doe"}
              />
            </div>

            {activeTab === 'business' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('signup.businessType')}</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none appearance-none text-sm cursor-pointer"
                  >
                    {BUSINESS_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">
                  {signupMethod === 'email' ? t('login.email') : 'Mobile Number'}
                </label>
                <button 
                  type="button" 
                  onClick={toggleMethod}
                  className="text-[9px] font-black text-wedding-600 uppercase tracking-widest hover:text-wedding-700 transition-colors"
                >
                  {signupMethod === 'email' ? 'Switch to Mobile' : 'Switch to Email'}
                </button>
              </div>
              <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-wedding-500 transition-all bg-gray-50">
                {signupMethod === 'mobile' && (
                  <div className="relative border-r border-gray-200 bg-white px-2 flex items-center">
                    <select
                      value={selectedDialCode}
                      onChange={(e) => setSelectedDialCode(e.target.value)}
                      className="bg-transparent outline-none appearance-none text-xs font-bold cursor-pointer"
                    >
                      {COUNTRIES_CURRENCIES.map(c => (
                        <option key={c.country} value={c.dialCode}>
                          {c.flag} {c.dialCode}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {signupMethod === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <input
                    type={signupMethod === 'email' ? 'email' : 'tel'}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-transparent outline-none text-sm"
                    placeholder={signupMethod === 'email' ? "email@example.com" : "123 456 7890"}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">{t('login.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="flex items-start pt-1">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-wedding-600 border-gray-300 rounded focus:ring-wedding-500 cursor-pointer"
              />
            </div>
            <div className="ml-3 text-xs leading-relaxed text-gray-500">
              <label htmlFor="terms">
                {t('signup.agree')}{' '}
                <button type="button" onClick={() => setPolicyType('terms')} className="font-black text-wedding-600 hover:underline">{t('signup.terms')}</button>{' '}
                {t('signup.and')}{' '}
                <button type="button" onClick={() => setPolicyType('privacy')} className="font-black text-wedding-600 hover:underline">{t('signup.privacy')}</button>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !agreed}
            className="w-full bg-wedding-600 hover:bg-wedding-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-wedding-100 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed group transform active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('signup.create')}</span>
                <ArrowRight className={`w-4 h-4 transition-transform ${language === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-gray-500">{t('signup.alreadyAccount')} </span>
            <button 
              type="button" 
              onClick={onNavigateToLogin}
              className="text-sm font-black text-wedding-600 hover:text-wedding-700 transition-colors uppercase tracking-tight"
            >
              {t('signup.signIn')}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
        &copy; 2024 {t('app.name')} • Infinite Scale
      </p>
    </div>
  );
};

export default SignupPage;
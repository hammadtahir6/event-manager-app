import React, { useState } from 'react';
import { Building2, Users, ArrowRight, Mail } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onLogin: (role: 'business' | 'individual' | 'owner', identifier: string) => void;
  onNavigateToSignup: () => void;
  onOpenUnlimited: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup, onOpenUnlimited }) => {
  const [activeTab, setActiveTab] = useState<'business' | 'individual'>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // REPLACE THIS URL WITH YOUR RAILWAY/RENDER URL AFTER DEPLOYMENT
      // Example: const API_URL = 'https://event-manager-backend.up.railway.app';
      const API_URL = 'event-manager-backend-production-1db4.up.railway.app'; 
      
      console.log(`Attempting login to: ${API_URL}/api/login`);

      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        onLogin(data.user.role, data.user.email);
      } else {
        console.error('Login failed:', data.error);
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Network error during login:', error);
      alert('Network error. Please make sure the backend server is running and accessible.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-wedding-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-wedding-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl z-10 overflow-hidden border border-white/50 backdrop-blur-sm">
        <div className="p-8 pb-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-wedding-100 rounded-2xl flex items-center justify-center cursor-pointer hover:rotate-3 transition-transform shadow-sm" onClick={onOpenUnlimited}>
              <div className="text-wedding-600"><Logo className="w-8 h-8" /></div>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tighter text-gray-800 mb-2">{t('login.title')}</h1>
          <p className="text-gray-500 text-sm italic">Unlock your dream celebration</p>
        </div>

        <div className="px-8 mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('business')} className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'business' ? 'bg-white text-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Building2 className="w-4 h-4 mr-2" /> {t('login.business')}
            </button>
            <button onClick={() => setActiveTab('individual')} className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'individual' ? 'bg-white text-wedding-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Users className="w-4 h-4 mr-2" /> {t('login.individual')}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('login.email')}</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-wedding-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none text-sm"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('login.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-wedding-500 outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-wedding-600 hover:bg-wedding-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-wedding-100 hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group">
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <><span>{activeTab === 'business' ? t('login.signin') : t('login.access')}</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <div className="text-center pt-2">
            <span className="text-sm text-gray-500">{t('login.noAccount')} </span>
            <button type="button" onClick={onNavigateToSignup} className="text-sm font-black text-wedding-600 hover:text-wedding-700 transition-colors uppercase tracking-tight">{t('button.signup')}</button>
          </div>
        </form>
      </div>
      <p className="mt-8 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">&copy; 2024 {t('app.name')} • Orchestrate Magic</p>
    </div>
  );
};

export default LoginPage;
import React, { ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, Building2, MessageSquare, ChevronDown, CheckCircle2, UserCircle } from 'lucide-react';
import { View } from '../types';
import Logo from './Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LayoutProps {
  children: ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout?: () => void;
  userName?: string;
  onOpenUnlimited: () => void;
  role?: 'business' | 'individual' | 'owner';
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, onLogout, userName, onOpenUnlimited, role }) => {
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'inquiries', label: t('nav.inquiries'), icon: MessageSquare },
    { id: 'individuals', label: t('nav.bookings'), icon: Users },
    { id: 'businesses', label: t('nav.vendors'), icon: Building2 },
  ];

  // Add Profile link for business users in sidebar
  if (role === 'business') {
    navItems.push({ id: 'profile', label: 'My Profile', icon: UserCircle });
  }

  return (
    <div className="flex h-screen bg-wedding-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col z-10 hidden md:flex">
        <div className="p-6 border-b border-wedding-100 flex items-center justify-center cursor-pointer" onClick={onOpenUnlimited}>
          <div className="mr-2 text-wedding-600 hover:scale-110 transition-transform">
             <Logo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-serif font-black tracking-tighter text-gray-800 truncate">{t('app.name')}</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-wedding-50 text-wedding-700 font-semibold shadow-sm ring-1 ring-wedding-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-wedding-600'
                }`}
              >
                <item.icon 
                   className={`w-5 h-5 mr-3 transition-transform ${language === 'ar' ? 'ml-3 mr-0' : 'mr-3'} ${isActive ? 'text-wedding-600' : 'text-gray-400'}`} 
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-wedding-100 space-y-2">
          {/* Language Selector in Sidebar */}
          <div className="relative group">
            <button className="w-full flex items-center justify-between p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
               <span className="flex items-center">
                 <span className="mr-2">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}</span>
                 <span className="text-sm truncate max-w-[100px]">{SUPPORTED_LANGUAGES.find(l => l.code === language)?.name}</span>
               </span>
               <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            <div className="absolute bottom-full left-0 mb-2 w-full max-h-60 overflow-y-auto bg-white rounded-lg shadow-xl border border-gray-100 hidden group-hover:block z-50">
                {SUPPORTED_LANGUAGES.map(lang => (
                   <button
                     key={lang.code}
                     onClick={() => setLanguage(lang.code)}
                     className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${language === lang.code ? 'bg-wedding-50 text-wedding-700 font-bold' : 'text-gray-700'}`}
                   >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {language === lang.code && <CheckCircle2 className="w-3 h-3" />}
                   </button>
                 ))}
            </div>
          </div>

          <button className="w-full flex items-center p-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors">
            <Settings 
                className={`w-5 h-5 ${language === 'ar' ? 'ml-3 mr-0' : 'mr-3'}`} 
            />
            {t('nav.settings')}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center p-3 text-gray-600 hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut 
                className={`w-5 h-5 ${language === 'ar' ? 'ml-3 mr-0' : 'mr-3'}`} 
            />
            {t('nav.logout')}
          </button>
        </div>

        <div className="p-4 text-center text-[10px] text-gray-400 bg-gray-50 border-t border-gray-100">
          &copy; {new Date().getFullYear()} {t('app.name')}<br/>All rights reserved.
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-20 flex justify-between items-center md:hidden">
          <div className="flex items-center" onClick={onOpenUnlimited}>
            <div className="text-wedding-600 mr-2">
              <Logo className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-serif font-black tracking-tighter text-gray-800">{t('app.name')}</h1>
          </div>
          <button onClick={onLogout} className="text-gray-500">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Desktop Header */}
        <header className="bg-white shadow-sm p-6 sticky top-0 z-10 hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-2xl font-serif text-gray-800 capitalize">
               {navItems.find(i => i.id === currentView)?.label || currentView}
            </h2>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-500">{t('dashboard.welcome')}, {userName || 'Manager'}</span>
              
              {/* Avatar Dropdown */}
              <div className="relative group">
                <div 
                    className="w-10 h-10 rounded-full bg-wedding-200 flex items-center justify-center text-wedding-700 font-bold border-2 border-white shadow-md cursor-pointer hover:ring-2 hover:ring-wedding-400"
                >
                  {userName ? userName.charAt(0).toUpperCase() : 'M'}
                </div>
                {/* Profile Options Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 hidden group-hover:block z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Settings</p>
                    </div>
                    {role === 'business' && (
                        <button 
                            onClick={() => setCurrentView('profile')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-wedding-50 flex items-center"
                        >
                            <UserCircle className="w-4 h-4 mr-2 text-wedding-600" />
                            Business Profile
                        </button>
                    )}
                    <button 
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                    <div className="px-4 py-2 mt-2 pt-2 border-t border-gray-50">
                        <button onClick={onOpenUnlimited} className="flex items-center text-[10px] font-bold text-gray-400 hover:text-wedding-600 uppercase tracking-tighter">
                            Upgrade to Unlimited
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Nav */}
        <nav className="md:hidden flex overflow-x-auto bg-white border-b border-gray-100 p-2 space-x-2">
           {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                   isActive ? 'bg-wedding-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>

        <footer className="md:hidden p-4 text-center text-xs text-gray-400 border-t border-gray-200 bg-white">
          &copy; {new Date().getFullYear()} {t('app.name')}. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Layout;
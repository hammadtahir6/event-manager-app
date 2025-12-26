import React, { useState } from 'react';
import { ArrowRight, Building2, Users, Share2, Sparkles, CheckCircle2, Shield, Calendar, Heart, Globe, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { COUNTRIES_CURRENCIES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, Language } from '../i18n/translations';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenUnlimited: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onOpenUnlimited }) => {
  const [pricingCountry, setPricingCountry] = useState('United States');
  const { t, language, setLanguage } = useLanguage();
  
  const selectedCurrencyConfig = COUNTRIES_CURRENCIES.find(c => c.country === pricingCountry) || COUNTRIES_CURRENCIES.find(c => c.country === 'United States')!;

  const getPrice = (type: 'individual' | 'business') => {
    if (type === 'individual') {
        if (selectedCurrencyConfig.fixedIndividual !== undefined) return selectedCurrencyConfig.fixedIndividual;
        return (5 * selectedCurrencyConfig.rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    } else {
        if (selectedCurrencyConfig.fixedBusiness !== undefined) return selectedCurrencyConfig.fixedBusiness;
        return (40 * selectedCurrencyConfig.rate).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Manager',
          text: 'Check out Event Manager - The perfect platform linking professional Event Businesses with Individuals.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-wedding-100 selection:text-wedding-900">
      
      {/* HERO SECTION */}
      <header className="relative min-h-[90vh] flex flex-col overflow-hidden bg-wedding-50">
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
           <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-wedding-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
           <div className="absolute top-1/3 -left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        </div>

        {/* Navbar */}
        <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-2 group cursor-pointer" onClick={onOpenUnlimited}>
            <div className="text-wedding-600 group-hover:scale-110 transition-transform">
               <Logo className="w-8 h-8" />
            </div>
            <span className="text-3xl font-serif font-black tracking-tighter text-gray-900">{t('app.name')}</span>
          </div>
          <div className="flex items-center space-x-4">
            
            {/* Language Selector */}
            <div className="relative group z-50">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-wedding-500 transition-colors p-2">
                 <span>{SUPPORTED_LANGUAGES.find(l => l.code === language)?.flag}</span>
                 <span className="text-sm font-medium uppercase">{language}</span>
                 <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block animate-fadeIn z-50">
                 {SUPPORTED_LANGUAGES.map(lang => (
                   <button
                     key={lang.code}
                     onClick={() => setLanguage(lang.code)}
                     className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between ${language === lang.code ? 'bg-wedding-50 text-wedding-700 font-bold' : 'text-gray-700'}`}
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

             <button 
              onClick={handleShare}
              className="text-gray-600 hover:text-wedding-500 transition-colors p-2"
              title="Share App"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onGetStarted}
              className="text-gray-600 font-medium hover:text-wedding-500 transition-colors"
            >
              {t('button.login')}
            </button>
          </div>
        </nav>

        {/* Hero Main Content */}
        <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-5xl mx-auto w-full">
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight text-gray-900 transition-colors duration-500">
            {t('landing.hero.title.part1')} <span className="text-wedding-600">{t('landing.hero.title.part2')}</span> {t('landing.hero.title.part3')} <span className="text-purple-600">{t('landing.hero.title.part4')}</span>.
          </h1>
          
          <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed text-gray-600 transition-colors duration-500">
            {t('landing.subtitle')}
          </p>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onGetStarted}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 font-serif rounded-full hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wedding-600 shadow-xl bg-wedding-600 hover:bg-wedding-700 shadow-wedding-200"
            >
              <span>{t('button.getStarted')}</span>
              <ArrowRight className={`ml-2 w-5 h-5 transition-transform ${language === 'ar' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
            </button>
          </div>
        </div>
      </header>

       {/* PRICING SECTION - Moved to Top */}
       <section className="py-24 bg-white px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-8">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Simple Pricing in Your Local Currency</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Transparent fees. No hidden costs. Pay in {selectedCurrencyConfig.currency}.</p>
          </div>

          {/* Currency Selector */}
          <div className="flex justify-center mb-12">
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-wedding-500 transition-colors" />
              <select
                value={pricingCountry}
                onChange={(e) => setPricingCountry(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-gray-700 focus:ring-2 focus:ring-wedding-500 outline-none appearance-none cursor-pointer hover:border-wedding-300 transition-all shadow-sm"
              >
                {COUNTRIES_CURRENCIES.map(c => (
                  <option key={c.country} value={c.country}>{c.country} ({c.currency})</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:border-wedding-200 transition-colors relative overflow-hidden transform hover:-translate-y-1 duration-300">
               <div className="absolute top-0 right-0 bg-wedding-100 text-wedding-700 text-xs font-bold px-3 py-1 rounded-bl-lg">
                 POPULAR
               </div>
               <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Individual Planner</h3>
               <p className="text-gray-500 mb-6">For couples and party planners.</p>
               
               <div className="mb-6">
                   <div className="flex items-center text-green-600 font-bold text-sm mb-2">
                       <CheckCircle2 className="w-4 h-4 mr-1" />
                       <span>Inquiries are free with limited access</span>
                   </div>
                   <div className="flex items-baseline">
                     <span className="text-5xl font-bold text-gray-900">{selectedCurrencyConfig.symbol}{getPrice('individual')}</span>
                     <span className="text-gray-500 ml-2">/ Inquiry</span>
                   </div>
                   <p className="text-sm text-gray-500 mt-1 font-medium">For Full Access</p>
               </div>

               <ul className="space-y-4 mb-8 text-gray-600">
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-500 mr-2" /> Pay in {selectedCurrencyConfig.currency}</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-500 mr-2" /> AI Theme Generation</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-500 mr-2" /> Vendor Management</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-500 mr-2" /> Secure Payments</li>
               </ul>

               <button onClick={onGetStarted} className="w-full py-4 rounded-xl font-bold bg-gray-50 text-gray-800 hover:bg-gray-100 transition-colors">
                 Start Planning
               </button>
            </div>

            {/* Business Plan */}
            <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden transform hover:-translate-y-1 duration-300">
               <div className="absolute top-0 right-0 w-64 h-64 bg-wedding-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
               
               <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">Venue Pro</h3>
               <p className="text-gray-400 mb-6 relative z-10">For halls, caterers, and vendors.</p>
               
               <div className="flex items-baseline mb-6 relative z-10">
                 <span className="text-5xl font-bold">{selectedCurrencyConfig.symbol}{getPrice('business')}</span>
                 <span className="text-gray-400 ml-2">/ month</span>
               </div>

               <div className="bg-wedding-600 text-white px-4 py-2 rounded-lg font-bold text-sm mb-6 inline-block relative z-10">
                 15 Days Free Trial!
               </div>

               <ul className="space-y-4 mb-8 text-gray-300 relative z-10">
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-400 mr-2" /> {selectedCurrencyConfig.currency} Billing</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-400 mr-2" /> AI Email Drafts</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-400 mr-2" /> CRM & Calendar</li>
                 <li className="flex items-center"><CheckCircle2 className="w-5 h-5 text-wedding-400 mr-2" /> Analytics Dashboard</li>
               </ul>

               <button onClick={onGetStarted} className="w-full py-4 rounded-xl font-bold bg-wedding-600 hover:bg-wedding-700 transition-colors relative z-10 shadow-lg shadow-wedding-900/50">
                 Start Free Trial
               </button>
            </div>
          </div>
          
           {/* Payment Methods Banner */}
           <div className="mt-16 border-t border-gray-100 pt-8 flex justify-center items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
              <span className="text-sm font-bold text-gray-400">SECURE PAYMENTS via</span>
              <div className="flex gap-4">
                 {/* Simple CSS shapes for card logos */}
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">VISA</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">MASTERCARD</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">AMEX</div>
                 <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold">PAYPAL</div>
              </div>
           </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Reimagining Event Management</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Streamline your workflow with tools designed for modern event professionals and planners.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div 
                className="w-16 h-16 bg-wedding-100 rounded-2xl flex items-center justify-center mb-6 text-wedding-600 cursor-pointer hover:scale-110 transition-transform"
                onClick={onOpenUnlimited}
              >
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Planning</h3>
              <p className="text-gray-500 leading-relaxed">
                Generate creative themes, draft professional emails, and brainstorm menus instantly with our Gemini AI integration.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div 
                className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 cursor-pointer hover:scale-110 transition-transform"
                onClick={onOpenUnlimited}
              >
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vendor Network</h3>
              <p className="text-gray-500 leading-relaxed">
                Connect seamlessly with top-rated florists, caterers, and photographers. Send inquiries directly from your dashboard.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
              <div 
                className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 cursor-pointer hover:scale-110 transition-transform"
                onClick={onOpenUnlimited}
              >
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Management</h3>
              <p className="text-gray-500 leading-relaxed">
                Keep track of contracts, payments, and guest lists in one secure location. Never miss a deadline again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE SECTION */}
      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-bold text-gray-900">For Venues & Businesses</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-wedding-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Manage all your bookings in a centralized calendar.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-wedding-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Automate client communication with AI drafts.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-wedding-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Track revenue and upcoming event logistics.</span>
                </li>
              </ul>
              <button onClick={onGetStarted} className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors">
                List Your Business
              </button>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-wedding-200 rounded-full blur-3xl opacity-20"></div>
               <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                 <div className="flex items-center mb-6">
                   <div 
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={onOpenUnlimited}
                   >
                     <div className="text-gray-600">
                        <Logo className="w-6 h-6" />
                     </div>
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900">Grand Ballroom Inc.</h4>
                     <p className="text-sm text-gray-500">Business Dashboard</p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                   <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                   <div className="h-20 bg-gray-50 rounded w-full mt-4 border border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                     Calendar View Preview
                   </div>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mt-24">
             <div className="relative order-2 md:order-1">
               <div className="absolute inset-0 bg-purple-200 rounded-full blur-3xl opacity-20"></div>
               <div className="relative bg-white p-8 rounded-2xl shadow-xl">
                 <div className="flex items-center mb-6">
                   <div 
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={onOpenUnlimited}
                   >
                     <Heart className="w-6 h-6 text-gray-600" />
                   </div>
                   <div>
                     <h4 className="font-bold text-gray-900">Sarah & James</h4>
                     <p className="text-sm text-gray-500">Wedding Planning</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 bg-wedding-50 rounded-lg flex flex-col items-center justify-center text-wedding-300">
                      <Sparkles className="w-6 h-6 mb-2" />
                      <span className="text-xs">Ideas</span>
                    </div>
                    <div className="h-24 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-300">
                      <Calendar className="w-6 h-6 mb-2" />
                      <span className="text-xs">Timeline</span>
                    </div>
                 </div>
               </div>
            </div>

            <div className="space-y-8 order-1 md:order-2">
              <h2 className="text-3xl font-serif font-bold text-gray-900">For Couples & Planners</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Find the perfect venue and vendors near you.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Build mood boards and manage your guest list.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-purple-600 mr-3 flex-shrink-0" />
                  <span className="text-gray-600 text-lg">Get AI suggestions for themes and vows.</span>
                </li>
              </ul>
              <button onClick={onGetStarted} className="px-6 py-3 bg-wedding-600 text-white rounded-lg font-bold hover:bg-wedding-700 transition-colors shadow-lg shadow-wedding-200">
                Start Planning Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={onOpenUnlimited}>
                <div className="text-wedding-500">
                    <Logo className="w-6 h-6" invert />
                </div>
                <span className="text-2xl font-serif font-black tracking-tighter text-white">{t('app.name')}</span>
             </div>
             <p className="text-sm">
               The all-in-one platform for creating unforgettable moments.
             </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4">Product</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold mb-4">Company</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-wedding-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
             <h5 className="text-white font-bold mb-4">Legal</h5>
             <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-wedding-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
          &copy; 2024 Event Manager. Powered by Google Gemini.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
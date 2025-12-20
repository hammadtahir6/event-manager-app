import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Shield, Lock, Globe, Wallet } from 'lucide-react';
import { COUNTRIES_CURRENCIES } from '../constants';

interface BillingModalProps {
  isOpen: boolean;
  role: 'business' | 'individual';
  onClose: () => void;
  onSuccess: (amount: number, currency: string) => void;
  initialCountry?: string;
}

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, role, onClose, onSuccess, initialCountry = 'United States' }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Currency State
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [localPrice, setLocalPrice] = useState(0);

  // Update selectedCountry when initialCountry changes or modal opens
  useEffect(() => {
    if (isOpen) {
        setSelectedCountry(initialCountry);
    }
  }, [isOpen, initialCountry]);

  useEffect(() => {
    const countryData = COUNTRIES_CURRENCIES.find(c => c.country === selectedCountry);
    if (countryData) {
      setCurrencyCode(countryData.currency);
      setCurrencySymbol(countryData.symbol);
      setExchangeRate(countryData.rate || 1);
      
      // Calculate Price based on role and fixed pricing if available
      let price = 0;
      if (role === 'individual') {
          if (countryData.fixedIndividual !== undefined) {
              price = countryData.fixedIndividual;
          } else {
              price = Number((5 * (countryData.rate || 1)).toFixed(2));
          }
      } else {
          if (countryData.fixedBusiness !== undefined) {
              price = countryData.fixedBusiness;
          } else {
              price = Number((40 * (countryData.rate || 1)).toFixed(2));
          }
      }
      setLocalPrice(price);
    }
  }, [selectedCountry, role]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
  };

  if (!isOpen) return null;

  const priceDisplay = `${currencySymbol}${localPrice.toLocaleString()} ${currencyCode}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      // Pass the actual local amount paid
      onSuccess(localPrice, currencyCode);
    }, 2000);
  };

  const planDetails = role === 'business' 
    ? {
        title: "Activate Business Subscription",
        description: "Your 3-month free trial has ended. Subscribe now to continue managing your venue and inquiries.",
        price: priceDisplay,
        period: "/ month",
        features: ["Unlimited Event Management", "AI-Powered Drafts", "Analytics Dashboard", "Priority Support"]
      }
    : {
        title: "Unlock Full Access",
        description: "Individual Planner Inquiries are free with limited access. For Full Access, it is $5 per Inquiry.",
        price: priceDisplay,
        period: " / Inquiry",
        features: ["Full Event Management", "AI Planning Tools", "Vendor Network Access", "Unlimited Edits"]
      };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* Left Side - Plan Info */}
        <div className="bg-gray-900 p-8 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-wedding-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-16 -mb-16"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold mb-2">{planDetails.title}</h2>
            <p className="text-gray-400 text-sm mb-8">{planDetails.description}</p>
            
            <div className="flex items-baseline mb-8">
              <span className="text-3xl font-bold">{planDetails.price}</span>
              <span className="text-gray-400 ml-1 text-sm">{planDetails.period}</span>
            </div>

            <ul className="space-y-4">
              {planDetails.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm">
                  <CheckCircle2 className="w-5 h-5 text-wedding-500 mr-3 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-gray-800 flex flex-col gap-2">
            <div className="flex items-center text-xs text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              <span>Secure 256-bit SSL Encrypted payment</span>
            </div>
            {/* Payment Methods Visuals */}
            <div className="flex gap-2 mt-2 opacity-60">
                <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-gray-900 text-[8px] font-bold">VISA</div>
                <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-gray-900 text-[8px] font-bold">MC</div>
                <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-gray-900 text-[8px] font-bold">AMEX</div>
                <div className="h-6 w-10 bg-white rounded flex items-center justify-center text-gray-900 text-[8px] font-bold">PAYPAL</div>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="bg-white p-8 md:w-3/5 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Billing Details</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
               <Globe className="w-4 h-4" />
               <span>Local Pricing</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             
             {/* Country Selector */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Country</label>
                <select 
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none bg-white transition-all"
                >
                  {COUNTRIES_CURRENCIES.map(c => (
                    <option key={c.country} value={c.country}>{c.country}</option>
                  ))}
                </select>
             </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-all"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-all"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-500 focus:border-transparent outline-none transition-all"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods Footer */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-wedding-600 hover:bg-wedding-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center">
                    Pay {priceDisplay}
                    <Wallet className="ml-2 w-5 h-5 opacity-80" />
                  </span>
                )}
              </button>
            </div>
            
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
              disabled={isProcessing}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
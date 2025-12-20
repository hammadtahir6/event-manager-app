import React from 'react';
import { X, Rocket, Infinity, Globe } from 'lucide-react';

interface UnlimitedSolutionsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnlimitedSolutions: React.FC<UnlimitedSolutionsProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4 backdrop-blur-lg animate-fadeIn">
      <div className="relative max-w-5xl w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl text-center text-white border border-white/10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mb-8 shadow-lg transform rotate-3 hover:rotate-6 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); }}>
             <Infinity className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
            Unlimited Solutions
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-12 font-light leading-relaxed">
            Welcome to the future of event management. By clicking our icons, you've unlocked a gateway to infinite possibilities, seamless scaling, and boundless creativity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
             <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <Rocket className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Scale Infinitely</h3>
                <p className="text-sm text-gray-300">Grow your venue business without boundaries using our advanced AI tools.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <Infinity className="w-8 h-8 text-pink-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Endless Features</h3>
                <p className="text-sm text-gray-300">From CRM to AI drafting, our toolkit evolves with your imagination.</p>
             </div>
             <div className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Global Reach</h3>
                <p className="text-sm text-gray-300">Connect with clients and vendors across the entire event universe.</p>
             </div>
          </div>
          
          <button 
            onClick={onClose}
            className="mt-12 px-10 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-transform hover:scale-105 shadow-xl"
          >
            Back to App
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnlimitedSolutions;
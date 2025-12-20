import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const Icon = isPrivacy ? Shield : FileText;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-wedding-600" />
            <h3 className="text-xl font-serif font-bold text-gray-800">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto text-sm text-gray-600 leading-relaxed space-y-4">
          {isPrivacy ? (
            <>
              <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
              <p>At Event Manager, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Event Manager.</p>
              
              <h4 className="font-bold text-gray-800 mt-4">1. Personal Information We Collect</h4>
              <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
              
              <h4 className="font-bold text-gray-800 mt-4">2. How We Use Your Personal Information</h4>
              <p>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).</p>
              
              <h4 className="font-bold text-gray-800 mt-4">3. Sharing Your Personal Information</h4>
              <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our customers use the Site.</p>
              
              <h4 className="font-bold text-gray-800 mt-4">4. Data Retention</h4>
              <p>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</p>
            </>
          ) : (
            <>
               <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
               <p>This website is operated by Event Manager. Throughout the site, the terms “we”, “us” and “our” refer to Event Manager. Event Manager offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
               
               <h4 className="font-bold text-gray-800 mt-4">1. Online Store Terms</h4>
               <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence.</p>

               <h4 className="font-bold text-gray-800 mt-4">2. General Conditions</h4>
               <p>We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices.</p>

               <h4 className="font-bold text-gray-800 mt-4">3. Accuracy, Completeness and Timeliness of Information</h4>
               <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only.</p>

               <h4 className="font-bold text-gray-800 mt-4">4. Modifications to the Service and Prices</h4>
               <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-wedding-600 text-white rounded-lg hover:bg-wedding-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
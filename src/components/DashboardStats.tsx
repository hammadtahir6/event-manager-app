import React, { useState } from 'react';
import { Individual, BookingStatus, ActivityLog } from '../types';
import { Users, CalendarCheck, FileText, Activity, Sparkles, TrendingUp, X, Radar, Target, UserCircle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateBusinessGrowthPlan, generateLeadTargetingStrategy } from '../services/geminiService';

interface DashboardStatsProps {
  individuals: Individual[];
  activities?: ActivityLog[];
  onOpenUnlimited: () => void;
  // Optional business context for AI growth features
  businessContext?: {
    name: string;
    category: string;
    city: string;
  };
  isProfileIncomplete?: boolean;
  onGoToProfile?: () => void;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  individuals, 
  activities = [], 
  onOpenUnlimited, 
  businessContext,
  isProfileIncomplete,
  onGoToProfile
}) => {
  const pendingInquiries = individuals.filter(c => c.status === BookingStatus.Inquiry).length;
  const confirmedBookings = individuals.filter(c => c.status === BookingStatus.Confirmed).length;
  const upcomingEvents = individuals.filter(c => {
    const weddingDate = new Date(c.weddingDate);
    const now = new Date();
    return weddingDate > now && c.status === BookingStatus.Confirmed;
  }).length;

  // AI Growth Plan State
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTitle, setAiTitle] = useState('');

  // Find potential leads in the area for businesses
  const potentialLeads = businessContext ? individuals.filter(ind => 
    ind.city?.toLowerCase() === businessContext.city.toLowerCase() &&
    ind.status !== BookingStatus.Confirmed && 
    ind.status !== BookingStatus.Completed && 
    ind.status !== BookingStatus.Cancelled
  ) : [];

  // Prepare chart data: Bookings per month (simple aggregation)
  const chartData = individuals.reduce((acc, curr) => {
    const date = new Date(curr.weddingDate);
    const month = date.toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.name === month);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: month, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  chartData.sort((a, b) => monthsOrder.indexOf(a.name) - monthsOrder.indexOf(b.name));

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
      <div 
        className={`p-4 rounded-full ${colorClass} bg-opacity-20 cursor-pointer hover:scale-105 transition-transform`}
        onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
      >
        <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold font-serif text-gray-800">{value}</h3>
      </div>
    </div>
  );

  const handleGenerateGrowthPlan = async () => {
    if (!businessContext) return;
    
    setAiTitle(pendingInquiries > 0 ? "Scaling Strategy" : "Your Business Growth Plan");
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent("Analyzing local market trends and generating your strategy...");

    const strategy = await generateBusinessGrowthPlan(businessContext.name, businessContext.category, businessContext.city);
    
    setAiContent(strategy);
    setAiLoading(false);
  };

  const handleTargetLeads = async () => {
    if (!businessContext || potentialLeads.length === 0) return;

    // Summarize leads for AI
    const leadSummary = potentialLeads.map(l => `${l.eventType} on ${l.weddingDate} (${l.guestCount} guests)`).join('; ');

    setAiTitle(`Lead Targeting: ${potentialLeads.length} Potential Clients`);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiContent(`Analyzing ${potentialLeads.length} active leads in ${businessContext.city}...`);

    const strategy = await generateLeadTargetingStrategy(businessContext.name, businessContext.category, businessContext.city, leadSummary);
    
    setAiContent(strategy);
    setAiLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Profile Incomplete Prompt - HIGH PRIORITY FOR NEW USERS */}
      {isProfileIncomplete && onGoToProfile && (
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-1 shadow-lg group">
          <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                <UserCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Your profile is almost ready!</h3>
                <p className="text-gray-500 text-sm max-w-md">
                  To start appearing in client searches, you need to <strong>add business details, photos, and services with pricing</strong>.
                </p>
              </div>
            </div>
            <button 
              onClick={onGoToProfile}
              className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-md flex items-center whitespace-nowrap group-hover:scale-105 transition-transform"
            >
              Complete Setup
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* AI Opportunity Spotter */}
      {businessContext && potentialLeads.length > 0 && !isProfileIncomplete && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-1 shadow-lg transform transition-all hover:scale-[1.01]">
          <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-50 rounded-full text-emerald-600 animate-pulse">
                <Radar className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                  AI Opportunity Spotter
                  <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {potentialLeads.length} Matches Found
                  </span>
                </h3>
                <p className="text-gray-500 text-sm max-w-md">
                  We found <strong>{potentialLeads.length} active events</strong> being planned in <strong>{businessContext.city}</strong> right now. 
                </p>
              </div>
            </div>
            <button 
              onClick={handleTargetLeads}
              className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-md flex items-center whitespace-nowrap"
            >
              <Target className="w-5 h-5 mr-2" />
              Draft Outreach Campaign
            </button>
          </div>
        </div>
      )}

      {/* General Growth Assistant */}
      {businessContext && potentialLeads.length === 0 && !isProfileIncomplete && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-1 shadow-lg transform transition-all hover:scale-[1.01]">
          <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {pendingInquiries > 0 ? "Ready to scale up?" : "Waiting for your first inquiry?"}
                </h3>
                <p className="text-gray-500 text-sm max-w-md">
                  {pendingInquiries > 0 
                    ? `You're doing great with ${pendingInquiries} pending inquiries. Let our AI analyze your location to help you dominate.` 
                    : `It looks like things are quiet. Let our AI analyze your location and service category to generate a personalized marketing plan.`}
                </p>
              </div>
            </div>
            <button 
              onClick={handleGenerateGrowthPlan}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center whitespace-nowrap"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Generate Growth Plan
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Pending Inquiries" 
          value={pendingInquiries} 
          icon={FileText} 
          colorClass="text-blue-600 bg-blue-600" 
        />
        <StatCard 
          title="Confirmed Bookings" 
          value={confirmedBookings} 
          icon={CalendarCheck} 
          colorClass="text-purple-600 bg-purple-600" 
        />
        <StatCard 
          title="Upcoming Events" 
          value={upcomingEvents} 
          icon={Users} 
          colorClass="text-wedding-600 bg-wedding-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-serif font-bold text-gray-800 mb-4">Bookings Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  cursor={{ fill: '#fce7f3' }}
                />
                <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ec4899' : '#f472b6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-serif font-bold text-gray-800 mb-4 flex items-center">
             <Activity 
                className="w-5 h-5 mr-2 cursor-pointer hover:text-wedding-600 transition-colors" 
                onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}
             />
             Recent Activity
           </h3>
           <ul className="space-y-4 max-h-64 overflow-y-auto pr-2">
             {activities.slice(0, 10).map(act => (
               <li key={act.id} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                 <div className="w-2 h-2 mt-2 rounded-full bg-wedding-500 flex-shrink-0" />
                 <div>
                   <p className="text-sm font-medium text-gray-800">
                     {act.description}
                   </p>
                   <p className="text-xs text-gray-400">{new Date(act.timestamp).toLocaleString()}</p>
                 </div>
               </li>
             ))}
             {activities.length === 0 && (
                <li className="text-sm text-gray-400 text-center py-4">No activity recorded yet.</li>
             )}
           </ul>
        </div>
      </div>

      {/* AI Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50 rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-xl font-serif font-bold text-gray-800">{aiTitle}</h3>
              </div>
              <button 
                onClick={() => setAiModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
                  <p className="text-gray-500 animate-pulse font-medium">Consulting marketing experts...</p>
                </div>
              ) : (
                <div className="prose prose-indigo max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-100 text-sm leading-relaxed shadow-inner">
                    {aiContent}
                  </pre>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button 
                onClick={() => setAiModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(aiContent);
                  alert('Strategy copied to clipboard!');
                }}
                disabled={aiLoading}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors shadow-sm"
              >
                Copy Strategy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;
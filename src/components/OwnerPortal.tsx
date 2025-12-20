
import React, { useState } from 'react';
import { ActivityLog, Transaction, Suggestion } from '../types';
import { LogOut, Activity, DollarSign, Users, Shield, TrendingUp, Building2, User, CreditCard, Banknote, Download, Search, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, Filter, Briefcase, Globe, MessageCircle, CheckCircle2, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Logo from './Logo';

interface OwnerPortalProps {
  onLogout: () => void;
  userName: string;
  activities: ActivityLog[];
  transactions: Transaction[];
  suggestions: Suggestion[];
  onUpdateSuggestionStatus: (id: string, status: 'new' | 'reviewed') => void;
  usersCount: number;
  onOpenUnlimited: () => void;
}

const OwnerPortal: React.FC<OwnerPortalProps> = ({ 
  onLogout, 
  userName, 
  activities, 
  transactions,
  suggestions,
  onUpdateSuggestionStatus,
  usersCount,
  onOpenUnlimited
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'activity' | 'financials' | 'suggestions' | 'settings'>('dashboard');
  const [activityFilter, setActivityFilter] = useState<'all' | 'business' | 'individual' | 'owner'>('all');

  // Derived Stats
  const businessUsersCount = Math.floor(usersCount * 0.4); // Mock breakdown
  const individualUsersCount = usersCount - businessUsersCount;

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const businessRevenue = transactions.filter(t => t.userRole === 'business').reduce((acc, t) => acc + t.amount, 0);
  const individualRevenue = transactions.filter(t => t.userRole === 'individual').reduce((acc, t) => acc + t.amount, 0);

  const revenueData = [
    { name: 'Business Subscriptions', value: businessRevenue, color: '#ec4899' },
    { name: 'Inquiry Fees', value: individualRevenue, color: '#9333ea' },
  ];

  const filteredActivities = activities.filter(act => activityFilter === 'all' || act.userRole === activityFilter);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, colorClass }: any) => (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:border-gray-600 transition-all">
       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <Icon className={`w-20 h-20 ${colorClass}`} />
       </div>
       <div className="relative z-10">
          <h3 className="text-gray-400 font-medium text-sm mb-1">{title}</h3>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          <div className="flex items-center text-xs">
             {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 text-green-400 mr-1" />
             ) : (
                <ArrowDownRight className="w-3 h-3 text-gray-400 mr-1" />
             )}
             <span className={trend === 'up' ? 'text-green-400' : 'text-gray-400'}>{subtitle}</span>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      {/* Top Navigation */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-2.5 bg-gray-900 rounded-xl cursor-pointer hover:scale-105 border border-gray-700 text-wedding-500" onClick={(e) => { e.stopPropagation(); onOpenUnlimited(); }}>
               <Logo className="w-8 h-8" invert />
            </div>
            <div>
               <h1 className="font-serif font-black text-2xl text-white tracking-tight">ADMIN COMMAND</h1>
               <div className="flex items-center text-[10px] text-wedding-500 font-bold uppercase tracking-widest mt-0.5">
                  <Shield className="w-3 h-3 mr-1" />
                  Privileged Access Level 1
               </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-bold text-white">{userName}</span>
                <span className="text-xs text-gray-500">System Administrator</span>
             </div>
             <div className="h-8 w-px bg-gray-700"></div>
             <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700/50 rounded-xl transition-all"
                title="Secure Logout"
             >
                <LogOut className="w-6 h-6" />
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-8 px-4 gap-8">
        
        {/* Sidebar Nav */}
        <nav className="w-64 flex-shrink-0 hidden md:block space-y-3">
            <button
               onClick={() => setActiveTab('dashboard')}
               className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all border ${
                   activeTab === 'dashboard' ? 'bg-wedding-900/20 text-wedding-50 border-wedding-900/50 shadow-lg font-bold' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
               }`}
            >
                <TrendingUp className="w-5 h-5 mr-3" />
                Executive Dashboard
            </button>
            <button
               onClick={() => setActiveTab('activity')}
               className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all border ${
                   activeTab === 'activity' ? 'bg-wedding-900/20 text-wedding-50 border-wedding-900/50 shadow-lg font-bold' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
               }`}
            >
                <Activity className="w-5 h-5 mr-3" />
                Real-time Activity
            </button>
            <button
               onClick={() => setActiveTab('financials')}
               className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all border ${
                   activeTab === 'financials' ? 'bg-wedding-900/20 text-wedding-50 border-wedding-900/50 shadow-lg font-bold' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
               }`}
            >
                <DollarSign className="w-5 h-5 mr-3" />
                Revenue & Ledger
            </button>
            <button
               onClick={() => setActiveTab('suggestions')}
               className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all border ${
                   activeTab === 'suggestions' ? 'bg-wedding-900/20 text-wedding-50 border-wedding-900/50 shadow-lg font-bold' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
               }`}
            >
                <MessageCircle className="w-5 h-5 mr-3" />
                User Suggestions
                {suggestions.filter(s => s.status === 'new').length > 0 && (
                  <span className="ml-auto w-5 h-5 flex items-center justify-center bg-wedding-600 text-white text-[10px] rounded-full">
                    {suggestions.filter(s => s.status === 'new').length}
                  </span>
                )}
            </button>
            <div className="pt-6 pb-2 px-4">
               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">System</span>
            </div>
            <button
               onClick={() => setActiveTab('settings')}
               className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all border ${
                   activeTab === 'settings' ? 'bg-wedding-900/20 text-wedding-50 border-wedding-900/50 shadow-lg font-bold' : 'text-gray-400 border-transparent hover:text-gray-200 hover:bg-gray-800'
               }`}
            >
                <Banknote className="w-5 h-5 mr-3" />
                Payout Configuration
            </button>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 pb-12 overflow-hidden">
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard 
                          title="Gross Revenue" 
                          value={`$${totalRevenue.toLocaleString()}`} 
                          subtitle="+12.5% from last month" 
                          trend="up"
                          icon={Banknote} 
                          colorClass="text-green-500" 
                        />
                        <StatCard 
                          title="Total Subscribers" 
                          value={usersCount} 
                          subtitle={`${businessUsersCount} Vendors • ${individualUsersCount} Planners`} 
                          trend="up"
                          icon={Users} 
                          colorClass="text-blue-500" 
                        />
                        <StatCard 
                          title="Platform Activity" 
                          value={activities.length} 
                          subtitle="Logs processed today" 
                          trend="up"
                          icon={Activity} 
                          colorClass="text-purple-500" 
                        />
                        <StatCard 
                          title="Active Inquiries" 
                          value={activities.filter(a => a.actionType === 'inquiry').length} 
                          subtitle="Unmatched opportunities" 
                          trend="down"
                          icon={Briefcase} 
                          colorClass="text-wedding-500" 
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* Revenue Breakdown Chart */}
                       <div className="lg:col-span-2 bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl">
                          <h3 className="text-xl font-bold mb-8 flex items-center">
                             <PieChartIcon className="w-5 h-5 mr-3 text-wedding-500" />
                             Revenue Streams
                          </h3>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={revenueData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                  cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                   {revenueData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-8 grid grid-cols-2 gap-4">
                             <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Business Revenue</p>
                                <p className="text-xl font-bold text-wedding-500">${businessRevenue.toLocaleString()}</p>
                             </div>
                             <div className="p-4 bg-gray-900 rounded-xl border border-gray-700">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Inquiry Revenue</p>
                                <p className="text-xl font-bold text-purple-500">${individualRevenue.toLocaleString()}</p>
                             </div>
                          </div>
                       </div>

                       {/* Global Distribution Mock */}
                       <div className="bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-xl flex flex-col">
                          <h3 className="text-xl font-bold mb-6 flex items-center">
                             <Globe className="w-5 h-5 mr-3 text-blue-500" />
                             User Mix
                          </h3>
                          <div className="flex-1 flex flex-col justify-center items-center">
                             <div className="relative w-48 h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                    <Pie
                                      data={[
                                        { name: 'Vendors', value: businessUsersCount },
                                        { name: 'Planners', value: individualUsersCount }
                                      ]}
                                      cx="50%"
                                      cy="50%"
                                      innerRadius={60}
                                      outerRadius={80}
                                      paddingAngle={5}
                                      dataKey="value"
                                    >
                                      <Cell fill="#ec4899" />
                                      <Cell fill="#3b82f6" />
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                   <span className="text-2xl font-bold">{usersCount}</span>
                                   <span className="text-[10px] text-gray-500 font-bold uppercase">Total</span>
                                </div>
                             </div>
                             <div className="mt-8 space-y-3 w-full">
                                <div className="flex items-center justify-between text-sm">
                                   <div className="flex items-center">
                                      <div className="w-3 h-3 rounded-full bg-wedding-500 mr-2"></div>
                                      <span className="text-gray-400">Business Vendors</span>
                                   </div>
                                   <span className="font-bold">{businessUsersCount}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                   <div className="flex items-center">
                                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                                      <span className="text-gray-400">Individual Planners</span>
                                   </div>
                                   <span className="font-bold">{individualUsersCount}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                    <div className="p-8 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Global Activity Stream</h2>
                            <p className="text-gray-500 text-sm">Real-time logs for all users across the platform.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-900 p-1.5 rounded-xl border border-gray-700">
                           <Filter className="w-4 h-4 text-gray-500 ml-2" />
                           {(['all', 'business', 'individual', 'owner'] as const).map(role => (
                             <button
                               key={role}
                               onClick={() => setActivityFilter(role)}
                               className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${activityFilter === role ? 'bg-wedding-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                             >
                               {role}
                             </button>
                           ))}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-900/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">User</th>
                                    <th className="px-8 py-5">Role</th>
                                    <th className="px-8 py-5">Action</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/50">
                                {filteredActivities.map((act) => (
                                    <tr key={act.id} className="hover:bg-gray-700/30 transition-all group">
                                        <td className="px-8 py-5">
                                           <div className="flex items-center">
                                              <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center mr-3 font-bold text-xs text-wedding-400">
                                                 {act.userName.charAt(0)}
                                              </div>
                                              <div>
                                                 <p className="text-white font-medium group-hover:text-wedding-400 transition-colors">{act.userName}</p>
                                                 <p className="text-[10px] text-gray-500 font-mono">{act.userId}</p>
                                              </div>
                                           </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                                                act.userRole === 'business' ? 'bg-indigo-900/40 text-indigo-400 border border-indigo-900' : 
                                                act.userRole === 'owner' ? 'bg-wedding-900/40 text-wedding-400 border border-wedding-900' : 
                                                'bg-blue-900/40 text-blue-400 border border-blue-900'
                                            }`}>
                                                {act.userRole}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-gray-300 font-medium">{act.description}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                           <div className="flex items-center">
                                              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                 act.actionType === 'payment' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                                                 act.actionType === 'delete' ? 'bg-red-500' :
                                                 'bg-blue-500'
                                              }`} />
                                              <span className="capitalize text-gray-500 text-xs">{act.actionType}</span>
                                           </div>
                                        </td>
                                        <td className="px-8 py-5 text-right text-gray-500 font-mono text-xs">
                                            {new Date(act.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredActivities.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center">
                                <Activity className="w-12 h-12 text-gray-700 mb-4" />
                                <h4 className="text-gray-500 font-bold uppercase tracking-widest text-xs">No entries found for this filter</h4>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'financials' && (
                <div className="space-y-8 animate-fadeIn">
                   <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                      <div className="p-8 border-b border-gray-700 flex justify-between items-center">
                         <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Financial Ledger</h2>
                            <p className="text-gray-500 text-sm">Full transaction history for the platform.</p>
                         </div>
                         <button className="flex items-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                         </button>
                      </div>
                      <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-900 text-gray-200 uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">ID</th>
                                        <th className="px-8 py-5">User</th>
                                        <th className="px-8 py-5">Amount</th>
                                        <th className="px-8 py-5">Description</th>
                                        <th className="px-8 py-5 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-8 py-5 font-mono text-[10px] text-gray-600">#{t.id.slice(0, 8)}</td>
                                            <td className="px-8 py-5">
                                                <div className="text-white font-bold">{t.userName}</div>
                                                <div className="text-[10px] uppercase font-black tracking-tighter text-gray-500">{t.userRole}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                               <span className="text-green-400 font-black text-base">
                                                  +{t.amount.toLocaleString()} {t.currency}
                                               </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs italic text-gray-500">"{t.description}"</td>
                                            <td className="px-8 py-5 text-right font-mono text-[10px]">{new Date(t.timestamp).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                   </div>
                </div>
            )}

            {activeTab === 'suggestions' && (
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                    <div className="p-8 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-1">User Suggestions Column</h2>
                        <p className="text-gray-500 text-sm">Direct feedback and ideas from Business and Individual account holders.</p>
                    </div>
                    
                    <div className="p-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {suggestions.length > 0 ? (
                            suggestions.map(sug => (
                               <div key={sug.id} className={`p-6 rounded-2xl border transition-all ${sug.status === 'new' ? 'bg-gray-900 border-wedding-900/50 shadow-wedding-900/10' : 'bg-gray-800 border-gray-700 opacity-60'}`}>
                                  <div className="flex justify-between items-start mb-4">
                                     <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mr-3 ${sug.userRole === 'business' ? 'bg-indigo-900 text-indigo-400' : 'bg-blue-900 text-blue-400'}`}>
                                           {sug.userName.charAt(0)}
                                        </div>
                                        <div>
                                           <h4 className="text-white font-bold text-sm leading-tight">{sug.userName}</h4>
                                           <p className="text-[10px] uppercase font-black tracking-widest text-gray-500">{sug.userRole}</p>
                                        </div>
                                     </div>
                                     {sug.status === 'new' && (
                                       <span className="bg-wedding-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded animate-pulse">New</span>
                                     )}
                                  </div>
                                  
                                  <p className="text-gray-300 text-sm italic mb-6 leading-relaxed">"{sug.content}"</p>
                                  
                                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
                                     <div className="flex items-center text-gray-500 text-[10px] font-mono">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(sug.timestamp).toLocaleDateString()}
                                     </div>
                                     <button 
                                        onClick={() => onUpdateSuggestionStatus(sug.id, sug.status === 'new' ? 'reviewed' : 'new')}
                                        className={`p-2 rounded-lg transition-all ${sug.status === 'new' ? 'text-wedding-500 hover:bg-wedding-900/30' : 'text-gray-400 hover:bg-gray-700'}`}
                                        title={sug.status === 'new' ? "Mark as Reviewed" : "Mark as New"}
                                     >
                                        <CheckCircle2 className="w-5 h-5" />
                                     </button>
                                  </div>
                               </div>
                            ))
                          ) : (
                             <div className="col-span-full py-20 text-center flex flex-col items-center">
                                <MessageCircle className="w-16 h-16 text-gray-800 mb-4" />
                                <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">No user suggestions found yet.</p>
                             </div>
                          )}
                       </div>
                    </div>
                </div>
            )}
        </main>
      </div>
      
      <footer className="bg-gray-800 border-t border-gray-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
           <span>&copy; {new Date().getFullYear()} Event Manager Cloud Infrastructure</span>
           <div className="flex gap-6">
              <span className="text-wedding-500">Security: Verified</span>
              <span className="text-blue-500">Uptime: 99.99%</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default OwnerPortal;

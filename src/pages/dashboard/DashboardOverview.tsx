import { Users, Briefcase, FileText, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardOverview = () => {
  const { user, role } = useAuth();

  const stats = [
    { title: 'Total Clients', value: '12', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Active Trusts', value: '3', icon: Briefcase, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    { title: 'Pending Documents', value: '8', icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Recent Activity', value: '24', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-10">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-serif text-white tracking-wide mb-2">Welcome back, {user?.displayName || 'User'}</h1>
        <p className="text-gray-400 font-light text-lg">Here is what's happening with your accounts today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`glass-panel glass-panel-hover p-8 rounded-3xl animate-fade-in-up animate-delay-${(i + 1) * 100}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <h3 className="text-gray-400 font-medium tracking-wide mb-1">{stat.title}</h3>
              <p className="text-4xl font-light text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Placeholder for future charts or activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up animate-delay-300">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl h-80 flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Activity size={24} className="text-gray-600" />
           </div>
           <h3 className="text-xl font-medium text-gray-400 mb-2">Activity Overview</h3>
           <p className="text-gray-600">Chart data will populate as activity increases.</p>
        </div>
        <div className="glass-panel p-8 rounded-3xl h-80 flex flex-col justify-center items-center text-center">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FileText size={24} className="text-gray-600" />
           </div>
           <h3 className="text-xl font-medium text-gray-400 mb-2">Recent Documents</h3>
           <p className="text-gray-600">No new documents uploaded today.</p>
        </div>
      </div>
    </div>
  );
};

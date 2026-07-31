import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const DashboardOverview = () => {
  const { user, role } = useAuth();
  
  const [stats, setStats] = useState({
    totalClients: 0,
    activeTrusts: 0,
    pendingDocuments: 0,
    recentActivity: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (role === 'Admin') {
          const res = await api.get('/stats');
          if (res.data.success) {
            setStats(res.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [role]);

  const displayStats = [
    { title: 'Total Clients', value: loading ? '...' : stats.totalClients, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Active Trusts', value: loading ? '...' : stats.activeTrusts, icon: Briefcase, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10' },
    { title: 'Pending Documents', value: loading ? '...' : stats.pendingDocuments, icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Recent Activity', value: loading ? '...' : stats.recentActivity, icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="space-y-10">
      <div className="animate-fade-in-up">
        <h1 className="text-4xl font-serif text-white tracking-wide mb-2">Welcome back, {user?.displayName || 'User'}</h1>
        <p className="text-gray-400 font-light text-lg">Here is what's happening with your accounts today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => {
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

    </div>
  );
};

import { useState, useEffect } from 'react';
import { Users, FileText, Activity, UserPlus, Upload, Settings, ShieldCheck, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
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
    { title: 'Total Clients', value: loading ? '...' : stats.totalClients, change: 'Active Accounts', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Pending Documents', value: loading ? '...' : stats.pendingDocuments, change: stats.pendingDocuments > 0 ? 'Requires Review' : 'Up to date', icon: FileText, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'Recent Activity', value: loading ? '...' : stats.recentActivity, change: 'Live Audit Log', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  const recentActivities: any[] = [];

  return (
    <div className="space-y-10">
      {/* Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide mb-2">
            Welcome back, {user?.displayName || 'Administrator'}
          </h1>
          <p className="text-gray-400 font-light text-base sm:text-lg">
            Institutional overview and real-time portfolio activity.
          </p>
        </div>

        {role === 'Admin' && (
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/dashboard/clients"
              className="px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FCEBBA] text-black font-semibold rounded-xl hover:scale-105 transition-all text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              <UserPlus size={16} /> New Client
            </Link>
            <Link
              to="/dashboard/documents"
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 rounded-xl transition-all text-xs font-medium flex items-center gap-2"
            >
              <Upload size={16} className="text-[#D4AF37]" /> Upload Document
            </Link>
            <Link
              to="/dashboard/settings"
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all text-xs"
              title="Platform Settings"
            >
              <Settings size={16} />
            </Link>
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className={`glass-panel glass-panel-hover p-6 sm:p-8 rounded-3xl animate-fade-in-up border border-white/5 relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium tracking-wide mb-1">{stat.title}</h3>
              <p className="text-3xl sm:text-4xl font-light text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Activity Log & Platform Integrity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">System Activity Audit Log</h3>
                <p className="text-xs text-gray-400">Real-time status updates across all accounts.</p>
              </div>
            </div>
            <span className="text-xs text-[#D4AF37] font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" /> Live
            </span>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-gray-500 border border-white/5 border-dashed rounded-2xl">
                <Activity size={28} className="mx-auto mb-2 opacity-30 text-[#D4AF37]" />
                <p className="text-sm">No recent activity logged yet.</p>
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-start justify-between gap-4 hover:border-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white/5 text-[#D4AF37] mt-0.5">
                      {act.type === 'user' ? <Users size={16} /> : act.type === 'doc' ? <FileText size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-200">{act.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{act.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 shrink-0">
                    <Clock size={12} /> {act.time}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Fiduciary Security Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[50px] pointer-events-none" />
          
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#0A2A1B] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-6 shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Platform Encryption Vault</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              All client documents, layout profiles, and fiduciary data are protected with AES-256 military-grade encryption.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Database Sync</span>
              <span className="text-green-400 font-medium">100% Operational</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>TLS Security</span>
              <span className="text-[#D4AF37] font-medium">v1.3 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

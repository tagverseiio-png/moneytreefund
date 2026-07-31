import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Users, FileText, Settings, Briefcase, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export const DashboardLayout = () => {
  const { signOut, user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setScrolled(target.scrollTop > 10);
    };
    const mainContent = document.getElementById('main-content');
    mainContent?.addEventListener('scroll', handleScroll);
    return () => mainContent?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: Home, adminOnly: false },
    { name: 'Clients', path: '/dashboard/clients', icon: Users, adminOnly: true },
    { name: 'Trusts', path: '/dashboard/trusts', icon: Briefcase, adminOnly: true },
    { name: 'Documents', path: '/dashboard/documents', icon: FileText, adminOnly: true },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || role === 'Admin');

  return (
    <div className="min-h-screen bg-[#03120B] text-[#FDFBF7] flex overflow-hidden font-sans relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#0A2A1B]/40 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-72 glass-panel border-y-0 border-l-0 border-r border-white/5 flex flex-col relative z-10">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-serif">MoneyTree<span className="text-gradient-gold">Fund</span></h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]"></span>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{role} Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ease-out ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 text-[#D4AF37] shadow-[inset_4px_0_0_0_#D4AF37]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <Icon size={20} className={isActive ? 'text-[#D4AF37]' : 'text-gray-500 group-hover:text-gray-300 transition-colors'} />
                  <span className="font-medium text-sm tracking-wide">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} className="text-[#D4AF37]/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="mb-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A2A1B] to-[#D4AF37]/20 flex items-center justify-center border border-white/10 text-[#D4AF37] font-serif text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate text-gray-200">{user?.displayName || 'User'}</p>
              <p className="text-xs truncate text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-300"
          >
            <LogOut size={16} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen relative z-10 overflow-hidden">
        {/* Sticky Header */}
        <header 
          className={`h-20 flex items-center justify-between px-10 transition-all duration-300 z-20 ${
            scrolled ? 'glass-panel border-x-0 border-t-0 shadow-lg' : 'bg-transparent border-b border-transparent'
          }`}
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-light text-gray-100 tracking-wide">
              {visibleNavItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Can add notifications or search here in future */}
          </div>
        </header>

        {/* Scrollable Content */}
        <div id="main-content" className="flex-1 overflow-y-auto custom-scrollbar px-10 py-8 relative">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

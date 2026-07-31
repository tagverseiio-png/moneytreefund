
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, Users, FileText, Settings, Briefcase } from 'lucide-react';

export const DashboardLayout = () => {
  const { signOut, user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#03120B] text-[#FDFBF7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051a10] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-light">MoneyTree<span className="text-[#D4AF37]">Fund</span></h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{role} Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded transition-colors">
            <Home size={18} />
            <span>Overview</span>
          </Link>
          <Link to="/dashboard/clients" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded transition-colors">
            <Users size={18} />
            <span>Clients</span>
          </Link>
          <Link to="/dashboard/trusts" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded transition-colors">
            <Briefcase size={18} />
            <span>Trusts</span>
          </Link>
          <Link to="/dashboard/documents" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded transition-colors">
            <FileText size={18} />
            <span>Documents</span>
          </Link>
          <Link to="/dashboard/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] rounded transition-colors">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="px-4 py-2 mb-4">
            <p className="text-sm truncate text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center px-8 bg-[#051a10]">
          <h2 className="text-lg font-medium text-gray-200">Dashboard</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

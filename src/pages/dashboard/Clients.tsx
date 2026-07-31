import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Mail, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export const Clients = () => {
  const { role } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      if (res.data.success) {
        setClients(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setCreating(true);
      setError('');
      setSuccess('');
      
      await api.post('/clients', { name, email, password });
      
      setSuccess('Client user created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchClients(); // refresh list
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.response?.data?.message || 'Failed to create client');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white">Clients</h2>
        <p className="text-gray-400 mt-1">Manage client profiles and securely create user accounts.</p>
      </div>

      {role === 'Admin' && (
        <form onSubmit={handleCreateClient} className="bg-[#051a10] border border-white/5 p-6 rounded-lg space-y-4">
          <h3 className="text-[#D4AF37] font-medium tracking-wide uppercase text-sm mb-4">Create New Client Account</h3>
          
          {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded">{error}</div>}
          {success && <div className="text-green-400 text-sm bg-green-400/10 p-3 rounded">{success}</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Temporary Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck size={16} className="text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md pl-10 pr-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={creating || !name || !email || !password}
              className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#FDFBF7] transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <UserPlus size={16} />
              {creating ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#051a10] border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No clients found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-black/20 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Client Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Email Address</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-gray-200 font-medium">{client.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{client.email}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

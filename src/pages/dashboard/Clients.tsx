import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Mail, User, ShieldCheck, CheckCircle2, FileText, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  status?: string;
  createdAt: string;
}

export const Clients = () => {
  const { role } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for creating client
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state for requesting documents
  const [requestModalClient, setRequestModalClient] = useState<Client | null>(null);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [requesting, setRequesting] = useState(false);

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
      
      setSuccess('Client account created successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchClients();
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.response?.data?.message || 'Failed to create client');
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (clientId: string) => {
    if (!window.confirm('Are you sure you want to approve this client account?')) return;
    try {
      await api.put(`/clients/${clientId}/approve`);
      fetchClients();
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Failed to approve client.');
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestModalClient || !reqTitle) return;

    try {
      setRequesting(true);
      await api.post(`/clients/${requestModalClient.id}/requests`, {
        title: reqTitle,
        description: reqDesc
      });
      alert('Document request sent successfully.');
      setRequestModalClient(null);
      setReqTitle('');
      setReqDesc('');
    } catch (error) {
      console.error('Request failed:', error);
      alert('Failed to send document request.');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-light text-white">Clients</h2>
        <p className="text-gray-400 mt-1">Manage client profiles, approve accounts, and request documents.</p>
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
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Date Added</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-200">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${client.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                      {client.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {role === 'Admin' && (
                      <>
                        <button 
                          onClick={() => setRequestModalClient(client)}
                          className="px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded text-sm transition-colors border border-[#D4AF37]/30"
                          title="Request Document"
                        >
                          <FileText size={16} className="inline mr-1" /> Request Doc
                        </button>
                        {client.status !== 'Active' && (
                          <button 
                            onClick={() => handleApprove(client.id)}
                            className="px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded text-sm transition-colors border border-green-500/30"
                            title="Approve Account"
                          >
                            <CheckCircle2 size={16} className="inline mr-1" /> Approve
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Document Request Modal */}
      {requestModalClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#051a10] border border-white/10 p-6 rounded-lg shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setRequestModalClient(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-light text-white mb-2">Request Document</h3>
            <p className="text-gray-400 text-sm mb-6">Ask <span className="text-[#D4AF37]">{requestModalClient.name}</span> to upload a specific document.</p>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Document Title (Required)</label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="e.g., Passport Copy"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Instructions (Optional)</label>
                <textarea
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37] min-h-[100px]"
                  placeholder="Please upload a color copy of your passport..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalClient(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={requesting || !reqTitle}
                  className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#FDFBF7] transition-all disabled:opacity-50"
                >
                  {requesting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

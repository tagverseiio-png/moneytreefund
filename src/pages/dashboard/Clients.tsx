import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Mail, User, ShieldCheck, CheckCircle2, FileText, X, Key, AlertTriangle, Settings2, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
  status?: string;
  layoutId?: string;
  createdAt: string;
}

interface PasswordResetRequest {
  id: string;
  email: string;
  status: string;
  createdAt: string;
}

interface Layout {
  id: string;
  name: string;
}

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  status: string;
}

export const Clients = () => {
  const { role } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [passwordResets, setPasswordResets] = useState<PasswordResetRequest[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state for creating client
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal state for changing password
  const [passwordModalClient, setPasswordModalClient] = useState<Client | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);

  // Modal state for Profile Settings (Layout + Docs)
  const [profileModalClient, setProfileModalClient] = useState<Client | null>(null);
  const [clientRequests, setClientRequests] = useState<DocumentRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  
  // Layout change state
  const [newLayoutId, setNewLayoutId] = useState('');
  const [settingLayout, setSettingLayout] = useState(false);

  // New Doc Request state
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [requesting, setRequesting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsRes, resetsRes, layoutsRes] = await Promise.all([
        api.get('/clients'),
        role === 'Admin' ? api.get('/clients/password-resets') : Promise.resolve({ data: { success: true, data: [] } }),
        api.get('/settings/layouts/public')
      ]);
      if (clientsRes.data.success) {
        setClients(clientsRes.data.data);
      }
      if (resetsRes.data.success) {
        setPasswordResets(resetsRes.data.data);
      }
      if (layoutsRes.data.success) {
        setLayouts(layoutsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

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
      fetchData();
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
      fetchData();
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Failed to approve client.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalClient || !newPassword) return;
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    try {
      setSettingPassword(true);
      await api.put(`/clients/${passwordModalClient.id}/password`, {
        password: newPassword
      });
      alert('Password updated successfully.');
      setPasswordModalClient(null);
      setNewPassword('');
      fetchData();
    } catch (error) {
      console.error('Password reset failed:', error);
      alert('Failed to update password.');
    } finally {
      setSettingPassword(false);
    }
  };

  // --- Profile Settings Methods ---

  const fetchClientRequests = async (clientId: string) => {
    try {
      setLoadingRequests(true);
      const res = await api.get(`/clients/${clientId}/requests`);
      if (res.data.success) {
        setClientRequests(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const openProfileModal = (client: Client) => {
    setProfileModalClient(client);
    setNewLayoutId(client.layoutId || '');
    setReqTitle('');
    setReqDesc('');
    fetchClientRequests(client.id);
  };

  const handleChangeLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileModalClient || !newLayoutId) return;

    try {
      setSettingLayout(true);
      await api.put(`/clients/${profileModalClient.id}/layout`, {
        layoutId: newLayoutId
      });
      // Update local state without closing modal
      setProfileModalClient({ ...profileModalClient, layoutId: newLayoutId });
      fetchData(); // Refresh background data
      alert('Profile Layout updated successfully. Note: This does not automatically re-generate new document requests.');
    } catch (error) {
      console.error('Layout update failed:', error);
      alert('Failed to update profile layout.');
    } finally {
      setSettingLayout(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileModalClient || !reqTitle) return;

    try {
      setRequesting(true);
      await api.post(`/clients/${profileModalClient.id}/requests`, {
        title: reqTitle,
        description: reqDesc
      });
      // Refresh requests without closing modal
      await fetchClientRequests(profileModalClient.id);
      setReqTitle('');
      setReqDesc('');
    } catch (error) {
      console.error('Request failed:', error);
      alert('Failed to send document request.');
    } finally {
      setRequesting(false);
    }
  };

  const getLayoutName = (id?: string) => {
    if (!id) return 'Unassigned';
    return layouts.find(l => l.id === id)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h2 className="text-2xl font-light text-white">Clients</h2>
        <p className="text-gray-400 mt-1">Manage client profiles, approve accounts, and request documents.</p>
      </div>

      {role === 'Admin' && passwordResets.length > 0 && (
        <div className="bg-yellow-900/30 border border-yellow-500/50 p-4 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-400 mt-0.5" size={20} />
          <div>
            <h3 className="text-yellow-400 font-medium">Pending Password Reset Requests</h3>
            <p className="text-sm text-yellow-200/70 mt-1">
              The following emails have requested a password reset: {passwordResets.map(r => r.email).join(', ')}. 
              Find the corresponding client below and click "Change Password".
            </p>
          </div>
        </div>
      )}

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
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Profile Layout</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Date Added</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => {
                const hasResetRequest = passwordResets.some(r => r.email === client.email);
                return (
                  <tr key={client.id} className={`hover:bg-white/[0.02] transition-colors ${hasResetRequest ? 'bg-yellow-500/[0.05]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-200 flex items-center gap-2">
                        {client.name}
                        {hasResetRequest && <AlertTriangle size={14} className="text-yellow-500" title="Password Reset Requested" />}
                      </div>
                      <div className="text-sm text-gray-500">{client.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 text-sm bg-white/5 px-2 py-1 rounded">
                        {getLayoutName(client.layoutId)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${client.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {client.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      {role === 'Admin' && (
                        <>
                          <button 
                            onClick={() => openProfileModal(client)}
                            className="px-3 py-1.5 bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 rounded text-sm transition-colors border border-[#D4AF37]/30"
                            title="Manage Profile"
                          >
                            <Settings2 size={16} className="inline mr-1" /> Profile Settings
                          </button>
                          <button 
                            onClick={() => setPasswordModalClient(client)}
                            className="px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded text-sm transition-colors border border-blue-500/30"
                            title="Change Password"
                          >
                            <Key size={16} className="inline mr-1" /> Password
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* User Profile Settings Modal */}
      {profileModalClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#051a10] border border-white/10 p-8 rounded-lg shadow-2xl max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setProfileModalClient(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8 pr-12">
              <h3 className="text-2xl font-light text-white mb-1">User Profile Settings</h3>
              <p className="text-gray-400">Manage settings and required documents for <span className="text-[#D4AF37] font-medium">{profileModalClient.name}</span></p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: User Data & Layout */}
              <div className="space-y-6">
                <div className="bg-[#03120B] p-6 rounded-lg border border-white/5 space-y-4">
                  <h4 className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium mb-4 flex items-center gap-2">
                    <User size={16} /> User Information
                  </h4>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={profileModalClient.name}
                      className="w-full bg-black/20 border border-white/5 rounded-md px-4 py-2 text-gray-300 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profileModalClient.email}
                      className="w-full bg-black/20 border border-white/5 rounded-md px-4 py-2 text-gray-300 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="bg-[#03120B] p-6 rounded-lg border border-white/5">
                  <h4 className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium mb-4 flex items-center gap-2">
                    <Settings2 size={16} /> Profile Layout
                  </h4>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                    Changing this dictates which template they fall under. It will not automatically generate or delete existing document requests.
                  </p>
                  <form onSubmit={handleChangeLayout} className="flex gap-3">
                    <select
                      value={newLayoutId}
                      onChange={(e) => setNewLayoutId(e.target.value)}
                      required
                      className="flex-1 bg-black/20 border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="" disabled>Select a Layout</option>
                      {layouts.map(layout => (
                        <option key={layout.id} value={layout.id}>{layout.name}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={settingLayout || !newLayoutId || newLayoutId === profileModalClient.layoutId}
                      className="px-4 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#FDFBF7] transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {settingLayout ? 'Saving...' : 'Update'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Document Requirements */}
              <div className="bg-[#03120B] p-6 rounded-lg border border-white/5 flex flex-col h-full max-h-[500px]">
                <h4 className="text-[#D4AF37] text-sm uppercase tracking-wider font-medium mb-4 flex items-center gap-2">
                  <FileText size={16} /> Document Requirements
                </h4>
                
                <div className="flex-1 space-y-3 mb-6 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                  {loadingRequests ? (
                    <div className="text-gray-500 text-sm italic text-center py-4">Loading requirements...</div>
                  ) : clientRequests.length === 0 ? (
                    <div className="text-gray-500 text-sm italic text-center py-4">No document requirements assigned.</div>
                  ) : (
                    clientRequests.map(req => (
                      <div key={req.id} className="bg-black/20 border border-white/5 p-3 rounded-md flex justify-between items-center hover:border-white/10 transition-colors">
                        <div>
                          <div className="text-gray-200 font-medium text-sm">{req.title}</div>
                          {req.description && <div className="text-gray-500 text-xs mt-0.5">{req.description}</div>}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ml-3 ${
                          req.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-white/5 pt-6 mt-auto">
                  <h5 className="text-gray-300 text-sm font-medium mb-3">Add Custom Requirement</h5>
                  <form onSubmit={handleCreateRequest} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={reqTitle}
                      onChange={(e) => setReqTitle(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Document Title (e.g., Aadhar Card)"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={reqDesc}
                        onChange={(e) => setReqDesc(e.target.value)}
                        className="flex-1 bg-black/20 border border-white/10 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Instructions (Optional)"
                      />
                      <button
                        type="submit"
                        disabled={requesting || !reqTitle}
                        className="px-4 py-2 bg-white/10 text-white font-medium rounded-md hover:bg-white/20 transition-all disabled:opacity-50 flex items-center gap-1 text-sm whitespace-nowrap"
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordModalClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#051a10] border border-white/10 p-6 rounded-lg shadow-2xl max-w-md w-full relative">
            <button 
              onClick={() => setPasswordModalClient(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-light text-white mb-2">Change Password</h3>
            <p className="text-gray-400 text-sm mb-6">Manually set a new password for <span className="text-[#D4AF37]">{passwordModalClient.name}</span>.</p>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">New Password</label>
                <input
                  type="text"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                  placeholder="At least 6 characters"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPasswordModalClient(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={settingPassword || !newPassword || newPassword.length < 6}
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {settingPassword ? 'Saving...' : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

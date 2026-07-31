import { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Mail, User, Users, ShieldCheck, CheckCircle2, FileText, X, Key, AlertTriangle, Settings2, Plus, ArrowRight } from 'lucide-react';
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
  type?: 'file' | 'text';
  textResponse?: string;
}

export const Clients = () => {
  const { role } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [passwordResets, setPasswordResets] = useState<PasswordResetRequest[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Modals state
  const [passwordModalClient, setPasswordModalClient] = useState<Client | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [settingPassword, setSettingPassword] = useState(false);

  const [profileModalClient, setProfileModalClient] = useState<Client | null>(null);
  const [clientRequests, setClientRequests] = useState<DocumentRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  
  const [newLayoutId, setNewLayoutId] = useState('');
  const [settingLayout, setSettingLayout] = useState(false);

  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('file');
  const [requesting, setRequesting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clientsRes, resetsRes, layoutsRes] = await Promise.all([
        api.get('/clients'),
        role === 'Admin' ? api.get('/clients/password-resets') : Promise.resolve({ data: { success: true, data: [] } }),
        api.get('/settings/layouts/public')
      ]);
      if (clientsRes.data.success) setClients(clientsRes.data.data);
      if (resetsRes.data.success) setPasswordResets(resetsRes.data.data);
      if (layoutsRes.data.success) setLayouts(layoutsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [role]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      setCreating(true);
      await api.post('/clients', { name, email, password });
      setName(''); setEmail(''); setPassword('');
      setShowCreateModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create client');
    } finally {
      setCreating(false);
    }
  };

  const handleApprove = async (clientId: string) => {
    try {
      await api.put(`/clients/${clientId}/approve`);
      fetchData();
    } catch (error) {
      alert('Failed to approve client.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalClient || newPassword.length < 6) return;
    try {
      setSettingPassword(true);
      await api.put(`/clients/${passwordModalClient.id}/password`, { password: newPassword });
      setPasswordModalClient(null); setNewPassword('');
      fetchData();
    } catch (error) {
      alert('Failed to update password.');
    } finally {
      setSettingPassword(false);
    }
  };

  const fetchClientRequests = async (clientId: string) => {
    try {
      setLoadingRequests(true);
      const res = await api.get(`/clients/${clientId}/requests`);
      if (res.data.success) setClientRequests(res.data.data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const openProfileModal = (client: Client) => {
    setProfileModalClient(client);
    setNewLayoutId(client.layoutId || '');
    setReqTitle(''); setReqDesc(''); setReqType('file');
    fetchClientRequests(client.id);
  };

  const handleChangeLayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileModalClient || !newLayoutId) return;
    try {
      setSettingLayout(true);
      await api.put(`/clients/${profileModalClient.id}/layout`, { layoutId: newLayoutId });
      setProfileModalClient({ ...profileModalClient, layoutId: newLayoutId });
      fetchData();
    } catch (error) {
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
      await api.post(`/clients/${profileModalClient.id}/requests`, { title: reqTitle, description: reqDesc, type: reqType });
      await fetchClientRequests(profileModalClient.id);
      setReqTitle(''); setReqDesc(''); setReqType('file');
    } catch (error) {
      alert('Failed to send document request.');
    } finally {
      setRequesting(false);
    }
  };

  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const handleAdminUpload = async (e: React.ChangeEvent<HTMLInputElement>, requestId: string, clientId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFor(requestId);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', clientId);
      formData.append('requestId', requestId);
      
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Document securely uploaded on behalf of client.');
      fetchClientRequests(clientId);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      const res = await api.get(`/documents/${documentId}/url`);
      if (res.data.success && res.data.data.url) {
        window.open(res.data.data.url, '_blank');
      } else {
        alert('Could not retrieve document URL.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to get document.');
    }
  };

  const handleDeleteDocument = async (documentId: string, clientId: string) => {
    if (!window.confirm('Are you sure you want to delete this document? The requirement will return to Pending.')) return;
    try {
      await api.delete(`/documents/${documentId}`);
      fetchClientRequests(clientId);
    } catch (err) {
      console.error(err);
      alert('Failed to delete document.');
    }
  };

  const getLayoutName = (id?: string) => layouts.find(l => l.id === id)?.name || 'Unassigned';

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white tracking-wide">Client Portfolio</h1>
          <p className="text-gray-400 mt-2 font-light">Manage your client relationships, onboarding profiles, and documents.</p>
        </div>
        {role === 'Admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FCEBBA] text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2"
          >
            <UserPlus size={18} /> New Client
          </button>
        )}
      </div>

      {role === 'Admin' && passwordResets.length > 0 && (
        <div className="glass-panel border-yellow-500/30 p-5 rounded-2xl flex items-start gap-4 animate-fade-in-up">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 border border-yellow-500/50">
            <AlertTriangle className="text-yellow-400" size={20} />
          </div>
          <div>
            <h3 className="text-yellow-400 font-medium tracking-wide">Action Required: Password Resets</h3>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed">
              Pending requests for: {passwordResets.map(r => r.email).join(', ')}. 
              Locate the client below and manually issue a new password.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="glass-panel py-20 text-center rounded-3xl animate-fade-in-up">
          <Users className="mx-auto text-gray-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-gray-300">No Clients Yet</h3>
          <p className="text-gray-500 mt-2">Create your first client account to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up animate-delay-100">
          {clients.map((client) => {
            const hasResetRequest = passwordResets.some(r => r.email === client.email);
            return (
              <div key={client.id} className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col relative group overflow-hidden">
                {/* Active Indicator Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${client.status === 'Active' ? 'bg-[#D4AF37]/50' : 'bg-yellow-500/50'}`} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A2A1B] to-[#03120B] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-serif text-xl shadow-inner">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white tracking-wide flex items-center gap-2">
                        {client.name}
                        {hasResetRequest && <AlertTriangle size={16} className="text-yellow-400 animate-pulse" title="Password Reset Requested" />}
                      </h3>
                      <p className="text-sm text-gray-500">{client.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400">Profile Layout</span>
                    <span className="text-[#D4AF37] font-medium">{getLayoutName(client.layoutId)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400">Account Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${client.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'}`}>
                      {client.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-gray-400">Joined</span>
                    <span className="text-gray-300">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {role === 'Admin' && (
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => openProfileModal(client)}
                      className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm transition-all duration-300 border border-white/10 flex items-center justify-center gap-2"
                    >
                      <Settings2 size={16} /> Manage
                    </button>
                    <button 
                      onClick={() => setPasswordModalClient(client)}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 border border-white/10"
                      title="Reset Password"
                    >
                      <Key size={16} />
                    </button>
                    {client.status !== 'Active' && (
                      <button 
                        onClick={() => handleApprove(client.id)}
                        className="px-4 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all duration-300 border border-green-500/20"
                        title="Approve Account"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full relative shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-serif text-white mb-6">New Client</h3>
            <form onSubmit={handleCreateClient} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium tracking-wide">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white input-glow transition-all" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white input-glow transition-all" placeholder="client@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium tracking-wide">Temporary Password</label>
                <div className="relative">
                  <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white input-glow transition-all" placeholder="Min. 6 characters" />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10">Cancel</button>
                <button type="submit" disabled={creating || !name || !email || !password} className="flex-1 px-4 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#FCEBBA] transition-all disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Profile Settings Modal */}
      {profileModalClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="glass-panel p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-5xl w-full relative max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
            <button onClick={() => setProfileModalClient(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>
            
            <div className="mb-8 pr-12 shrink-0">
              <h3 className="text-3xl font-serif text-white mb-2 tracking-wide">Profile Settings</h3>
              <p className="text-gray-400 font-light">Managing configuration for <span className="text-[#D4AF37] font-medium">{profileModalClient.name}</span></p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">
              {/* Left Column: Data & Layout */}
              <div className="space-y-6">
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-6 flex items-center gap-2">
                    <User size={14} /> Identity Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                      <input disabled value={profileModalClient.name} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-gray-300 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                      <input disabled value={profileModalClient.email} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-gray-300 cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                  <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-6 flex items-center gap-2">
                    <Settings2 size={14} /> Layout Template
                  </h4>
                  <form onSubmit={handleChangeLayout} className="flex gap-3">
                    <select value={newLayoutId} onChange={(e) => setNewLayoutId(e.target.value)} required className="flex-1 bg-[#0A2A1B] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] transition-colors appearance-none">
                      <option value="" disabled>Select Layout</option>
                      {layouts.map(layout => <option key={layout.id} value={layout.id}>{layout.name}</option>)}
                    </select>
                    <button type="submit" disabled={settingLayout || !newLayoutId} className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#FCEBBA] transition-all disabled:opacity-50">
                      {settingLayout ? 'Saving...' : 'Apply'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Profile Data & Documents */}
              <div className="flex flex-col gap-6 h-full min-h-[400px]">
                
                {/* Profile Data Section */}
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5 flex flex-col flex-1">
                  <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
                    <User size={14} /> Profile Data
                  </h4>
                  <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
                    {loadingRequests ? (
                      <div className="text-gray-500 text-sm italic text-center py-4">Loading...</div>
                    ) : clientRequests.filter(r => r.type === 'text').length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/5 border-dashed">No profile data requested.</div>
                    ) : (
                      clientRequests.filter(r => r.type === 'text').map(req => (
                        <div key={req.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <div className="text-gray-300 text-sm font-medium">{req.title}</div>
                            {req.status === 'Fulfilled' ? (
                              <div className="mt-1 text-white text-sm bg-black/40 px-3 py-2 rounded-lg border border-white/10">
                                {req.textResponse}
                              </div>
                            ) : (
                              <div className="mt-1 text-gray-500 text-xs italic">Pending client response...</div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Documents Section */}
                <div className="bg-black/30 p-6 rounded-2xl border border-white/5 flex flex-col flex-1">
                  <h4 className="text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4 flex items-center gap-2">
                    <FileText size={14} /> Document Uploads
                  </h4>
                  <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 max-h-[250px]">
                    {loadingRequests ? (
                      <div className="text-gray-500 text-sm italic text-center py-4">Loading...</div>
                    ) : clientRequests.filter(r => r.type !== 'text').length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl border border-white/5 border-dashed">No documents requested.</div>
                    ) : (
                      clientRequests.filter(r => r.type !== 'text').map(req => (
                        <div key={req.id} className="bg-white/5 border border-white/5 p-3 rounded-xl flex justify-between items-center gap-2">
                          <div className="flex-1">
                            <div className="text-gray-300 text-sm font-medium">{req.title}</div>
                            <div className="text-gray-500 text-xs mt-0.5">{req.description || 'File upload'}</div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {req.status === 'Pending' ? (
                              <label className={`cursor-pointer px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] uppercase font-bold tracking-wider transition-all ${uploadingFor === req.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                {uploadingFor === req.id ? 'Uploading' : 'Upload'}
                                <input type="file" className="hidden" onChange={(e) => handleAdminUpload(e, req.id, profileModalClient.id)} />
                              </label>
                            ) : req.documentId ? (
                              <>
                                <button onClick={() => handleDownload(req.documentId!)} className="px-3 py-1 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] rounded text-[10px] uppercase font-bold tracking-wider transition-all">
                                  View File
                                </button>
                                <button onClick={() => handleDeleteDocument(req.documentId!, profileModalClient.id)} className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded text-[10px] uppercase font-bold tracking-wider transition-all">
                                  Delete
                                </button>
                              </>
                            ) : null}
                            
                            <span className={`text-[10px] px-2 py-1 rounded-full border uppercase tracking-wider ${
                              req.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                              req.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                              'bg-green-500/10 text-green-400 border-green-500/30'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Create New Request */}
                  <div className="pt-4 border-t border-white/5 mt-4 shrink-0">
                    <form onSubmit={handleCreateRequest} className="space-y-3">
                      <input type="text" required value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} className="w-full bg-[#0A2A1B] border border-white/10 rounded-xl px-4 py-2 text-sm text-white input-glow transition-all" placeholder="New Field/Document Title" />
                      <div className="flex gap-2">
                        <select value={reqType} onChange={(e) => setReqType(e.target.value)} className="w-1/3 bg-[#0A2A1B] border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#D4AF37] transition-all appearance-none">
                          <option value="file">File</option>
                          <option value="text">Text</option>
                        </select>
                        <input type="text" value={reqDesc} onChange={(e) => setReqDesc(e.target.value)} className="w-2/3 bg-[#0A2A1B] border border-white/10 rounded-xl px-3 py-2 text-sm text-white input-glow transition-all" placeholder="Instructions (Opt)" />
                        <button type="submit" disabled={requesting || !reqTitle} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordModalClient && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="glass-panel p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-sm w-full relative border border-white/10">
            <button onClick={() => setPasswordModalClient(null)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-serif text-white mb-2">Change Password</h3>
            <p className="text-gray-400 text-sm mb-6">Manually issue a new password for <br/><span className="text-[#D4AF37]">{passwordModalClient.email}</span></p>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <input type="text" required minLength={6} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white input-glow transition-all" placeholder="New Password" />
              </div>
              <button type="submit" disabled={settingPassword || newPassword.length < 6} className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#FCEBBA] transition-all disabled:opacity-50">
                {settingPassword ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

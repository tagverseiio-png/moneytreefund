import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Upload, AlertCircle, CheckCircle2, FileText, Check, User, Eye, MessageSquare, Shield, HelpCircle, X } from 'lucide-react';

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Fulfilled' | 'Approved';
  type?: 'file' | 'text';
  textResponse?: string;
  createdAt: string;
  documentId?: string;
}

export const ClientPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [status, setStatus] = useState<string>('Pending');
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [dragOverReqId, setDragOverReqId] = useState<string | null>(null);
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportMsg, setSupportMsg] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  const fetchProfileAndRequests = async () => {
    try {
      setLoading(true);
      const meRes = await api.get('/auth/me');
      if (meRes.data.success) {
        setStatus(meRes.data.data.status || 'Pending');
      }

      if (user?.uid) {
        const reqRes = await api.get(`/clients/${user.uid}/requests`);
        if (reqRes.data.success) {
          setRequests(reqRes.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching portal data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRequests();
  }, [user]);

  const uploadFileForRequest = async (file: File, requestId: string) => {
    if (!user?.uid) return;
    try {
      setUploadingFor(requestId);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', user.uid);
      formData.append('requestId', requestId);
      
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Document securely uploaded. Our team will review it shortly.');
      fetchProfileAndRequests();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setUploadingFor(null);
      setDragOverReqId(null);
    }
  };

  const handleUploadFulfillment = async (e: React.ChangeEvent<HTMLInputElement>, requestId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFileForRequest(file, requestId);
    }
  };

  const handleDrop = async (e: React.DragEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverReqId(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFileForRequest(file, requestId);
    }
  };

  const handleTextSubmit = async (requestId: string) => {
    const textResponse = textInputs[requestId];
    if (!textResponse || !user?.uid) return;

    try {
      setUploadingFor(requestId);
      await api.put(`/clients/${user.uid}/requests/${requestId}/text`, { textResponse });
      toast.success('Information submitted securely.');
      fetchProfileAndRequests();
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to submit information.');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleDownloadDoc = async (documentId?: string) => {
    if (!documentId) return;
    try {
      const res = await api.get(`/documents/${documentId}/url`);
      if (res.data.success && res.data.data.url) {
        window.open(res.data.data.url, '_blank');
      } else {
        toast.error('Unable to retrieve file link.');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to open document.');
    }
  };

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    setSendingSupport(true);
    setTimeout(() => {
      setSendingSupport(false);
      setSupportMsg('');
      setShowSupportModal(false);
      toast.success('Your message has been sent to your assigned fiduciary manager.');
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Loading Client Workspace</p>
      </div>
    );
  }

  const textRequests = requests.filter(r => r.type === 'text');
  const fileRequests = requests.filter(r => r.type !== 'text');

  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const totalRequests = requests.length;
  const progressPercent = totalRequests === 0 ? 100 : Math.round(((totalRequests - pendingRequests) / totalRequests) * 100);

  return (
    <div className="max-w-5xl space-y-10 animate-fade-in-up">
      {/* Header Banner */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-gradient-to-l from-[#D4AF37]/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold mb-3">
              <Shield size={12} /> Institutional Vault Active
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-wide mb-3">
              Welcome back, <br/>
              <span className="text-gradient-gold font-medium">{user?.displayName || user?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-gray-400 font-light text-base sm:text-lg max-w-lg leading-relaxed">
              Complete your onboarding profile and provide any required compliance documents below.
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center shadow-inner flex flex-col items-center justify-center">
            <div className="relative inline-flex items-center justify-center mb-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={226.2}
                  strokeDashoffset={226.2 - (226.2 * progressPercent) / 100}
                  className="text-[#D4AF37] transition-all duration-1000 ease-out" 
                />
              </svg>
              <span className="absolute text-2xl font-light text-white">{progressPercent}%</span>
            </div>
            <p className="text-xs font-medium text-[#D4AF37] uppercase tracking-wider">Profile Setup</p>
          </div>
        </div>
      </div>

      {/* Account Status Card */}
      <div className={`glass-panel p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-500 ${
        status === 'Active' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 p-2 rounded-full shrink-0 ${status === 'Active' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
            {status === 'Active' ? (
              <CheckCircle2 className="text-green-400" size={24} />
            ) : (
              <AlertCircle className="text-yellow-400" size={24} />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-medium tracking-wide ${status === 'Active' ? 'text-green-400' : 'text-yellow-400'}`}>
              Account Status: {status}
            </h3>
            <p className="text-gray-300 mt-1 leading-relaxed text-sm md:text-base">
              {status === 'Active' 
                ? 'Your account is fully approved. You have full access to our fiduciary suite.' 
                : 'Your account is pending administrator approval. Please complete your profile tasks below.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSupportModal(true)}
          className="shrink-0 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-medium flex items-center gap-2 transition-all"
        >
          <MessageSquare size={14} className="text-[#D4AF37]" /> Contact Fiduciary
        </button>
      </div>

      {/* Main Grid: Profile Data & Document Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Data (Text Requests) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
          
          <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2 mb-6">
            <User className="text-[#D4AF37]" size={22} /> Profile Fields
          </h3>

          {textRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-2xl">
              <CheckCircle2 size={32} className="text-green-500/30 mb-3" />
              <p className="text-sm">No text responses required at this time.</p>
            </div>
          ) : (
            <div className="space-y-6 flex-1">
              {textRequests.map((req) => {
                const isPending = req.status === 'Pending';
                return (
                  <div key={req.id} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-sm font-medium text-gray-300 tracking-wide">{req.title}</label>
                      {!isPending && (
                        <span className="text-[10px] uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                          <Check size={10} /> Saved
                        </span>
                      )}
                    </div>
                    {isPending ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={textInputs[req.id] || ''}
                          onChange={(e) => setTextInputs({ ...textInputs, [req.id]: e.target.value })}
                          placeholder={req.description || "Enter response"}
                          className="flex-1 bg-black/40 border border-white/10 focus:border-[#D4AF37]/50 rounded-xl px-4 py-2.5 text-sm text-white transition-all outline-none"
                        />
                        <button
                          onClick={() => handleTextSubmit(req.id)}
                          disabled={!textInputs[req.id] || uploadingFor === req.id}
                          className="px-4 py-2 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl transition-all disabled:opacity-50 text-sm whitespace-nowrap"
                        >
                          {uploadingFor === req.id ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 flex items-center cursor-not-allowed">
                        {req.textResponse || 'Submitted'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Required Documents (File Requests with Drag & Drop) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
          
          <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2 mb-6">
            <FileText className="text-[#D4AF37]" size={22} /> Document Collection
          </h3>

          {fileRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-2xl">
              <CheckCircle2 size={32} className="text-green-500/30 mb-3" />
              <p className="text-sm">No additional documents required.</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {fileRequests.map((req) => {
                const isPending = req.status === 'Pending';
                const isDragActive = dragOverReqId === req.id;
                return (
                  <div
                    key={req.id}
                    onDragOver={(e) => { e.preventDefault(); if (isPending) setDragOverReqId(req.id); }}
                    onDragLeave={() => setDragOverReqId(null)}
                    onDrop={(e) => handleDrop(e, req.id)}
                    className={`p-5 rounded-2xl border transition-all ${
                      isDragActive
                        ? 'bg-[#D4AF37]/10 border-[#D4AF37] scale-[1.01]'
                        : isPending
                        ? 'bg-black/30 border-white/10 hover:border-white/20'
                        : 'bg-green-500/5 border-green-500/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-200 text-sm">{req.title}</h4>
                          {!isPending && (
                            <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                              Uploaded
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {req.description || 'Drag & drop file here or browse.'}
                        </p>
                      </div>
                      
                      {isPending ? (
                        <label className={`shrink-0 cursor-pointer px-4 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] transition-all rounded-xl font-medium text-xs flex items-center justify-center gap-2 ${uploadingFor === req.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          <Upload size={14} />
                          {uploadingFor === req.id ? 'Uploading...' : 'Browse File'}
                          <input type="file" className="hidden" onChange={(e) => handleUploadFulfillment(e, req.id)} />
                        </label>
                      ) : (
                        <div className="shrink-0 flex items-center gap-2">
                          {req.documentId && (
                            <button
                              onClick={() => handleDownloadDoc(req.documentId)}
                              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                              title="View Document"
                            >
                              <Eye size={13} className="text-[#D4AF37]" /> View
                            </button>
                          )}
                          <span className="px-3 py-1.5 text-green-400 text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 size={14} /> Vaulted
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Support / Contact Fiduciary Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">Contact Fiduciary Advisor</h3>
                <p className="text-xs text-gray-400">Direct encrypted line to your portfolio manager.</p>
              </div>
            </div>

            <form onSubmit={handleSendSupport} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="Describe your inquiry or question regarding compliance documents..."
                  className="w-full bg-black/40 border border-white/10 focus:border-[#D4AF37]/50 rounded-2xl p-4 text-sm text-white transition-all outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingSupport || !supportMsg.trim()}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
                >
                  {sendingSupport ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

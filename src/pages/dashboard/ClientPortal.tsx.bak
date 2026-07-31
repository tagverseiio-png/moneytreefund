import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, AlertCircle, CheckCircle2, FileText, ChevronRight, Check } from 'lucide-react';

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Fulfilled' | 'Approved';
  type?: 'file' | 'text';
  textResponse?: string;
  createdAt: string;
}

export const ClientPortal = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('Pending');
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [textInputs, setTextInputs] = useState<Record<string, string>>({});

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndRequests();
  }, [user]);

  const handleUploadFulfillment = async (e: React.ChangeEvent<HTMLInputElement>, requestId: string) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;

    try {
      setUploadingFor(requestId);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', user.uid);
      
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // In a robust implementation, the endpoint above would also update the req status to Fulfilled.
      alert('Document securely uploaded. Our team will review it shortly.');
      fetchProfileAndRequests();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploadingFor(null);
    }
  };

  const handleTextSubmit = async (requestId: string) => {
    const textResponse = textInputs[requestId];
    if (!textResponse || !user?.uid) return;

    try {
      setUploadingFor(requestId);
      await api.put(`/clients/${user.uid}/requests/${requestId}/text`, { textResponse });
      alert('Response securely submitted. Our team will review it shortly.');
      fetchProfileAndRequests();
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit response');
    } finally {
      setUploadingFor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">Loading Workspace</p>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const totalRequests = requests.length;
  const progressPercent = totalRequests === 0 ? 100 : Math.round(((totalRequests - pendingRequests) / totalRequests) * 100);

  return (
    <div className="max-w-5xl space-y-10 animate-fade-in-up">
      <div className="glass-panel p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Background glow specific to banner */}
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-gradient-to-l from-[#D4AF37]/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-serif text-white tracking-wide mb-3">
              Welcome back, <br/>
              <span className="text-gradient-gold font-medium">{user?.displayName || user?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-gray-400 font-light text-lg max-w-lg leading-relaxed">
              Complete your onboarding process by providing the requested documents below. Your secure vault is ready.
            </p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center shadow-inner">
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
            <p className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">Profile Setup</p>
          </div>
        </div>
      </div>

      <div className={`glass-panel p-6 rounded-2xl border flex items-start gap-4 transition-all duration-500 ${
        status === 'Active' ? 'bg-green-500/5 border-green-500/20' : 'bg-yellow-500/5 border-yellow-500/20'
      }`}>
        <div className={`mt-0.5 p-2 rounded-full ${status === 'Active' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
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
              ? 'Your account is fully approved. You have full access to our premium suite.' 
              : 'Your account is pending administrator approval. Please provide the required documents below to expedite verification.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-serif text-white tracking-wide flex items-center gap-2">
            <FileText className="text-[#D4AF37]" size={24} /> Action Items
          </h3>
        </div>
        
        {requests.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-white/5 border-dashed">
            <CheckCircle2 size={48} className="mx-auto text-green-500/50 mb-4" />
            <h4 className="text-xl font-medium text-gray-200 mb-2">You're all caught up!</h4>
            <p className="text-gray-500">No documents are currently requested by your administrator.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req, idx) => {
              const isPending = req.status === 'Pending';
              return (
                <div 
                  key={req.id} 
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-300 animate-fade-in-up animate-delay-${(idx % 4 + 1) * 100} ${
                    isPending ? 'border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/[0.04]' : 'border-green-500/20 bg-green-500/[0.02]'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-lg font-medium text-gray-100">{req.title}</h4>
                        {!isPending && <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1"><Check size={12}/> Received</span>}
                      </div>
                      <p className="text-sm text-gray-400 max-w-2xl">{req.description || 'Please provide a clear, legible copy of this document.'}</p>
                    </div>
                    
                    <div className="shrink-0 w-full md:w-auto">
                      {isPending ? (
                        req.type === 'text' ? (
                          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <input
                              type="text"
                              value={textInputs[req.id] || ''}
                              onChange={(e) => setTextInputs({ ...textInputs, [req.id]: e.target.value })}
                              placeholder="Enter your response..."
                              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white input-glow transition-all md:w-64"
                            />
                            <button
                              onClick={() => handleTextSubmit(req.id)}
                              disabled={!textInputs[req.id] || uploadingFor === req.id}
                              className="px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#FCEBBA] transition-all rounded-xl font-medium text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {uploadingFor === req.id ? 'Submitting...' : 'Submit'}
                              <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                            </button>
                          </div>
                        ) : (
                          <label className={`w-full md:w-auto cursor-pointer px-6 py-3 bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:text-[#FCEBBA] transition-all rounded-xl font-medium text-sm flex items-center justify-center gap-2 group ${uploadingFor === req.id ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload size={18} className="group-hover:-translate-y-1 transition-transform" />
                            {uploadingFor === req.id ? 'Uploading to Vault...' : 'Secure Upload'}
                            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={(e) => handleUploadFulfillment(e, req.id)}
                            />
                          </label>
                        )
                      ) : (
                        <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                          <CheckCircle2 size={18} className="text-green-500/50" /> {req.type === 'text' ? 'Submitted' : 'Uploaded'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

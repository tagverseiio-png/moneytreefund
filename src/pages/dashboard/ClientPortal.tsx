import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, AlertCircle, CheckCircle2, FileText, Check, User } from 'lucide-react';

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
      formData.append('requestId', requestId);
      
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
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
      alert('Response securely submitted.');
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

  const textRequests = requests.filter(r => r.type === 'text');
  const fileRequests = requests.filter(r => r.type !== 'text');

  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const totalRequests = requests.length;
  const progressPercent = totalRequests === 0 ? 100 : Math.round(((totalRequests - pendingRequests) / totalRequests) * 100);

  return (
    <div className="max-w-5xl space-y-10 animate-fade-in-up">
      <div className="glass-panel p-10 rounded-3xl relative overflow-hidden border border-white/10 shadow-2xl">
        <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[200%] bg-gradient-to-l from-[#D4AF37]/10 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-4xl font-serif text-white tracking-wide mb-3">
              Welcome back, <br/>
              <span className="text-gradient-gold font-medium">{user?.displayName || user?.email?.split('@')[0]}</span>
            </h2>
            <p className="text-gray-400 font-light text-lg max-w-lg leading-relaxed">
              Complete your onboarding profile and provide any required documents below.
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
              : 'Your account is pending administrator approval. Please complete your profile below to expedite verification.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Form (Text Requests) */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
          
          <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2 mb-6">
            <User className="text-[#D4AF37]" size={22} /> Profile Data
          </h3>

          {textRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl">
              <CheckCircle2 size={32} className="text-green-500/30 mb-3" />
              <p>No profile fields required.</p>
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
                          placeholder={req.description || "Enter value"}
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

        {/* Required Documents (File Requests) */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] pointer-events-none" />
          
          <h3 className="text-xl font-serif text-white tracking-wide flex items-center gap-2 mb-6">
            <FileText className="text-[#D4AF37]" size={22} /> Document Uploads
          </h3>

          {fileRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl">
              <CheckCircle2 size={32} className="text-green-500/30 mb-3" />
              <p>No documents required.</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {fileRequests.map((req) => {
                const isPending = req.status === 'Pending';
                return (
                  <div key={req.id} className={`p-4 rounded-xl border transition-all ${isPending ? 'bg-black/20 border-white/10 hover:border-[#D4AF37]/30' : 'bg-green-500/5 border-green-500/20'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-200 text-sm">{req.title}</h4>
                          {!isPending && <span className="bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase">Uploaded</span>}
                        </div>
                        <p className="text-xs text-gray-500">{req.description || 'Securely upload your file.'}</p>
                      </div>
                      
                      {isPending ? (
                        <label className={`shrink-0 cursor-pointer px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all rounded-lg font-medium text-xs flex items-center justify-center gap-2 ${uploadingFor === req.id ? 'opacity-50 pointer-events-none' : ''}`}>
                          <Upload size={14} />
                          {uploadingFor === req.id ? 'Uploading...' : 'Upload File'}
                          <input type="file" className="hidden" onChange={(e) => handleUploadFulfillment(e, req.id)} />
                        </label>
                      ) : (
                        <div className="shrink-0 px-4 py-2 bg-transparent text-gray-400 text-xs font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 size={14} className="text-green-500/50" /> Vaulted
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
    </div>
  );
};

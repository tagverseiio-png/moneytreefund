import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Fulfilled';
  createdAt: string;
}

export const ClientPortal = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>('Pending');
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

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
      
      // 1. Upload Document
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', user.uid);
      
      // We assume /documents handles the upload securely.
      // A more robust implementation would update the document request status to Fulfilled on backend.
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // For now, refresh lists
      alert('Document uploaded successfully. Admin will review it.');
      
      // In a real implementation we'd do a PUT /requests/:id to mark it Fulfilled.
      fetchProfileAndRequests();
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploadingFor(null);
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8">Loading your portal...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-light text-white">Welcome, {user?.email}</h2>
        <p className="text-gray-400 mt-1">Manage your account and required documents here.</p>
      </div>

      <div className={`p-6 rounded-lg border ${status === 'Active' ? 'bg-green-900/20 border-green-500/30' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30'}`}>
        <div className="flex items-start gap-4">
          {status === 'Active' ? (
            <CheckCircle2 className="text-green-400 mt-1" size={24} />
          ) : (
            <AlertCircle className="text-[#D4AF37] mt-1" size={24} />
          )}
          <div>
            <h3 className={`text-lg font-medium ${status === 'Active' ? 'text-green-400' : 'text-[#D4AF37]'}`}>
              Account Status: {status}
            </h3>
            <p className="text-gray-300 mt-1">
              {status === 'Active' 
                ? 'Your account is fully approved. You have full access to the platform.' 
                : 'Your account is pending administrator approval. Please provide any requested documents below to expedite the process.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#051a10] border border-white/5 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 bg-black/20">
          <h3 className="font-medium text-gray-200">Requested Documents</h3>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No documents requested at this time.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {requests.map(req => (
              <li key={req.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-medium text-gray-200">{req.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{req.description}</p>
                    <div className="mt-2 text-xs px-2 py-1 bg-white/5 rounded w-max text-gray-300">
                      Status: {req.status}
                    </div>
                  </div>
                  <div>
                    <label className={`cursor-pointer px-4 py-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all rounded font-medium text-sm flex items-center gap-2 ${uploadingFor === req.id ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload size={16} />
                      {uploadingFor === req.id ? 'Uploading...' : 'Upload File'}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleUploadFulfillment(e, req.id)}
                      />
                    </label>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Upload, File, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Document {
  id: string;
  fileName: string;
  clientName: string;
  size: number;
  uploadedAt: string;
}

export const Documents = () => {
  const { role } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, clientsRes] = await Promise.all([
        api.get('/documents'),
        api.get('/clients') // ensure this exists or fails gracefully
      ]);
      if (docsRes.data.success) setDocuments(docsRes.data.data);
      if (clientsRes.data?.success) setClients(clientsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedClientId) return;

    const selectedClient = clients.find(c => c.id === selectedClientId);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', selectedClientId);
    if (selectedClient) {
      formData.append('clientName', selectedClient.name);
    }

    try {
      setUploading(true);
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      setSelectedClientId('');
      fetchData(); // refresh list
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId: string) => {
    try {
      const res = await api.get(`/documents/${docId}/url`);
      if (res.data.success && res.data.data.url) {
        window.open(res.data.data.url, '_blank');
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to open document');
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      setDocuments(docs => docs.filter(d => d.id !== docId));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-light text-white">Documents</h2>
          <p className="text-gray-400 mt-1">Securely view and manage legal and fiduciary documents.</p>
        </div>
      </div>

      {role === 'Admin' && (
        <form onSubmit={handleUpload} className="bg-[#051a10] border border-white/5 p-6 rounded-lg space-y-4">
          <h3 className="text-[#D4AF37] font-medium tracking-wide uppercase text-sm mb-4">Upload New Document</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Select Client</label>
              <select
                required
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="">-- Choose Client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-2">Select File</label>
              <input
                type="file"
                required
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-1.5 text-gray-200 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={uploading || !file || !selectedClientId}
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#FDFBF7] transition-all disabled:opacity-50 flex items-center gap-2 h-[42px]"
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-[#051a10] border border-white/5 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No documents found.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-black/20 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">File Name</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Client</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Size</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">Date Uploaded</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <File size={16} className="text-[#D4AF37]" />
                      <span className="text-gray-200">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{doc.clientName}</td>
                  <td className="px-6 py-4 text-gray-400">{(doc.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => handleDownload(doc.id)}
                        className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded transition-all"
                        title="View / Download"
                      >
                        <Eye size={18} />
                      </button>
                      {role === 'Admin' && (
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

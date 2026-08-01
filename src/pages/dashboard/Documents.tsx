import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { Upload, File, Trash2, Eye, Search, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

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
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, clientsRes] = await Promise.all([
        api.get('/documents'),
        api.get('/clients')
      ]);
      if (docsRes.data.success) setDocuments(docsRes.data.data);
      if (clientsRes.data?.success) setClients(clientsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDocuments = useMemo(() => {
    if (!searchQuery) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      doc => doc.fileName.toLowerCase().includes(q) || doc.clientName?.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

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
      toast.success('Document uploaded to vault.');
      setFile(null);
      setSelectedClientId('');
      fetchData();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId: string) => {
    try {
      const res = await api.get(`/documents/${docId}/url`);
      if (res.data.success && res.data.data.url) {
        window.open(res.data.data.url, '_blank');
      } else {
        toast.error('Unable to generate file download URL.');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to open document');
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      toast.info('Document deleted from vault.');
      setDocuments(docs => docs.filter(d => d.id !== docId));
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete document');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-white tracking-wide">Documents Vault</h2>
          <p className="text-gray-400 mt-1 font-light text-sm sm:text-base">Securely view and manage legal and fiduciary documents.</p>
        </div>
      </div>

      {/* Admin Upload Form */}
      {role === 'Admin' && (
        <form onSubmit={handleUpload} className="glass-panel border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-[#D4AF37] font-medium tracking-wider uppercase text-xs">Upload New Document</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-2">Select Client</label>
              <select
                required
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full bg-[#03120B] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#D4AF37] transition-all"
              >
                <option value="">-- Choose Client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name} ({client.email})</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-2">Select File</label>
              <input
                type="file"
                required
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-[#03120B] border border-white/10 rounded-xl px-4 py-1.5 text-sm text-gray-200 focus:outline-none file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20 transition-all"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={uploading || !file || !selectedClientId}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 h-[42px] text-xs whitespace-nowrap"
              >
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Document Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search documents by file name or client..."
          className="w-full bg-black/40 border border-white/10 focus:border-[#D4AF37]/50 rounded-2xl pl-11 pr-10 py-3 text-sm text-white transition-all outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Documents Table */}
      <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Loading vault files...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <File size={36} className="mx-auto mb-3 opacity-40 text-[#D4AF37]" />
            <p className="text-sm font-medium">No documents found matching criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/40 border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">File Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Client</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Size</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Uploaded</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <File size={16} className="text-[#D4AF37] shrink-0" />
                        <span className="text-gray-200 font-medium">{doc.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{doc.clientName || 'General'}</td>
                    <td className="px-6 py-4 text-gray-400">{(doc.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDownload(doc.id)}
                          className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all"
                          title="View / Download"
                        >
                          <Eye size={18} />
                        </button>
                        {role === 'Admin' && (
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
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
          </div>
        )}
      </div>
    </div>
  );
};

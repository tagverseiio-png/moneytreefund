import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, FileText, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RequiredDoc {
  title: string;
  description: string;
}

interface DocumentLayout {
  id: string;
  name: string;
  requiredDocs: RequiredDoc[];
}

export const Settings = () => {
  const { role } = useAuth();
  const [layouts, setLayouts] = useState<DocumentLayout[]>([]);
  const [loading, setLoading] = useState(true);

  const [formName, setFormName] = useState('');
  const [formDocs, setFormDocs] = useState<RequiredDoc[]>([{ title: '', description: '' }]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings/layouts');
      if (res.data.success) {
        setLayouts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const handleDocChange = (index: number, field: keyof RequiredDoc, value: string) => {
    const newDocs = [...formDocs];
    newDocs[index][field] = value;
    setFormDocs(newDocs);
  };

  const addDocField = () => {
    setFormDocs([...formDocs, { title: '', description: '' }]);
  };

  const removeDocField = (index: number) => {
    const newDocs = formDocs.filter((_, i) => i !== index);
    setFormDocs(newDocs);
  };

  const resetForm = () => {
    setFormName('');
    setFormDocs([{ title: '', description: '' }]);
    setEditingId(null);
  };

  const handleEdit = (layout: DocumentLayout) => {
    setEditingId(layout.id);
    setFormName(layout.name);
    setFormDocs(layout.requiredDocs.length > 0 ? [...layout.requiredDocs] : [{ title: '', description: '' }]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this layout?')) return;
    try {
      await api.delete(`/settings/layouts/${id}`);
      fetchLayouts();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete layout.');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validDocs = formDocs.filter(d => d.title.trim() !== '');
    if (!formName || validDocs.length === 0) {
      alert('Please provide a layout name and at least one document title.');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/settings/layouts/${editingId}`, { name: formName, requiredDocs: validDocs });
      } else {
        await api.post('/settings/layouts', { name: formName, requiredDocs: validDocs });
      }
      resetForm();
      fetchLayouts();
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save layout.');
    } finally {
      setSaving(false);
    }
  };

  if (role !== 'Admin') {
    return <div className="p-8 text-gray-400">Settings are restricted to Administrators.</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-serif text-white tracking-wide">Platform Settings</h1>
        <p className="text-gray-400 mt-2 font-light text-lg">Design client onboarding profiles and automate document collection.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Create / Edit Form */}
        <div className="glass-panel rounded-3xl p-8 h-fit shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-transparent opacity-50" />
          
          <h3 className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm mb-8 flex items-center gap-2">
            <LayoutTemplate size={16} />
            {editingId ? 'Edit Layout Profile' : 'Create New Layout Profile'}
          </h3>
          
          <form onSubmit={handleSave} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm text-gray-400 mb-2 font-medium">Profile Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-[#03120B]/60 border border-white/10 rounded-xl px-4 py-3 text-white input-glow transition-all"
                placeholder="e.g. Corporate KYC"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-4 flex items-center justify-between font-medium">
                <span>Required Documents</span>
                <button type="button" onClick={addDocField} className="text-xs text-[#D4AF37] hover:bg-[#D4AF37]/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 border border-[#D4AF37]/20">
                  <Plus size={12} /> Add Field
                </button>
              </label>
              
              <div className="space-y-3">
                {formDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 relative group transition-all hover:bg-white/10">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={e => handleDocChange(idx, 'title', e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white input-glow transition-all"
                        placeholder="Document Title (e.g. Identity Proof)"
                      />
                      <input
                        type="text"
                        value={doc.description}
                        onChange={e => handleDocChange(idx, 'description', e.target.value)}
                        className="w-full bg-black/40 border border-transparent rounded-xl px-4 py-2.5 text-sm text-gray-400 input-glow transition-all"
                        placeholder="Instructions (Optional)"
                      />
                    </div>
                    {formDocs.length > 1 && (
                      <button type="button" onClick={() => removeDocField(idx)} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors mt-1">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-8">
              {editingId && (
                <button type="button" onClick={resetForm} className="px-5 py-3 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all">
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#FCEBBA] text-black font-semibold rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                <CheckCircle2 size={18} />
                {saving ? 'Saving...' : 'Save Profile Template'}
              </button>
            </div>
          </form>
        </div>

        {/* List of Layouts */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-xl flex flex-col max-h-[800px]">
          <div className="px-8 py-6 border-b border-white/5 bg-black/20 shrink-0">
            <h3 className="font-medium text-gray-200 text-lg">Active Templates</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <span className="text-gray-400">Loading templates...</span>
              </div>
            ) : layouts.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <LayoutTemplate size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                No layouts defined yet.<br/>Create one on the left.
              </div>
            ) : (
              <ul className="divide-y divide-white/5">
                {layouts.map(layout => (
                  <li key={layout.id} className="p-8 hover:bg-white/[0.02] transition-colors group">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-[#D4AF37] font-medium text-xl tracking-wide">{layout.name}</h4>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(layout)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(layout.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 rounded-2xl p-4 border border-white/5">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3 pl-1">Required Documents</p>
                      <div className="space-y-3">
                        {layout.requiredDocs.map((doc, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <div className="mt-0.5 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                               <FileText size={12} className="text-[#D4AF37]" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-200 block">{doc.title}</span>
                              {doc.description && <span className="text-xs text-gray-500 mt-0.5 block">{doc.description}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

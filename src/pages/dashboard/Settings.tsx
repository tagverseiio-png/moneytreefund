import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Edit2, FileText, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-2xl font-light text-white">Platform Settings</h2>
        <p className="text-gray-400 mt-1">Configure client onboarding profiles and document requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Create / Edit Form */}
        <div className="bg-[#051a10] border border-white/5 rounded-lg p-6 h-fit">
          <h3 className="text-[#D4AF37] font-medium tracking-wide uppercase text-sm mb-6">
            {editingId ? 'Edit Layout Profile' : 'Create New Layout Profile'}
          </h3>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Profile Name (e.g. Individual KYC)</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full bg-[#03120B] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Layout Name"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2 flex items-center justify-between">
                <span>Required Documents</span>
                <button type="button" onClick={addDocField} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add Document
                </button>
              </label>
              
              <div className="space-y-3">
                {formDocs.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-black/20 p-3 rounded border border-white/5">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={doc.title}
                        onChange={e => handleDocChange(idx, 'title', e.target.value)}
                        className="w-full bg-[#03120B] border border-white/10 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Document Title (e.g. Aadhar Card)"
                      />
                      <input
                        type="text"
                        value={doc.description}
                        onChange={e => handleDocChange(idx, 'description', e.target.value)}
                        className="w-full bg-[#03120B] border border-white/10 rounded px-3 py-1.5 text-sm text-gray-400 focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Instructions (Optional)"
                      />
                    </div>
                    {formDocs.length > 1 && (
                      <button type="button" onClick={() => removeDocField(idx)} className="p-1.5 text-gray-500 hover:text-red-400 mt-1">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 text-gray-400 hover:text-white">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#D4AF37] text-black font-medium rounded-md hover:bg-[#FDFBF7] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* List of Layouts */}
        <div className="bg-[#051a10] border border-white/5 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-black/20">
            <h3 className="font-medium text-gray-200">Existing Layouts</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : layouts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No layouts defined yet.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {layouts.map(layout => (
                <li key={layout.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-[#D4AF37] font-medium text-lg">{layout.name}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(layout)} className="p-1.5 text-gray-400 hover:text-white rounded bg-white/5">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(layout.id)} className="p-1.5 text-gray-400 hover:text-red-400 rounded bg-white/5">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Required Docs:</p>
                    {layout.requiredDocs.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <FileText size={14} className="text-gray-500" />
                        <span>{doc.title}</span>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

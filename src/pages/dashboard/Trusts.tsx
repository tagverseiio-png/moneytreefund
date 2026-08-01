import { useState } from 'react';
import { Briefcase, Plus, ShieldCheck, Lock, Users, DollarSign, ArrowUpRight, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

interface TrustAccount {
  id: string;
  name: string;
  type: 'Irrevocable Trust' | 'Revocable Trust' | 'Family Office Vault' | 'Charitable Foundation';
  trustee: string;
  assetValue: string;
  beneficiariesCount: number;
  status: 'Active & Compliant' | 'Pending Review';
  createdAt: string;
}

export const Trusts = () => {
  const { role } = useAuth();
  const { toast } = useToast();

  const [trusts, setTrusts] = useState<TrustAccount[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<TrustAccount['type']>('Irrevocable Trust');
  const [trustee, setTrustee] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [beneficiaries, setBeneficiaries] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const calculateTotalAssets = () => {
    let total = 0;
    trusts.forEach((t) => {
      const num = parseFloat(t.assetValue.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(num)) total += num;
    });
    return total > 0 ? `$${total.toLocaleString()}` : '$0';
  };

  const handleCreateTrust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !trustee || !assetValue) return;

    setSubmitting(true);
    setTimeout(() => {
      const newTrust: TrustAccount = {
        id: `trust-${Date.now()}`,
        name,
        type,
        trustee,
        assetValue: assetValue.startsWith('$') ? assetValue : `$${assetValue}`,
        beneficiariesCount: Number(beneficiaries) || 1,
        status: 'Active & Compliant',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setTrusts([newTrust, ...trusts]);
      toast.success(`Trust structure "${name}" successfully registered.`);
      setShowCreateModal(false);
      setName(''); setTrustee(''); setAssetValue(''); setBeneficiaries(1);
      setSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">Fiduciary & Trust Accounts</h1>
          <p className="text-gray-400 mt-1 font-light text-sm sm:text-base">
            Manage active trust structures, fiduciary holdings, and compliance status.
          </p>
        </div>

        {role === 'Admin' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#FCEBBA] text-black font-semibold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-2 self-start sm:self-auto text-xs sm:text-sm"
          >
            <Plus size={18} /> New Trust Structure
          </button>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Total Assets in Trust</span>
            <DollarSign size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-light text-white">{calculateTotalAssets()}</p>
          <p className="text-xs text-green-400 mt-2 flex items-center gap-1 font-medium">
            <ArrowUpRight size={14} /> Real-time Valuation
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Active Structures</span>
            <Briefcase size={20} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl font-light text-white">{trusts.length} Vaults</p>
          <p className="text-xs text-gray-400 mt-2 font-medium">100% Fully Audited</p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Compliance Health</span>
            <ShieldCheck size={20} className="text-green-400" />
          </div>
          <p className="text-3xl font-light text-white">Verified</p>
          <p className="text-xs text-green-400 mt-2 font-medium">AES-256 Multi-Sig Active</p>
        </div>
      </div>

      {/* Trusts Grid or Empty State */}
      {trusts.length === 0 ? (
        <div className="glass-panel py-16 px-6 text-center rounded-3xl border border-white/5 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-4 border border-[#D4AF37]/20">
            <Briefcase size={32} />
          </div>
          <h3 className="text-xl font-serif text-white mb-2">No Active Trusts Found</h3>
          <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
            There are currently no active trust structures registered in your portfolio. Click below to add a new trust account.
          </p>
          {role === 'Admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl text-xs transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Register First Trust
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trusts.map((trust) => (
            <div
              key={trust.id}
              className="glass-panel glass-panel-hover p-6 sm:p-8 rounded-3xl border border-white/5 flex flex-col justify-between relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]/50" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {trust.type}
                  </span>
                  <span className="text-[11px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                    <ShieldCheck size={12} /> {trust.status}
                  </span>
                </div>

                <h3 className="text-xl font-serif text-white tracking-wide mb-2">{trust.name}</h3>
                <p className="text-xs text-gray-400 mb-6">Trustee: <span className="text-gray-200">{trust.trustee}</span></p>

                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5 text-xs mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Target Value</span>
                    <span className="text-white font-semibold text-sm">{trust.assetValue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Beneficiaries</span>
                    <span className="text-gray-200 font-medium flex items-center gap-1">
                      <Users size={12} className="text-[#D4AF37]" /> {trust.beneficiariesCount} Assigned
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Created</span>
                    <span className="text-gray-400">{trust.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <Lock size={12} /> Encrypted Ledger
                </span>
                <button
                  onClick={() => toast.info(`Accessing details for ${trust.name}...`)}
                  className="text-[#D4AF37] hover:text-white font-medium transition-colors"
                >
                  Inspect Vault &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Trust Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in-up">
          <div className="glass-panel p-8 rounded-3xl max-w-lg w-full relative shadow-2xl border border-white/10">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-serif text-white mb-2">Register Trust Structure</h3>
            <p className="text-xs text-gray-400 mb-6">Setup new fiduciary account profile and asset protection vault.</p>

            <form onSubmit={handleCreateTrust} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Trust Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rothschild Heritage Trust"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37]/50 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Trust Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#D4AF37]/50 transition-all outline-none"
                  >
                    <option value="Irrevocable Trust">Irrevocable Trust</option>
                    <option value="Revocable Trust">Revocable Trust</option>
                    <option value="Family Office Vault">Family Office Vault</option>
                    <option value="Charitable Foundation">Charitable Foundation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Beneficiaries</label>
                  <input
                    type="number"
                    min={1}
                    value={beneficiaries}
                    onChange={(e) => setBeneficiaries(Number(e.target.value))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37]/50 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Designated Trustee</label>
                <input
                  type="text"
                  required
                  value={trustee}
                  onChange={(e) => setTrustee(e.target.value)}
                  placeholder="e.g. MoneyTree Corporate Trustee"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37]/50 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">Initial Asset Valuation</label>
                <input
                  type="text"
                  required
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  placeholder="e.g. $5,000,000"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#D4AF37]/50 transition-all outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-medium transition-all border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !name || !trustee || !assetValue}
                  className="flex-1 px-4 py-2.5 bg-[#D4AF37] hover:bg-[#FCEBBA] text-black font-semibold rounded-xl text-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Register Trust'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white">Overview</h2>
        <p className="text-gray-400 mt-1">Welcome to the Trustee Management Platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#051a10] border border-white/5 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Clients</h3>
          <p className="text-3xl font-light text-[#D4AF37] mt-2">0</p>
        </div>
        <div className="bg-[#051a10] border border-white/5 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Active Trusts</h3>
          <p className="text-3xl font-light text-[#D4AF37] mt-2">0</p>
        </div>
        <div className="bg-[#051a10] border border-white/5 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Documents</h3>
          <p className="text-3xl font-light text-[#D4AF37] mt-2">0</p>
        </div>
        <div className="bg-[#051a10] border border-white/5 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm font-medium">Pending Approvals</h3>
          <p className="text-3xl font-light text-[#D4AF37] mt-2">0</p>
        </div>
      </div>
    </div>
  );
};

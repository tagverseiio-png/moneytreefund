export const Clients = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-white">Clients</h2>
        <p className="text-gray-400 mt-1">Manage client profiles and relationships.</p>
      </div>
      <div className="bg-[#051a10] border border-white/5 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">No clients found.</p>
      </div>
    </div>
  );
};

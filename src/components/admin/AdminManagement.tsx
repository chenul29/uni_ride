import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all admins from Supabase
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id, name, email, role')
        .order('id', { ascending: true });

      if (error) throw error;
      setAdmins(data || []);
    } catch (err: any) {
      console.error('Error fetching admins:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Delete Admin Function
  const handleDeleteAdmin = async (id: number, adminEmail: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete admin "${adminEmail}"?`);
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Admin deleted successfully!');
      fetchAdmins(); // Refresh the list
    } catch (err: any) {
      alert('Error deleting admin: ' + err.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto my-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Admin Management</h2>
        <p className="text-sm text-gray-500">Manage existing admins and remove access when necessary.</p>
      </div>

      {/* Admin List Table */}
      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading admins...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50 text-sm text-gray-700">
                  <td className="p-3 font-mono">{admin.id}</td>
                  <td className="p-3 font-medium">{admin.name}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {admin.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1 rounded-md text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {admins.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
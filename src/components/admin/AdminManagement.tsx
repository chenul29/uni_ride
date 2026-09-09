import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch all admins from Supabase
  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error.message);
    } else {
      setAdmins(data || []);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Add new admin details
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase
      .from('admins')
      .insert([{ name: name.trim(), email: email.trim(), role: 'admin' }]);

    if (error) {
      setError(error.message);
    } else {
      setName('');
      setEmail('');
      setShowAddModal(false);
      fetchAdmins();
    }
    setLoading(false);
  };

  // Delete admin
  const handleDeleteAdmin = async (id: string) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) {
        alert(error.message);
      } else {
        fetchAdmins();
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto my-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin Management</h2>
          <p className="text-sm text-gray-500">Manage existing admins and remove access when necessary.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
        >
          + Create Admin
        </button>
      </div>

      {/* Modal / Popup Form to Create Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Admin</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Admin Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Admin Email</label>
                <input
                  type="email"
                  placeholder="e.g. admin@uniride.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border text-gray-600 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List of Admins with Delete Button */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
              <th className="p-3 text-sm font-semibold text-gray-600">Role</th>
              <th className="p-3 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500 text-sm">
                  No admins found. Click "+ Create Admin" to add one.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm font-medium text-gray-800">{admin.name}</td>
                  <td className="p-3 text-sm text-gray-600">{admin.email}</td>
                  <td className="p-3 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {admin.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1 rounded-md text-xs border border-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
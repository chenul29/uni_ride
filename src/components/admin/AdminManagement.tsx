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
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Admin Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

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

  // Delete Admin
  const handleDeleteAdmin = async (id: number, adminEmail: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete admin "${adminEmail}"?`);
    if (!confirmDelete) return;

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Admin deleted successfully!');
      fetchAdmins();
    } catch (err: any) {
      alert('Error deleting admin: ' + err.message);
    }
  };

  // Create Admin
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('admins')
        .insert([{ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password: password.trim(), 
          role: 'admin' 
        }]);

      if (error) throw error;

      alert('New admin added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setShowAddModal(false);
      fetchAdmins();
    } catch (err: any) {
      alert('Error adding admin: ' + err.message);
    } finally {
      setSubmitting(false);
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

      {/* Modal / Popup Form to Create Admin */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Create New Admin</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@uniride.lk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border text-gray-600 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;

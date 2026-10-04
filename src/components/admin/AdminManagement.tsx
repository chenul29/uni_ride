import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AdminManagementProps {
  userEmail?: string;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({ userEmail }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // Form states for creating admin
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // States for editing admin name
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [updatingName, setUpdatingName] = useState(false);

  useEffect(() => {
    const fetchUserAndAdmins = async () => {
      setLoading(true);
      let activeEmail = userEmail || null;

      // 1. Get email from active Supabase Session
      if (!activeEmail) {
        const { data: { session } } = await supabase.auth.getSession();
        activeEmail = session?.user?.email || null;
      }

      // 2. Fallback to LocalStorage
      if (!activeEmail) {
        activeEmail = localStorage.getItem('userEmail') || localStorage.getItem('adminEmail') || localStorage.getItem('email');
        if (!activeEmail) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              activeEmail = parsed?.email || null;
            } catch (e) {
              console.error(e);
            }
          }
        }
      }

      setCurrentUserEmail(activeEmail);
      await fetchAdmins();
    };

    fetchUserAndAdmins();
  }, [userEmail]);

  // Strictly check if current logged-in user is admin@uniride.lk
  const isSuperAdmin = Boolean(
    currentUserEmail && currentUserEmail.trim().toLowerCase() === 'admin@uniride.lk'
  );

  const fetchAdmins = async () => {
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

  const handleDeleteAdmin = async (id: number, adminEmail: string) => {
    if (!isSuperAdmin) {
      alert('Permission denied. Only admin@uniride.lk can delete admins.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete admin "${adminEmail}"?`)) return;

    try {
      const { error } = await supabase.from('admins').delete().eq('id', id);
      if (error) throw error;
      alert('Admin deleted successfully!');
      fetchAdmins();
    } catch (err: any) {
      alert('Error deleting admin: ' + err.message);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Permission denied. Only admin@uniride.lk can create admins.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('admins').insert([{ 
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

  const handleStartEdit = (admin: Admin) => {
    if (!isSuperAdmin) return;
    setEditingId(admin.id);
    setEditingName(admin.name);
  };

  const handleSaveName = async (id: number) => {
    if (!isSuperAdmin || !editingName.trim()) return;

    setUpdatingName(true);
    try {
      const { error } = await supabase
        .from('admins')
        .update({ name: editingName.trim() })
        .eq('id', id);

      if (error) throw error;
      alert('Admin name updated successfully!');
      setEditingId(null);
      fetchAdmins();
    } catch (err: any) {
      alert('Error updating name: ' + err.message);
    } finally {
      setUpdatingName(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500 text-center py-6">Loading admins...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-5xl mx-auto my-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin List</h2>
          <p className="text-sm text-gray-500">
            {isSuperAdmin 
              ? 'Manage existing admins, edit details, and remove access.' 
              : 'View system administrators list.'}
          </p>
        </div>

        {/* 🟢 ONLY SHOW "+ Create Admin" BUTTON IF LOGGED IN USER IS admin@uniride.lk */}
        {isSuperAdmin && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
          >
            + Create Admin
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600 text-sm">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              {/* 🟢 Actions Column Header only for admin@uniride.lk */}
              {isSuperAdmin && <th className="p-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50 text-sm text-gray-700">
                <td className="p-3 font-mono">{admin.id}</td>
                <td className="p-3 font-medium">
                  {isSuperAdmin && editingId === admin.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  ) : (
                    admin.name
                  )}
                </td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                    {admin.role}
                  </span>
                </td>

                {/* 🟢 ONLY SHOW EDIT AND DELETE BUTTONS IF LOGGED IN USER IS admin@uniride.lk */}
                {isSuperAdmin && (
                  <td className="p-3 text-right space-x-2">
                    {editingId === admin.id ? (
                      <>
                        <button
                          onClick={() => handleSaveName(admin.id)}
                          disabled={updatingName}
                          className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded-md text-xs transition-colors disabled:opacity-50"
                        >
                          {updatingName ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-3 py-1 rounded-md text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStartEdit(admin)}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-md text-xs transition-colors border border-gray-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1 rounded-md text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {admins.length === 0 && (
              <tr>
                <td colSpan={isSuperAdmin ? 5 : 4} className="text-center py-4 text-gray-500">
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showAddModal && isSuperAdmin && (
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
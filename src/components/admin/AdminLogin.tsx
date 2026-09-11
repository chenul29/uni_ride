import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create Admin Modal & Form States (From Original Code)
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

      const { data, error: fetchError } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password.trim())
        .single();

      if (fetchError || !data) {
        throw new Error('Invalid email or password.');
      }

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Add New Admin Function (Original Logic)
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!supabase) {
        throw new Error('Supabase is not configured.');
      }

      const { error } = await supabase
        .from('admins')
        .insert([{ 
          name: name.trim(), 
          email: newEmail.trim().toLowerCase(), 
          password: newPassword.trim(), 
          role: 'admin' 
        }]);

      if (error) throw error;

      alert('New admin added successfully!');
      setName('');
      setNewEmail('');
      setNewPassword('');
      setShowAddModal(false);
    } catch (err: any) {
      alert('Error adding admin: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 relative">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Admin Login</h2>
        <p className="text-sm text-center text-gray-500 mb-6">UniRide System Admin Access</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            + Create Admin
          </button>
        </div>
      </div>

      {/* Modal / Popup Form to Create Admin (Original Modal) */}
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
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="admin@uniride.lk"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

export default AdminLogin;
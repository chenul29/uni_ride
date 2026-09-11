import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      if (isRegistering) {
        // Create Admin
        const { error: dbError } = await supabase
          .from('admins')
          .insert([{ name: name.trim(), email: cleanEmail, password: cleanPassword, role: 'admin' }]);

        if (dbError) throw dbError;

        alert('New Admin created successfully! Please sign in.');
        setName('');
        setEmail('');
        setPassword('');
        setIsRegistering(false);
      } else {
        // Check Login Details
        const { data, error: dbError } = await supabase
          .from('admins')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', cleanPassword)
          .maybeSingle();

        if (dbError) throw dbError;

        if (!data) {
          throw new Error('Invalid email or password. Please check your credentials.');
        }

        alert('Login Successful!');

        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-3">
            U
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRegistering ? 'Create Admin Account' : 'Admin Login'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegistering
              ? 'Enter new details to register an admin'
              : 'Sign in to UniRide Admin Portal'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="supun1234@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : isRegistering
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 underline"
          >
            {isRegistering
              ? 'Already have an admin account? Sign In'
              : 'Need to create a new Admin? Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
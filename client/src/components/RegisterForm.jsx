import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterForm = ({ onSwitch }) => {
  const { register, loading, error } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-8 rounded-xl shadow-xl max-w-md mx-auto mt-20 border border-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Register</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label className="block w-28 font-semibold text-blue-800 text-right">Name</label>
          <input
            type="text"
            className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="block w-28 font-semibold text-blue-800 text-right">Email</label>
          <input
            type="email"
            className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="block w-28 font-semibold text-blue-800 text-right">Password</label>
          <input
            type="password"
            className="flex-1 border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors w-full font-semibold text-lg mt-6"
        disabled={loading}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      <div className="mt-6 text-center">
        <span>Already have an account? </span>
        <button type="button" className="text-blue-600 underline font-semibold" onClick={onSwitch}>Login</button>
      </div>
    </form>
  );
};

export default RegisterForm; 
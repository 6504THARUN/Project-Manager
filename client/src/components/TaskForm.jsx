import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

const TaskForm = ({ onTaskCreated, user, logout }) => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (user?.email === 'admin@gmail.com') {
      fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsers(data.filter(u => u.email !== 'admin@gmail.com')))
        .catch(() => setUsers([]));
    }
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = { title, description, priority, dueDate };
      if (user?.email === 'admin@gmail.com' && assignedTo) body.assignedTo = assignedTo;
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to create task');
      setTitle('');
      setDescription('');
      setPriority('Normal');
      setDueDate('');
      setAssignedTo('');
      if (onTaskCreated) onTaskCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 shadow-xl rounded-xl p-8 mb-10 max-w-2xl mx-auto border border-blue-100">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Add New Task</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-blue-800">Title</label>
          <input
            type="text"
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-blue-800">Description</label>
          <textarea
            className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-blue-800">Priority</label>
            <select
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-blue-800">Due Date</label>
            <input
              type="date"
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>
        {user?.email === 'admin@gmail.com' && (
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-blue-800">Assign To</label>
            <select
              className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors mt-2 w-full font-semibold text-lg"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 
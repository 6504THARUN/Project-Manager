import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { AuthContext } from '../context/AuthContext';

const AllUsers = forwardRef((props, ref) => {
  const { user, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = () => {
    fetch('http://localhost:5000/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => setError('Failed to fetch users'));
  };

  useImperativeHandle(ref, () => ({ fetchUsers }));

  useEffect(() => {
    if (user?.email === 'admin@gmail.com') {
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [user, token]);

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(() => fetchUsers());
  };

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (user?.email !== 'admin@gmail.com') return null;

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">All Users</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        className="mb-4 w-full border px-3 py-2 rounded"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {error && <div className="text-red-500 text-center mb-2">{error}</div>}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Registered</th>
            <th className="py-2 px-4"># Projects</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u._id} className="border-t">
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.role || 'Member'}</td>
              <td className="py-2 px-4">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''}</td>
              <td className="py-2 px-4">{u.projectCount ?? '-'}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(u._id)}
                  disabled={u.email === 'admin@gmail.com'}
                  title={u.email === 'admin@gmail.com' ? 'Cannot delete admin' : 'Delete user'}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUsers.length === 0 && <div className="text-center text-gray-500 mt-4">No users found.</div>}
    </div>
  );
});

export default AllUsers; 
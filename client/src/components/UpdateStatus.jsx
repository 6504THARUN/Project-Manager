import React, { useState, useEffect } from 'react';

const statusOptions = ["To Do", "In Progress", "Done"];

const UpdateStatus = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', status: '' });

  const fetchProjects = () => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setProjects(data.filter(p => p.status !== "Done"));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEditClick = (project) => {
    setEditId(project._id);
    setEditData({
      title: project.title,
      description: project.description || '',
      status: project.status || 'To Do',
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/tasks/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to update project');
        setEditId(null);
        fetchProjects();
      })
      .catch(() => alert('Failed to update project'));
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Project Status</h2>
      {loading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center text-gray-500">No ongoing projects.</div>
      )}
      {!loading && !error && projects.length > 0 && (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project._id} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
              {editId === project._id ? (
                <form onSubmit={handleEditSubmit} className="flex flex-col gap-2">
                  <input
                    name="title"
                    className="border rounded px-2 py-1"
                    value={editData.title}
                    onChange={handleEditChange}
                    required
                  />
                  <textarea
                    name="description"
                    className="border rounded px-2 py-1"
                    value={editData.description}
                    onChange={handleEditChange}
                  />
                  <select
                    name="status"
                    className="border rounded px-2 py-1"
                    value={editData.status}
                    onChange={handleEditChange}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                      Save
                    </button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-semibold">{project.title}</span>
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{project.status}</span>
                    <div className="text-gray-700">{project.description}</div>
                  </div>
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEditClick(project)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UpdateStatus;

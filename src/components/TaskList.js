import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const TaskList = forwardRef((props, ref) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '', priority: 'Normal', dueDate: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchTasks
  }));

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'Normal',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error('Failed to update task');
      setEditingId(null);
      await fetchTasks();
    } catch (err) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-4">Loading tasks...</div>;
  if (error) return <div className="text-red-500 mt-4">Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Task List</h2>
      {tasks.length === 0 ? (
        <div>No tasks found.</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task._id} className="p-4 bg-white rounded shadow flex flex-col gap-2">
              {editingId === task._id ? (
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
                    name="priority"
                    className="border rounded px-2 py-1"
                    value={editData.priority}
                    onChange={handleEditChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    name="dueDate"
                    type="date"
                    className="border rounded px-2 py-1"
                    value={editData.dueDate}
                    onChange={handleEditChange}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded" disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{task.title}</span>
                    <span className="ml-2 text-sm px-2 py-1 rounded bg-gray-200">{task.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(task._id)}
                      disabled={deleteLoading === task._id}
                    >
                      {deleteLoading === task._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default TaskList; 
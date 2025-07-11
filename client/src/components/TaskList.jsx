import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const statusColors = {
  'To Do': 'bg-gray-200 text-gray-700',
  'In Progress': 'bg-yellow-200 text-yellow-800',
  'Done': 'bg-green-200 text-green-800',
};

const TaskList = forwardRef((props, ref) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      if (data.length && data[0].createdAt) {
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(taskId);
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchTasks
  }));

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) return <div className="text-center mt-4">Loading tasks...</div>;
  if (error) return <div className="text-red-500 mt-4">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Task List</h2>
      {tasks.length === 0 ? (
        <div className="text-gray-500">No tasks found.</div>
      ) : (
        <ul className="space-y-4">
          {tasks.map(task => (
            <li key={task._id} className="p-6 bg-white/90 rounded-xl shadow flex flex-col gap-2 border border-blue-100 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <span className="font-semibold text-lg text-blue-900">{task.title}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full font-semibold ${statusColors[task.status] || 'bg-gray-200 text-gray-700'}`}>{task.status}</span>
                </div>
                <button
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
                  onClick={() => handleDelete(task._id)}
                  disabled={deletingId === task._id}
                >
                  {deletingId === task._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              {task.description && (
                <div className="text-gray-700 mt-1">{task.description}</div>
              )}
              {task.dueDate && (
                <div className="text-xs text-blue-600 mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default TaskList; 
import React, { useState, useEffect } from 'react';

const ViewProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects');
        setLoading(false);
      });
  }, []);

  const ongoing = projects.filter(p => p.status !== 'Done');
  const completed = projects.filter(p => p.status === 'Done');

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">View Project</h2>
      {loading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && (
        <>
          {/* Ongoing Projects Section */}
          <h3 className="text-lg font-bold mb-2 text-blue-700">Ongoing Projects</h3>
          {ongoing.length === 0 ? (
            <div className="text-center text-gray-500 mb-6">No ongoing projects.</div>
          ) : (
            <ul className="space-y-2 mb-6">
              {ongoing.map(project => (
                <li key={project._id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors border ${selected && selected._id === project._id ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200 hover:bg-blue-50'}`}
                    onClick={() => setSelected(project)}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Completed Projects Section */}
          <h3 className="text-lg font-bold mb-2 text-green-700">Completed Projects</h3>
          {completed.length === 0 ? (
            <div className="text-center text-gray-500 mb-6">No completed projects.</div>
          ) : (
            <ul className="space-y-2 mb-6">
              {completed.map(project => (
                <li key={project._id}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors border ${selected && selected._id === project._id ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200 hover:bg-green-50'}`}
                    onClick={() => setSelected(project)}
                  >
                    {project.title}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Project Details Section */}
          {selected && (
            <div className="bg-white rounded-lg shadow p-6 border border-blue-200">
              <h3 className="text-xl font-bold mb-2 text-blue-700">{selected.title}</h3>
              <p className="mb-2 text-gray-700">{selected.description}</p>
              <div className="mb-2">
                <span className="font-semibold">Priority:</span> {selected.priority}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Status:</span> {selected.status || 'N/A'}
              </div>
              <div>
                <span className="font-semibold">Due Date:</span> {selected.dueDate ? new Date(selected.dueDate).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewProject;

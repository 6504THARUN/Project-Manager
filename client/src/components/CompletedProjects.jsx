import React, { useState, useEffect } from 'react';

const CompletedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        setProjects(data.filter(p => p.status === "Done"));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch projects');
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Completed Projects</h2>
      {loading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="text-center text-gray-500">No completed projects.</div>
      )}
      {!loading && !error && projects.length > 0 && (
        <ul className="space-y-4">
          {projects.map(project => (
            <li key={project._id} className="bg-white rounded-lg shadow p-4">
              <span className="font-semibold">{project.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompletedProjects;

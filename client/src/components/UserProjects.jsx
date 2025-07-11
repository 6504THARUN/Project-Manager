import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserProjects = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/my-projects', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProjects(data));
  }, [token]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-blue-700">Your Projects</h3>
      {projects.length === 0 ? (
        <div className="text-gray-500">No projects found.</div>
      ) : (
        <ul>
          {projects.map(p => (
            <li key={p._id}>{p.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserProjects; 
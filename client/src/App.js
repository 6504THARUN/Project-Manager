import React, { useState, useContext, useRef } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import ViewProject from './components/ViewProject';
import UpdateStatus from './components/UpdateStatus';
import CompletedProjects from './components/CompletedProjects';
import { AuthContext } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AllUsers from './components/AllUsers';
import UserProjects from './components/UserProjects';

const SIDEBAR_OPTIONS = [
  { key: 'profile', label: 'Profile' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'addProject', label: 'Add Project' },
  { key: 'viewProject', label: 'View Project' },
  { key: 'completedProjects', label: 'Completed Projects' },
  { key: 'updateStatus', label: 'Update Status' },
];

function App() {
  const [view, setView] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const { logout, user } = useContext(AuthContext);
  const allUsersRef = useRef();

  // Placeholder user id
  const userId = 'user123';

  // Render main content based on selected view
  const renderMainContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-8">
            {user.email === 'admin@gmail.com' ? (
              <>
                <AllUsers ref={allUsersRef} />
                <TaskList />
              </>
            ) : (
              <TaskList />
            )}
          </div>
        );
      case 'addProject':
        return (
          <div className="w-full max-w-2xl mx-auto mt-8">
            <TaskForm user={user} onTaskCreated={() => allUsersRef.current && allUsersRef.current.fetchUsers && allUsersRef.current.fetchUsers()} />
          </div>
        );
      case 'profile':
        return (
          <div className="w-full max-w-2xl mx-auto mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>User ID: <span className="font-mono text-blue-700">{user?.id || user?.name || 'User'}</span></p>
            {user.email !== 'admin@gmail.com' && <UserProjects />}
          </div>
        );
      case 'completedProjects':
        return <CompletedProjects />;
      case 'updateStatus':
        return <UpdateStatus />;
      case 'viewProject':
        return <ViewProject />;
      default:
        return null;
    }
  };

  return user ? (
    <div className="h-screen w-full flex">
      <div className="flex flex-col h-full w-56 bg-gradient-to-b from-blue-700 to-blue-500 text-white py-8 px-4 shadow-lg">
        <div className="text-2xl font-extrabold tracking-wide text-center mb-10">Menu</div>
        <div className="flex-1" />
        <div className="flex flex-col items-center mb-8">
          {/* Logo Circle with Image */}
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-lg overflow-hidden">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-full h-full object-cover" />
          </div>
          {/* Username below the circle */}
          <span className="text-white font-semibold text-lg">{userId}</span>
        </div>
        <div className="flex flex-col">
          {SIDEBAR_OPTIONS.map(option => (
            <button
              key={option.key}
              onClick={() => setView(option.key)}
              className={`text-left px-4 py-3 mb-2 rounded-lg font-semibold transition-colors ${view === option.key ? 'bg-white text-blue-700' : 'hover:bg-blue-800'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-gray-50 flex flex-col">
        <div className="w-full flex items-center justify-between bg-purple-600 text-white px-8 py-4 shadow-md">
          <span className="text-2xl font-bold tracking-wide">Project Manager</span>
          <button
            className="bg-white text-purple-700 px-4 py-2 rounded font-semibold shadow hover:bg-purple-100 transition-colors"
            onClick={() => {
              logout();
              setView('dashboard');
            }}
          >
            Logout
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-start w-full">
          {renderMainContent()}
        </div>
      </div>
    </div>
  ) : (
    showRegister ? (
      <RegisterForm onSwitch={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitch={() => setShowRegister(true)} />
    )
  );
}

export default App;

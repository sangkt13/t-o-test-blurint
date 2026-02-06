import React from 'react';
import { Activity, LayoutTemplate } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'create' | 'history';
  setCurrentView: (view: 'home' | 'create' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Area */}
          <div className="flex items-center cursor-pointer group" onClick={() => setCurrentView('home')}>
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 font-bold text-xl text-slate-800 tracking-tight group-hover:text-blue-700 transition-colors">
              MedEdu <span className="text-blue-600">Blueprint</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                currentView === 'home' 
                  ? 'text-blue-700 bg-blue-50 ring-1 ring-blue-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                currentView === 'create' 
                  ? 'text-white bg-blue-600 shadow-md shadow-blue-200 hover:bg-blue-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutTemplate className="w-4 h-4 mr-2" />
              Tạo Ma trận
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Activity, LayoutTemplate, History } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'create' | 'history';
  setCurrentView: (view: 'home' | 'create' | 'history') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentView('home')}>
            <Activity className="h-8 w-8 text-blue-600 mr-2" />
            <span className="font-bold text-xl text-slate-800">MedEdu Blueprint</span>
          </div>
          <div className="flex space-x-8 items-center">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => setCurrentView('create')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                currentView === 'create' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutTemplate className="w-4 h-4 mr-1.5" />
              Tạo Ma trận
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

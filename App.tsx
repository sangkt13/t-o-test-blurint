import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BlueprintGenerator from './components/BlueprintGenerator';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'history'>('home');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <Hero onStart={() => setCurrentView('create')} />
        )}
        
        {currentView === 'create' && (
          <BlueprintGenerator />
        )}

        {currentView === 'history' && (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Lịch sử tạo Ma trận</h2>
            <p>Tính năng đang phát triển...</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-slate-500 text-sm">© 2025 MedEdu Blueprint AI. All rights reserved.</p>
          <div className="flex space-x-6">
             <a href="#" className="text-slate-400 hover:text-slate-500 text-sm">Điều khoản</a>
             <a href="#" className="text-slate-400 hover:text-slate-500 text-sm">Bảo mật</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

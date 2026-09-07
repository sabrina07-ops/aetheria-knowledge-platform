import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeSection } from './components/sections/HomeSection';
import { SpaceSection } from './components/sections/SpaceSection';
import { TechSection } from './components/sections/TechSection';
import { ArtSection } from './components/sections/ArtSection';
import { LiteratureSection } from './components/sections/LiteratureSection';
import { ScienceSection } from './components/sections/ScienceSection';
import { ResourcesSection } from './components/sections/ResourcesSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SearchModal } from './components/modals/SearchModal';
import { AuthModal } from './components/modals/AuthModal';
import { ProfileModal } from './components/modals/ProfileModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';

const MainContent: React.FC = () => {
  const { currentSection, theme } = useApp();

  const renderSection = () => {
    switch (currentSection) {
      case 'space':
        return <SpaceSection />;
      case 'technology':
        return <TechSection />;
      case 'art':
        return <ArtSection />;
      case 'literature':
      case 'philosophy':
        return <LiteratureSection />;
      case 'science':
        return <ScienceSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'admin':
        return <AdminDashboard />;
      case 'home':
      default:
        return <HomeSection />;
    }
  };

  return (
    <div 
      id="app-root-shell"
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-slate-950 text-slate-100' 
          : 'bg-[#fbfaf8] text-stone-900'
      }`}
    >
      <Navbar />
      <main className="flex-1">
        {renderSection()}
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <AuthModal />
      <ProfileModal />
      <NotificationsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

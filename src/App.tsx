import React, { useState, useEffect, useCallback } from 'react';
import { Clock, StickyNote, Settings } from 'lucide-react';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import PomodoroApp from './apps/PomodoroApp';
import StickyNotesApp from './apps/StickyNotesApp';
import SettingsModal from './components/SettingsModal';
import { AppDef, OpenApp } from './types';
import './App.css';

const APPS: AppDef[] = [
  { id: 'pomodoro', name: 'Pomodoro', icon: Clock, component: PomodoroApp, defaultSize: { width: 500, height: 650 } },
  { id: 'stickynotes', name: 'Sticky Notes', icon: StickyNote, component: StickyNotesApp, defaultSize: { width: 600, height: 450 } },
];

const App: React.FC = () => {
  const [wallpaper, setWallpaper] = useState('https://cdn.wallpapersafari.com/72/31/LqMUho.jpg');
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [nextKey, setNextKey] = useState(0);

  useEffect(() => {
    const storedWallpaper = localStorage.getItem('desktopWallpaper');
    if (storedWallpaper) {
      setWallpaper(storedWallpaper);
    }
  }, []);

  const handleWallpaperSave = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('desktopWallpaper', newWallpaper);
  };

  const openApp = useCallback((id: string) => {
    setOpenApps(currentApps => {
      const highestZIndex = Math.max(0, ...currentApps.map(a => a.zIndex));
      
      // Check if app is open and minimized
      const existingAppIndex = currentApps.findIndex(app => app.id === id && app.isMinimized);
      if (existingAppIndex !== -1) {
        const updatedApps = [...currentApps];
        updatedApps[existingAppIndex] = {
          ...updatedApps[existingAppIndex],
          isMinimized: false,
          zIndex: highestZIndex + 1,
        };
        return updatedApps;
      }

      // If not minimized or not open, open a new instance
      const newApp: OpenApp = { id, zIndex: highestZIndex + 1, isMinimized: false, key: nextKey };
      setNextKey(k => k + 1);
      return [...currentApps, newApp];
    });
  }, [nextKey]);

  const closeApp = (key: number) => {
    setOpenApps(apps => apps.filter(app => app.key !== key));
  };

  const minimizeApp = (key: number) => {
    setOpenApps(apps => apps.map(app => app.key === key ? { ...app, isMinimized: true } : app));
  };

  const focusApp = (key: number) => {
    setOpenApps(apps => {
      const highestZIndex = Math.max(0, ...apps.map(a => a.zIndex));
      return apps.map(app => app.key === key ? { ...app, zIndex: highestZIndex + 1, isMinimized: false } : app);
    });
  };

  return (
    <div className="desktop" style={{ backgroundImage: `url(${wallpaper})` }}>
      {openApps.map(appInstance => {
        const appDef = APPS.find(a => a.id === appInstance.id);
        if (!appDef || appInstance.isMinimized) return null;

        const AppComponent = appDef.component;
        return (
          <Window
            key={appInstance.key}
            title={appDef.name}
            zIndex={appInstance.zIndex}
            onClose={() => closeApp(appInstance.key)}
            onMinimize={() => minimizeApp(appInstance.key)}
            onFocus={() => focusApp(appInstance.key)}
            defaultSize={appDef.defaultSize}
          >
            <AppComponent
              onClose={() => closeApp(appInstance.key)}
              onMinimize={() => minimizeApp(appInstance.key)}
              onFocus={() => focusApp(appInstance.key)}
            />
          </Window>
        );
      })}

      <Taskbar apps={APPS} openApps={openApps} onOpenApp={openApp} onFocusApp={focusApp} />
      
      <button onClick={() => setIsSettingsOpen(true)} className="desktop-settings-button">
        <Settings size={20} />
      </button>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentWallpaper={wallpaper}
        onSave={handleWallpaperSave}
      />
    </div>
  );
};

export default App;

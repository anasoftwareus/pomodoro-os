import React from 'react';
import { AppDef, OpenApp } from '../types';
import './Taskbar.css';

interface TaskbarProps {
  apps: AppDef[];
  openApps: OpenApp[];
  onOpenApp: (id: string) => void;
  onFocusApp: (key: number) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ apps, openApps, onOpenApp, onFocusApp }) => {
  const handleAppClick = (appId: string) => {
    const runningApp = openApps.find(app => app.id === appId && !app.isMinimized);
    if (runningApp) {
      onFocusApp(runningApp.key);
    } else {
      onOpenApp(appId);
    }
  };

  return (
    <div className="taskbar">
      <div className="taskbar-icons">
        {apps.map(app => {
          const Icon = app.icon;
          const isOpen = openApps.some(openApp => openApp.id === app.id);
          return (
            <div key={app.id} className="taskbar-item-container">
              <button className="taskbar-item" onClick={() => handleAppClick(app.id)} title={app.name}>
                <Icon size={28} />
              </button>
              {isOpen && <div className="open-indicator"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Taskbar;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './SettingsModal.css';

interface PomodoroSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper?: string;
  onSave: (value: any) => void;
  settings?: PomodoroSettings;
  isPomodoro?: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentWallpaper, onSave, settings, isPomodoro }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [wallpaperUrl, setWallpaperUrl] = useState(currentWallpaper || '');

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);
  
  useEffect(() => {
    if (currentWallpaper) {
      setWallpaperUrl(currentWallpaper);
    }
  }, [currentWallpaper]);

  if (!isOpen) return null;

  const handlePomodoroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev!, [name]: parseInt(value, 10) }));
  };

  const handleSave = () => {
    if (isPomodoro && localSettings) {
      onSave(localSettings);
    } else {
      onSave(wallpaperUrl);
    }
    onClose();
  };

  const renderPomodoroSettings = () => (
    <>
      <div className="setting-item">
        <label htmlFor="work">Pomodoro (minutes)</label>
        <input type="number" id="work" name="work" value={localSettings?.work} onChange={handlePomodoroChange} min="1" />
      </div>
      <div className="setting-item">
        <label htmlFor="shortBreak">Short Break (minutes)</label>
        <input type="number" id="shortBreak" name="shortBreak" value={localSettings?.shortBreak} onChange={handlePomodoroChange} min="1" />
      </div>
      <div className="setting-item">
        <label htmlFor="longBreak">Long Break (minutes)</label>
        <input type="number" id="longBreak" name="longBreak" value={localSettings?.longBreak} onChange={handlePomodoroChange} min="1" />
      </div>
      <div className="setting-item">
        <label htmlFor="longBreakInterval">Long Break Interval</label>
        <input type="number" id="longBreakInterval" name="longBreakInterval" value={localSettings?.longBreakInterval} onChange={handlePomodoroChange} min="1" />
      </div>
    </>
  );

  const renderWallpaperSettings = () => (
    <div className="setting-item">
      <label htmlFor="wallpaper">Wallpaper URL</label>
      <input type="text" id="wallpaper" name="wallpaper" value={wallpaperUrl} onChange={(e) => setWallpaperUrl(e.target.value)} />
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">
          {isPomodoro ? renderPomodoroSettings() : renderWallpaperSettings()}
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;

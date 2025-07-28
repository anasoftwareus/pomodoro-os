import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import Timer from '../components/Timer';
import SettingsModal from '../components/SettingsModal';
import useTimer from '../hooks/useTimer';
import useSound from '../hooks/useSound';
import { AppProps } from '../types';
import './PomodoroApp.css';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroApp: React.FC<AppProps> = () => {
  const [settings, setSettings] = useState({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [mode, setMode] = useState<Mode>('work');

  const playSound = useSound('/sounds/notification.mp3');

  const handleTimerEnd = useCallback(() => {
    playSound();
    if (mode === 'work') {
      const newCycle = cycle + 1;
      setCycle(newCycle);
      if (newCycle % settings.longBreakInterval === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  }, [mode, cycle, settings.longBreakInterval, playSound]);

  const {
    time,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleReset,
  } = useTimer(settings[mode] * 60, handleTimerEnd);

  useEffect(() => {
    const storedSettings = localStorage.getItem('pomodoroSettings');
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        setSettings(s => ({...s, ...parsed}));
      } catch (e) {
        console.error("Failed to parse pomodoro settings", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    handleReset();
  }, [settings, handleReset]);

  useEffect(() => {
    handleReset();
  }, [mode, handleReset]);

  const handleModeChange = (newMode: Mode) => {
    if (isActive) {
      if (confirm('A timer is running. Are you sure you want to switch modes? This will reset the current timer.')) {
        setMode(newMode);
      }
    } else {
      setMode(newMode);
    }
  };

  const skipToNext = () => {
    handleTimerEnd();
  };

  const progress = (time / (settings[mode] * 60)) * 100;

  return (
    <div className="pomodoro-app-container">
      <header className="pomodoro-app-header">
        <h1 className="pomodoro-title">IntelliFocus</h1>
        <button onClick={() => setIsSettingsOpen(true)} className="pomodoro-icon-button settings-button">
          <Settings size={24} />
        </button>
      </header>

      <main className="pomodoro-timer-section">
        <div className="pomodoro-mode-selector">
          <button onClick={() => handleModeChange('work')} className={`pomodoro-mode-button ${mode === 'work' ? 'active' : ''}`}>Pomodoro</button>
          <button onClick={() => handleModeChange('shortBreak')} className={`pomodoro-mode-button ${mode === 'shortBreak' ? 'active' : ''}`}>Short Break</button>
          <button onClick={() => handleModeChange('longBreak')} className={`pomodoro-mode-button ${mode === 'longBreak' ? 'active' : ''}`}>Long Break</button>
        </div>
        
        <Timer time={time} progress={progress} />

        <div className="pomodoro-controls">
          <button onClick={handleReset} className="pomodoro-icon-button secondary">
            <RotateCcw size={24} />
          </button>
          <button onClick={isActive && !isPaused ? handlePause : handleStart} className="pomodoro-play-pause-button">
            {isActive && !isPaused ? <Pause size={32} /> : <Play size={32} />}
          </button>
          <button onClick={skipToNext} className="pomodoro-icon-button secondary">
            <SkipForward size={24} />
          </button>
        </div>
      </main>

      <footer className="pomodoro-app-footer">
        <p>Cycles completed: {Math.floor(cycle / 2)}</p>
        <p>Focus session #{Math.floor(cycle / 2) + 1}</p>
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
        isPomodoro={true}
      />
    </div>
  );
};

export default PomodoroApp;

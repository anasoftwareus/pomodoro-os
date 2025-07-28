import React from 'react';
import './Timer.css';

interface TimerProps {
  time: number;
  progress: number;
}

const Timer: React.FC<TimerProps> = ({ time, progress }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const radius = 140;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="timer-container">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          className="progress-ring-bg"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="progress-ring-fg"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="time-display">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer;

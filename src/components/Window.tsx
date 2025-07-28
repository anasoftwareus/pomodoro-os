import React from 'react';
import Draggable from 'react-draggable';
import { X, Square } from 'lucide-react';
import './Window.css';

interface WindowProps {
  children: React.ReactNode;
  title: string;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  defaultSize?: { width: number; height: number };
}

const Window: React.FC<WindowProps> = ({ children, title, zIndex, onClose, onFocus, defaultSize }) => {
  const nodeRef = React.useRef(null);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <Draggable
      handle=".window-header"
      nodeRef={nodeRef}
      onStart={onFocus}
      bounds="parent"
      disabled={isMaximized}
    >
      <div
        ref={nodeRef}
        className={`window-container ${isMaximized ? 'maximized' : ''}`}
        style={{ 
          zIndex,
          ...(!isMaximized && {
            width: defaultSize?.width ?? 500,
            height: defaultSize?.height ?? 400,
          }),
        }}
        onClick={onFocus}
      >
        <div className="window-header">
          <div className="window-title">{title}</div>
          <div className="window-controls">
            <button onClick={handleMaximize} className="window-control-button maximize">
              <Square size={14} />
            </button>
            <button onClick={onClose} className="window-control-button close">
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="window-content">
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export default Window;

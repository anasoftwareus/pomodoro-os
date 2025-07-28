import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface AppDef {
  id: string;
  name: string;
  icon: LucideIcon;
  component: React.FC<AppProps>;
  defaultSize?: { width: number; height: number };
}

export interface OpenApp {
  id: string;
  zIndex: number;
  isMinimized: boolean;
  key: number;
}

export interface AppProps {
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

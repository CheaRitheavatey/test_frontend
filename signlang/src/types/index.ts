export interface DetectedSign {
  id: string;
  sign: string;
  confidence: number;
  timestamp: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Subtitle {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface AppSettings {
  language: 'english' | 'spanish' | 'khmer';
  modelType: 'basic' | 'advanced' | 'multilingual';
  subtitlePosition: 'bottom' | 'top' | 'center';
  subtitleSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  showConfidence: boolean;
  minConfidence: number;
}

export interface CameraState {
  isActive: boolean;
  hasPermission: boolean;
  error: string | null;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export enum Page {
  ANIME = 'anime',
  FAITH = 'faith',
  CODE = 'code',
  CHAT = 'chat',
  TOOLS = 'tools',
  SPIN = 'spin',
  RANKING = 'ranking',
  CREATOR = 'creator',
  SECURITY = 'security'
}

export interface User {
  uid: string;
  name: string;
  email: string;
  points: number;
  xp: number;
  level: number;
  role: 'member' | 'sultan' | 'admin';
  isGhostMode: boolean;
  twoFactorEnabled: boolean;
  joinedAt: number;
  tasbeehCount?: number;
}

export interface ToolsData {
  quickNotes?: string;
  tasks?: { id: string; text: string; status: 'todo' | 'doing' | 'done' }[];
  pomodoroSettings?: { workTime: number; breakTime: number };
  habitTracker?: { habit: string; completedDays: string[] }[];
  lastUsedTool?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  uid: string;
  text: string;
  timestamp: any;
  isLink?: boolean;
  isSafe?: boolean;
}

export interface ActivityLog {
  id: string;
  type: string;
  ip: string;
  browser: string;
  time: number;
}

export interface Anime {
  id: string;
  title: string;
  thumb: string;
  video: string;
}

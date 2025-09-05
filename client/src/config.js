// API Configuration
export const API_URL = 'http://localhost:3000';
export const SOCKET_URL = 'http://localhost:3000';

// Game Constants
export const GAME_SETTINGS = {
  MAX_PLAYERS: 8,
  MIN_PLAYERS: 2,
  TURN_DURATION: 300, // seconds
  MAX_TURNS: 20,
};

// Resource Types
export const RESOURCE_TYPES = [
  'Oil',
  'Wheat',
  'Steel',
  'Technology',
  'Consumer Goods',
  'Rare Minerals',
  'Food',
  'Energy',
];

// Trade Policy Types
export const TRADE_POLICY_TYPES = {
  FREE_TRADE: 'free_trade',
  PROTECTIONIST: 'protectionist',
  MIXED: 'mixed',
};

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Game Modes
export const GAME_MODES = {
  SINGLE_PLAYER: 'single_player',
  MULTIPLAYER: 'multiplayer',
  EDUCATIONAL: 'educational',
};

// Colors
export const COLORS = {
  PRIMARY: '#2196F3',
  SECONDARY: '#FFC107',
  SUCCESS: '#4CAF50',
  ERROR: '#F44336',
  WARNING: '#FF9800',
  INFO: '#2196F3',
  BACKGROUND: '#F5F5F5',
  TEXT: '#212121',
  TEXT_SECONDARY: '#757575',
};

// Theme
export const THEME = {
  colors: {
    primary: COLORS.PRIMARY,
    accent: COLORS.SECONDARY,
    background: COLORS.BACKGROUND,
    surface: '#FFFFFF',
    text: COLORS.TEXT,
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: COLORS.ERROR,
  },
}; 
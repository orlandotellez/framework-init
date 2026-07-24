export const colors = {
  background: '#fff5f5',
  surface: '#fffafa',
  card: '#ffffff',
  elevated: '#f8f0f5',
  accentLight: '#f3e8f0',

  foreground: '#2d1b2e',
  textSecondary: '#6b5068',
  textMuted: '#9b7f98',
  textAccent: '#d4a5b6',

  primary: '#d4a5b6',
  primaryDark: '#b88298',
  primaryLight: '#e8c8d4',
  primaryForeground: '#ffffff',

  secondary: '#b8a9c9',
  secondaryDark: '#9a8bb0',
  secondaryLight: '#d8cfe8',

  accent: '#f3e8f0',
  accentCoral: '#e8a598',
  accentTeal: '#88bdb0',
  accentGold: '#e8c87a',

  muted: '#f8f0f5',
  mutedForeground: '#6b5068',
  cardForeground: '#2d1b2e',

  success: '#5cb87a',
  successBg: '#e8f5e9',
  warning: '#e8a020',
  warningBg: '#fff3e0',
  danger: '#d4606a',
  dangerBg: '#ffebee',
  info: '#7ab8d4',
  infoBg: '#e3f2fd',

  border: '#e8dde6',
  borderStrong: '#d4c5d0',
  white: '#ffffff',
} as const;

export type ColorKey = keyof typeof colors;

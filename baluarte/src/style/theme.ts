// src/styles/theme.ts
export const theme = {
  colors: {
    primary: {
      main: '#CB2020',
      light: '#E64D4D',
      dark: '#A01A1A',
      shadow: '#540000',
    },
    secondary: {
      main: '#F6F6F6',
      dark: '#E0E0E0',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
      light: '#999999',
      white: '#FFFFFF',
    }
  },
  
  
} as const;

export type Theme = typeof theme;

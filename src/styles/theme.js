import { createTheme, alpha } from '@mui/material/styles';

/** Vita Stay brand — matched to logo.png */
export const brand = {
  navy: '#002D62',
  navyDark: '#001A3D',
  navyMid: '#0A3A6E',
  navyLight: '#1A4F8A',
  teal: '#00A896',
  tealDark: '#008F7A',
  tealLight: '#2EC4B6',
  tealSoft: '#E6F7F5',
  mist: '#F0F5F9',
  charcoal: '#1C2B3A',
};

const sharedTypography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: { fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, letterSpacing: '-0.02em' },
  h3: { fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontWeight: 600, letterSpacing: '-0.01em' },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
  button: { textTransform: 'none', fontWeight: 500 },
};

const glassStyles = (mode) => ({
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: brand.navyDark,
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 10% 20%, ${alpha(brand.teal, 0.28)} 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 90% 80%, ${alpha(brand.navyLight, 0.5)} 0%, transparent 50%),
          linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navy} 38%, #006B72 72%, ${brand.tealDark} 100%)
        `,
        backgroundAttachment: 'fixed',
      },
      '::-webkit-scrollbar-thumb': {
        background: mode === 'dark' ? alpha(brand.teal, 0.35) : alpha(brand.navy, 0.25),
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: mode === 'dark' ? alpha(brand.teal, 0.55) : alpha(brand.navy, 0.4),
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 16,
        ...(mode === 'dark'
          ? {
              backgroundColor: alpha('#0F2138', 0.85),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(brand.teal, 0.12)}`,
            }
          : {
              backgroundColor: alpha('#ffffff', 0.9),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(brand.navy, 0.06)}`,
            }),
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: mode === 'dark'
          ? `0 8px 32px ${alpha(brand.navyDark, 0.5)}`
          : `0 8px 32px ${alpha(brand.navy, 0.08)}`,
        ...(mode === 'dark'
          ? {
              backgroundColor: alpha('#0F2138', 0.85),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(brand.teal, 0.12)}`,
            }
          : {
              backgroundColor: alpha('#ffffff', 0.92),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(brand.navy, 0.06)}`,
            }),
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        borderRadius: 0,
        backgroundColor: alpha(brand.navyDark, 0.88),
        backdropFilter: 'blur(24px)',
        borderRight: `1px solid ${alpha(brand.teal, 0.2)}`,
        color: '#ffffff',
        backgroundImage: 'none',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        backgroundColor: alpha(brand.navyDark, 0.82),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(brand.teal, 0.2)}`,
        color: '#ffffff',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 10 },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: `0 4px 14px ${alpha(brand.teal, 0.35)}`,
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.navyMid} 55%, ${brand.tealDark} 100%)`,
        '&:hover': {
          background: `linear-gradient(135deg, ${brand.navyDark} 0%, ${brand.navy} 50%, ${brand.teal} 100%)`,
        },
      },
      containedSecondary: {
        backgroundColor: brand.teal,
        '&:hover': { backgroundColor: brand.tealDark },
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      primary: {
        background: `linear-gradient(135deg, ${brand.navy} 0%, ${brand.teal} 100%)`,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.teal,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: mode === 'dark' ? brand.tealLight : brand.tealDark,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: brand.teal,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 8 },
      colorPrimary: {
        borderColor: alpha(mode === 'dark' ? brand.tealLight : brand.navy, 0.45),
        color: mode === 'dark' ? brand.tealLight : brand.navy,
      },
      colorSecondary: {
        borderColor: alpha(brand.teal, 0.5),
        color: mode === 'dark' ? brand.tealLight : brand.tealDark,
      },
      colorDefault: {
        borderColor: mode === 'dark' ? alpha('#fff', 0.25) : alpha(brand.navy, 0.25),
        color: mode === 'dark' ? alpha('#fff', 0.85) : brand.charcoal,
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        backgroundColor: mode === 'dark' ? '#0F2138' : '#FFFFFF',
        color: mode === 'dark' ? '#F5FAFC' : brand.charcoal,
        fontWeight: 600,
      },
      stickyHeader: {
        backgroundColor: mode === 'dark' ? '#0F2138' : '#FFFFFF',
        color: mode === 'dark' ? '#F5FAFC' : brand.charcoal,
      },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: {
        color: mode === 'dark' ? alpha('#fff', 0.85) : brand.charcoal,
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        '&.Mui-selected': {
          backgroundColor: alpha(brand.teal, mode === 'dark' ? 0.18 : 0.12),
          color: mode === 'dark' ? brand.tealLight : brand.navy,
          '& .MuiListItemIcon-root': {
            color: mode === 'dark' ? brand.tealLight : brand.tealDark,
          },
          '&:hover': {
            backgroundColor: alpha(brand.teal, mode === 'dark' ? 0.24 : 0.16),
          },
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        '&.Mui-selected': {
          color: mode === 'dark' ? brand.tealLight : brand.tealDark,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: { backgroundColor: brand.teal },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      colorPrimary: {
        '&.Mui-checked': { color: brand.teal },
        '&.Mui-checked + .MuiSwitch-track': { backgroundColor: brand.teal },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      colorPrimary: {
        '&.Mui-checked': { color: brand.teal },
      },
    },
  },
  MuiRadio: {
    styleOverrides: {
      colorPrimary: {
        '&.Mui-checked': { color: brand.teal },
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      colorPrimary: {
        backgroundColor: mode === 'dark' ? alpha(brand.teal, 0.15) : alpha(brand.navy, 0.12),
      },
      barColorPrimary: {
        background: `linear-gradient(90deg, ${brand.navy} 0%, ${brand.teal} 100%)`,
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: { color: mode === 'dark' ? brand.tealLight : brand.tealDark },
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        color: mode === 'dark' ? '#F5FAFC' : brand.charcoal,
      },
    },
  },
});

export const createAppTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? brand.tealLight : brand.navy,
        light: mode === 'dark' ? '#5ED4C8' : brand.navyLight,
        dark: mode === 'dark' ? brand.teal : brand.navyDark,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: mode === 'dark' ? brand.teal : brand.teal,
        light: brand.tealLight,
        dark: brand.tealDark,
        contrastText: '#FFFFFF',
      },
      info: {
        main: mode === 'dark' ? '#4DB6AC' : '#00897B',
        light: brand.tealLight,
        dark: brand.tealDark,
      },
      success: {
        main: mode === 'dark' ? '#30D158' : '#2E8B57',
      },
      warning: {
        main: mode === 'dark' ? '#FFD60A' : '#E6A23C',
      },
      error: {
        main: mode === 'dark' ? '#FF453A' : '#D32F2F',
      },
      background: {
        default: 'transparent',
        paper: mode === 'dark' ? '#0F2138' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#F5FAFC' : brand.charcoal,
        secondary: mode === 'dark' ? alpha('#FFFFFF', 0.65) : alpha(brand.navy, 0.65),
      },
      divider: mode === 'dark' ? alpha(brand.teal, 0.15) : alpha(brand.navy, 0.1),
    },
    typography: sharedTypography,
    shape: { borderRadius: 12 },
    components: glassStyles(mode),
  });

export default createAppTheme;

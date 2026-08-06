import { alpha, keyframes } from '@mui/material';
import { brand } from './theme';

export const atmosphereFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const atmosphereDrift = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(12px, -18px) scale(1.05); }
`;

/** Navy → teal gradient used on login and all authenticated pages */
export const atmosphereBackground = `
  radial-gradient(ellipse 80% 60% at 10% 20%, ${alpha(brand.teal, 0.28)} 0%, transparent 55%),
  radial-gradient(ellipse 70% 50% at 90% 80%, ${alpha(brand.navyLight, 0.5)} 0%, transparent 50%),
  linear-gradient(145deg, ${brand.navyDark} 0%, ${brand.navy} 38%, #006B72 72%, ${brand.tealDark} 100%)
`;

export const atmosphereRootSx = {
  background: atmosphereBackground,
  backgroundAttachment: 'fixed',
  position: 'relative',
};

/**
 * Filter / select fields that sit directly on the dark atmosphere (not inside Paper).
 * Page chrome is always navy→teal, so labels and borders must stay light in both themes.
 */
export const atmosphereFilterSx = {
  '& .MuiInputLabel-root': { color: alpha('#fff', 0.75) },
  '& .MuiInputLabel-root.Mui-focused': { color: '#fff' },
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    bgcolor: alpha('#fff', 0.06),
    '& fieldset': { borderColor: alpha('#fff', 0.35) },
    '&:hover fieldset': { borderColor: alpha('#fff', 0.55) },
    '&.Mui-focused fieldset': { borderColor: '#fff' },
    '& .MuiSvgIcon-root': { color: '#fff' },
  },
  '& input::placeholder': { color: alpha('#fff', 0.5), opacity: 1 },
  '& input[type="date"]::-webkit-calendar-picker-indicator': {
    filter: 'invert(1)',
  },
};

/** Dropdown menus for atmosphere filters — readable dark text on white paper */
export const atmosphereSelectMenuProps = {
  PaperProps: {
    sx: {
      bgcolor: '#fff',
      color: brand.charcoal,
      backgroundImage: 'none',
      '& .MuiMenuItem-root': {
        color: brand.charcoal,
        '&.Mui-selected': {
          bgcolor: alpha(brand.teal, 0.12),
          color: brand.navy,
        },
        '&:hover': { bgcolor: alpha(brand.navy, 0.06) },
      },
    },
  },
};

/** Tabs sitting on the atmosphere (outside Paper/Card) */
export const atmosphereTabsSx = {
  '& .MuiTab-root': {
    color: alpha('#fff', 0.7),
    '&.Mui-selected': { color: '#fff' },
  },
  '& .MuiTabs-indicator': { backgroundColor: brand.tealLight },
};

/** Outlined buttons in PageHeader / on atmosphere */
export const atmosphereOutlinedBtnSx = {
  color: '#fff',
  borderColor: alpha('#fff', 0.45),
  '&:hover': {
    borderColor: '#fff',
    bgcolor: alpha('#fff', 0.08),
  },
};

export const atmosphereGridSx = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(${alpha('#fff', 0.035)} 1px, transparent 1px),
    linear-gradient(90deg, ${alpha('#fff', 0.035)} 1px, transparent 1px)
  `,
  backgroundSize: '64px 64px',
  maskImage: 'radial-gradient(ellipse 70% 70% at 30% 50%, black 20%, transparent 75%)',
  pointerEvents: 'none',
  zIndex: 0,
};

export const atmosphereOrbPrimarySx = {
  position: 'absolute',
  width: 520,
  height: 520,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha(brand.tealLight, 0.35)} 0%, transparent 70%)`,
  top: -180,
  left: -100,
  filter: 'blur(40px)',
  animation: `${atmosphereDrift} 14s ease-in-out infinite`,
  pointerEvents: 'none',
  zIndex: 0,
};

export const atmosphereOrbSecondarySx = {
  position: 'absolute',
  width: 400,
  height: 400,
  borderRadius: '50%',
  background: `radial-gradient(circle, ${alpha('#fff', 0.12)} 0%, transparent 70%)`,
  bottom: -120,
  right: '35%',
  filter: 'blur(50px)',
  pointerEvents: 'none',
  zIndex: 0,
};

import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';
import { createAppTheme } from '../styles/theme';

const useTheme = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const isDark = mode === 'dark';

  return {
    mode,
    theme,
    isDark,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (newMode) => dispatch(setTheme(newMode)),
    ThemeProviderWrapper: ({ children }) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    ),
  };
};

export default useTheme;

import { createTheme } from '@mui/material/styles';
import { roboto, ubuntu, workSans } from '@/theme/fonts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#116ACC',
      dark: '#182233',
      light: '#B3CEE2',
    },
    secondary: {
      main: '#FD4E5D',
      light: '#D9DDE7',
    },
    info: { main: '#A0C3FF' },
    success: { main: '#76CA66' },
    warning: { main: '#FBC756' },
    error: { main: '#BA0000' },
    grey: {
      100: '#F3F4F6', // grey 7
      200: '#D1D5DB', // grey 6
      300: '#9CA3AF', // grey 5
      400: '#6B7280', // grey 4
      500: '#4B5563', // grey 3
      600: '#374151', //grey 2
      700: '#1F2937', //grey 1
    },
  },
  typography: {
    fontFamily: `${workSans.style.fontFamily}, ${roboto.style.fontFamily}, ${ubuntu.style.fontFamily}, sans-serif`,
  },
});

export default theme;

import { createTheme } from '@mui/material'
import { esES } from '@mui/x-date-pickers/locales'

const theme = createTheme({
  palette: {
    secondary: {
      main: '#4765a6'
    }
  },
  components: {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#c6d6f7',
            color: '#1d4ed8',
            '& .MuiListItemIcon-root': {
              color: '#4765a6'
            }
          }
        }
      }
    }
  }
},
esES)

export default theme

import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import theme from './themes/theme'
import router from './router'

export default function App () {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router}/>
    </ThemeProvider>
  )
}

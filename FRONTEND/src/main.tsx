import React from 'react'
import ReactDOM from 'react-dom/client'
import router from './router'

import { CssBaseline, ThemeProvider } from '@mui/material'
import { UserProvider } from './context/UserContext'
import { ToastContainer } from 'react-toastify'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './assets/css/index.css'
import 'react-toastify/dist/ReactToastify.css'
import 'dayjs/locale/es'

import theme from './themes/theme'
import { RouterProvider } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <ToastContainer theme='colored' position='top-center' draggable />
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </ThemeProvider>
    </ThemeProvider>
  </React.StrictMode>
)

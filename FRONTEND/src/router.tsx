import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from './pages/HomePage'
import { GeneralDataPage } from './pages/DatosGeneralesPage/GeneralDataPage'
import { CardexDataPage } from './pages/CardexDataPage/CardexDataPage'
import { LoanDataPage } from './pages/PrestamosPage/LoanDataPage'
import { PaysheetDataPage } from './pages/RecibosPage/ReciboPage'
import { VacacionesPage } from './pages/VacacionesPage/VacacionesPage'
import { TimeCheckDataPage } from './pages/TimeCheckDataPage/TimeCheckDataPage'
import { SavingsDataPage } from './pages/FondoAhorroPage/SavingsDataPage'
import { ConfigPage } from './pages/ConfigPage'
import { JustificanteDataPage } from './pages/JustificantesDataPage/JustificanteDataPage'
import { PublicRoute, loader as PublicRouteLoader } from './components/PublicRoute'
import { ProtectedRoute, loader as ProtectedRouteLoader } from './components/ProtectedRoute'

export default createBrowserRouter([
  {
    path: '/login',
    element: <PublicRoute />,
    loader: PublicRouteLoader,
    children: [{ index: true, element: <LoginPage /> }]
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    loader: ProtectedRouteLoader,
    children: [{
      element: <AppLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: '/inicio', element: <HomePage /> },
        { path: '/datos-generales', element: <GeneralDataPage /> },
        { path: '/cardex', element: <CardexDataPage /> },
        { path: '/mis-prestamos', element: <LoanDataPage /> },
        { path: '/recibo-nomina', element: <PaysheetDataPage /> },
        { path: 'saldos-vacaciones', element: <VacacionesPage /> },
        { path: 'consulta-tiempos', element: <TimeCheckDataPage /> },
        { path: 'mi-fondo-ahorro', element: <SavingsDataPage /> },
        { path: 'configuracion', element: <ConfigPage /> },
        { path: 'justificantes', element: <JustificanteDataPage /> }
      ]
    }]
  }
])

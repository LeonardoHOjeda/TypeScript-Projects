import { Paper } from '@mui/material'
import { Opciones } from './components/Opciones'

export const PaysheetDataPage = () => {
  return (
    <Paper elevation={6} className='py-3 px-10 mx-auto'>
      <h2 className='text-md font-normal mt-0 text-center'>Generar Recibo</h2>
      <Opciones/>
    </Paper>
  )
}

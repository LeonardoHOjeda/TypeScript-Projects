import { Paper } from '@mui/material'
import { PayrollData } from '../DatosGeneralesPage/components/PayrollData'

export const PayrollDataPage = () => {
  return (
    <>
      <Paper elevation={6} className="py-3 px-10 mx-auto">
        <h2 className='text-md font-normal mt-0 text-center'>Datos de Nomina</h2>
        <hr />
        <PayrollData />
      </Paper>
    </>
  )
}

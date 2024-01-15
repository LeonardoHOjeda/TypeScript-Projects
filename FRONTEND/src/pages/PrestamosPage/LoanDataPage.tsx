import { useState } from 'react'
import { Selector } from './components/PrestamoSelector'
import { Desglose } from './components/Desglose'
import { empleadoService } from '../../services/empleado.service'
import { Alert, AlertTitle, CircularProgress } from '@mui/material'
import { Resumen } from './components/Resumen'

export const LoanDataPage = () => {
  const [infoPrestamo, setInfoPrestamo] = useState<any>([])
  const [isAvailablePrestamo, setIsAvailablePrestamo] = useState(false)
  const [isLoadingTable, setIsLoadingTable] = useState(false)

  const fetchLoanData = (idConcepto: string | number) => {
    setIsLoadingTable(true)
    empleadoService.fetchConceptosPrestamos(idConcepto.toString())
      .then(infoPrestamo => {
        setIsLoadingTable(false)
        setIsAvailablePrestamo(true)
        return setInfoPrestamo(infoPrestamo)
      })
      .catch(console.log)
  }

  return (
    <>
      <Selector onLoanChange={fetchLoanData} />
      {isLoadingTable
        ? (
        <div className="flex flex-col justify-center items-center">
          <CircularProgress color='secondary' />
        </div>)
        : (
            infoPrestamo.length === 0
              ? (
                  isAvailablePrestamo && (
              <div className="flex flex-col justify-center items-center">
              <Alert severity="warning">
                <AlertTitle>Información Importante</AlertTitle>
                No se ha seleccionado ningún préstamo.
              </Alert>
            </div>
                  )
                )
              : (
            <>
              <Desglose loanData={infoPrestamo} />
              <Resumen loanData={infoPrestamo} />
            </>

                )
          )}
    </>
  )
}

import { useEffect, useState } from 'react'
import { SavingsData } from './components/SavingsData'
import { SavingsTable } from './components/SavingsTable'
import { empleadoService } from '../../services/empleado.service'
import { AhorrosModel } from '../../models/AhorrosModel'
import { CircularProgress } from '@mui/material'
import { SavingsTotalTable } from './components/SavingsTotalTable'
import { Concepto } from '../../models/fondo_ahorro.model'

export const SavingsDataPage = () => {
  const [isLoadingTable, setIsLoadingTable] = useState(false)
  const [employeeConcept, setEmployeeConcept] = useState<Concepto>()
  const [companyConcept, setCompanyConcept] = useState(0)
  const [periodInformation, setPeriodInformation] = useState<AhorrosModel[]>([])
  const [isAvailablePeriod, setIsAvailablePeriod] = useState(false)

  useEffect(() => {
    empleadoService.fetchConceptos()
      .then((concepto) => {
        setEmployeeConcept(concepto[0].id_concepto)
        setCompanyConcept(concepto[1].id_concepto)
      })
      .catch(console.log)
  }, [])

  const fetchPeriods = (period: string) => {
    const splittedDates = period.split(',')

    const fechaInicio = splittedDates[0]
    let fechaFin = splittedDates[1]
    if (!fechaFin) {
      const fechaActual = new Date()
      fechaFin = fechaActual.toISOString()
    }
    setIsLoadingTable(true)

    empleadoService.fetchAhorro(fechaInicio, fechaFin)
      .then((periodInformation) => {
        if (periodInformation != null) {
          setPeriodInformation(periodInformation)
          setIsAvailablePeriod(true)
        }
        setIsLoadingTable(false)
      })
      .catch(console.log)
  }

  return (
    <div>
      <SavingsData onPeriodChange={fetchPeriods}/>
      { isLoadingTable
        ? (
        <div className="flex flex-col justify-center items-center">
          <CircularProgress color='secondary' />
        </div>)
        : (
            isAvailablePeriod && (
        <>
          <SavingsTable savingsData={periodInformation}/>
          <SavingsTotalTable savingsData={periodInformation}/>
        </>
            )
          )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { JustificanteData } from './components/JustificanteData'
import { JustificantesTable } from './components/JustificantesTable'
import { justificantesService } from '../../services/justificantes.service'
import { toast } from 'react-toastify'
import { JustificantesTabla } from '../../models/justificantes.model'
import { CircularProgress } from '@mui/material'

export const JustificanteDataPage = () => {
  const [justificantesData, setJustificantesData] = useState<JustificantesTabla[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchJustificantesData()
  }, [])

  const fetchJustificantesData = () => {
    setIsLoading(true)
    justificantesService.fetchJustificantes().then((justificanteInfo) => {
      setJustificantesData(justificanteInfo)

      setIsLoading(false)
    }).catch((error) => {
      toast.error(`${error.response.data.statusCode}: ${error.response.data.message}`)
    })
  }

  return (
    <div>
      <JustificanteData onFormSubmit={fetchJustificantesData} />
      {isLoading
        ? (
          <div className="flex flex-col justify-center items-center mt-5">
            <CircularProgress color='secondary' />
          </div>)
        : (
          <>
            <JustificantesTable justificantesData={justificantesData} OnDeleteConfirm={fetchJustificantesData} />
          </>
          )}
    </div>
  )
}

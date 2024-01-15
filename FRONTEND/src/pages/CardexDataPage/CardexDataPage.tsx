import { Backdrop, CircularProgress, Paper } from '@mui/material'
import { cardexService } from '../../services/cardex.service'
import { useEffect, useState } from 'react'
import { Keys } from './components/Keys'
import { Cardex } from './components/Cardex'
import { SelectYear } from './components/SelectYear'
import { Cardex as CardexModelo, LlavesCardex } from '../../models/cardex.model'
import { filtrarRespuestas, obtenerCaracteresUnicos } from '../../utils/helpers'

export const CardexDataPage = () => {
  const [clavesCardex, setClavesCardex] = useState<LlavesCardex[]>([])
  const [filtteredKeys, setFiltteredKeys] = useState<LlavesCardex[]>([])
  const [cardex, setCardex] = useState<CardexModelo>({ id_emp: 0, acardex: '', diasa: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCardex, setIsLoadingCardex] = useState(true)
  const [isLoadingKeys, setIsLoadingKeys] = useState(true)

  const fetchCardex = (year: string) => {
    setIsLoadingCardex(true)
    setIsLoadingKeys(true)
    cardexService.fetchCardex(year)
      .then((cardex) => {
        setCardex(cardex as any)
        setIsLoadingCardex(false)
      })
      .catch((error) => {
        console.log('Error en fetchCardex: ', error)
      })
  }

  useEffect(() => {
    cardexService.fetchLlavesCardex()
      .then((keys) => {
        setClavesCardex(keys)
        setIsLoading(false)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    if (cardex == null) return
    if (clavesCardex.length === 0) return
    const keysFiltered = filtrarRespuestas(clavesCardex, obtenerCaracteresUnicos(cardex))
    setFiltteredKeys(keysFiltered)
    setIsLoadingKeys(false)
  }, [cardex, clavesCardex])

  /* Actualiza el estado cada que cambie el year */
  return (
    <>
      <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={6} className="py-3 px- mx-auto">
        <h2 className='text-md font-normal mt-0 text-center'>Cardex</h2>
        <SelectYear onYearChange={fetchCardex}></SelectYear>
        {isLoadingCardex
          ? <div className="flex flex-col justify-center items-center">
            <CircularProgress color='secondary' />
          </div>
          : <Cardex cardexData={cardex ?? { id_emp: 0, acardex: '', diasa: '' }} llaves={clavesCardex}></Cardex> }
      </Paper>
      {isLoadingKeys
        ? (
        <div className="flex flex-col justify-center items-center mt-5">
          <CircularProgress color='secondary' />
        </div>
          )
        : (
        <Keys keysCardex={filtteredKeys}></Keys>
          )}
    </>
  )
}

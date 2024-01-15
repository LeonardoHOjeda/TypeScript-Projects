import { NextFunction, Request, Response } from 'express'
import { ReciboService } from './services'
import logger from '@/helpers/logger'
import { PDFMaker } from '@/helpers/pdf'
import { puppeteerPDF } from '@/helpers/puppeteer'
import { PaperFormat } from 'puppeteer'

export async function years (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const years = await finder.findYears(id_emp)

    res.json(years)
  } catch (error: any) {
    logger.error('Error al obtener los años de la nomina: ', error)
    next(error)
  }
}

export async function empresa (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new ReciboService()
  try {
    const empresa = await finder.findEmpresa()

    res.json(empresa)
  } catch (error: any) {
    logger.error('Error al obtener la empresa de la nomina: ', error)
    next(error)
  }
}

export async function registroPatronal (req: Request, res: Response, next: NextFunction): Promise<void> {
  const finder = new ReciboService()
  try {
    const registro = await finder.findRegistroPatronal()

    res.json(registro)
  } catch (error: any) {
    logger.error('Error al obtener el registro patronal de la nomina: ', error)
    next(error)
  }
}

export async function meses (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { year } = req.params
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const meses = await finder.findMeses(Number(year), id_emp)

    res.json(meses)
  } catch (error: any) {
    logger.error('Error al obtener los meses de la nomina: ', error)
    next(error)
  }
}

export async function periodos (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { mes, year } = req.params
  const { id_emp } = req.user!
  const finder = new ReciboService()
  try {
    const periodos = await finder.findPeriodos(id_emp, Number(mes), Number(year))

    res.json(periodos)
  } catch (error: any) {
    logger.error('Error al obtener los periodos de la nomina: ', error)
    next(error)
  }
}

export async function percepciones (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo } = req.params
  const id_periodo = periodo.split('-')[0]
  const finder = new ReciboService()
  try {
    const deducciones = await finder.findPercepciones(id_emp, Number(id_periodo))

    res.json(deducciones)
  } catch (error: any) {
    logger.error('Error al obtener las deducciones del periodo: ', error)
    next(error)
  }
}

export async function deducciones (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo } = req.params
  const id_periodo = periodo.split('-')[0]
  const finder = new ReciboService()
  try {
    const deducciones = await finder.findDeducciones(id_emp, Number(id_periodo))

    res.json(deducciones)
  } catch (error: any) {
    logger.error('Error al obtener las deducciones del periodo: ', error)
    next(error)
  }
}

// TODO: Eliminar Endpoint
export async function recibosData (req: Request, res: Response, next: NextFunction): Promise<void> {
  const { id_emp } = req.user!
  const { periodo, fechaInicio, fechaFin } = req.query
  const id_periodo = (periodo as string).split('-')[0]

  const finder = new ReciboService()
  try {
    const recibo = await finder.getInformacionRecibo(id_emp, Number(id_periodo), (fechaInicio as string), (fechaFin as string))

    res.json(recibo)
  } catch (error: any) {
    logger.error('Error al obtener la informacion del recibo: ', error)
    next(error)
  }
}

/* Recibos */
export async function recibo (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { html, comprobanteFolio } = await PDFMaker.recibo(req)

    const footer = /* html */
      `
        <div style="width: 100%; margin-left: 1cm; margin-right: 1cm;">
          <div style="width: 100%; border-bottom: 1px solid #000; position: relative;">
            <p style="font-size: 9px; text-align: center; color: #d1cfcf">
              &lt; No Recibo: ${comprobanteFolio} - Hoja <span class="pageNumber"></span> &gt;
            </p>
            <p style="font-size: 9px; position: absolute; right: 0; top: 0; color: #d1cfcf"">
              Página <span class="pageNumber"></span>
            </p>
          </div>
          <div style="width: 100%; display: flex; justify-content: space-between;">
            <p style="font-weight: bold; margin-bottom: 0.5rem; font-size: 9px;">ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA DE UN CFDI</p>
            <p style="font-size: 9px;">www.maquisoft.com.mx</p>
          </div>
        </div>
      `

    const pdf = await puppeteerPDF.createPDF(html, {
      format: 'Letter' as PaperFormat,
      margin: {
        top: '0.5cm'
      },
      displayHeaderFooter: true,
      footerTemplate: footer
    })

    res.contentType('application/pdf')
    res.send(pdf)
  } catch (error: any) {
    logger.error('Error al generar el recibo: ', error)
    next(error)
  }
}

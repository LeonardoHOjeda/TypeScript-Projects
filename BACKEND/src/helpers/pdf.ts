import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import { Request } from 'express'
import { ReciboService } from '@/modules/recibo/services'
import { formatoFechaLitteEndian, formatoMoneda } from './helpers'
import { Deduccion, Percepcion } from '@/interfaces/recibo.interface'

export class PDFMaker {
  /**
   * Helper para obtener las repeticiones
   */
  static timesHelper (n: number, options: handlebars.HelperOptions): string {
    let result = ''
    for (let i = 0; i < n; i++) {
      result += String(options.fn(i))
    }
    return result
  }

  /**
   * Función para generar el recibo completo
   * @param req Los datos de la petición
   * @returns El HTML del ticket timbrado
   */
  public static async recibo (req: Request): Promise<{ html: string, comprobanteFolio: string }> {
    const { id_emp } = req.user!
    const { periodo, fechaInicio, fechaFin } = req.query

    console.log('periodo: ', periodo)
    console.log('fechaInicio: ', fechaInicio)
    console.log('fechaFin: ', fechaFin)

    const reciboService = new ReciboService()

    const division: string[] = (periodo as string).split('-')
    const id_periodo = Number(division[0])

    handlebars.registerHelper('times', this.timesHelper)
    const ruta = path.resolve(__dirname, '../templates/recibo.hbs')
    console.log('ruta: ', ruta)

    const template = fs.readFileSync(ruta, 'utf8')

    const image = await reciboService.findImagenEmpresa()
    const imageBuffer = image!.xfile
    const base64Image = imageBuffer.toString('base64')

    const info = await reciboService.getInformacionRecibo(id_emp, id_periodo, (fechaInicio as string), (fechaFin as string))

    console.log('info: ', info)

    // * Se le agrega el formato de fecha a la fecha de alta
    info.empleado[0].fecha_alta = formatoFechaLitteEndian(info.empleado[0].fecha_alta)
    info.empleado[0].sd = formatoMoneda(Number(info.empleado[0].sd))

    // * Suma de las percepciones
    const sumaPercepciones = info.percepciones.reduce(
      (total: any, percepcion: Percepcion) => Number(total) + Number(percepcion.total),
      0
    )

    // * Se le agrega el formato de moneda a las percepciones
    info.percepciones.forEach((percepcion: Percepcion) => {
      percepcion.total = formatoMoneda(Number(percepcion.total))
      percepcion.pesos = formatoMoneda(Number(percepcion.pesos))
      percepcion.excento = formatoMoneda(Number(percepcion.excento))
    })

    // * Suma de las deducciones
    const sumaDeducciones = info.deducciones.reduce((total: any, deduccion: Deduccion) => {
      const importe = parseFloat(deduccion.importe.toString().replace(',', ''))

      return Number(total) + importe
    }, 0)

    // * Se le agrega el formato de moneda a las percepciones
    info.deducciones.forEach((deduccion: Deduccion) => {
      deduccion.pesos = formatoMoneda(Number(deduccion.pesos))
      deduccion.pesosExcento = formatoMoneda(Number(deduccion.pesosExcento))
    })

    const netoAPagar = Number(sumaPercepciones) - Number(sumaDeducciones)

    const fechaIni = await reciboService.findFechaInicioCorte(id_periodo)
    const fechaEnd = await reciboService.findFechaFinCorte(id_periodo) ?? fechaFin

    const aportacionEmpleado = await reciboService.findAportacionEmpleado(id_emp, id_periodo, (fechaEnd as string), fechaIni)
    const aportacionEmpresa = await reciboService.findAportacionEmpresa(id_emp, id_periodo, (fechaEnd as string), fechaIni)

    const devolucionEmpleado = await reciboService.findDevolucionEmpleado(id_emp, id_periodo, fechaIni, (fechaEnd as string))
    const devolucionEmpresa = await reciboService.findDevolucionEmpresa(id_periodo, id_emp, fechaIni, (fechaEnd as string))

    const saldoEmpleado: number = Number(aportacionEmpleado?.AportEmpleado ?? 0) - Number(devolucionEmpleado ?? 0)
    const saldoEmpresa: number = Number(aportacionEmpresa?.AportEmpresa ?? 0) - Number(devolucionEmpresa ?? 0)

    const saldos = {
      saldoEmpleado: formatoMoneda(saldoEmpleado),
      saldoEmpresa: formatoMoneda(saldoEmpresa)
    }

    const configSaldos = await reciboService.findConfiguracion(id_periodo)

    // ? Se obtiene la información del timbrado
    const timbradoData = await reciboService.findInformacionTimbrado(id_emp, id_periodo)
    let base64Qr = ''
    if (timbradoData != null) {
      base64Qr = timbradoData.imagenQrCode.toString('base64')
    }

    console.log('Timbrado aqui: ', timbradoData)

    const now = formatoFechaLitteEndian(new Date().toLocaleString())

    const leyendas = await reciboService.findLeyendas(id_periodo)

    const datos = await reciboService.findDatosPeriodo(id_periodo)
    const noEmpx = await reciboService.findNumEmpleado(id_emp)
    const noRecibo: string = `${datos.datosPeriodo}${noEmpx.numEmpleado}`

    const configConcepto = await reciboService.findConfiguracionConcepto()

    const nombreConcepto1 = await reciboService.findConcepto(Number(configConcepto.conceptoRecibo1))
    const nombreConcepto2 = await reciboService.findConcepto(Number(configConcepto.conceptoRecibo2))

    const saldoConcepto1 = await reciboService.findSaldoConcepto(info.empleado[0].id_emp, id_periodo, Number(configConcepto.conceptoRecibo1), info.empleado[0].id_plaza)

    const saldoConcepto2 = await reciboService.findSaldoConcepto(info.empleado[0].id_emp, id_periodo, Number(configConcepto.conceptoRecibo2), info.empleado[0].id_plaza)

    const configPlazas = await reciboService.findConfiguracionPlazas()

    const infoPlazas = await reciboService.findInformacionPlazas(id_periodo, info.empleado[0].id_emp)
    console.log('saldos: ', saldos)

    const html = handlebars.compile(template)({
      data: info,
      imagen: base64Image,
      base64Qr,
      sumaPercepciones: formatoMoneda(sumaPercepciones),
      sumaDeducciones: formatoMoneda(sumaDeducciones),
      netoAPagar: formatoMoneda(netoAPagar),
      timbradoData,
      noRecibo: timbradoData?.comprobante_folio ?? noRecibo,
      regimenFiscal: timbradoData?.regimen_fiscal ?? 'GENERAL DE LEY PERSONAS MORALES',
      captions: leyendas,
      now,
      saldos,
      configSaldos: {
        fdoAhrcbo: configSaldos?.fdoAhrcbo ?? false,
        fdoAhrcboEmpresa: configSaldos?.fdoAhrcboEmpresa ?? false
      },
      configConcepto: {
        concepto1: configConcepto.conceptoRecibo1,
        concepto2: configConcepto.conceptoRecibo2
      },
      nombreConceptos: {
        concepto1: nombreConcepto1.descripcion,
        concepto2: nombreConcepto2.descripcion
      },
      saldoConceptos: {
        concepto1: formatoMoneda(saldoConcepto1?.saldo ?? 0),
        concepto2: formatoMoneda(saldoConcepto2?.saldo ?? 0)
      },
      plazas: {
        configPlaza: configPlazas.Flag,
        infoPlaza: infoPlazas
      }
    })

    return { html, comprobanteFolio: timbradoData?.comprobante_folio ?? noRecibo }
  }
}

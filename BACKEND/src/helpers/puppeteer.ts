import puppeteer, { PDFOptions } from 'puppeteer'

class PuppeteerPDF {
  public async createPDF (html: string, options: PDFOptions): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    })
    const page = await browser.newPage()

    // Configurar el contenido HTML en la página de Puppeteer
    await page.setContent(html)

    // Generar el PDF
    const pdfBuffer = await page.pdf(options)

    // Cerrar el navegador de Puppeteer
    await browser.close()

    return pdfBuffer
  }
}

export const puppeteerPDF = new PuppeteerPDF()

import { v4 as uuidv4 } from 'uuid'
import { Empleado, Foto, HSupervisor, Repositorio } from '@/entities/empleados'
import { Contacto } from '@/entities/empleados/contacto.entity'
import { HBanco, HLinea, HMedioPago, HArea, HCategoria, HCCosto, HDepartamento, HHorario, HTurno, HPlanta, HManoObra } from '@/entities/nomina'
import { Mailer } from '@/helpers/mailer'
import { HTTPError } from '@/middlewares/error_handler'
import { AppDataSource, ImagenesDataSource } from '@/database/datasources'
import logger from '@/helpers/logger'

export class EmpleadoService {
  async findOne (id_emp: number, noempx: string): Promise<any> {
    const empleado = await Empleado.findOne({
      relations: {
        nacionalidad: true,
        estado_nacimiento: true,
        estado_civil: true,
        direccion: {
          estado: true,
          ciudad: true,
          colonia: true
        }
      },
      where: { noempx }
    })

    if (empleado == null) throw new HTTPError(404, 'Empleado no encontrado')

    const promises = [
      this.findSupervisor(id_emp),
      this.findMetodoPago(id_emp),
      this.findBanco(id_emp),
      this.findHorario(id_emp),
      this.findTurno(id_emp),
      this.findArea(id_emp),
      this.findCategoria(id_emp),
      this.findCentroCosto(id_emp),
      this.findDepartamento(id_emp),
      this.findLinea(id_emp),
      this.findPlanta(id_emp),
      this.findManoObra(id_emp),
      this.findNombresContacto(id_emp),
      empleado
    ]

    const result = await Promise.all(promises)

    return {
      empleado,
      nomina: {
        supervisor: result[0],
        metodoPago: result[1],
        banco: result[2],
        horario: result[3],
        turno: result[4],
        area: result[5],
        categoria: result[6],
        centroCosto: result[7],
        departamento: result[8],
        linea: result[9],
        planta: result[10],
        manoObra: result[11],
        contacto: result[12]
      }
    }
  }

  async findImagen (id_emp: number): Promise<Buffer | Object> {
    try {
      await ImagenesDataSource.initialize()
      const id_foto = await Foto.findOne({
        where: { id_emp }
      })

      const foto = await Repositorio.findOne({
        where: { id_campo: id_foto?.foto }
      })

      if (foto == null || foto.xfile == null) return {}

      const imagen = Buffer.from(foto.xfile, 'base64')

      return imagen
    } catch (error: any) {
      logger.error('Error al conectar con la base de datos de imágenes: ', error)
      throw new HTTPError(500, 'Error al obtener la imagen del empleado')
    } finally {
      await ImagenesDataSource.destroy()
    }
  }

  async findSupervisor (id_emp: number): Promise<HSupervisor | object> {
    const supervisor = await HSupervisor.findOne({
      select: { id_emp: true, fecha: true },
      relations: { supervisor: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (supervisor == null) return {}

    return supervisor.supervisor
  }

  async findMetodoPago (id_emp: number): Promise<HMedioPago | object> {
    const medioPago = await HMedioPago.findOne({
      relations: { medioPago: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (medioPago == null) return {}

    return medioPago.medioPago
  }

  async findBanco (id_emp: number): Promise<HBanco | object> {
    const banco = await HBanco.findOne({
      relations: { banco: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (banco == null) return {}

    return banco.banco
  }

  async findHorario (id_emp: number): Promise<HHorario | object> {
    const horario = await HHorario.findOne({
      relations: { horario: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (horario == null) return {}

    return horario.horario
  }

  async findTurno (id_emp: number): Promise<HTurno | object> {
    const turno = await HTurno.findOne({
      relations: { turno: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (turno == null) return {}

    return turno.turno
  }

  async findArea (id_emp: number): Promise<HArea | object> {
    const area = await HArea.findOne({
      relations: { area: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (area == null) return {}

    return area.area
  }

  async findCategoria (id_emp: number): Promise<HCategoria | object> {
    const categoria = await HCategoria.findOne({
      relations: { categoria: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (categoria == null) return {}

    return categoria.categoria
  }

  async findCentroCosto (id_emp: number): Promise<HCCosto | object> {
    const centroCosto = await HCCosto.findOne({
      relations: { centro_costo: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (centroCosto == null) return {}

    return centroCosto.centro_costo
  }

  async findDepartamento (id_emp: number): Promise<HDepartamento | object> {
    const departamento = await HDepartamento.findOne({
      relations: { departamento: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (departamento == null) return {}

    return departamento.departamento
  }

  async findLinea (id_emp: number): Promise<HLinea | object> {
    const linea = await HLinea.findOne({
      relations: { linea: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (linea == null) return {}

    return linea.linea
  }

  async findPlanta (id_emp: number): Promise<HPlanta | object> {
    const planta = await HPlanta.findOne({
      relations: { planta: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (planta == null) return {}

    return planta.planta
  }

  async findManoObra (id_emp: number): Promise<HManoObra | object> {
    const manoObra = await HManoObra.findOne({
      relations: { manoObra: true },
      order: { fecha: 'DESC' },
      where: { id_emp }
    })

    if (manoObra == null) return {}

    return manoObra.manoObra
  }

  async findNombresContacto (id_emp: number): Promise<any> {
    const contacto = await Contacto.findOne({
      select: {
        id_parentesco: true,
        nombre: true,
        apPaterno: true,
        apMaterno: true,
        telefonoE: true,
        celular: true
      },
      where: { id_emp, id_parentesco: 6 }
    })

    if (contacto == null) return {}

    return contacto
  }

  async findMenus (): Promise<any> {
    const menus = AppDataSource.query('SELECT claveMenu, descripcion, nameExe, visible FROM menu WHERE padre IN (SELECT id_nodo FROM menu WHERE nombre = @0)', ['KioskoWeb'])

    return await menus
  }

  async update (username: string, body: any): Promise<Empleado | null> {
    const empleado = await Empleado.findOne({ where: { noempx: username } })
    // Obtener contrasena anterior y la nueva
    const { nip, nuevoNip } = body

    if (empleado == null || empleado.nip !== nip) return null

    empleado.nip = nuevoNip

    await empleado.save()

    return empleado
  }

  // Enviar correo para restablecer la contrasena
  async sendPasswordResetEmail (email: string): Promise<void> {
    const uuid = uuidv4()
    const empleado = await Empleado.findOne({ where: { email } })
    console.log('Empleado: ', empleado)

    if (empleado == null) throw new HTTPError(404, 'Empleado no encontrado')
    empleado.reset_password_token = uuid
    await empleado.save()
    console.log('Empleado guardado: ')

    Mailer.sendNotification({
      subject: 'Restablecer contraseña',
      to: email,
      greeting: `Hola ${empleado.nombre} ${empleado.apPaterno}`,
      content: 'Hemos recibido una solicitud para restablecer tu contraseña. Si no has realizado esta solicitud, puedes ignorar este correo.',
      atte: 'Atte. Kiosko Riche',
      action: {
        title: 'Restablecer contraseña',
        url: `${process.env.FRONTEND_URL}/configuracion?token=${uuid}`
      }
    })
  }

  // TODO: Actualizar contrasena despues de verificar el token
  async verifyPasswordToken (token: string): Promise<boolean> {
    const empleado = await Empleado.findOne({ where: { reset_password_token: token } })

    if (empleado == null) throw new HTTPError(404, 'El código no es válido o ha expirado')

    empleado.reset_password_token = ''
    await empleado.save()

    return true
  }
}

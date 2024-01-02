import jwt from 'jsonwebtoken'
import { HTTPError } from '@/middlewares/error_handler'
import { settings } from '@/config/settings'
import { Empleado } from '@/entities/empleados'
import { Configuracion } from '@/entities/configuracion.entity'
import { RazonSocial } from '@/entities/empleados/razon_social.entity'
import { AppDataSource } from '@/database/datasources'

export class AuthService {
  async login (username: string, password: string) {
    let empleado: Empleado | null = null

    const authenticationMethod = await this.configurationAuthentication()

    if (authenticationMethod === 1) {
      empleado = await Empleado.findOne({ where: { noempx: username } })
    } else if (authenticationMethod === 2) {
      empleado = await Empleado.findOne({
        where: {
          codigo: {
            codigoGafete: username
          }
        }
      })
    }

    if (empleado == null || empleado.nip !== password || empleado.vigencia === 'B') throw new HTTPError(401, 'Usuario o contraseña incorrectos')

    const empresa: RazonSocial[] = await AppDataSource
      .query('SELECT razonSocial FROM ConfigRs WHERE CHARINDEX(@0, \',\' + CadenaCias + \',\') > 0',
        [empleado.id_cia.toString()])

    const token = this.createToken(empleado)

    return {
      id_emp: empleado.id_emp,
      noempx: empleado.noempx,
      nombre: `${empleado.nombre} ${empleado.apPaterno} ${empleado.apMaterno}`,
      id_cia: empleado.id_cia,
      vigencia: empleado.vigencia,
      empresa: empresa[0].razonSocial,
      token
    }
  }

  /**
   * @description Obtiene la manera de autenticar al empleado, ya sea con el NOEMPx o con el CodigoGafete
   */
  private async configurationAuthentication () {
    const loginConfiguration = await Configuracion.find({
      select: ['accesoKiosko']
    })

    return loginConfiguration[0].accesoKiosko
  }

  private createToken (empleado: Empleado) {
    return jwt.sign({ noempx: empleado.noempx, id_emp: empleado.id_emp, id_cia: empleado.id_cia }, settings.SECRET, {
      expiresIn: 86400
    })
  }
}

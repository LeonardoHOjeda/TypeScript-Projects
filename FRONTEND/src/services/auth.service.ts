import { instance } from '../networking/axios'

class AuthService {
  async login (username: string, password: string): Promise<{ token: string, noempx: string, id_emp: number, nombre: string, empresa: string }> {
    const data = await instance.post('/auth/login', { username, password })
    console.log(`${username}, ${password}`)

    localStorage.setItem('empleadoData', JSON.stringify(data.data))
    localStorage.setItem('token', data.data.token)

    return {
      token: data.data.token,
      noempx: data.data.noempx,
      id_emp: data.data.id_emp,
      nombre: data.data.nombre,
      empresa: data.data.empresa
    }
  }
}

export const authService = new AuthService()

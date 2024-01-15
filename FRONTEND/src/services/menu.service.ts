import { instance } from '../networking/axios'

class MenuService {
  async getMenu (): Promise<any> {
    const menus = await instance.get('/empleados/menus')

    return menus.data
  }
}

export const menuService = new MenuService()

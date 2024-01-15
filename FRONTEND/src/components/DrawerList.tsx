import { Divider, List, ListItem, ListItemButton, ListItemIcon, Toolbar } from '@mui/material'
import { AccountCircle, WorkHistory, AccountBalanceWallet, ReceiptLong, BeachAccess, AccessTimeFilled, Savings, Logout, Description, House } from '@mui/icons-material'
import Logo from '../assets/img/kioskologo.png'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/UserContext'
import { menuService } from '../services/menu.service'

export const DrawerList = () => {
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [isActive, setIsActive] = useState('')
  const navigate = useNavigate()
  const { logout } = useUserContext()

  // const isSelected = (route: string) => isActive.search(route) > 0
  const isSelected = (route: string) => {
    return isActive.search(route) > 0
  }

  const navigateAndCloseDrawer = (route: string) => {
    navigate(route)
    // onToggleDrawer
  }

  const iconMapping: any = {
    inicio: <House />,
    'datos-generales': <AccountCircle />,
    cardex: <WorkHistory />,
    'mis-prestamos': <AccountBalanceWallet />,
    'recibo-nomina': <ReceiptLong />,
    'saldos-vacaciones': <BeachAccess />,
    'consulta-tiempos': <AccessTimeFilled />,
    'mi-fondo-ahorro': <Savings />,
    justificantes: <Description />
  }

  useEffect(() => {
    menuService.getMenu().then((data: any[]) => {
      const menu: any[] = []
      data.forEach((item: any) => {
        if (item.visible) {
          const icon = iconMapping[item.nameExe] // Obtén el ícono correspondiente

          menu.push({
            text: item.descripcion,
            icon,
            route: item.nameExe
          })
        }
      })
      menu.push({
        text: 'Salir',
        icon: <Logout />,
        route: 'login'
      })
      setMenuItems(menu)
    })
      .catch(console.log)
  }, [])

  useEffect(() => {
    setIsActive(location.pathname)
  }, [location.pathname])

  return (
    <div>
      <div className='bg-gray-200'>
        <Toolbar>
          <img src={Logo} alt="Logo Nomifacil" style={{ paddingTop: '24px', paddingBottom: '16px', color: 'primary' }}/>
        </Toolbar>
      </div>
      <Divider />
      <List>
        {menuItems
          .filter((menu) => menu.text !== 'Salir') // Filtrar los elementos con texto diferente a "Salir"
          .map((menu, index) => (
            <ListItem disablePadding key={index} onClick={() => navigateAndCloseDrawer(menu.route)}>
              <ListItemButton selected={isSelected(menu.route)}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <p className='py-3 m-0'>{menu.text}</p>
              </ListItemButton>
            </ListItem>
          ))}

        <ListItem disablePadding onClick={() => {
          logout()
          navigate('/login')
        }}>
          <ListItemButton>
            <ListItemIcon>{menuItems.find((menu) => menu.text === 'Salir')?.icon}</ListItemIcon>
            <p className='py-3 m-0'>Salir</p>
          </ListItemButton>
        </ListItem>

      </List>

    </div>
  )
}

import { AppBar, IconButton, Toolbar } from '@mui/material'
import { Menu } from '@mui/icons-material'
import Typography from '@mui/material/Typography'
import { NavbarProfileButton } from './NavbarProfileButton'
import { useUserContext } from '../context/UserContext'

interface NavbarProps {
  onToggleDrawer: () => void
}

export const Navbar = ({ onToggleDrawer }: NavbarProps) => {
  const { nombre, empresa } = useUserContext()

  const partesNombre = nombre.split(' ')

  return (
    <AppBar position="fixed" sx={{ width: { md: 'calc(100% - 250px)' }, ml: { md: '250px' } }} color='secondary'>
      <Toolbar variant="dense" className='flex justify-between'>
        <IconButton edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2, display: { md: 'none' } }} onClick={onToggleDrawer}>
          <Menu />
        </IconButton>
        <div className='flex w-full align-middle items-start gap-2'>
          <Typography color="inherit" component="div" className=' block text-lg font-bold max-w-fit' sx={{ flexGrow: 1 }}>
            ¡HOLA, { partesNombre[0] }!
          </Typography>
          <Typography color="inherit" component="div" className=' text-lg font-bold hidden md:block' sx={{ flexGrow: 1 }}>
            | { empresa }
          </Typography>
        </div>
        <NavbarProfileButton />
      </Toolbar>
    </AppBar>
  )
}

import { KeyboardArrowDown, PowerSettingsNew, Password } from '@mui/icons-material'
import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItemIcon, Menu, MenuItem, Stack } from '@mui/material'
import { useState } from 'react'
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

export const NavbarProfileButton = () => {
  const { noempx, logout, nombre } = useUserContext()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const open = Boolean(anchorEl)
  const isOpenDialog = Boolean(openDialog)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleClickOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleClickLogout = () => {
    logout()
    navigate('/login')
  }

  const navigateConfig = (route: string) => {
    navigate(route)
  }

  const nameToColor = (string: string) => {
    let hash = 0
    let index

    for (index = 0; index < string.length; index += 1) {
      hash = string.charCodeAt(index) + ((hash << 5) - hash)
    }

    let color = '#'

    for (index = 0; index < 3; index += 1) {
      const value = (hash >> (index * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }

    return color
  }

  const trimName = (name: string) => {
    return {
      sx: { bgcolor: nameToColor(name) },
      children: name ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : ''
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Stack direction='row' spacing={2} >
        <Button
        aria-controls={open ? 'resources=menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        color='inherit'
        endIcon={<KeyboardArrowDown/>}
        id='resources-button'
        onClick={handleClick}
        sx={{ justifyContent: 'space-between', paddingRight: { md: '3rem' } }}
        >
          <Avatar className="mr-4" alt="Remy Sharp" {...trimName(`${nombre}`)} src="/static/images/avatar/1.jpg" />
          <p className='min-w-fit font-bold'>Empleado: <span className='font-thin'>{noempx}</span></p>
        </Button>
      </Stack>
      <Menu
        id='resources-menu'
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        MenuListProps={{ 'aria-labelledby': 'resources-button' }}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { navigateConfig('configuracion'); handleClose() }}>
          <ListItemIcon>
            <Password fontSize="small" />
          </ListItemIcon>
          Cambiar Contraseña
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleClickOpenDialog(); handleClose() }}>
          <ListItemIcon >
            <PowerSettingsNew fontSize="small" color='error' />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>
      {/* <Avatar className="mr-4 bg-warning" alt="Remy Sharp" src="/static/images/avatar/1.jpg">LH</Avatar> */}
      <Dialog open={isOpenDialog} onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Estás a punto de cerrar sesión'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de cerrar tu sesion?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='error'>Cancelar</Button>
          <Button onClick={handleClickLogout} color='success' autoFocus>Cerrar Sesion</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

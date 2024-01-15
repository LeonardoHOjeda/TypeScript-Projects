import { Box } from '@mui/material'
import { DrawerComponent } from '../components/DrawerComponent'
import { Navbar } from '../components/Navbar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export const AppLayout = () => {
  const [isDrawerOpen, setisDrawerOpen] = useState(false)

  return (
    <div>
      <Navbar onToggleDrawer={() => setisDrawerOpen(true)}/>
      <DrawerComponent onCloseDrawer={() => setisDrawerOpen(false)} isOpen={isDrawerOpen} />
      <Box component='main' sx={{ width: { md: 'calc(100% - 250px)' }, ml: { md: '250px' } }} className='mt-20 md:mt-12'>
        <div className='md:p-5'>
          <Outlet />
        </div>
      </Box>
    </div>
  )
}

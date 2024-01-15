import { Container } from '@mui/material'
import { useState } from 'react'
import { Navbar } from './Navbar'
import { DrawerComponent } from './DrawerComponent'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  const [isDrawerOpen, setisDrawerOpen] = useState(false)
  return (
    <>
      <Navbar onToggleDrawer={() => setisDrawerOpen(true)}/>
      <DrawerComponent onCloseDrawer={() => setisDrawerOpen(false)} isOpen={isDrawerOpen} />
      <Container>
        {children}
      </Container>
    </>
  )
}

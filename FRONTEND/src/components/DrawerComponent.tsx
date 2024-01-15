import { Drawer } from '@mui/material'
import { Box } from '@mui/system'
import { DrawerList } from './DrawerList'

interface DrawerComponentProps {
  onCloseDrawer: () => void
  isOpen: boolean
}

export const DrawerComponent = ({ onCloseDrawer, isOpen }: DrawerComponentProps) => {
  return (
    <Box component='nav' sx={{ width: { md: 250 }, flexShrink: { sm: 0 } }}>
          <Drawer
            anchor='left'
            onClose={() => onCloseDrawer()}
            open={isOpen}
            variant='temporary'
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
            }}
          >
            <DrawerList/>
          </Drawer>

          <Drawer
          anchor='left'
          variant='permanent'
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
          }}
        >
          <DrawerList />
        </Drawer>
        </Box>
  )
}

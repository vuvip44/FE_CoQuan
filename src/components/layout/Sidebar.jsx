import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  CalendarMonth as CalendarMonthIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Debug user data
  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is authenticated:', isAuthenticated);
    console.log('User data:', user?.user);
    console.log('User roleId:', user?.user?.roleId);
  }, [user, isAuthenticated]);
  
  // Check if user has admin role (roleId === 1)
  const isAdmin = user?.user?.roleId === 1;

  const menuItems = [
    {
      text: 'Đặt lịch',
      icon: <EventNoteIcon />,
      path: '/schedule/create',
      roles: ['Admin', 'User']
    },
    {
      text: 'Xem lịch',
      icon: <CalendarMonthIcon />,
      path: '/schedule/view',
      roles: ['Admin', 'User']
    },
    {
      text: 'Duyệt lịch',
      icon: <AdminPanelSettingsIcon />,
      path: '/schedule/approve',
      roles: ['Admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!isAuthenticated || !user?.user) return false;
    
    // For admin role (roleId === 1)
    if (isAdmin) {
      console.log(`Admin can see: ${item.text}`);
      return true; // Admin can see all items
    }
    
    // For user role (roleId === 2)
    console.log(`User can see: ${item.text} - ${item.roles.includes('User')}`);
    return item.roles.includes('User');
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          top: '64px', // Height of AppBar
          height: 'calc(100% - 64px)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {filteredMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 
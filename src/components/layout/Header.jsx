import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import authService from '../../services/authService';
import { logout } from '../../store/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    handleMenuClose();
    setLoginOpen(true);
  };

  const handleRegisterClick = () => {
    handleMenuClose();
    setRegisterOpen(true);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
    handleMenuClose();
  };

  const menuItems = isAuthenticated ? [
    <MenuItem key="logout" onClick={handleLogout}>Đăng xuất</MenuItem>
  ] : [
    <MenuItem key="login" onClick={handleLoginClick}>Đăng nhập</MenuItem>,
    <MenuItem key="register" onClick={handleRegisterClick}>Đăng ký</MenuItem>
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lịch
          </Typography>
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar src={user?.avatar} alt={user?.fullName}>
                {user?.fullName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />
    </>
  );
};

export default Header; 
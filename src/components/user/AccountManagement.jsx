import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import userService from '../../services/userService';

const AccountManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleOpenPasswordModal = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleChangePassword = async () => {
    try {
      // Validate form
      if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        setNotification({
          type: 'error',
          message: 'Vui lòng điền đầy đủ thông tin'
        });
        return;
      }

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setNotification({
          type: 'error',
          message: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
        });
        return;
      }

      if (passwordForm.newPassword.length < 6) {
        setNotification({
          type: 'error',
          message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
        });
        return;
      }

      setLoading(true);
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setNotification({
        type: 'success',
        message: 'Đổi mật khẩu thành công!'
      });
      handleClosePasswordModal();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Không thể đổi mật khẩu'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (roleId) => {
    return roleId === 1 ? 'Admin' : 'User';
  };

  return (
    <Box sx={{ p: 3 }}>
      {notification && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Quản lý tài khoản
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            Thông tin cá nhân
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Họ tên"
              fullWidth
              margin="normal"
              value={user?.user?.fullName || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={user?.user?.email || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Vai trò"
              fullWidth
              margin="normal"
              value={getRoleName(user?.user?.roleId)}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon />
            Bảo mật
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPasswordModal}
            sx={{ mt: 1 }}
          >
            Đổi mật khẩu
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal} maxWidth="sm" fullWidth>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Mật khẩu hiện tại"
              fullWidth
              margin="normal"
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <TextField
              label="Mật khẩu mới"
              fullWidth
              margin="normal"
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              helperText="Mật khẩu phải có ít nhất 6 ký tự"
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              fullWidth
              margin="normal"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal}>Hủy</Button>
          <Button 
            onClick={handleChangePassword} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Đổi mật khẩu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountManagement; 
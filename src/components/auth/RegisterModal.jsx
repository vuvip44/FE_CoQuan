import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import authService from '../../services/authService';
import { setUser, setError, setLoading } from '../../store/authSlice';

const RegisterModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      dispatch(setError(null));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password length
    if (formData.password.length < 6) {
      dispatch(setError('Mật khẩu phải có ít nhất 6 ký tự'));
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      dispatch(setError('Mật khẩu không khớp'));
      return;
    }

    dispatch(setLoading(true));
    try {
      const { confirmPassword, ...registerData } = formData;
      // Transform data to match backend model
      const transformedData = {
        Email: registerData.email,
        Password: registerData.password,
        ConfirmPassword: confirmPassword,
        FullName: registerData.fullName
      };
      
      const response = await authService.register(transformedData);
      console.log('Register response:', response); // Debug log

      // Kiểm tra response có đúng format không
      if (response && response.status === 200) {
        // Đăng ký thành công
        setSnackbar({
          open: true,
          message: response.message || 'Đăng ký thành công!',
          severity: 'success'
        });
        // Đóng modal, reset user và chuyển về trang chủ
        onClose();
        dispatch(setUser(null));
        dispatch(setError(null));
        navigate('/');
      } else {
        // Đăng ký thất bại
        const errorMessage = response?.message || 'Đăng ký thất bại';
        dispatch(setError(errorMessage));
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Register error:', error); // Debug log
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      dispatch(setError(errorMessage));
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Đăng ký</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              name="fullName"
              label="Họ và tên"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.fullName}
              onChange={handleChange}
              required
              error={!!error}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!error}
            />
            <TextField
              margin="dense"
              name="password"
              label="Mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              required
              error={!!error}
            />
            <TextField
              margin="dense"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              fullWidth
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              error={!!error}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RegisterModal; 
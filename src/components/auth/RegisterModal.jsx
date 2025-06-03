import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import authService from '../../services/authService';
import { setUser, setError, setLoading } from '../../store/authSlice';

const RegisterModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      dispatch(setError('Mật khẩu không khớp'));
      return;
    }

    dispatch(setLoading(true));
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authService.register(registerData);
      dispatch(setUser(response.data));
      onClose();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đăng ký</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            Đăng ký
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterModal; 
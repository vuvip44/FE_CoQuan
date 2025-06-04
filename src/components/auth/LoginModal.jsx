import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

const LoginModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await authService.login(formData);
      dispatch(setUser(response.data));
      onClose();
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Đăng nhập</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            Đăng nhập
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal; 
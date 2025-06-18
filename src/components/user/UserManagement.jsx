import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import userService from '../../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    roleId: 2, // Default to User role
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Không thể lấy danh sách người dùng'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        password: '',
        confirmPassword: '',
        fullName: user.fullName,
        roleId: user.roleId,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        roleId: 2,
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      roleId: 2,
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.email || !formData.fullName) {
        setNotification({
          type: 'error',
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
        return;
      }

      if (!selectedUser && (!formData.password || !formData.confirmPassword)) {
        setNotification({
          type: 'error',
          message: 'Vui lòng nhập mật khẩu và xác nhận mật khẩu'
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setNotification({
          type: 'error',
          message: 'Mật khẩu và xác nhận mật khẩu không khớp'
        });
        return;
      }

      if (selectedUser) {
        // Update user - only send password if it's provided
        const updateData = {
          email: formData.email,
          fullName: formData.fullName,
          roleId: formData.roleId,
        };
        
        if (formData.password) {
          updateData.password = formData.password;
          updateData.confirmPassword = formData.confirmPassword;
        }

        await userService.updateUser(selectedUser.id, updateData);
        setNotification({
          type: 'success',
          message: 'Cập nhật người dùng thành công!'
        });
      } else {
        // Create user
        await userService.createUser(formData);
        setNotification({
          type: 'success',
          message: 'Tạo người dùng thành công!'
        });
      }
      handleCloseModal();
      fetchUsers();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Có lỗi xảy ra'
      });
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await userService.deleteUser(userId);
        setNotification({
          type: 'success',
          message: 'Xóa người dùng thành công!'
        });
        fetchUsers();
      } catch (error) {
        setNotification({
          type: 'error',
          message: error.message || 'Không thể xóa người dùng'
        });
      }
    }
  };

  const handleChangeRole = async (userId) => {
    try {
      await userService.updateUserRole(userId);
      setNotification({
        type: 'success',
        message: 'Cập nhật vai trò thành công!'
      });
      fetchUsers();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Không thể cập nhật vai trò'
      });
    }
  };

  const getRoleName = (roleId) => {
    return roleId === 1 ? 'Admin' : 'User';
  };

  const getRoleColor = (roleId) => {
    return roleId === 1 ? 'error' : 'primary';
  };

  return (
    <Box sx={{ p: 3 }}>
      {notification && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h1">
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Thêm người dùng
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleName(user.roleId)}
                      color={getRoleColor(user.roleId)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleChangeRole(user.id)}
                        title="Thay đổi vai trò"
                      >
                        <PersonIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        title="Xóa người dùng"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              label="Họ tên"
              fullWidth
              margin="normal"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Mật khẩu"
              fullWidth
              margin="normal"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText={selectedUser ? 'Để trống nếu không muốn thay đổi mật khẩu' : ''}
            />
            <TextField
              label="Xác nhận mật khẩu"
              fullWidth
              margin="normal"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              helperText={selectedUser ? 'Để trống nếu không muốn thay đổi mật khẩu' : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedUser ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 
import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Chào mừng đến với ứng dụng Lịch
        </Typography>
        <Typography variant="body1">
          Đây là trang chủ của ứng dụng. Vui lòng đăng nhập để sử dụng các tính năng.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage; 
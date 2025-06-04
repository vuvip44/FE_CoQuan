import React, { useEffect, useState } from 'react';
import scheduleService from '../../services/scheduleService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, CircularProgress, Alert, Box } from '@mui/material';

const cellBorder = { border: '1px solid #bdbdbd' };

const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ApproveSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await scheduleService.getPendingSchedules();
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách lịch chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await scheduleService.updateScheduleStatus(id, newStatus);
      setSchedules(schedules => schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      alert('Cập nhật trạng thái thất bại!');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1100, minWidth: 700 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
          Duyệt lịch công tác
        </Typography>
        {loading && <CircularProgress sx={{ my: 2 }} />}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650, border: '1px solid #bdbdbd' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffcc' }}>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Ngày</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Lãnh đạo/Cục tham dự</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Nội dung</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Địa điểm</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Đơn vị chuẩn bị/Tham dự</TableCell>
                <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id} sx={schedule.status === 'Pending' ? { backgroundColor: '#ffcccc' } : { backgroundColor: '#fff' }}>
                  <TableCell sx={cellBorder}>{formatDateTime(schedule.startTime)}</TableCell>
                  <TableCell sx={cellBorder}>{formatDate(schedule.startTime)}</TableCell>
                  <TableCell sx={cellBorder}>{schedule.leaderCompany}</TableCell>
                  <TableCell sx={cellBorder}>{schedule.title}</TableCell>
                  <TableCell sx={cellBorder}>{schedule.location}</TableCell>
                  <TableCell sx={cellBorder}>{schedule.component}</TableCell>
                  <TableCell sx={cellBorder}>
                    <Select
                      value={schedule.status}
                      size="small"
                      disabled={updatingId === schedule.id}
                      onChange={e => handleStatusChange(schedule.id, e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ApproveSchedule; 
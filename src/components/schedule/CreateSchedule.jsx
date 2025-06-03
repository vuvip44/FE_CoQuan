import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';
import AddScheduleModal from './AddScheduleModal';
import scheduleService from '../../services/scheduleService';

const CreateSchedule = () => {
  const [openModal, setOpenModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchParams, setSearchParams] = useState({
    leaderCompany: '',
    title: '',
    startTime: null,
    endTime: null,
    status: '',
    location: '',
    createAt: null
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSuccess = (data) => {
    setNotification({
      type: 'success',
      message: 'Tạo lịch thành công!'
    });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (field) => (newValue) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  const handleSearch = async () => {
    try {
      setSearchError(null);
      const response = await scheduleService.searchSchedules(searchParams);
      setSearchResults(response.data);
    } catch (error) {
      setSearchError(error.message || 'Có lỗi xảy ra khi tìm kiếm');
    }
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'HH:mm');
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'EEEE, dd/MM/yyyy', { locale: vi });
  };

  const groupSchedulesByDate = (schedules) => {
    const grouped = {};
    schedules.forEach(schedule => {
      const date = format(new Date(schedule.startTime), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  return (
    <Box sx={{ p: 3 }}>
      {notification && (
        <Alert severity={notification.type} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
          Thêm lịch
        </Button>
        <Button
          variant="contained"
          color="error"
        >
          Xóa lịch
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
          Tìm kiếm lịch
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '150px' }}>Lãnh đạo cơ quan:</Typography>
              <TextField
                name="leaderCompany"
                size="small"
                fullWidth
                value={searchParams.leaderCompany}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '150px' }}>Nội dung:</Typography>
              <TextField
                name="title"
                size="small"
                fullWidth
                value={searchParams.title}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '150px' }}>Thời gian từ:</Typography>
                <DateTimePicker
                  value={searchParams.startTime}
                  onChange={handleDateTimeChange('startTime')}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '150px' }}>Thời gian đến:</Typography>
                <DateTimePicker
                  value={searchParams.endTime}
                  onChange={handleDateTimeChange('endTime')}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '150px' }}>Trạng thái:</Typography>
              <TextField
                name="status"
                select
                size="small"
                fullWidth
                value={searchParams.status}
                onChange={handleSearchChange}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Pending">Chờ duyệt</MenuItem>
                <MenuItem value="Approved">Đã duyệt</MenuItem>
                <MenuItem value="Rejected">Từ chối</MenuItem>
              </TextField>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '150px' }}>Địa điểm:</Typography>
              <TextField
                name="location"
                size="small"
                fullWidth
                value={searchParams.location}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ width: '150px' }}>Ngày tạo:</Typography>
                <DateTimePicker
                  value={searchParams.createAt}
                  onChange={handleDateTimeChange('createAt')}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                />
              </Box>
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </Box>
          </Grid>
        </Grid>

        {searchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {searchError}
          </Alert>
        )}

        {searchResults.length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table sx={{ minWidth: 650 }}>
              {Object.entries(groupSchedulesByDate(searchResults)).map(([date, schedules]) => (
                <React.Fragment key={date}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell colSpan={5} sx={{ py: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {formatDate(date)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '100px' }}>Thời gian</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Lãnh đạo/Cục tham dự</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Nội dung</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '150px' }}>Địa điểm</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '200px' }}>Đơn vị chuẩn bị/Tham dự</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{formatDateTime(schedule.startTime)}</TableCell>
                        <TableCell>{schedule.leaderCompany}</TableCell>
                        <TableCell>{schedule.title}</TableCell>
                        <TableCell>{schedule.location}</TableCell>
                        <TableCell>{schedule.component}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </React.Fragment>
              ))}
            </Table>
          </TableContainer>
        )}
      </Box>

      <AddScheduleModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default CreateSchedule; 
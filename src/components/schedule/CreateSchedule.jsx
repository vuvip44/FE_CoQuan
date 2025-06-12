import React, { useState, useEffect } from 'react';
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
import UserScheduleTable from './UserScheduleTable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const CreateSchedule = () => {
  const [openModal, setOpenModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showSearchForm, setShowSearchForm] = useState(false);
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
  const [userSchedules, setUserSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editForm, setEditForm] = useState({
    leaderCompany: '',
    title: '',
    startTime: null,
    endTime: null,
    location: '',
    note: ''
  });

  useEffect(() => {
    fetchUserSchedules();
  }, []);

  const fetchUserSchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleService.getScheduleByCurrentUser();
      if (response && response.data) {
        setUserSchedules(response.data);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Không thể lấy danh sách lịch'
      });
    } finally {
      setLoading(false);
    }
  };

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
    fetchUserSchedules(); // Refresh danh sách lịch sau khi tạo mới
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

  const handleDelete = async (id) => {
    try {
      await scheduleService.deleteSchedule(id);
      setNotification({
        type: 'success',
        message: 'Xóa lịch thành công!'
      });
      fetchUserSchedules();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error.message || 'Không thể xóa lịch'
      });
    }
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setEditForm({
      leaderCompany: schedule.leaderCompany,
      title: schedule.title,
      startTime: new Date(schedule.startTime),
      endTime: new Date(schedule.endTime),
      location: schedule.location,
      note: schedule.note || ''
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      // Validate required fields
      if (!editForm.leaderCompany || !editForm.title || !editForm.startTime || !editForm.endTime || !editForm.location) {
        setNotification({
          type: 'error',
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
        });
        return;
      }

      // Validate dates
      if (editForm.startTime >= editForm.endTime) {
        setNotification({
          type: 'error',
          message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
        });
        return;
      }

      const updateData = {
        leaderCompany: editForm.leaderCompany,
        title: editForm.title,
        component: selectedSchedule.component,
        startTime: editForm.startTime.toISOString(),
        endTime: editForm.endTime.toISOString(),
        location: editForm.location,
        note: editForm.note || ''
      };

      console.log('Submitting update data:', updateData);

      await scheduleService.updateSchedule(selectedSchedule.id, updateData);
      setNotification({
        type: 'success',
        message: 'Cập nhật lịch thành công!'
      });
      setEditModalOpen(false);
      fetchUserSchedules();
    } catch (error) {
      console.error('Update error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Không thể cập nhật lịch'
      });
    }
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
          color="info"
          onClick={() => setShowSearchForm(!showSearchForm)}
        >
          {showSearchForm ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
        </Button>
      </Box>

      {showSearchForm && (
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
            <UserScheduleTable schedules={searchResults} />
          )}
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
          Danh sách lịch của bạn
        </Typography>
        {loading ? (
          <Typography sx={{ textAlign: 'center' }}>Đang tải...</Typography>
        ) : userSchedules.length > 0 ? (
          <UserScheduleTable
            schedules={userSchedules}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ) : (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Chưa có lịch nào
          </Typography>
        )}
      </Box>

      <AddScheduleModal
        open={openModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cập nhật lịch</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Lãnh đạo cơ quan"
                fullWidth
                value={editForm.leaderCompany}
                onChange={(e) => setEditForm(prev => ({ ...prev, leaderCompany: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nội dung"
                fullWidth
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateTimePicker
                  label="Thời gian bắt đầu"
                  value={editForm.startTime}
                  onChange={(newValue) => setEditForm(prev => ({ ...prev, startTime: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
                <DateTimePicker
                  label="Thời gian kết thúc"
                  value={editForm.endTime}
                  onChange={(newValue) => setEditForm(prev => ({ ...prev, endTime: newValue }))}
                  slotProps={{ textField: { fullWidth: true } }}
                  ampm={false}
                  format="dd/MM/yyyy HH:mm"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Địa điểm"
                fullWidth
                value={editForm.location}
                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ghi chú"
                fullWidth
                multiline
                rows={4}
                value={editForm.note}
                onChange={(e) => setEditForm(prev => ({ ...prev, note: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateSchedule; 
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { vi } from 'date-fns/locale';
import scheduleService from '../../services/scheduleService';

const AddScheduleModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    leaderCompany: '',
    title: '',
    component: '',
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: '',
    note: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (field) => (newDateTime) => {
    setFormData(prev => ({
      ...prev,
      [field]: newDateTime
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate dates and times
      if (!formData.startTime || !formData.endTime) {
        throw new Error('Vui lòng chọn thời gian bắt đầu và kết thúc');
      }

      if (formData.startTime >= formData.endTime) {
        throw new Error('Thời gian kết thúc phải sau thời gian bắt đầu');
      }

      const scheduleData = {
        leaderCompany: formData.leaderCompany,
        title: formData.title,
        component: formData.component,
        startTime: formData.startTime.toISOString(),
        endTime: formData.endTime.toISOString(),
        location: formData.location,
        note: formData.note
      };

      const response = await scheduleService.createSchedule(scheduleData);
      onSuccess(response.data);
      onClose();
      // Reset form
      setFormData({
        leaderCompany: '',
        title: '',
        component: '',
        startTime: new Date(),
        endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        location: '',
        note: ''
      });
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi tạo lịch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      PaperProps={{
        sx: {
          width: '600px',
          borderRadius: '8px',
        }
      }}
    >
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
            Tạo lịch công tác
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ width: '120px' }}>Lãnh đạo cơ quan:</Typography>
            <TextField
              name="leaderCompany"
              size="small"
              fullWidth
              value={formData.leaderCompany}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ width: '120px', mt: 1 }}>Nội dung:</Typography>
            <TextField
              name="title"
              multiline
              rows={2}
              size="small"
              fullWidth
              value={formData.title}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ width: '120px', mt: 1 }}>Thành phần:</Typography>
            <TextField
              name="component"
              multiline
              rows={2}
              size="small"
              fullWidth
              value={formData.component}
              onChange={handleChange}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '120px' }}>Thời gian từ:</Typography>
              <DateTimePicker
                value={formData.startTime}
                onChange={handleDateTimeChange('startTime')}
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                slotProps={{
                  actionBar: { actions: ['cancel', 'accept'] },
                  popper: { placement: 'bottom', disablePortal: false }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ width: '120px' }}>Thời gian đến:</Typography>
              <DateTimePicker
                value={formData.endTime}
                onChange={handleDateTimeChange('endTime')}
                renderInput={(params) => (
                  <TextField {...params} size="small" fullWidth />
                )}
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                slotProps={{
                  actionBar: { actions: ['cancel', 'accept'] },
                  popper: { placement: 'bottom', disablePortal: false }
                }}
              />
            </Box>
          </LocalizationProvider>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ width: '120px' }}>Tại địa điểm:</Typography>
            <TextField
              name="location"
              size="small"
              fullWidth
              value={formData.location}
              onChange={handleChange}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography sx={{ width: '120px', mt: 1 }}>Ghi chú:</Typography>
            <TextField
              name="note"
              multiline
              rows={2}
              size="small"
              fullWidth
              value={formData.note}
              onChange={handleChange}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          Lưu lại
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={onClose}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddScheduleModal; 
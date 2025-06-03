import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import scheduleService from '../../services/scheduleService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSnackbar } from 'notistack';

const ViewSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  function getCurrentWeek() {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil((((now.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return week;
  }

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedulesByWeek(currentWeek);
      setSchedules(data);
    } catch (error) {
      enqueueSnackbar(error.message || 'Có lỗi xảy ra khi tải lịch', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentWeek]);

  const formatTime = (dateString) => {
    return format(new Date(dateString), 'HH:mm');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayName = format(date, 'EEEE', { locale: vi });
    const formattedDate = format(date, 'dd/MM/yyyy');
    return `${dayName}, ${formattedDate}`;
  };

  const groupSchedulesByDate = (schedules) => {
    const grouped = {};
    schedules.forEach(schedule => {
      const date = schedule.startTime.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => prev + 1);
  };

  const groupedSchedules = groupSchedulesByDate(schedules);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" align="center" sx={{ mb: 1 }}>
          LỊCH CÔNG TÁC LÃNH ĐẠO CỤC
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <IconButton onClick={handlePreviousWeek} size="small">
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" component="div">
            Tuần thứ {currentWeek}
          </Typography>
          <IconButton onClick={handleNextWeek} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '10%', borderRight: '1px solid rgba(224, 224, 224, 1)', bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                  Thời gian
                </TableCell>
                <TableCell sx={{ width: '20%', borderRight: '1px solid rgba(224, 224, 224, 1)', bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                  Lãnh đạo/Đơn vị dự
                </TableCell>
                <TableCell sx={{ width: '35%', borderRight: '1px solid rgba(224, 224, 224, 1)', bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                  Nội dung
                </TableCell>
                <TableCell sx={{ width: '15%', borderRight: '1px solid rgba(224, 224, 224, 1)', bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                  Địa điểm
                </TableCell>
                <TableCell sx={{ width: '20%', bgcolor: '#f5f5f5', fontWeight: 'bold' }}>
                  Đơn vị chuẩn bị/phối hợp
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedSchedules).map(([date, schedules]) => (
                <React.Fragment key={date}>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}
                    >
                      {formatDate(date)}
                    </TableCell>
                  </TableRow>
                  {schedules.map((schedule, index) => (
                    <TableRow key={schedule.id || index}>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {formatTime(schedule.startTime)}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {schedule.leaderCompany}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {schedule.title}
                      </TableCell>
                      <TableCell sx={{ borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                        {schedule.location}
                      </TableCell>
                      <TableCell>
                        {schedule.preparingUnit}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ViewSchedule; 
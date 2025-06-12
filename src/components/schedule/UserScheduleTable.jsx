import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const UserScheduleTable = ({ schedules, onDelete, onEdit }) => {
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
      const date = format(new Date(schedule.startTime), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(schedule);
    });
    return grouped;
  };

  const groupedSchedules = groupSchedulesByDate(schedules);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thời gian</TableCell>
            <TableCell>Lãnh đạo cơ quan</TableCell>
            <TableCell>Nội dung</TableCell>
            <TableCell>Địa điểm</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell align="center">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
            <React.Fragment key={date}>
              <TableRow>
                <TableCell colSpan={6} sx={{ backgroundColor: '#f5f5f5' }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatDate(date)}
                  </Typography>
                </TableCell>
              </TableRow>
              {daySchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </TableCell>
                  <TableCell>{schedule.leaderCompany}</TableCell>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell>{schedule.location}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: 
                          schedule.status === 'Approved' ? '#e8f5e9' :
                          schedule.status === 'Rejected' ? '#ffebee' :
                          '#fff3e0',
                        color:
                          schedule.status === 'Approved' ? '#2e7d32' :
                          schedule.status === 'Rejected' ? '#c62828' :
                          '#ef6c00',
                      }}
                    >
                      {schedule.status === 'Approved' ? 'Đã duyệt' :
                       schedule.status === 'Rejected' ? 'Từ chối' :
                       'Chờ duyệt'}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(schedule)}
                        disabled={schedule.status !== 'Pending'}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(schedule.id)}
                        disabled={schedule.status !== 'Pending'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserScheduleTable; 
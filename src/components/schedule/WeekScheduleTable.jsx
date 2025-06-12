import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'HH:mm');
};
const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), "EEEE, dd/MM/yyyy", { locale: vi });
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

const cellBorder = { border: '1px solid #bdbdbd' };

const WeekScheduleTable = ({ schedules = [] }) => {
  const grouped = groupSchedulesByDate(schedules);
  
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650, border: '1px solid #bdbdbd' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#ffffcc' }}>
            <TableCell sx={{ fontWeight: 'bold', width: '100px', ...cellBorder }}>Thời gian</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '200px', ...cellBorder }}>Lãnh đạo/Cục tham dự</TableCell>
            <TableCell sx={{ fontWeight: 'bold', ...cellBorder }}>Nội dung</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '150px', ...cellBorder }}>Địa điểm</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '200px', ...cellBorder }}>Đơn vị chuẩn bị/Tham dự</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(grouped).length > 0 ? (
            Object.entries(grouped).map(([date, schedules]) => (
              <React.Fragment key={date}>
                <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableCell colSpan={5} align="center" sx={{ py: 1, ...cellBorder }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {formatDate(date)}
                    </Typography>
                  </TableCell>
                </TableRow>
                {schedules.map((schedule) => (
                  <TableRow
                    key={schedule.id}
                    sx={schedule.status === 'Pending' ? { backgroundColor: '#ffcccc' } : { backgroundColor: '#fff' }}
                  >
                    <TableCell sx={cellBorder}>{formatDateTime(schedule.startTime)}</TableCell>
                    <TableCell sx={cellBorder}>{schedule.leaderCompany}</TableCell>
                    <TableCell sx={cellBorder}>{schedule.title}</TableCell>
                    <TableCell sx={cellBorder}>{schedule.location}</TableCell>
                    <TableCell sx={cellBorder}>{schedule.component}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 2, ...cellBorder }}>
                <Typography variant="body1" color="text.secondary">
                  Không có lịch nào trong tuần này
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WeekScheduleTable; 
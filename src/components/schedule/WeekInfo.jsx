import React, { useState } from 'react';
import { Box, Typography, Button, Stack, TextField } from '@mui/material';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import vi from 'date-fns/locale/vi';

const getWeekRange = (week, year) => {
  // Lấy ngày đầu tuần (thứ 2) dựa trên số tuần và năm
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (week - 1) * 7;
  const monday = startOfWeek(new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + daysOffset)), { weekStartsOn: 1 });
  const sunday = endOfWeek(monday, { weekStartsOn: 1 });
  return { start: monday, end: sunday };
};

const WeekInfo = ({ week, year, onWeekChange }) => {
  const [inputWeek, setInputWeek] = useState(String(week));
  const { start, end } = getWeekRange(week, year);

  const handleSearch = () => {
    const val = Number(inputWeek);
    if (val >= 1 && val <= 53) {
      onWeekChange(val);
    }
  };

  return (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        LỊCH CÔNG TÁC LÃNH ĐẠO CỤC
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        Tuần thứ
        <TextField
          type="number"
          value={inputWeek}
          onChange={e => {
            setInputWeek(e.target.value);
          }}
          inputProps={{
            min: 1,
            max: 53,
            style: { width: 50, textAlign: 'center', fontWeight: 'bold' },
            inputMode: 'numeric',
            pattern: '[0-9]*'
          }}
          size="small"
          sx={{
            width: 70,
            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
              WebkitAppearance: 'none',
              margin: 0,
            },
            '& input[type=number]': {
              MozAppearance: 'textfield',
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ ml: 1, minWidth: 80 }}
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
        | Từ ngày: <b>{format(start, 'dd/MM/yyyy', { locale: vi })}</b> - Đến ngày: <b>{format(end, 'dd/MM/yyyy', { locale: vi })}</b>
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Button variant="contained" color="success" onClick={() => { setInputWeek(String(week - 1)); onWeekChange(week - 1); }}>
          Tuần trước
        </Button>
        <Button variant="contained" color="success" onClick={() => { setInputWeek(String(week + 1)); onWeekChange(week + 1); }}>
          Tuần tiếp theo
        </Button>
        <Button variant="contained" color="info" onClick={() => window.print()}>
          In lịch
        </Button>
      </Stack>
    </Box>
  );
};

export default WeekInfo; 
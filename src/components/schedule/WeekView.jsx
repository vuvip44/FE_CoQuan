import React, { useState, useEffect } from 'react';
import WeekInfo from './WeekInfo';
import WeekScheduleTable from './WeekScheduleTable';
import scheduleService from '../../services/scheduleService';
import { Alert, CircularProgress, Box } from '@mui/material';

const getCurrentWeek = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today - firstDay) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
};

const WeekView = () => {
  const [week, setWeek] = useState(getCurrentWeek());
  const [year] = useState(new Date().getFullYear());
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSchedules = async (w) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Call API GetSchedulesByWeek with week:', w);
      const res = await scheduleService.getSchedulesByWeek(w);
      const dataArr = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      setSchedules(dataArr);
      console.log('Schedules result:', dataArr);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải lịch tuần');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(week);
    // eslint-disable-next-line
  }, [week]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 1100, minWidth: 700 }}>
        <WeekInfo week={week} year={year} onWeekChange={setWeek} />
        {loading && <CircularProgress sx={{ my: 2 }} />}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        <WeekScheduleTable schedules={schedules} />
      </Box>
    </Box>
  );
};

export default WeekView; 
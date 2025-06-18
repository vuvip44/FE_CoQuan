import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import store from './store/store';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CreateSchedule from './pages/Schedule/CreateSchedule';
import ViewSchedule from './components/schedule/ViewSchedule';
import ApproveSchedule from './components/schedule/ApproveSchedule';
import UserManagement from './components/user/UserManagement';
import AccountManagement from './components/user/AccountManagement';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
          <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="schedule">
                  <Route path="create" element={<CreateSchedule />} />
                  <Route path="view" element={<ViewSchedule />} />
                  <Route path="approve" element={<ApproveSchedule />} />
                </Route>
                <Route path="users" element={<UserManagement />} />
                <Route path="account" element={<AccountManagement />} />
              </Route>
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
} from '@mui/material';
import { Search, Download } from '@mui/icons-material';
import axios from "axios";

import AuditLogTable from './Admin common/AuditLogTable';

interface AuditLog {
  log_id: string;
  created_at: string;

  admin_name: string;
  admin_role: string;

  action: string;
  module: string;

  target_entity: string;
  target_type: string;

  description: string;

  status: string;

  reason?: string;

  ip_address: string;

  device?: string;

  old_value?: any;

  new_value?: any;
}

const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

useEffect(() => {

  const fetchAuditLogs = async () => {
    try {

      const token = localStorage.getItem("token");

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.get(
        `${API_URL}/api/audit-logs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLogs(response.data.logs || []);

    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      setLogs([]);
    }
  };

  fetchAuditLogs();

}, []);

  const filterLogs = () => {
    return (logs || []).filter(log => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
const matchesSearch =
  log.admin_name?.toLowerCase().includes(query) ||
  log.action?.toLowerCase().includes(query) ||
  log.module?.toLowerCase().includes(query) ||
  log.target_entity?.toLowerCase().includes(query) ||
  log.description?.toLowerCase().includes(query) ||
  log.ip_address?.includes(query);
        if (!matchesSearch) return false;
      }

      // Date filter
if (dateFilter) {
  const logDate = new Date(log.created_at);
  const now = new Date();

  switch (dateFilter) {
    case 'today': {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (logDate < today) return false;
      break;
    }

    case 'week': {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);

      if (logDate < weekAgo) return false;
      break;
    }

    case 'month': {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);

      if (logDate < monthAgo) return false;
      break;
    }
  }
}
      // User filter
    if (userFilter) {
  if (
    userFilter === "admin" &&
    log.admin_role !== "ADMIN"
  )
    return false;

  if (
    userFilter === "superadmin" &&
    log.admin_role !== "SUPER_ADMIN"
  )
    return false;
}

      // Module filter
      if (moduleFilter && log.module !== moduleFilter) return false;

      // Status filter
      if (statusFilter && log.status !== statusFilter) return false;

      return true;
    });
  };

  const filteredLogs = filterLogs();

  const handleExport = () => {
    console.log('Exporting logs...');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: '100%', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
          Audit Log
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and monitor all system activities and user actions
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3, boxShadow: 'none', border: '1px solid #E9E9EE', borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              size="small"
              sx={{ height: '48px' }}
            />
          </Grid>
          
          <Grid item xs={6} sm={6} md={2.5}>
            <FormControl fullWidth size="medium" sx={{ minWidth: 130 }} >
              <InputLabel>Date</InputLabel>
              <Select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} label="Date">
                <MenuItem value="">All</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">This Week</MenuItem>
                <MenuItem value="month">This Month</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={2.5}>
            <FormControl fullWidth size="medium" sx={{ minWidth: 130 }}>
              <InputLabel>Users</InputLabel>
              <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} label="Users">
                <MenuItem value="">All Users</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superadmin">Super Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={2.5}>
            <FormControl fullWidth size="medium" sx={{ minWidth: 130 }}>
              <InputLabel>Modules</InputLabel>
              <Select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} label="Modules">
                <MenuItem value="">All Modules</MenuItem>
                <MenuItem value="RA">RA</MenuItem>
                <MenuItem value="Broker">Broker</MenuItem>
                <MenuItem value="TELEGRAM_CLIENT">Telegram</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
                <MenuItem value="Subscription">Subscription</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={2.5}>
            <FormControl fullWidth size="medium" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SUCCESS">Success</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

{/* 
<Grid item xs={6} sm={6} md={2}>
  <Button
    variant="outlined"
    startIcon={<Download />}
    onClick={handleExport}
    fullWidth
    sx={{
      height: '48px',
      fontSize: '14px',
    }}
  >
    Export
  </Button>
</Grid>
*/}
        </Grid>
      </Paper>

      <AuditLogTable logs={filteredLogs} totalEntries={logs.length} showingEntries={filteredLogs.length} />
    </Box>
  );
};

export default AdminAuditLogs;
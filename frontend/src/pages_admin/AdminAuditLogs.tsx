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

import AuditLogTable from './Admin common/AuditLogTable';

interface AuditLog {
  logId: string;
  timestamp: string;
  adminName: string;
  adminRole: 'SUPER_ADMIN' | 'ADMIN';
  action: string;
  module: 'RA' | 'Broker' | 'Billing' | 'Subscription';
  targetEntity: string;
  targetType: 'RA' | 'BROKER' | 'USER' | 'SUBSCRIPTION';
  description: string;
  status: 'SUCCESS' | 'FAILED';
  reason?: string;
  ipAddress: string;
  device: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const sampleLogs: AuditLog[] = [
      {
        logId: '550e8400-e29b-41d4-a716-446655440000',
        timestamp: '2024-01-15T10:30:00Z',
        adminName: 'John Doe',
        adminRole: 'ADMIN',
        action: 'APPROVE',
        module: 'RA',
        targetEntity: 'Jane Smith',
        targetType: 'RA',
        description: 'Approved RA registration after verification of credentials',
        status: 'SUCCESS',
        oldValue: '{"status": "PENDING", "verified": false}',
        newValue: '{"status": "ACTIVE", "verified": true, "approvedBy": "John Doe"}',
        ipAddress: '192.168.1.1',
        device: 'Chrome/Windows',
        createdAt: '2024-01-15T10:30:00Z',
      },
      {
        logId: '550e8400-e29b-41d4-a716-446655440001',
        timestamp: '2024-01-15T11:45:00Z',
        adminName: 'Sarah Johnson',
        adminRole: 'SUPER_ADMIN',
        action: 'REJECT',
        module: 'Broker',
        targetEntity: 'Mike Wilson',
        targetType: 'BROKER',
        description: 'Rejected broker application due to missing documentation',
        status: 'FAILED',
        reason: 'Incomplete documentation - missing KYC documents and proof of address',
        oldValue: '{"status": "PENDING", "documents": ["license"]}',
        newValue: '{"status": "REJECTED", "documents": ["license"], "rejectionReason": "Missing KYC"}',
        ipAddress: '192.168.1.2',
        device: 'Safari/Mac',
        createdAt: '2024-01-15T11:45:00Z',
      },
      {
        logId: '550e8400-e29b-41d4-a716-446655440002',
        timestamp: '2024-01-15T14:20:00Z',
        adminName: 'Robert Brown',
        adminRole: 'ADMIN',
        action: 'VERIFY',
        module: 'Billing',
        targetEntity: 'Alice Davis',
        targetType: 'USER',
        description: 'Verified and updated billing information for user account',
        status: 'SUCCESS',
        oldValue: '{"billingStatus": "UNVERIFIED", "paymentMethod": null}',
        newValue: '{"billingStatus": "VERIFIED", "paymentMethod": "credit_card", "lastVerified": "2024-01-15T14:20:00Z"}',
        ipAddress: '192.168.1.3',
        device: 'Firefox/Windows',
        createdAt: '2024-01-15T14:20:00Z',
      },
      {
        logId: '550e8400-e29b-41d4-a716-446655440003',
        timestamp: '2024-01-15T16:00:00Z',
        adminName: 'Emily Chen',
        adminRole: 'SUPER_ADMIN',
        action: 'SUSPEND',
        module: 'Subscription',
        targetEntity: 'David Martinez',
        targetType: 'SUBSCRIPTION',
        description: 'Suspended user subscription due to policy violation',
        status: 'SUCCESS',
        reason: 'Terms of service violation - multiple user complaints received',
        oldValue: '{"status": "ACTIVE", "suspensionCount": 0}',
        newValue: '{"status": "SUSPENDED", "suspensionCount": 1, "suspensionReason": "ToS violation"}',
        ipAddress: '192.168.1.4',
        device: 'Chrome/Linux',
        createdAt: '2024-01-15T16:00:00Z',
      },
    ];
    setLogs(sampleLogs);
  }, []);

  const filterLogs = () => {
    return logs.filter(log => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          log.adminName.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.module.toLowerCase().includes(query) ||
          log.targetEntity.toLowerCase().includes(query) ||
          log.description.toLowerCase().includes(query) ||
          log.ipAddress.includes(query);
        if (!matchesSearch) return false;
      }

      // Date filter
      if (dateFilter) {
        const logDate = new Date(log.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today': {
            const todayStart = new Date(today);
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            if (logDate < todayStart || logDate > todayEnd) return false;
            break;
          }
          case 'week': {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (logDate < weekAgo) return false;
            break;
          }
          case 'month': {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (logDate < monthAgo) return false;
            break;
          }
        }
      }

      // User filter
      if (userFilter) {
        if (userFilter === 'admin' && log.adminRole !== 'ADMIN') return false;
        if (userFilter === 'superadmin' && log.adminRole !== 'SUPER_ADMIN') return false;
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
        </Grid>
      </Paper>

      <AuditLogTable logs={filteredLogs} totalEntries={logs.length} showingEntries={filteredLogs.length} />
    </Box>
  );
};

export default AdminAuditLogs;
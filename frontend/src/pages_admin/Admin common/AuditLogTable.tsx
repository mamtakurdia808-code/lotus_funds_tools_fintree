import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility, Info } from '@mui/icons-material';

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

interface AuditLogTableProps {
  logs: AuditLog[];
  totalEntries: number;
  showingEntries: number;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs, totalEntries, showingEntries }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return { backgroundColor: '#10B981', color: 'white' };
      case 'FAILED':
        return { backgroundColor: '#EF4444', color: 'white' };
      default:
        return { backgroundColor: '#6B7280', color: 'white' };
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'APPROVE':
        return { backgroundColor: '#10B981', color: 'white' };
      case 'REJECT':
        return { backgroundColor: '#EF4444', color: 'white' };
      case 'VERIFY':
        return { backgroundColor: '#3B82F6', color: 'white' };
      case 'SUSPEND':
        return { backgroundColor: '#F59E0B', color: 'white' };
      default:
        return { backgroundColor: '#6B7280', color: 'white' };
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'RA':
        return { backgroundColor: '#8B5CF6', color: 'white' };
      case 'Broker':
        return { backgroundColor: '#06B6D4', color: 'white' };
      case 'Billing':
        return { backgroundColor: '#F59E0B', color: 'white' };
      case 'Subscription':
        return { backgroundColor: '#10B981', color: 'white' };
      default:
        return { backgroundColor: '#6B7280', color: 'white' };
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {showingEntries} of {totalEntries} entries
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          overflowX: 'auto', 
          boxShadow: 'none', 
          border: '1px solid #E9E9EE', 
          borderRadius: 2,
          '&::-webkit-scrollbar': {
            height: '8px',
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
        }}
      >
        <Table sx={{ minWidth: 1800 }} aria-label="audit log table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Log ID</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Admin Name</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Admin Role</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Module</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Target Entity</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Target Type</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Old Value</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>New Value</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Device</TableCell>
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap', py: 1.5 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.logId} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {log.logId.slice(0, 8)}...
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2">
                    {new Date(log.timestamp).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {log.adminName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Chip
                    label={log.adminRole}
                    size="small"
                    sx={{
                      backgroundColor: log.adminRole === 'SUPER_ADMIN' ? '#8B5CF6' : '#06B6D4',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Chip
                    label={log.action}
                    size="small"
                    sx={getActionColor(log.action)}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Chip
                    label={log.module}
                    size="small"
                    sx={getModuleColor(log.module)}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2">
                    {log.targetEntity}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Chip
                    label={log.targetType}
                    size="small"
                    sx={{
                      backgroundColor: '#F3F4F6',
                      color: '#374151',
                      fontSize: '11px',
                      fontWeight: 500,
                    }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 200, py: 1 }}>
                  <Typography variant="body2" sx={{ 
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {log.description}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 150, py: 1 }}>
                  <Typography variant="body2" sx={{ 
                    fontSize: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: log.reason ? 'text.primary' : 'text.secondary'
                  }}>
                    {log.reason || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 300, py: 1 }}>
                  {log.oldValue ? (
                    <Box
                      sx={{
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #E5E7EB',
                        borderRadius: 1,
                        p: 1,
                        maxHeight: 100,
                        overflow: 'auto'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        fontFamily: 'monospace', 
                        fontSize: '11px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}>
                        {typeof log.oldValue === 'string' 
                          ? log.oldValue 
                          : JSON.stringify(log.oldValue, null, 2)
                        }
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ maxWidth: 300, py: 1 }}>
                  {log.newValue ? (
                    <Box
                      sx={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #D1FAE5',
                        borderRadius: 1,
                        p: 1,
                        maxHeight: 100,
                        overflow: 'auto'
                      }}
                    >
                      <Typography variant="body2" sx={{ 
                        fontFamily: 'monospace', 
                        fontSize: '11px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all'
                      }}>
                        {typeof log.newValue === 'string' 
                          ? log.newValue 
                          : JSON.stringify(log.newValue, null, 2)
                        }
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '12px' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Chip
                    label={log.status}
                    size="small"
                    sx={getStatusColor(log.status)}
                  />
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {log.ipAddress}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Typography variant="body2" sx={{ fontSize: '12px' }}>
                    {log.device}
                  </Typography>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ padding: 0.5 }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {log.reason && (
                      <Tooltip title={log.reason}>
                        <IconButton size="small" sx={{ padding: 0.5 }}>
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditLogTable;

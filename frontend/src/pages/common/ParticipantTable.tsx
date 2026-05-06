import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export type ParticipantRow = {
  id: string;
  name: string;
  status: string;
  ageTime: string;
  onView?: () => void;
  onViewParticipant?: () => void;
};

interface ParticipantTableProps {
  rows: ParticipantRow[];
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  rows,
  searchQuery = "",
  onSearchChange,
  page = 1,
  onPageChange,
  itemsPerPage = ITEMS_PER_PAGE,
  loading = false,
}) => {
  const statusColor = (status: string): "success" | "error" | "warning" | "default" => {
    const s = status.toLowerCase();
    if (s === "approved") return "success";
    if (s === "rejected") return "error";
    if (s === "pending") return "warning";
    return "default";
  };

  const filteredRows = rows.filter((row) => {
    const query = searchQuery.toLowerCase();
    return row.name.toLowerCase().includes(query);
  });

  const pageCount = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* SEARCH */}
      <TextField
        placeholder="Search by name"
        fullWidth
        size="small"
        value={searchQuery}
        onChange={(e) => onSearchChange?.(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {/* TABLE */}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f6f6f6" }}>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Age / Time</TableCell>
              <TableCell align="right">Action</TableCell>
              <TableCell>Telegram</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No matching results
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status}
                      color={statusColor(row.status) as "success" | "error" | "warning" | "default"}
                    />
                  </TableCell>

                  <TableCell>{row.ageTime}</TableCell>

                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={row.onView}
                      >
                        View
                      </Button>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.75,
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={row.onViewParticipant}
                      >
                        View Participant
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      {pageCount > 1 && onPageChange && (
        <Pagination
          sx={{ alignSelf: "center", mt: 2 }}
          count={pageCount}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      )}
    </Box>
  );
};

export default ParticipantTable;

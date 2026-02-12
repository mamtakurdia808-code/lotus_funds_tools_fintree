import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Stack,
  Menu,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface HistoryRecord {
  dateTime: string;
  action: string;
  exchange: string;
  type: string;
  category: string;
  instrument: string;
  symbol: string;
  expiry: string | null;
  entry: number;
  exit: number;
  status: string;
  profitLoss: number;
}

const historySelectStyle = { fontSize: "0.75rem", fontWeight: 500, minWidth: 140, px: 2, ".MuiSelect-select": { py: 1.5, pr: "32px !important" }, "& .MuiSvgIcon-root": { right: 8 } };
const historyHeadStyle = { fontSize: "0.75rem", fontWeight: 700, color: "#666", backgroundColor: "#fff", borderBottom: "1px solid #F0F0F0", py: 2 };
const historyBodyStyle = { fontSize: "0.75rem", py: 1.5, borderBottom: "1px solid #FAFAFA" };
const historyPageButtonStyle = { border: "1px solid #E9E9EE", borderRadius: "4px", p: 0.5, "&:disabled": { opacity: 0.5 } };

const Performance: React.FC = () => {
  const metrics = {
    total: 12,
    accuracy: 91,
    strike: 27,
    rr: 138.7,
    active: 1,
    exited: 11,
    profit: 10,
    adverse: 1,
    sl: 0,
    early: 38,
    last: ["l", "l", "g", "r", "g", "g", "g", "g", "g", "g"],
  };

  const [data, setData] = useState<HistoryRecord[]>([]);
  const [filteredData, setFilteredData] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState("All");
  const [typesOfCall, settypesOfCall] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetch("/recommendationHistory.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json.recommendationHistory);
        setFilteredData(json.recommendationHistory);
      })
      .catch((err) => console.error("Error fetching recommendation history:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...data];

    if (typesOfCall !== "All") {
      result = result.filter((item) => item.type.toLowerCase() === typesOfCall);
    }
    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }
    if (actionFilter !== "All") {
      result = result.filter((item) => item.action.toUpperCase() === actionFilter);
    }
    if (outcomeFilter !== "All") {
      result = result.filter((item) =>
        outcomeFilter === "Profit" ? item.profitLoss > 0 : item.profitLoss < 0
      );
    }
    if (dateFilter !== "All") {
      const now = new Date();
      result = result.filter((item) => {
        const itemDate = new Date(item.dateTime);
        if (dateFilter === "Today") {
          return itemDate.toDateString() === now.toDateString();
        }
        if (dateFilter === "Last 7 Days") {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return itemDate >= sevenDaysAgo;
        }
        return true;
      });
    }
    setFilteredData(result);
    setPage(1);
  }, [dateFilter, typesOfCall, categoryFilter, actionFilter, outcomeFilter, data]);

  const handleReset = () => {
    setDateFilter("All");
    settypesOfCall("All");
    setCategoryFilter("All");
    setActionFilter("All");
    setOutcomeFilter("All");
  };

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return (
      <Box>
        <Typography fontSize="0.75rem" color="text.secondary">
          {d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
        </Typography>
        <Typography fontSize="0.75rem" color="text.secondary">
          {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}
        </Typography>
      </Box>
    );
  };

  const BigCard = ({ title, value, green = false }: any) => (
    <Paper sx={cardStyle}>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize="0.875rem">{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: "1.125rem", color: "#999" }} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography
          fontSize="3rem"
          fontWeight={700}
          color={green ? "#16a34a" : "#000"}
        >
          {value}
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            borderRadius: "1.125rem",
            textTransform: "none",
            fontWeight: 600,
            px: 2.25,
            minWidth: 0,
            boxShadow: "none",
            backgroundColor: "#4F6EF7",
            "&:hover": { backgroundColor: "#3E5BE6", boxShadow: "none" },
          }}
        >
          View
        </Button>
      </Box>
    </Paper>
  );

  const SmallCard = ({ title, value, green = false, red = false }: any) => (
    <Paper sx={cardStyle}>
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize="0.8125rem">{title}</Typography>
        <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "#999" }} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
        <Typography
          fontSize="1.625rem"
          fontWeight={700}
          color={green ? "#16a34a" : red ? "#dc2626" : "#000"}
        >
          {value}
        </Typography>
        <IconButton
          size="small"
          sx={{
            width: "1.875rem",
            height: "1.875rem",
            borderRadius: "999px",
            backgroundColor: "#4F6EF7",
            color: "#fff",
            "&:hover": { backgroundColor: "#3E5BE6" },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "0.8125rem" }} />
        </IconButton>
      </Box>
    </Paper>
  );

  const Last10 = () => (
    <Paper sx={cardStyle}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontSize="0.8125rem">Last 10 Exited Calls</Typography>
        <InfoOutlinedIcon sx={{ fontSize: "1rem", color: "#999" }} />
      </Box>
      <Box display="flex" gap={0.9} mt={2}>
        {metrics.last.map((s, i) => {
          let bg = "#22c55e";
          if (s === "r") bg = "#ef4444";
          if (s === "l") bg = "#86efac";

          return (
            <Box
              key={i}
              sx={{
                width: "0.875rem",
                height: "1.125rem",
                borderRadius: "0.04375rem",
                background: bg,
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 3, backgroundColor: "#fff" }}>
      <Typography fontSize="1.625rem" fontWeight={700} mb={3}>
        Performance
      </Typography>

      <Paper
        sx={{
          p: 2.5,
          borderRadius: "0.1875rem",
          border: "1px solid #eee",
          backgroundColor: "#fff",
          boxShadow: "none",
        }}
      >
        <Grid container spacing={2}>
          {/* ===== COLUMN 1 ===== */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <BigCard title="Total Recommendations" value={metrics.total} />
              </Grid>
              <Grid size={6}>
                <SmallCard title="Active" value={metrics.active} green />
              </Grid>
              <Grid size={6}>
                <SmallCard title="Exited" value={metrics.exited} />
              </Grid>
            </Grid>
          </Grid>

          {/* ===== COLUMN 2 ===== */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <BigCard title="Accuracy" value={`${metrics.accuracy}%`} green />
              </Grid>
              <Grid size={6}>
                <SmallCard title="Profitable" value={metrics.profit} green />
              </Grid>
              <Grid size={6}>
                <SmallCard title="Adverse" value={metrics.adverse} red />
              </Grid>
            </Grid>
          </Grid>

          {/* ===== COLUMN 3 ===== */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <BigCard title="Target Strike Rate" value={`${metrics.strike}%`} />
              </Grid>
              <Grid size={6}>
                <SmallCard title="SL Hit Rate" value={`${metrics.sl}%`} />
              </Grid>
              <Grid size={6}>
                <SmallCard title="Early Exit" value={`${metrics.early}%`} />
              </Grid>
            </Grid>
          </Grid>

          {/* ===== COLUMN 4 ===== */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <BigCard title="Risk : Reward Ratio" value={metrics.rr} />
              </Grid>
              <Grid size={12}>
                <Last10 />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* RECOMMENDATION HISTORY TABLE */}
      <Box sx={{ mt: 4 }}>
        <Paper
          sx={{
            p: 0,
            borderRadius: "0.25rem",
            border: "1px solid #E9E9EE",
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2, borderBottom: "1px solid #F0F0F0" }}
          >
            <Typography fontSize="1.25rem" fontWeight={700}>
              Recommendation History
            </Typography>

            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #E9E9EE",
                borderRadius: "0.5rem",
                overflow: "hidden",
              }}
            >
              <Box sx={{ p: 1, borderRight: "1px solid #E9E9EE", display: "flex", alignItems: "center", backgroundColor: "#F8F9FA" }}>
                <FilterAltOutlinedIcon sx={{ fontSize: "1.1rem", color: "#666" }} />
              </Box>

              <Box sx={{ px: 1.5, py: 0.5, borderRight: "1px solid #E9E9EE" }}>
                <Typography fontSize="0.75rem" color="#666" fontWeight={500}>Filter By</Typography>
              </Box>

              <Box sx={{ borderRight: "1px solid #E9E9EE" }}>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={historySelectStyle}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="All">Date</MenuItem>
                  <MenuItem value="Today">Today</MenuItem>
                  <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                </Select>
              </Box>

              <Box sx={{ borderRight: "1px solid #E9E9EE" }}>
                <Select
                  value={typesOfCall}
                  onChange={(e) => settypesOfCall(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={historySelectStyle}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="All">Type of Calls </MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="futures">Futures</MenuItem>
                  <MenuItem value="options call">Option Call</MenuItem>
                  <MenuItem value="options put">Option Put</MenuItem>
                </Select>
              </Box>
              <Box sx={{ borderRight: "1px solid #E9E9EE" }}>
                <Select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={historySelectStyle}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="All">Action </MenuItem>
                  <MenuItem value="BUY">Buy</MenuItem>
                  <MenuItem value="SELL">Sell</MenuItem>
                </Select>                
              </Box>

              <Box sx={{ borderRight: "1px solid #E9E9EE" }}>
                <Select
                  value={outcomeFilter}
                  onChange={(e) => setOutcomeFilter(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={historySelectStyle}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="All">Outcome</MenuItem>
                  <MenuItem value="Profit">Profit</MenuItem>
                  <MenuItem value="Loss">Loss</MenuItem>
                </Select>
              </Box>

              <Box sx={{ borderRight: "1px solid #E9E9EE" }}>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  displayEmpty
                  size="small"
                  sx={historySelectStyle}
                  variant="standard"
                  disableUnderline
                >
                  <MenuItem value="All">Category</MenuItem>
                  <MenuItem value="Intraday">Intraday</MenuItem>
                  <MenuItem value="Short Term">Short Term</MenuItem>
                  <MenuItem value="Long Term">Long Term</MenuItem>
                </Select>
              </Box>

              <Button
                startIcon={<RestartAltIcon sx={{ fontSize: "1rem" }} />}
                onClick={handleReset}
                sx={{
                  textTransform: "none",
                  color: "#ff4d4d",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  px: 2,
                  "&:hover": { backgroundColor: "rgba(255, 77, 77, 0.05)" },
                }}
              >
                Reset Filter
              </Button>
            </Paper>
          </Box>

          <TableContainer>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={historyHeadStyle}>Date & Time</TableCell>
                  <TableCell sx={historyHeadStyle}>Action</TableCell>
                  <TableCell sx={historyHeadStyle}>Exchange</TableCell>
                  <TableCell sx={historyHeadStyle}>Type</TableCell>
                  <TableCell sx={historyHeadStyle}>Category</TableCell>
                  <TableCell sx={historyHeadStyle}>Instrument</TableCell>
                  <TableCell sx={historyHeadStyle}>Symbol</TableCell>
                  <TableCell sx={historyHeadStyle}>Expiry</TableCell>
                  <TableCell sx={historyHeadStyle}>Entry</TableCell>
                  <TableCell sx={historyHeadStyle}>Exit</TableCell>
                  <TableCell sx={historyHeadStyle}>STATUS</TableCell>
                  <TableCell align="right" sx={historyHeadStyle}>Profit / Loss</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={12} align="center" sx={{ py: 4 }}>Loading...</TableCell></TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow><TableCell colSpan={12} align="center" sx={{ py: 4 }}>No records found</TableCell></TableRow>
                ) : (
                  paginatedData.map((row, idx) => (
                    <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={historyBodyStyle}>{formatDateTime(row.dateTime)}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.action}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.exchange}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.type}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.category}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.instrument}</TableCell>
                      <TableCell sx={historyBodyStyle}><Typography fontWeight={600} fontSize="0.75rem">{row.symbol}</Typography></TableCell>
                      <TableCell sx={historyBodyStyle}>{row.expiry || "-"}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.entry}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.exit}</TableCell>
                      <TableCell sx={historyBodyStyle}>{row.status}</TableCell>
                      <TableCell align="right" sx={historyBodyStyle}>
                        <Box sx={{
                          display: "inline-block", backgroundColor: row.profitLoss >= 0 ? "#DCFCE7" : "#FEE2E2",
                          color: row.profitLoss >= 0 ? "#166534" : "#991B1B", px: 1.5, py: 0.5, borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700,
                        }}>
                          {row.profitLoss >= 0 ? `+ ${row.profitLoss.toLocaleString()}` : `- ${Math.abs(row.profitLoss).toLocaleString()}`}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ p: 2, borderTop: "1px solid #F0F0F0", gap: 2 }}>
            <Typography fontSize="0.75rem" color="text.secondary">
              Showing {filteredData.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}-{Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length.toString().padStart(2, "0")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} sx={historyPageButtonStyle}><ChevronLeftIcon fontSize="small" /></IconButton>
              <IconButton size="small" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} sx={historyPageButtonStyle}><ChevronRightIcon fontSize="small" /></IconButton>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

const cardStyle = {
  p: 2,
  borderRadius: "0.145rem",
  border: "1px solid #E9E9EE",
  backgroundColor: "#fff",
  boxShadow: "none",
  height: "100%",
};

export default Performance;

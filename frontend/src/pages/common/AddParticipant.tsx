import React, { useState, useEffect } from "react";
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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TelegramSearch from "../../pages_admin/Admin common/TelegramSearch";

interface Participant {
  id: string;
  phone_number?: string;
  telegram_client_name?: string;
  telegram_user_id?: string;
}

const AddParticipant: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUsername = localStorage.getItem("username");

        if (!token || !storedUsername) {
          console.error("No token or username found");
          setLoading(false);
          return;
        }

        setUsername(storedUsername);

        // For now, we'll use sample data since we need to get the user's ID first
        // In a real implementation, you would fetch this from your API
        const sampleParticipants: Participant[] = [
          {
            id: "1",
            phone_number: "+919876543210",
            telegram_client_name: "john_doe",
            telegram_user_id: "123456789",
          },
          {
            id: "2", 
            phone_number: "+919876543211",
            telegram_client_name: "jane_smith",
            telegram_user_id: "987654321",
          },
        ];

        setParticipants(sampleParticipants);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch participants:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const filteredParticipants = participants.filter((participant) => {
    const query = searchQuery.toLowerCase();
    return (
      participant.phone_number?.toLowerCase().includes(query) ||
      participant.telegram_client_name?.toLowerCase().includes(query) ||
      participant.telegram_user_id?.toLowerCase().includes(query)
    );
  });


  return (
    <Box
      sx={{
        width: "95%",
        mx: "auto",
        mt: 4,
        ml: 2,
      }}
    >
      <Typography fontWeight={600}>View Participant</Typography>

      {/* Participants Section */}
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          Participants
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 1, mt: 1 }}>
          Search User
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search by Phone or Username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Phone</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Userid</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredParticipants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No participants found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>{participant.phone_number || "N/A"}</TableCell>
                      <TableCell>{participant.telegram_client_name || "N/A"}</TableCell>
                      <TableCell>{participant.telegram_user_id || "N/A"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Add New Participant */}
      <Box sx={{ mt: 3 }}>
        <Typography fontWeight={600} sx={{ mb: 1 }}>
          Add New Participant
        </Typography>

        {username && (
          <TelegramSearch
            raId={username}
            onSaved={() => {
              // Refresh participants list after adding
              // In a real implementation, you would fetch the updated list
              console.log("Participant added, refreshing list...");
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AddParticipant;

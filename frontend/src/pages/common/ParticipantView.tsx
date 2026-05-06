import React, { useState, useEffect } from "react";
import ParticipantTable, { ParticipantRow } from "./ParticipantTable";

interface UserData {
  id: string;
  user_id?: string;
  first_name?: string;
  surname?: string;
  name?: string;
  email?: string;
  raStatus?: string;
  user_status?: string;
  "age/time"?: string;
}

const ParticipantView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ParticipantRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username"); // User's login username

        if (!token || !username) {
          console.error("No token or username found");
          console.log("Token:", token);
          console.log("Username:", username);
          setLoading(false);
          return;
        }

        // Fetch all registrations data from admin API
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/registration/all-registrations-active-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errBody = await response.json();
          console.error("Error response:", errBody);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (!Array.isArray(data)) {
          console.error("Expected array but got:", data);
          setLoading(false);
          return;
        }

        console.log("Filtering for username:", username);
        // Filter data based on logged-in user's username or email
        const userData = data.filter((item: UserData) => {
          const itemEmail = item.email?.toLowerCase();
          const loggedInUsername = username.toLowerCase();
          console.log("Comparing:", itemEmail, "with", loggedInUsername);
          return itemEmail === loggedInUsername;
        });

        console.log("Filtered userData:", userData);

        // Format data for ParticipantTable
        const formattedRows: ParticipantRow[] = userData.map((item: UserData) => ({
          id: item.id || item.user_id || "",
          name: `${item.first_name || ""} ${item.surname || ""}`.trim() || item.name || "N/A",
          status: item.raStatus || item.user_status || "N/A",
          ageTime: item["age/time"] || "Just now",
          onView: () => {
            console.log("View user:", item.name);
            // Add your view logic here - navigate to user details or open modal
          },
          onViewParticipant: () => {
            console.log("View participant for:", item.name);
            // Add your view participant logic here - fetch participants for this user
          },
        }));

        setRows(formattedRows);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load user data:", error);
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Participant Management</h2>
      <ParticipantTable
        rows={rows}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        page={page}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
};

export default ParticipantView;

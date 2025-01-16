import React, { useState } from "react";
import CreateForm from "./CreateForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./Dashboard.css";

const Dashboard = () => {
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [source, setSource] = useState("");
  const [items, setItems] = useState([]);

  const availableSources = ["Google Ads", "Meta Ads", "Website", "Referral"];

  const allSourceData = {
    "Google Ads": [
      {
        id: 1,
        name: "John Doe",
        number: "12345",
        timestamp: "1627845600",
        attendedBy: "Jane Smith",
        date: "2021-08-01",
        company: "ABC Corp",
        query: "General Query",
        status: "Pending",
      },
    ],
    "Meta Ads": [
      {
        id: 2,
        name: "Alice Johnson",
        number: "67890",
        timestamp: "1627846000",
        attendedBy: "Mark Smith",
        date: "2021-08-02",
        company: "XYZ Ltd",
        query: "Product Query",
        status: "Resolved",
      },
    ],
    Website: [],
    Referral: [],
  };

  const handleSourceChange = (event) => {
    const selectedSource = event.target.value;
    setSource(selectedSource);

    // Load data for the selected source
    setItems(allSourceData[selectedSource] || []);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (array) => {
    const sortedArray = array.sort((a, b) => {
      const isAsc = sortDirection === "asc";

      if (orderBy === "timestamp") {
        return isAsc
          ? parseInt(a.timestamp) - parseInt(b.timestamp)
          : parseInt(b.timestamp) - parseInt(a.timestamp);
      }

      if (orderBy === "date") {
        return isAsc
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }

      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });
    return sortedArray;
  };

  const sortedItems = sortData([...items]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Ads Leads Data </div>

      {/* Source Dropdown */}
      <FormControl
        style={{
          width: "200px",
          margin: "16px 0",
        }}
        variant="outlined"
      >
        <InputLabel
          id="source-select-label"
          sx={{
            fontSize: "14px",
            background: "#E5E4E2",
            padding: "0 4px",
            borderRadius: "1vw",
            transform: "translate(14px, -6px) scale(0.9)",
            color: "black",
          }}
          shrink={true}
        >
          Select Source
        </InputLabel>
        <Select
          labelId="source-select-label"
          value={source}
          onChange={handleSourceChange}
          sx={{
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            padding: "10px 14px",
            "& .MuiSelect-icon": {
              color: "#333",
            },
          }}
        >
          <MenuItem value="">None</MenuItem>
          {availableSources.map((src) => (
            <MenuItem key={src} value={src}>
              {src}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "number"}
                  direction={orderBy === "number" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("number")}
                >
                  Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "timestamp"}
                  direction={orderBy === "timestamp" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("timestamp")}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>
              <TableCell>Attended By</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{item.timestamp}</TableCell>
                  <TableCell>{item.attendedBy}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.query}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available for the selected source.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Dashboard;

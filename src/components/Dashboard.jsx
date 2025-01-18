import React, { useState, useEffect } from "react";
import CreateForm from "./CreateForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableRow,
  TableSortLabel,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Dialog,
  TextField,
} from "@mui/material";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = ({ isLoggedIn }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortDirection, setSortDirection] = useState("");
  const [orderBy, setOrderBy] = useState("date");
  const [source, setSource] = useState("");
  const [items, setItems] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSourcedData, setSelectedSourcedData] = useState([]);
  const navigate = useNavigate();

  const availableSources = ["Google Ads", "Meta Ads", "Website", "Referral"];
  const availableStatuses = ["Pending", "Approved", "In Progress"];
  console.log("Items", items);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, []);
  // get all data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "techkilla_leads"),
      (snapshot) => {
        const alldata = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setItems(alldata);
      }
    );
    return () => unsubscribe();
  }, []);

  console.log("Items", items);

  const handleSourceChange = async (event) => {
    const selectedSource = event.target.value;
    setSource(selectedSource);

    // If source is not selected, reset filters

    setNameFilter("");
    setStatusFilter("");
    setDateFilter("");
  };

  // handle name change
  const handleNameChange = (event) => {
    const selectedName = event.target.value;
    setNameFilter(selectedName);
  };

  // handle status change
  const handleStatusChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
  };

  // Format ISO date to YYYY-MM-DD for comparison
  const formatDateForComparison = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0]; // Get only the YYYY-MM-DD part
  };

  // Filter items based on source, name, status, and date
  useEffect(() => {
    const handleFilterChange = () => {
      let filteredItems = items;

      // If source is selected, filter by source
      if (source) {
        filteredItems = filteredItems.filter((item) => item.source === source);
      }

      // If status is selected, filter by status
      if (statusFilter) {
        filteredItems = filteredItems.filter(
          (item) =>
            item.status &&
            item.status.toLowerCase().trim() ===
              statusFilter.toLowerCase().trim()
        );
      }

      // If name is selected, filter by name
      if (nameFilter) {
        filteredItems = filteredItems.filter((item) =>
          item.name?.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      // If date is selected, filter by date
      if (dateFilter) {
        // console.log(dateFilter, filteredItems);
        filteredItems = filteredItems.filter((item) => {
          const date = new Date(item.timestamp).toISOString().split("T")[0];
          return date === dateFilter;
        });
      }
      if (sortDirection === "asc") {
        filteredItems = filteredItems.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
      } else {
        filteredItems = filteredItems.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
      }

      // Set filtered data
      setSelectedSourcedData(filteredItems);
    };

    // Apply filtering if any filter is set
    if (source || statusFilter || nameFilter || dateFilter || sortDirection) {
      handleFilterChange();
    } else {
      setSelectedSourcedData(); // Show all data if no filters are selected
    }
  }, [source, nameFilter, statusFilter, dateFilter, items, sortDirection]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // open edit form
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  // handle delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the item with ID: ${id}?`
    );

    const confirmAndDelete = async () => {
      try {
        const docRef = doc(db, "techkilla_leads", id);
        await deleteDoc(docRef);
        console.log(`Document with ID: ${docRef.id} has been deleted.`);
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    };

    confirmDelete && confirmAndDelete();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  // open create form
  const handleCreateFormOpen = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  // firestore create lead
  const createLead = async (formData) => {
    console.log(formData);
    try {
      const docRef = await addDoc(collection(db, "techkilla_leads"), formData);
      console.log("Document written with ID: ", docRef.id);

      // Update the document to include the ID in the document fields
      await updateDoc(docRef, { id: docRef.id });
      console.log("Document updated to include ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error.message);
      throw error;
    }
  };

  // create and update lead
  const handleCreateFormSubmit = async (newData) => {
    try {
      const dataWithSource = { ...newData, source };

      if (editingItem) {
        // update lead
        const itemDoc = doc(db, "techkilla_leads", dataWithSource.id);
        await updateDoc(itemDoc, dataWithSource);
        setEditingItem(null);
      } else {
        // create new lead
        await createLead(dataWithSource);
      }

      // Close the dialog and reset editing state
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving lead. Details:", {
        message: error.message,
        newData,
        editingItem,
      });
    }
  };
  const formatTimestamp = (timestamp) => {
    // Check if timestamp is an instance of Firebase Timestamp
    console.log("date", timestamp);
    const date = new Date(timestamp).toISOString().split("T")[0];

    console.log(date);
    return date;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Ads Leads Data</div>

      <div style={{ marginBottom: "16px" }}>
        <TextField
          label="Date"
          type="date"
          variant="outlined"
          size="small"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: 10 }}
          disabled={!source}
        />
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={handleNameChange}
          style={{ marginRight: "16px", width: "200px" }}
          disabled={!source}
        />

        <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
            disabled={!source}
          >
            <MenuItem value="">None</MenuItem>
            {availableStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

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
            padding: "0 6px",
            borderRadius: "1vw",
            transform: "translate(14px, -6px) scale(0.9)",
            color: "black",
            marginBottom: "8px",
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
            height: "36px",
            paddingBottom: "8px",
            "& .MuiSelect-icon": {
              color: "#333",
            },
            marginTop: "4px",
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

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleCreateFormOpen}
        style={{ margin: "18px" }}
      >
        Create New Entry
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: "16px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Attended By</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Query</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedSourcedData?.length > 0 ? (
              selectedSourcedData.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.number}</TableCell>
                  <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                  <TableCell>{item.attendedBy}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell>{item.query}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "1vw", // Adjust the gap as needed
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleDelete(item.id)}
                        sx={{
                          backgroundColor: "red",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
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

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <CreateForm
          item={editingItem}
          onClose={handleDialogClose}
          onSubmit={(formData) => handleCreateFormSubmit(formData)}
        />
      </Dialog>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Dialog,
  TextField,
} from "@mui/material";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";

import "./Dashboard.css";

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [source, setSource] = useState("");
  const [items, setItems] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSourcedData, setSelectedSourcedData] = useState([]);

  const availableSources = ["Google Ads", "Meta Ads", "Website", "Referral"];
  console.log("Items", items);

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

  // handle source change
  const handleSourceChange = async (event) => {
    console.log("calling handle sourse change");
    const selectedSource = event.target.value;
    setSource(selectedSource);
  };

  // filter souce change
  useEffect(() => {
    const handleFilterSourceChange = () => {
      const filteredItems = items.filter((item) => item.source === source);
      setSelectedSourcedData(filteredItems);
    };

    handleFilterSourceChange();
  }, [source, items]);

  console.log("selectedSourcedData", selectedSourcedData);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortData = (array) => {
    return array.sort((a, b) => {
      const isAsc = sortDirection === "asc";

      if (orderBy === "timestamp") {
        return isAsc
          ? parseInt(a.timestamp) - parseInt(b.timestamp)
          : parseInt(b.timestamp) - parseInt(a.timestamp);
      }

      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  const sortedItems = sortData(
    items.filter((item) => {
      // Filter by Name
      const matchesName = item.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      // Filter by Date
      const matchesDate = dateFilter ? item.date === dateFilter : true;

      // Filter by Status
      const matchesStatus = statusFilter ? item.status === statusFilter : true;

      return matchesName && matchesDate && matchesStatus;
    })
  );

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Ads Leads Data</div>

      <div style={{ marginBottom: "16px" }}>
        <TextField
          label="Filter by Date"
          type="date"
          variant="outlined"
          size="small"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ marginRight: "16px", width: "200px" }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Filter by Name"
          variant="outlined"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          style={{ marginRight: "16px", width: "200px" }}
        />

        <FormControl variant="outlined" size="small" style={{ width: "200px" }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Number</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "timestamp"}
                  direction={orderBy === "timestamp" ? sortDirection : "asc"}
                  onClick={() => handleRequestSort("timestamp")}
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
            {selectedSourcedData.length > 0 ? (
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

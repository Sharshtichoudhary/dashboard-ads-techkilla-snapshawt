import React, { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const CreateForm = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    number: "",
    timestamp: "",
    attendedBy: "",
    date: "",
    company: "",
    query: "",
    status: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        timestamp: item.timestamp || new Date().toISOString(), // Format timestamp
      });
    } else {
      // If creating a new entry, set current timestamp
      setFormData((prevState) => ({
        ...prevState,
        timestamp: new Date().toISOString(),
      }));
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open onClose={onClose}>
        <DialogTitle>{item ? "Edit Data" : "Create Lead"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Number"
            name="number"
            value={formData.number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Attended By"
            name="attendedBy"
            value={formData.attendedBy}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Query"
            name="query"
            value={formData.query}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default CreateForm;

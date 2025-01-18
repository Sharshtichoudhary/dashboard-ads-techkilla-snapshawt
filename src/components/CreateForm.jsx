import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
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
    name: "",
    number: "",
    timestamp: "",
    attendedBy: "",
    company: "",
    query: "",
    status: "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        timestamp: item.timestamp || new Date().toISOString(),
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
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate number field
    if (name === "number" || name === "date") {
      if (!/^\d+$/.test(value)) {
        setErrors({
          ...errors,
          [name]: "This field requires a valid number.",
        });
      } else {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  };
  const [errors, setErrors] = useState({
    number: "",
    date: "",
  });
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Dialog open onClose={onClose}>
        <DialogTitle>{formData.name ? "Edit Data" : "Create Lead"}</DialogTitle>
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
            error={!!errors.number}
            helperText={errors.number}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={!!errors.number || !!errors.date}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default CreateForm;

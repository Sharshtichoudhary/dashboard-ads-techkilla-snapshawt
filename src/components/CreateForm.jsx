import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
} from "@mui/material";

const CreateForm = ({ open, onClose, existingData, onSave }) => {
  const [formData, setFormData] = useState({
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
    if (existingData) {
      setFormData(existingData);
    } else {
      setFormData({
        name: "",
        number: "",
        timestamp: "",
        attendedBy: "",
        date: "",
        company: "",
        query: "",
        status: "",
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{existingData ? "Edit Item" : "Create Item"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Number"
          type="text"
          fullWidth
          name="number"
          value={formData.number}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Timestamp"
          type="text"
          fullWidth
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Attended By"
          type="text"
          fullWidth
          name="attendedBy"
          value={formData.attendedBy}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          label="Company"
          type="text"
          fullWidth
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Query"
          type="text"
          fullWidth
          name="query"
          value={formData.query}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {existingData ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";

const LoginPopup = ({ setIsLoggedIn }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const predefinedPasscode = "1234";

  const handleSubmit = () => {
    if (passcode === predefinedPasscode) {
      setIsLoggedIn(true);
      navigate("/dashboard");
    } else {
      setError("Incorrect passcode. Please try again.");
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>Enter Passcode</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Passcode"
          type="password"
          fullWidth
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPopup;

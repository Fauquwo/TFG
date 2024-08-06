import React, { useState } from 'react';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const Register = ({ account, handleRegister }) => {
  const [address, setAddress] = useState(account);
  const [role, setRole] = useState('');

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = () => {
    handleRegister(address, role);
  };

  return (
    <div>
      <h2>Register</h2>
      <FormControl fullWidth>
        <TextField
          label="Address"
          value={address}
          onChange={handleAddressChange}
          fullWidth
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Role</InputLabel>
        <Select
          value={role}
          onChange={handleRoleChange}
          fullWidth
        >
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="patient">Patient</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Register
      </Button>
    </div>
  );
};

export default Register;

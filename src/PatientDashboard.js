import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

const PatientDashboard = ({ handleRequestAppointment, patientAppointments, records }) => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [timestamp, setTimestamp] = useState('');

  const handleRequest = () => {
    const selectedTime = new Date(timestamp).getTime();
    handleRequestAppointment(doctorAddress, selectedTime);
  };

  const handleDownload = async (hash, timestamp) => {
    try {
      const response = await fetch(`http://localhost:5000/download/${hash}/${timestamp}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `record_${timestamp}.txt`; // Generar nombre de archivo de descarga
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <Typography variant="h6">Request an Appointment</Typography>
      <TextField
        label="Doctor Address"
        value={doctorAddress}
        onChange={(e) => setDoctorAddress(e.target.value)}
        fullWidth
      />
      <TextField
        label="Select Time"
        type="datetime-local"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Button variant="contained" color="primary" onClick={handleRequest}>
        Request Appointment
      </Button>

      <Typography variant="h6">Your Appointments</Typography>
      <List>
        {patientAppointments.map((appointment, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Doctor: ${appointment.doctor}, Time: ${new Date(Number(appointment.timestamp)).toLocaleString()}`}
              secondary={`Confirmed: ${appointment.confirmed ? 'Yes' : 'No'}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Your Records</Typography>
      <List>
        {records.map((record, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`IPFS Hash: ${record.ipfsHash}`}
              secondary={`Doctor: ${record.doctor}, Timestamp: ${new Date(record.timestamp).toLocaleString()}`}
            />
            <Button variant="contained" color="primary" onClick={() => handleDownload(record.ipfsHash, record.timestamp)}>
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default PatientDashboard;

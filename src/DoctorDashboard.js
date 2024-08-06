import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

const DoctorDashboard = ({ appointments, handleConfirmAppointment, handleAddRecord, fetchRecords, records }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [file, setFile] = useState(null);
  const [timestamp, setTimestamp] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/plain') {
      const currentTime = new Date().toISOString();
      setFile(new File([selectedFile], `record_${currentTime}.txt`, { type: 'text/plain' }));
      setTimestamp(currentTime);
    } else {
      alert('Only .txt files are allowed');
      e.target.value = null; // Clear the file input
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('File uploaded to IPFS:', data);

      handleAddRecord(patientAddress, data.hash, data.timestamp, data.mimetype);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
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
      <h2>Doctor Dashboard</h2>

      <Typography variant="h6">Appointments</Typography>
      <List>
        {appointments.map((appointment, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Patient: ${appointment.patient}, Time: ${new Date(Number(appointment.timestamp)).toLocaleString()}`}
              secondary={`Confirmed: ${appointment.confirmed ? 'Yes' : 'No'}`}
            />
            {!appointment.confirmed && (
              <Button variant="contained" color="primary" onClick={() => handleConfirmAppointment(index)}>
                Confirm
              </Button>
            )}
          </ListItem>
        ))}
      </List>

      <Typography variant="h6">Upload Record for Patient</Typography>
      <TextField
        label="Patient Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
        fullWidth
      />
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <Typography variant="caption" color="textSecondary">
        Only .txt files are allowed
      </Typography>
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload Record
      </Button>

      <Typography variant="h6">View Records for Patient</Typography>
      <TextField
        label="Patient Address"
        value={patientAddress}
        onChange={(e) => setPatientAddress(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={() => fetchRecords(patientAddress)}>
        View Records
      </Button>
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

export default DoctorDashboard;

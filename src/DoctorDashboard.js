import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, Typography } from '@mui/material';

const DoctorDashboard = ({ appointments, handleConfirmAppointment, handleAddRecord, fetchRecords, records }) => {
  const [patientAddress, setPatientAddress] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

      handleAddRecord(patientAddress, data.hash, data.timestamp); // 传递文件的 IPFS 哈希和时间戳
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownload = async (hash) => {
    try {
      const response = await fetch(`http://localhost:5000/download/${hash}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = hash; // 您可以根据需要更改文件名
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
      <input type="file" onChange={handleFileChange} />
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
              secondary={`Doctor: ${record.doctor}, Timestamp: ${new Date(record.timestamp).toLocaleString()}`} // update timestamp
            />
            <Button variant="contained" color="primary" onClick={() => handleDownload(record.ipfsHash)}>
              Download
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default DoctorDashboard;

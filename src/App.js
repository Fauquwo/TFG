import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MedicalRecord from './abis/MedicalRecord.json';
import Home from './components/Home';
import AddRecord from './components/AddRecord';
import RequestAppointment from './components/RequestAppointment';
import RecordList from './components/RecordList';
import AppointmentList from './components/AppointmentList';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState('');
  const [view, setView] = useState('home');

  useEffect(() => {
    const loadBlockchainData = async () => {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = MedicalRecord.networks[networkId];
      if (networkData) {
        const contract = new web3.eth.Contract(MedicalRecord.abi, networkData.address);
        setContract(contract);
        const isDoctor = await contract.methods.doctors(accounts[0]).call();
        const isPatient = await contract.methods.patients(accounts[0]).call();
        if (isDoctor) {
          setRole('doctor');
          setView('doctor');
        } else if (isPatient) {
          setRole('patient');
          setView('patient');
        } else {
          setView('home');
        }
      } else {
        alert('Smart contract not deployed to detected network.');
      }
    };

    loadBlockchainData();
  }, []);

  const handleRegister = async (address, role) => {
    if (role === 'doctor') {
      await contract.methods.addDoctor(address).send({ from: account });
    } else if (role === 'patient') {
      await contract.methods.addPatient(address).send({ from: account });
    }
    setRole(role);
    setView(role);
  };

  const handleRecordAdded = (newRecord) => {
    setPatientRecords([...patientRecords, newRecord]);
  };

  const handleAppointmentRequested = (newAppointment) => {
    setAppointments([...appointments, newAppointment]);
  };

  const handleAppointmentConfirmed = (appointmentId) => {
    const updatedAppointments = appointments.map((appt, index) =>
      index === appointmentId ? { ...appt, confirmed: true } : appt
    );
    setAppointments(updatedAppointments);
  };

  const renderView = () => {
    switch (view) {
      case 'patient':
        return (
          <>
            <RequestAppointment contract={contract} account={account} onAppointmentRequested={handleAppointmentRequested} />
            <AppointmentList
              appointments={appointments}
              contract={contract}
              account={account}
              onAppointmentConfirmed={handleAppointmentConfirmed}
            />
          </>
        );
      case 'doctor':
        return (
          <>
            <AddRecord contract={contract} account={account} onRecordAdded={handleRecordAdded} />
            <RecordList records={patientRecords} />
          </>
        );
      default:
        return <Home onRegister={handleRegister} />;
    }
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import axios from 'axios';
import MedicalRecord from './abis/MedicalRecord.json';
import Header from './Header';
import Register from './Register';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [role, setRole] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const web3 = new Web3(provider);
      setWeb3(web3);

      if (provider.request) {
        try {
          await provider.request({ method: 'eth_requestAccounts' });
        } catch (error) {
          return;
        }
      }

      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      // Verificación de roles
      const networkId = await web3.eth.net.getId();
      const networkData = MedicalRecord.networks[networkId];

      if (networkData) {
        const contract = new web3.eth.Contract(MedicalRecord.abi, networkData.address);
        setContract(contract);

        try {
          const isDoctor = await contract.methods.doctors(accounts[0]).call();
          const isPatient = await contract.methods.patients(accounts[0]).call();

          if (isDoctor) {
            setRole('doctor');
            fetchAllAppointments(contract, accounts[0], 'doctor');
          } else if (isPatient) {
            setRole('patient');
            fetchAllAppointments(contract, accounts[0], 'patient');
            const records = await contract.methods.getRecords(accounts[0]).call();
            setRecords(records);
          }
        } catch (error) {
        }
      } else {
        window.alert('Smart contract not deployed to detected network.');
      }
    } else {
      window.alert('Please install MetaMask!');
    }
  };

  const fetchAllAppointments = async (contract, address, role) => {
    try {
      const allAppointments = await contract.methods.getAppointments().call();
      if (role === 'doctor') {
        const doctorAppointments = allAppointments.filter(appointment => appointment.doctor === address);
        setAppointments(doctorAppointments);
      } else if (role === 'patient') {
        const patientAppointments = allAppointments.filter(appointment => appointment.patient === address);
        setPatientAppointments(patientAppointments);
      }
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const handleRegister = async (address, role) => {
    if (!contract) {
      console.error('Contract is not loaded');
      return;
    }

    try {
      if (role === 'doctor') {
        await contract.methods.addDoctor(address).send({ from: account });
      } else if (role === 'patient') {
        await contract.methods.addPatient(address).send({ from: account });
      }
      
      setRole(role);
    } catch (error) {
      console.error(`Failed to register ${address} as ${role}:`, error);
    }
  };
  
  const handleAddRecord = async (patientAddress, fileHash, timestamp, mimetype) => {
    if (!contract) {
      console.error('Contract is not loaded');
      return;
    }
  
    try {
      if (!web3.utils.isAddress(patientAddress)) {
        throw new Error('Invalid patient address');
      }
  
      if (!fileHash || typeof fileHash !== 'string') {
        throw new Error('Invalid IPFS hash');
      }
  
      await contract.methods.addRecord(patientAddress, fileHash, timestamp, mimetype).send({ from: account });
  
      const records = await contract.methods.getRecords(patientAddress).call();
      setRecords(records);
    } catch (error) {
      console.error('Failed to add record:', error.message);
    }
  };
  
  const handleRequestAppointment = async (doctorAddress, timestamp) => {
    if (!contract) {
      console.error('Contract is not loaded');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/appointment', { doctorAddress, patientAddress: account, timestamp });
      console.log('Appointment data uploaded to IPFS:', response.data);

      await contract.methods.requestAppointment(doctorAddress, timestamp.toString()).send({ from: account });
      fetchAllAppointments(contract, account, 'patient');
    } catch (error) {
      console.error('Failed to request appointment:', error);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    if (!contract) {
      console.error('Contract is not loaded');
      return;
    }

    try {
      await contract.methods.confirmAppointment(appointmentId).send({ from: account });
      setAppointments(appointments);
      fetchAllAppointments(contract, account, role);
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
    }
  };

  const fetchRecords = async (patientAddress) => {
    if (!contract) {
      console.error('Contract is not loaded');
      return;
    }

    try {
      const records = await contract.methods.getRecords(patientAddress).call();
      setRecords(records);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  return (
    <div>
      <Header account={account} />
      <div style={{ padding: '20px' }}>
        {!role && <Register account={account} handleRegister={handleRegister} />}
        {role === 'doctor' && (
          <DoctorDashboard
            appointments={appointments}
            handleConfirmAppointment={handleConfirmAppointment}
            handleAddRecord={handleAddRecord}
            fetchRecords={fetchRecords}
            records={records}
          />
        )}
        {role === 'patient' && (
          <PatientDashboard
            handleRequestAppointment={handleRequestAppointment}
            patientAppointments={patientAppointments}
            records={records}
          />
        )}
      </div>
    </div>
  );
};

export default App;

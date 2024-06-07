import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import MedicalRecord from './abis/MedicalRecord.json';
import AddRecord from './components/AddRecord';
import RequestAppointment from './components/RequestAppointment';
import RecordList from './components/RecordList';
import AppointmentList from './components/AppointmentList';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);

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
        const records = await contract.methods.getRecords(accounts[0]).call();
        setPatientRecords(records);
        const allAppointments = await contract.methods.getAppointments().call();
        setAppointments(allAppointments);
      } else {
        alert('Smart contract not deployed to detected network.');
      }
    };

    loadBlockchainData();
  }, []);

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

  return (
    <div>
      <AddRecord contract={contract} account={account} onRecordAdded={handleRecordAdded} />
      <RecordList records={patientRecords} />
      <RequestAppointment contract={contract} account={account} onAppointmentRequested={handleAppointmentRequested} />
      <AppointmentList
        appointments={appointments}
        contract={contract}
        account={account}
        onAppointmentConfirmed={handleAppointmentConfirmed}
      />
    </div>
  );
};

export default App;

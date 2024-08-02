const express = require('express');
const Web3 = require('web3');
const IPFS = require('ipfs-http-client');

const app = express();
const port = process.env.PORT || 5000;

// Connect to IPFS
const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// Connect to Ethereum
const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');

// Load contract ABI and address
const contractABI = require('./abis/MedicalRecord.json').abi;
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // 您的智能合约地址
const contract = new web3.eth.Contract(contractABI, contractAddress);

app.use(express.json());

app.post('/upload', async (req, res) => {
  try {
    const { file, account } = req.body;
    const ipfsResult = await ipfs.add(Buffer.from(file, 'base64'));
    const ipfsHash = ipfsResult.path;
    await contract.methods.addRecord(account, ipfsHash).send({ from: account });
    res.send({ ipfsHash });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/request-appointment', async (req, res) => {
  try {
    const { doctor, timestamp, account } = req.body;
    await contract.methods.requestAppointment(doctor, timestamp).send({ from: account });
    res.send({ status: 'Appointment requested' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/confirm-appointment', async (req, res) => {
  try {
    const { appointmentId, account } = req.body;
    await contract.methods.confirmAppointment(appointmentId).send({ from: account });
    res.send({ status: 'Appointment confirmed' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/register', async (req, res) => {
  try {
    const { address, role, account } = req.body;
    if (role === 'doctor') {
      await contract.methods.addDoctor(address).send({ from: account });
    } else if (role === 'patient') {
      await contract.methods.addPatient(address).send({ from: account });
    }
    res.send({ status: 'User registered' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

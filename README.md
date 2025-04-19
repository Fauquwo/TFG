# 🧬 TFG - Blockchain-based Medical Record System

This project implements a decentralized medical record system using **Ethereum smart contracts**, a **React.js frontend**, and an **Express backend**. It enables patients and doctors to interact securely via blockchain, ensuring privacy, transparency, and immutability of medical data.

## 📂 Project Structure

```
TFG/
│
├── migrations/         # Truffle deployment scripts
├── public/             # Static assets for React app
├── server/             # Express.js backend server
├── src/                # React.js frontend
├── test/               # Smart contract unit tests
├── truffle-config.js   # Truffle configuration
├── package.json        # Node dependencies and scripts
```

## 🚀 Features

- 📑 Patients can store and share medical records
- 👨‍⚕️ Doctors can view and manage appointments
- 🔒 Blockchain-backed privacy and access control
- 💡 MetaMask support for Web3 wallet integration

## 📄 Directory Breakdown

### `migrations/`
Truffle deployment scripts:
- `1_initial_migration.js`: Deploys the base Migrations contract.

### `server/index.js`
A minimal Express.js server with CORS support, ready for possible REST API integrations or external services like off-chain storage or analytics.

### `src/` - React Frontend

#### 🔧 Core Logic: `App.js`
- Connects to Ethereum via MetaMask.
- Loads `MedicalRecord` smart contract ABI.
- Authenticates user role (doctor/patient).
- Routes UI based on role.

#### 🧩 Components:
- `Register.js`: User onboarding (doctor/patient registration)
- `DoctorDashboard.js`: View all patient appointments
- `PatientDashboard.js`: Access to personal medical records
- `Header.js`: Navigation bar

### `test/`
Holds Truffle test scripts to ensure smart contract reliability.

### `truffle-config.js`
Standard configuration for smart contract compilation and deployment. Modify this file to set up networks like Ropsten, Rinkeby, or Ganache.

## 🛠 Installation

### 1. Clone the repo
```bash
git clone https://github.com/Fauquwo/TFG.git
cd TFG
```

### 2. Install dependencies
```bash
npm install
```

### 3. Compile and deploy smart contracts
```bash
truffle compile
truffle migrate --reset
```

### 4. Run the backend server
```bash
cd server
node index.js
```

### 5. Start the frontend
```bash
cd ..
npm start
```

Make sure you have MetaMask installed in your browser and connected to the correct network.

## 📦 Tech Stack

- **Solidity** - Smart contracts
- **Truffle** - Contract development framework
- **React.js** - Frontend framework
- **Express.js** - Backend server
- **Web3.js** - Ethereum API for JavaScript
- **MetaMask** - Ethereum wallet integration

## 📌 Notes

- Smart contracts are located in the `src/abis/MedicalRecord.json`, likely compiled using Truffle.
- Ensure Ganache or another Ethereum node is running locally for testing.
- MetaMask must be unlocked to allow Web3 access.

## 📜 License

MIT

import React, { useState } from 'react';

const Home = ({ onRegister }) => {
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('patient');

  const handleRegister = () => {
    onRegister(address, role);
  };

  return (
    <div className="home">
      <h1>欢迎来到医疗记录 Dapp</h1>
      <p>通过以太坊区块链管理您的医疗记录和预约</p>
      <input
        type="text"
        placeholder="Enter your Ethereum address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Home;

import React, { useState } from 'react';
import { create } from 'ipfs-http-client';

const ipfs = create('https://ipfs.infura.io:5001/api/v0');

const AddRecord = ({ contract, account, onRecordAdded }) => {
  const [buffer, setBuffer] = useState(null);

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result));
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const result = await ipfs.add(buffer);
    const ipfsHash = result.path;
    contract.methods.addRecord(account, ipfsHash).send({ from: account }).on('confirmation', () => {
      onRecordAdded({ ipfsHash, doctor: account, timestamp: Date.now() });
    });
  };

  return (
    <div>
      <h2>Add Medical Record</h2>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={captureFile} />
        <input type="submit" />
      </form>
    </div>
  );
};

export default AddRecord;

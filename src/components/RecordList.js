import React from 'react';

const RecordList = ({ records }) => {
  return (
    <div>
      <h2>Patient Medical Records</h2>
      <ul>
        {records.map((record, index) => (
          <li key={index}>
            <a href={`https://ipfs.infura.io/ipfs/${record.ipfsHash}`} target="_blank" rel="noopener noreferrer">
              {record.ipfsHash}
            </a> - {new Date(record.timestamp * 1000).toLocaleString()} - {record.doctor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordList;

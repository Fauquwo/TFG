import React, { useState } from 'react';

const RequestAppointment = ({ contract, account, onAppointmentRequested }) => {
  const [doctor, setDoctor] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  const requestAppointment = async (event) => {
    event.preventDefault();
    const timestamp = new Date(appointmentTime).getTime() / 1000;
    contract.methods.requestAppointment(doctor, timestamp).send({ from: account }).on('confirmation', () => {
      onAppointmentRequested({ patient: account, doctor, timestamp, confirmed: false });
    });
  };

  return (
    <div>
      <h2>Request an Appointment</h2>
      <form onSubmit={requestAppointment}>
        <input
          type="text"
          placeholder="Doctor Address"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
        />
        <input
          type="datetime-local"
          placeholder="Appointment Time"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
        />
        <input type="submit" />
      </form>
    </div>
  );
};

export default RequestAppointment;

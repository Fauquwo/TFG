import React from 'react';

const ConfirmAppointment = ({ contract, account, appointmentId, onAppointmentConfirmed }) => {
  const confirmAppointment = async () => {
    contract.methods.confirmAppointment(appointmentId).send({ from: account }).on('confirmation', () => {
      onAppointmentConfirmed(appointmentId);
    });
  };

  return (
    <button onClick={confirmAppointment}>Confirm</button>
  );
};

export default ConfirmAppointment;

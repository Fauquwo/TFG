import React from 'react';
import ConfirmAppointment from './ConfirmAppointment';

const AppointmentList = ({ appointments, contract, account, onAppointmentConfirmed }) => {
  return (
    <div>
      <h2>Appointments</h2>
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>
            Patient: {appointment.patient} - Doctor: {appointment.doctor} - Time: {new Date(appointment.timestamp * 1000).toLocaleString()} - Confirmed: {appointment.confirmed ? 'Yes' : 'No'}
            {!appointment.confirmed && appointment.doctor === account && (
              <ConfirmAppointment
                contract={contract}
                account={account}
                appointmentId={index}
                onAppointmentConfirmed={onAppointmentConfirmed}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;

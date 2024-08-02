import React from 'react';
import { Button } from '@material-ui/core';

const Register = ({ account, handleRegister }) => {
  return (
    <div>
      <h2>Register</h2>
      <Button variant="contained" color="primary" onClick={() => handleRegister(account, 'doctor')}>
        Register Doctor
      </Button>
      <Button variant="contained" color="secondary" onClick={() => handleRegister(account, 'patient')}>
        Register Patient
      </Button>
    </div>
  );
};

export default Register;

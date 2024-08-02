import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const Header = ({ account }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Medical Record DApp</Typography>
        <Typography variant="subtitle1" style={{ marginLeft: 'auto' }}>
          Account: {account}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

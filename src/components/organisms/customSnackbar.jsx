import { IconButton, Snackbar } from '@mui/material';
import React, { useContext } from 'react';
import alertCross from '../../assets/images/alertCross.png';
import { SnackbarContext } from '../../context/snackbarContext';
import './organisms.css';

const CustomSnackbar = (props) => {
  const useSnackbar = useContext(SnackbarContext);

  const action = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={() => useSnackbar.setVisible(false)}>
        <img src={alertCross} alt='' width={20} style={{ marginBottom: 1 }} />
      </IconButton>
    </div>
  );

  const onClose = () => {
    if (props.onClose) props.onClose();
    else useSnackbar.setVisible(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={useSnackbar.visible}
        autoHideDuration={useSnackbar.duration}
        onClose={onClose}
        message={useSnackbar.message}
        action={action}
      />
    </div>
  );
};

export default CustomSnackbar;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { handleOAuthCallback } from '../services/linkedinAuthService';

const LinkedInCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Process the callback
    const token = handleOAuthCallback();
    
    // Redirect based on result
    if (token) {
      // Success! Redirect to settings with success message
      navigate('/settings?success=true&message=LinkedIn+successfully+connected');
    } else {
      // Failed. Redirect to settings with error message
      navigate('/settings?error=Failed+to+connect+LinkedIn+account');
    }
  }, [navigate]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      height: '80vh' 
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Connecting to LinkedIn...
      </Typography>
    </Box>
  );
};

export default LinkedInCallback;

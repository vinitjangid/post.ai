import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { handleInstagramCallback } from '../services/instagramService';

const InstagramCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleInstagramCallback();
        
        // Add a delay for UX purposes
        setTimeout(() => {
          // Redirect to settings page whether successful or not
          navigate('/settings', { 
            state: { 
              from: 'instagram-callback',
              success: result.success,
              message: result.success 
                ? 'Successfully connected to Instagram!'
                : `Instagram connection failed: ${result.error}`
            }
          });
        }, 2000);
        
      } catch (error) {
        console.error('Error in Instagram callback:', error);
        
        setTimeout(() => {
          navigate('/settings', { 
            state: { 
              from: 'instagram-callback',
              success: false,
              message: `Instagram connection failed: ${error.message}`
            }
          });
        }, 2000);
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
          px: 2
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            sx={{ 
              mb: 3,
              color: '#833AB4'
            }} 
          />
        </motion.div>
        
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Processing Instagram Authorization
        </Typography>
        
        <Alert severity="info" sx={{ maxWidth: 500, mt: 2 }}>
          Please wait while we complete your Instagram connection...
        </Alert>
      </Box>
    </motion.div>
  );
};

export default InstagramCallback;

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Chip 
} from '@mui/material';
import { Instagram as InstagramIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  initiateInstagramAuth, 
  isInstagramAuthenticated, 
  logoutInstagram, 
  getInstagramUserData 
} from '../services/instagramService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #833AB4, #FD1D1D, #FCAF45)',
  }
}));

const InstagramButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #833AB4 30%, #FD1D1D 50%, #FCAF45 90%)',
  borderRadius: theme.spacing(3),
  color: 'white',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  fontWeight: 600,
  '&:hover': {
    opacity: 0.9,
  }
}));

const UserInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 64,
  height: 64,
  marginRight: theme.spacing(2),
  border: '2px solid #FCAF45',
}));

const InstagramAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    if (isInstagramAuthenticated()) {
      setUserData(getInstagramUserData());
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    
    try {
      initiateInstagramAuth();
      // The page will redirect, so we don't need to handle the response here
    } catch (err) {
      setError(`Failed to start authentication: ${err.message}`);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutInstagram();
    setUserData(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper>
        <Box display="flex" alignItems="center" mb={2}>
          <InstagramIcon fontSize="large" sx={{ mr: 1, color: '#FD1D1D' }} />
          <Typography variant="h5" fontWeight={600}>
            Instagram Integration
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          Connect your Instagram Business account to share your JavaScript and React tips as images.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {userData ? (
          <>
            <Alert severity="success" sx={{ mb: 2 }}>
              Successfully connected to Instagram!
            </Alert>
            
            <UserInfoBox>
              <ProfileAvatar src={userData.profilePicture} alt={userData.instagramName} />
              <Box>
                <Typography variant="h6">{userData.instagramName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  @{userData.instagramUsername}
                </Typography>
              </Box>
            </UserInfoBox>
            
            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" alignItems="center">
              <Chip 
                label="Connected" 
                color="success" 
                size="small" 
                sx={{ mr: 2 }} 
              />
              <Button 
                variant="outlined" 
                color="error"
                onClick={handleLogout}
              >
                Disconnect Account
              </Button>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={2}>
            <InstagramButton
              variant="contained"
              startIcon={<InstagramIcon />}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Connecting...
                </>
              ) : (
                'Connect Instagram Account'
              )}
            </InstagramButton>
            <Typography variant="caption" display="block" mt={2} color="text.secondary">
              You'll be redirected to Instagram to authorize the application
            </Typography>
          </Box>
        )}
      </StyledPaper>
    </motion.div>
  );
};

export default InstagramAuth;

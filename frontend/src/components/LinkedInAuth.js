import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Avatar
} from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { 
  initiateLinkedInAuth, 
  handleOAuthCallback, 
  isAuthenticated, 
  logout, 
  getToken 
} from '../services/linkedinAuthService';
import axios from 'axios';

const LinkedInAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the callback page
  const isCallbackPage = location.pathname === '/auth/linkedin/callback';

  // Handle the callback and fetch user profile
  useEffect(() => {
    if (isCallbackPage) {
      setLoading(true);
      const token = handleOAuthCallback();
      
      if (token) {
        // Fetch user profile from LinkedIn
        fetchLinkedInProfile(token);
      } else {
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    } else if (isAuthenticated()) {
      // If already authenticated, fetch the user profile
      fetchUserDataFromStorage();
    }
  }, [isCallbackPage]);

  // Fetch LinkedIn profile data
  const fetchLinkedInProfile = async (token) => {
    try {
      // LinkedIn API endpoints
      const profileUrl = 'https://api.linkedin.com/v2/me';
      const emailUrl = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';

      // Headers for API calls
      const headers = {
        Authorization: `Bearer ${token}`
      };

      // Fetch basic profile and email
      const [profileResponse, emailResponse] = await Promise.all([
        axios.get(profileUrl, { headers }),
        axios.get(emailUrl, { headers })
      ]);

      // Extract relevant data
      const profile = profileResponse.data;
      const email = emailResponse.data.elements?.[0]?.['handle~']?.emailAddress || '';

      // Profile picture requires additional call if needed
      let profilePic = '';
      try {
        const pictureResponse = await axios.get(
          `https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))`,
          { headers }
        );
        
        // Extract profile picture URL
        const pictureData = pictureResponse.data?.profilePicture?.['displayImage~']?.elements || [];
        const highestResImage = pictureData.reduce((prev, current) => 
          (prev.width > current.width) ? prev : current, { width: 0 });
        
        profilePic = highestResImage?.identifiers?.[0]?.identifier || '';
      } catch (err) {
        console.warn('Failed to fetch profile picture:', err);
      }

      // Create user data object
      const userData = {
        id: profile.id,
        firstName: profile.localizedFirstName,
        lastName: profile.localizedLastName,
        email,
        profilePic,
        token
      };

      // Save to localStorage for persistence
      localStorage.setItem('linkedin_user_data', JSON.stringify(userData));
      setUserData(userData);
      setLoading(false);

      // Redirect back to main page
      navigate('/');
    } catch (err) {
      console.error('Error fetching LinkedIn profile:', err);
      setError('Failed to fetch LinkedIn profile. Please try again.');
      setLoading(false);
    }
  };

  // Get user data from localStorage
  const fetchUserDataFromStorage = () => {
    try {
      const storedUserData = localStorage.getItem('linkedin_user_data');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (err) {
      console.error('Error fetching user data from storage:', err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserData(null);
    window.location.reload();
  };

  // Handle login button click
  const handleLogin = () => {
    setLoading(true);
    try {
      initiateLinkedInAuth();
    } catch (err) {
      setError('Failed to initiate LinkedIn authentication. Please try again.');
      setLoading(false);
    }
  };

  // Show loading state during authentication
  if (isCallbackPage && loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Authenticating with LinkedIn...</Typography>
      </Box>
    );
  }

  // Show error if authentication failed
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
        <Button 
          onClick={() => navigate('/')} 
          color="inherit" 
          size="small" 
          sx={{ ml: 2 }}
        >
          Return Home
        </Button>
      </Alert>
    );
  }

  // If authenticated, show user profile and logout button
  if (userData) {
    return (
      <Card sx={{ maxWidth: 345, mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={userData.profilePic} 
              alt={`${userData.firstName} ${userData.lastName}`}
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">
                {userData.firstName} {userData.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userData.email}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="success.main">
            Connected to LinkedIn
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={handleLogout} color="secondary">
            Disconnect
          </Button>
        </CardActions>
      </Card>
    );
  }

  // If not authenticated, show login button
  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<LinkedInIcon />}
        onClick={handleLogin}
        disabled={loading}
        sx={{ 
          bgcolor: '#0077b5', 
          '&:hover': { 
            bgcolor: '#005582' 
          }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Connect with LinkedIn'}
      </Button>
    </Box>
  );
};

export default LinkedInAuth;

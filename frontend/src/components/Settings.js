import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const Settings = () => {
  const location = useLocation();
  const [settings, setSettings] = useState({
    postTime: '09:00',
    postFrequency: 'daily',
    alternateTips: true,
  });
  
  const [linkedInStatus, setLinkedInStatus] = useState({
    connected: false,
    loading: true,
    profileId: '',
  });
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Check URL params for status messages (from OAuth callback)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setStatusMessage({
        severity: 'success',
        message: params.get('message') || 'LinkedIn connected successfully!'
      });
    }
    if (params.get('error')) {
      setStatusMessage({
        severity: 'error',
        message: params.get('error')
      });
    }
    
    // Fetch LinkedIn connection status
    fetchLinkedInStatus();
  }, [location]);
  
  // Fetch LinkedIn connection status
  const fetchLinkedInStatus = async () => {
    try {
      setLinkedInStatus(prev => ({ ...prev, loading: true }));
      const response = await axios.get('/auth/linkedin/status');
      setLinkedInStatus({
        connected: response.data.connected,
        loading: false,
        profileId: response.data.profile?.id || '',
      });
    } catch (error) {
      console.error('Error fetching LinkedIn status:', error);
      setLinkedInStatus({
        connected: false,
        loading: false,
        profileId: '',
      });
    }
  };
  
  // Connect to LinkedIn
  const connectLinkedIn = () => {
    window.location.href = '/auth/linkedin/auth';
  };
  
  // Disconnect from LinkedIn
  const disconnectLinkedIn = async () => {
    try {
      await axios.post('/auth/linkedin/disconnect');
      setLinkedInStatus({
        connected: false,
        loading: false,
        profileId: '',
      });
      setStatusMessage({
        severity: 'success',
        message: 'LinkedIn disconnected successfully'
      });
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      setStatusMessage({
        severity: 'error',
        message: 'Failed to disconnect LinkedIn'
      });
    }
  };
  
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save these to the backend
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ fontWeight: 600 }}>
        Settings
      </Typography>
      
      <Snackbar 
        open={!!statusMessage} 
        autoHideDuration={6000} 
        onClose={() => setStatusMessage(null)}
      >
        <Alert 
          onClose={() => setStatusMessage(null)} 
          severity={statusMessage?.severity || 'info'} 
          sx={{ width: '100%' }}
        >
          {statusMessage?.message}
        </Alert>
      </Snackbar>
      
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkedInIcon color="primary" /> LinkedIn Connection
        </Typography>
        
        <Card sx={{ mb: 3, mt: 2, borderRadius: 2 }}>
          <CardContent>
            {linkedInStatus.loading ? (
              <Box display="flex" alignItems="center" justifyContent="center" py={2}>
                <CircularProgress size={30} />
              </Box>
            ) : linkedInStatus.connected ? (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    Connected to LinkedIn
                  </Typography>
                  <Chip 
                    label={`ID: ${linkedInStatus.profileId}`} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Your LinkedIn account is connected and ready to post content.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" mb={1}>
                  Not connected to LinkedIn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect your LinkedIn account to enable posting JavaScript tips directly to your profile.
                </Typography>
              </Box>
            )}
          </CardContent>
          <CardActions>
            {linkedInStatus.connected ? (
              <Button
                startIcon={<LinkOffIcon />}
                color="error"
                variant="outlined"
                onClick={disconnectLinkedIn}
              >
                Disconnect LinkedIn
              </Button>
            ) : (
              <Button
                startIcon={<LinkIcon />}
                variant="contained"
                color="primary"
                onClick={connectLinkedIn}
              >
                Connect LinkedIn Account
              </Button>
            )}
          </CardActions>
        </Card>
      
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings saved successfully!
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Posting Schedule
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Post Time"
                name="postTime"
                type="time"
                value={settings.postTime}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="post-frequency-label">Post Frequency</InputLabel>
                <Select
                  labelId="post-frequency-label"
                  name="postFrequency"
                  value={settings.postFrequency}
                  label="Post Frequency"
                  onChange={handleChange}
                >
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekdays">Weekdays Only</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.alternateTips}
                    onChange={handleChange}
                    name="alternateTips"
                    color="primary"
                  />
                }
                label="Alternate between JavaScript and React tips"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              Save Settings
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;

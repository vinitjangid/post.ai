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
import InstagramIcon from '@mui/icons-material/Instagram';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

// Import Auth components
import LinkedInAuth from './LinkedInAuth';
import InstagramAuth from './InstagramAuth';
import { isAuthenticated } from '../services/linkedinAuthService';
import { isInstagramAuthenticated } from '../services/instagramService';

const Settings = () => {
  const location = useLocation();
  const [settings, setSettings] = useState({
    postTime: '09:00',
    postFrequency: 'daily',
    alternateTips: true,
  });
  const [isLinkedInConnected, setIsLinkedInConnected] = useState(false);
  const [isInstagramConnected, setIsInstagramConnected] = useState(false);
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  
  // Check if user is authenticated with LinkedIn and Instagram
  useEffect(() => {
    setIsLinkedInConnected(isAuthenticated());
    setIsInstagramConnected(isInstagramAuthenticated());
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('linkedin_post_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error('Error parsing saved settings:', err);
      }
    }
    
    // Check URL params for status messages (from OAuth callback)
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setStatusMessage({
        severity: 'success',
        message: params.get('message') || 'Connection successful!'
      });
    }
    if (params.get('error')) {
      setStatusMessage({
        severity: 'error',
        message: params.get('error')
      });
    }
    
    // Check state from navigation (from Instagram callback)
    if (location.state?.from === 'instagram-callback') {
      setStatusMessage({
        severity: location.state.success ? 'success' : 'error',
        message: location.state.message
      });
    }
  }, [location]);
  
  // Save settings to local storage
  const saveSettings = () => {
    try {
      localStorage.setItem('linkedin_post_settings', JSON.stringify(settings));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
      setTimeout(() => setError(null), 3000);
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
    // Save settings to localStorage
    saveSettings();
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
        
        {/* Use our new LinkedIn Auth component */}
        <Box sx={{ my: 3 }}>
          <LinkedInAuth />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {isLinkedInConnected 
              ? "Your LinkedIn account is connected. You can now post content directly to your LinkedIn profile." 
              : "Connect your LinkedIn account to post JavaScript and React tips directly to your profile."}
          </Typography>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstagramIcon sx={{ color: '#E1306C' }} /> Instagram Connection
        </Typography>
        
        {/* Instagram Auth component */}
        <Box sx={{ my: 3 }}>
          <InstagramAuth />
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            {isInstagramConnected 
              ? "Your Instagram Business account is connected. You can now post images directly to your Instagram profile." 
              : "Connect your Instagram Business account to post JavaScript and React tips as images."}
          </Typography>
        </Box>
      
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

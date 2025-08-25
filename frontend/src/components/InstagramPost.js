import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  PhotoCamera as PhotoCameraIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { isInstagramAuthenticated, postToInstagram, getInstagramUserData } from '../services/instagramService';
import { fetchJavaScriptTip, fetchReactTip } from '../services/apiService';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  marginBottom: theme.spacing(3),
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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PreviewCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const DeleteImageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(0,0,0,0.6)',
  color: 'white',
  padding: 6,
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
}));

const InstagramPost = () => {
  const [category, setCategory] = useState('javascript');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  // Define generateRandomTip with useCallback to avoid infinite loop
  const generateRandomTip = useCallback(() => {
    const fetchTip = category === 'javascript' ? fetchJavaScriptTip : fetchReactTip;
    
    fetchTip().then(tip => {
      const hashtagsForCategory = category === 'javascript' 
        ? '#javascript #programming #coding #webdev'
        : '#reactjs #webdevelopment #frontend #javascript';
      
      setCaption(`${tip}\n\n${hashtagsForCategory}`);
    });
  }, [category]); // Only re-create when category changes

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = isInstagramAuthenticated();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      setUserData(getInstagramUserData());
    }
    
    // Generate a random tip for the initial caption
    generateRandomTip();
  }, [generateRandomTip]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    // Generate a new random tip when category changes
    setTimeout(() => {
      generateRandomTip();
    }, 100);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedImage = event.target.files[0];
      setImage(selectedImage);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please connect your Instagram account first.');
      return;
    }
    
    if (!image) {
      setError('Please select an image to post.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // For demo/frontend only, we need a way to host the image
      // In production, you'd want to upload this to your own server or a service like Cloudinary
      // For this demo, we'll assume the image URL is available (this won't work in production)
      // Normally, you'd do something like:
      // const imageUrl = await uploadImageToServer(image);
      
      // For demo purposes, we'll use a placeholder
      const mockImageUrl = 'https://via.placeholder.com/1080x1080.png?text=JavaScript+Tip';
      
      const result = await postToInstagram(mockImageUrl, caption);
      
      if (result.success) {
        setSuccess(true);
        setError(null);
        
        // Reset form
        setImage(null);
        setImagePreview(null);
        generateRandomTip();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(`Failed to post to Instagram: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
            Create Instagram Post
          </Typography>
        </Box>

        {!isAuthenticated ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Please connect your Instagram account in the Settings page first.
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Connected as @{userData?.instagramUsername}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Successfully posted to Instagram!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Post Content
              </Typography>
              
              <TextField
                select
                fullWidth
                label="Category"
                value={category}
                onChange={handleCategoryChange}
                margin="normal"
              >
                <MenuItem value="javascript">JavaScript</MenuItem>
                <MenuItem value="react">React</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Caption"
                multiline
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                margin="normal"
                placeholder="Enter your post caption here..."
              />

              <Button
                variant="outlined"
                onClick={generateRandomTip}
                sx={{ mt: 1 }}
              >
                Generate Random Tip
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                Post Image
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 3,
                  mb: 2,
                  backgroundColor: '#f9f9f9',
                  height: imagePreview ? 'auto' : 200,
                }}
              >
                {imagePreview ? (
                  <PreviewCard>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Post preview"
                      sx={{ maxHeight: 300 }}
                    />
                    <DeleteImageButton 
                      className="delete-button"
                      onClick={handleRemoveImage}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </DeleteImageButton>
                  </PreviewCard>
                ) : (
                  <>
                    <PhotoCameraIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                    <Typography variant="body1" color="text.secondary" align="center">
                      Select an image for your Instagram post
                    </Typography>
                  </>
                )}
              </Box>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Select Image
                <VisuallyHiddenInput type="file" accept="image/*" onChange={handleImageChange} />
              </Button>
              
              <Typography variant="caption" display="block" mt={1} color="text.secondary">
                Recommended aspect ratio: 1:1 (square) or 4:5 (portrait)
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box textAlign="center">
            <InstagramButton
              type="submit"
              variant="contained"
              startIcon={<InstagramIcon />}
              disabled={loading || !isAuthenticated}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  Posting...
                </>
              ) : (
                'Post to Instagram'
              )}
            </InstagramButton>
          </Box>
        </form>
      </StyledPaper>
    </motion.div>
  );
};

export default InstagramPost;

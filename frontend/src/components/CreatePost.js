import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardMedia
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { createPost, uploadPostImage } from '../services/apiService';

const CreatePost = () => {
  const [postType, setPostType] = useState('tip');
  const [category, setCategory] = useState('javascript');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      let imageUrl = null;
      
      // Upload image if present
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const imageData = await uploadPostImage(formData);
        imageUrl = imageData.imageUrl;
      }
      
      // Create post
      const postData = {
        type: postType,
        category,
        content,
        imageUrl
      };
      
      await createPost(postData);
      
      // Reset form
      setContent('');
      setImage(null);
      setImagePreview(null);
      setSuccess(true);
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div">
        Create New LinkedIn Post
      </Typography>
      
      <Paper sx={{ p: 4 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Post created successfully! It will be published to LinkedIn shortly.
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="post-type-label">Post Type</InputLabel>
                <Select
                  labelId="post-type-label"
                  value={postType}
                  label="Post Type"
                  onChange={(e) => setPostType(e.target.value)}
                  required
                >
                  <MenuItem value="tip">Tip</MenuItem>
                  <MenuItem value="image">Image Post</MenuItem>
                  <MenuItem value="custom">Custom Post</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="react">React</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Post Content"
                multiline
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Enter your post content here..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ mr: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                
                {image && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRemoveImage}
                    startIcon={<DeleteIcon />}
                  >
                    Remove Image
                  </Button>
                )}
              </Box>
              
              {imagePreview && (
                <Card sx={{ maxWidth: 345, mb: 2 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview}
                    alt="Post image preview"
                  />
                </Card>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Post'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePost;

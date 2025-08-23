import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Dialog,
  DialogContent
} from '@mui/material';
import JavaScriptIcon from '@mui/icons-material/Javascript';
import CodeIcon from '@mui/icons-material/Code';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';

const PostHistory = ({ posts, loading, error }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImageDialog = () => {
    setSelectedImage(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircleIcon color="success" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'javascript':
        return <JavaScriptIcon sx={{ color: '#f7df1e' }} />;
      case 'react':
        return <CodeIcon sx={{ color: '#61dafb' }} />;
      default:
        return <CodeIcon />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="div">
        Post History
      </Typography>
      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="post history table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((post) => (
                  <TableRow hover key={post.id}>
                    <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {post.type === 'image' ? (
                        <Chip 
                          icon={<ImageIcon />} 
                          label="Image" 
                          variant="outlined" 
                          color="primary"
                          size="small" 
                        />
                      ) : (
                        <Chip 
                          icon={<CodeIcon />} 
                          label="Tip" 
                          variant="outlined" 
                          color="secondary"
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getCategoryIcon(post.category)}
                        <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {post.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {post.content}
                        </Typography>
                        
                        {post.imageUrl && (
                          <Card 
                            sx={{ mt: 1, maxWidth: 100, cursor: 'pointer' }}
                            onClick={() => handleImageClick(post.imageUrl)}
                          >
                            <CardMedia
                              component="img"
                              height="60"
                              image={post.imageUrl}
                              alt="Post image"
                            />
                          </Card>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(post.status)}
                        <Typography variant="body2" sx={{ ml: 1, textTransform: 'capitalize' }}>
                          {post.status}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No posts yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={posts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseImageDialog}
        maxWidth="md"
      >
        <DialogContent>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Post" 
              style={{ width: '100%', maxHeight: '80vh' }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PostHistory;

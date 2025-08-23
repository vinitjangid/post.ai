import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, Card, CardContent, 
  CardActions, Grid, FormControl, InputLabel, Select, MenuItem,
  Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions, 
  Alert, Snackbar, useTheme, useMediaQuery, Tooltip, IconButton,
  Zoom, Fade, Collapse
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import QuizIcon from '@mui/icons-material/Quiz';
import DeleteIcon from '@mui/icons-material/Delete';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:3000';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(0, 119, 181, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 119, 181, 0); }
`;

// Styled components
const QuestionCard = styled(Card)(({ theme, index = 0 }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  overflow: 'hidden',
  animation: `${fadeIn} 0.5s ease-out ${0.1 * index}s both`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #0077b5, #00a0dc)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
    '&::before': {
      transform: 'scaleX(1)',
    }
  },
}));

const StyledOption = styled(Box)(({ theme, isCorrect }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: theme.spacing(1),
  backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(0, 0, 0, 0.03)',
  border: `1px solid ${isCorrect ? '#81c784' : 'transparent'}`,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.15)' : 'rgba(0, 0, 0, 0.05)',
    transform: 'translateX(4px)',
  },
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1.5),
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }
}));

const IconPulse = styled(Box)(({ theme }) => ({
  animation: `${pulse} 2s infinite`,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const DifficultyChip = ({ difficulty }) => {
  const getColor = (diff) => {
    switch(diff) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Chip 
      label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
      color={getColor(difficulty)}
      size="small"
      sx={{
        fontWeight: 500,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    />
  );
};

const MCQQuestions = () => {
  const [mcqs, setMCQs] = useState([]);
  const [postedMCQs, setPostedMCQs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ open: false, mcqId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchMCQs();
    fetchPostedMCQs();
  }, []);

  const fetchMCQs = async () => {
    try {
      let url;
      if (filter === 'unposted') {
        url = `${API_BASE_URL}/api/mcq/unposted`;
      } else {
        url = `${API_BASE_URL}/api/mcq`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch MCQs: ${response.status}`);
      }
      const data = await response.json();
      setMCQs(data);
    } catch (error) {
      console.error('Error fetching MCQs:', error);
    }
  };

  const fetchPostedMCQs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mcq/posted`);
      if (!response.ok) {
        throw new Error(`Failed to fetch posted MCQs: ${response.status}`);
      }
      const data = await response.json();
      setPostedMCQs(data);
    } catch (error) {
      console.error('Error fetching posted MCQs:', error);
    }
  };

  const handlePost = async (mcqId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mcq/${mcqId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to post MCQ: ${response.status}`);
      }
      
      const postedMCQ = await response.json();
      setPostedMCQs([...postedMCQs, postedMCQ]);
      
      // If we're viewing unposted MCQs, remove it from the list
      if (filter === 'unposted') {
        setMCQs(mcqs.filter(mcq => mcq.id !== mcqId));
      }
      
      setSuccessMessage(`MCQ #${mcqId} has been posted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error posting MCQ:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/mcq/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status}`);
      }
      
      // Update the posted MCQs list
      setPostedMCQs(postedMCQs.filter(post => post.id !== postId));
      
      // If we're viewing all MCQs, refetch to update the list
      if (filter === 'all') {
        fetchMCQs();
      }
      
      setSuccessMessage(`Post #${postId} has been deleted successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    
    // Refetch appropriate data based on filter
    if (newFilter === 'posted') {
      fetchPostedMCQs();
    } else if (newFilter === 'unposted' || newFilter === 'all') {
      fetchMCQs();
    }
  };

  const filteredMCQs = () => {
    let displayMCQs = [];
    
    if (filter === 'posted') {
      displayMCQs = postedMCQs;
    } else {
      displayMCQs = mcqs;
      
      // If filter is unposted, we already fetched only unposted MCQs
      if (filter !== 'unposted') {
        const postedIds = postedMCQs.map(post => post.contentId);
        if (filter === 'posted') {
          displayMCQs = mcqs.filter(mcq => postedIds.includes(mcq.id));
        }
      }
    }
    
    // Apply category filter if not 'all'
    if (category !== 'all') {
      displayMCQs = displayMCQs.filter(mcq => 
        mcq.category === category || (mcq.type === 'mcq' && mcq.category === category)
      );
    }
    
    // Apply difficulty filter if not 'all'
    if (difficulty !== 'all') {
      displayMCQs = displayMCQs.filter(mcq => 
        mcq.difficulty === difficulty || (mcq.type === 'mcq' && mcq.difficulty === difficulty)
      );
    }
    
    return displayMCQs;
  };

  const renderMCQCard = (mcq, index) => {
    // For posted MCQs that come from the posts endpoint
    const isPosted = 'type' in mcq && mcq.type === 'mcq';
    const mcqId = isPosted ? mcq.contentId : mcq.id;
    const question = isPosted ? mcq.content.split('\n\nOptions:')[0] : mcq.question;
    const options = isPosted ? 
      mcq.content.split('\n\nOptions:\n')[1].split('\n').map(opt => opt.substring(3)) : 
      mcq.options;
    const correctAnswer = isPosted ? mcq.answer : mcq.correctAnswer;
    
    // Animation variants for options
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    };
    
    const itemVariants = {
      hidden: { x: -10, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    };
    
    return (
      <QuestionCard index={index}>
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Tooltip title={`Question ID: ${mcqId}`} arrow placement="top-start">
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ 
                  px: 1.5, 
                  py: 0.5,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 119, 181, 0.08)',
                  fontWeight: 600
                }}
              >
                #{mcqId}
              </Typography>
            </Tooltip>
            
            <Box sx={{ display: 'flex', gap: 0.8 }}>
              <DifficultyChip difficulty={mcq.difficulty} />
              <Chip 
                label={mcq.category.charAt(0).toUpperCase() + mcq.category.slice(1)} 
                size="small"
                color={mcq.category === 'javascript' ? 'info' : 'secondary'}
                sx={{
                  fontWeight: 500,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              {isPosted && (
                <Tooltip title="Already posted to LinkedIn" arrow>
                  <IconPulse sx={{ ml: 0.5 }}>
                    <DoneIcon 
                      fontSize="small" 
                      color="success" 
                    />
                  </IconPulse>
                </Tooltip>
              )}
            </Box>
          </Box>
          
          <Typography 
            variant="h6" 
            component="div" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              lineHeight: 1.4,
              color: 'text.primary',
              mb: 2
            }}
          >
            {question}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary', 
              mb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1 
            }}
          >
            <QuizIcon fontSize="small" />
            Options
          </Typography>
          
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mt: 2 }}
          >
            {options.map((option, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <StyledOption 
                  isCorrect={option === correctAnswer}
                  sx={{ mb: 1.5 }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: option === correctAnswer ? 'success.light' : 'action.hover',
                      color: option === correctAnswer ? 'white' : 'text.secondary',
                      fontWeight: 600,
                      mr: 2
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ fontWeight: option === correctAnswer ? 500 : 400 }}
                  >
                    {option}
                  </Typography>
                  {option === correctAnswer && (
                    <DoneIcon 
                      fontSize="small" 
                      color="success" 
                      sx={{ ml: 'auto' }} 
                    />
                  )}
                </StyledOption>
              </motion.div>
            ))}
          </Box>
        </CardContent>
        <CardActions sx={{ px: 3, pb: 2 }}>
          {isPosted ? (
            <Button 
              startIcon={<DeleteIcon />} 
              color="error" 
              variant="outlined"
              size="medium"
              onClick={() => setDeleteDialog({ open: true, postId: mcq.id })}
              sx={{
                borderRadius: 4,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 3px 8px rgba(244, 67, 54, 0.2)',
                }
              }}
            >
              Remove Post
            </Button>
          ) : (
            <Button 
              startIcon={<PostAddIcon />} 
              color="primary" 
              variant="contained"
              size="medium"
              onClick={() => setConfirmDialog({ open: true, mcqId: mcq.id })}
              sx={{
                borderRadius: 4,
                px: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0, 119, 181, 0.25)',
                }
              }}
            >
              Post to LinkedIn
            </Button>
          )}
        </CardActions>
      </QuestionCard>
    );
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showFilters, setShowFilters] = useState(!isMobile);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, md: 4 }, 
        mb: { xs: 2, md: 4 },
        px: { xs: 1.5, sm: 3 }
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box 
          display="flex" 
          alignItems="center" 
          flexWrap="wrap"
          mb={3}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Box 
            display="flex" 
            alignItems="center"
            sx={{
              background: 'linear-gradient(90deg, rgba(0, 119, 181, 0.08) 0%, rgba(0, 119, 181, 0) 100%)',
              px: 2,
              py: 1,
              borderRadius: 4,
              mb: { xs: 1, sm: 0 }
            }}
          >
            <QuizIcon 
              sx={{ 
                fontSize: { xs: 28, md: 32 }, 
                mr: 1.5,
                color: 'primary.main' 
              }} 
            />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                background: 'linear-gradient(45deg, #0077b5 30%, #00a0dc 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MCQ Questions
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: { xs: 0, sm: 2 }
            }}
          >
            <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
              <IconButton 
                onClick={toggleFilters}
                sx={{ 
                  ml: 1,
                  backgroundColor: 'rgba(0, 119, 181, 0.08)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 119, 181, 0.15)',
                  }
                }}
              >
                {showFilters ? <FilterListOffIcon /> : <FilterListIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </motion.div>
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success" 
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      
      <Collapse in={showFilters} timeout={300}>
        <FilterContainer 
          component={motion.div}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <FormControl 
            sx={{ 
              width: { xs: '100%', sm: 200 },
              minWidth: { xs: '100%', sm: 200 } 
            }} 
            size="small"
          >
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filter">
              <MenuItem value="all">All Questions</MenuItem>
              <MenuItem value="posted">Posted Questions</MenuItem>
              <MenuItem value="unposted">Unposted Questions</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl 
            sx={{ 
              width: { xs: '100%', sm: 200 },
              minWidth: { xs: '100%', sm: 200 } 
            }} 
            size="small"
          >
            <InputLabel>Category</InputLabel>
            <Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="javascript">JavaScript</MenuItem>
              <MenuItem value="react">React</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl 
            sx={{ 
              width: { xs: '100%', sm: 200 },
              minWidth: { xs: '100%', sm: 200 } 
            }} 
            size="small"
          >
            <InputLabel>Difficulty</InputLabel>
            <Select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)} 
              label="Difficulty"
            >
              <MenuItem value="all">All Difficulties</MenuItem>
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </FilterContainer>
      </Collapse>
      
      <Grid 
        container 
        spacing={3}
        sx={{ mt: { xs: 1, sm: 2 } }}
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {filteredMCQs().map((mcq, index) => (
          <Grid 
            item 
            key={index} 
            xs={12} 
            sm={6} 
            lg={4}
            component={motion.div}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.5 }
              }
            }}
          >
            {renderMCQCard(mcq, index)}
          </Grid>
        ))}
        
        {filteredMCQs().length === 0 && (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                textAlign: 'center',
                bgcolor: 'background.paper',
                borderRadius: theme.shape.borderRadius * 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                mt: 2
              }}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <QuizIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                No MCQ questions found matching your criteria
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Try adjusting your filters to see more results
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      
      {/* Confirmation Dialog for Posting */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, mcqId: null })}
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 8,
          sx: { 
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PostAddIcon />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Confirm Post to LinkedIn
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Typography variant="body1">
            Are you sure you want to post this MCQ question to LinkedIn?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This will schedule the post to be published on your LinkedIn account.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            startIcon={<CancelIcon />}
            onClick={() => setConfirmDialog({ open: false, mcqId: null })} 
            color="inherit"
            sx={{ 
              borderRadius: 4,
              px: 2,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            startIcon={<PostAddIcon />}
            onClick={() => {
              handlePost(confirmDialog.mcqId);
              setConfirmDialog({ open: false, mcqId: null });
            }} 
            color="primary"
            variant="contained"
            autoFocus
            sx={{ 
              borderRadius: 4,
              px: 2,
              py: 1,
              boxShadow: '0 4px 10px rgba(0, 119, 181, 0.25)',
            }}
          >
            Post to LinkedIn
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, postId: null })}
        TransitionComponent={Zoom}
        PaperProps={{
          elevation: 8,
          sx: { 
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: 'error.main', 
            color: 'white',
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DeleteIcon />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Confirm Deletion
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Typography variant="body1">
            Are you sure you want to delete this posted MCQ?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will only remove the post from your local database. It will not remove the content from LinkedIn if it has already been shared.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            startIcon={<CancelIcon />}
            onClick={() => setDeleteDialog({ open: false, postId: null })} 
            color="inherit"
            sx={{ 
              borderRadius: 4,
              px: 2,
              py: 1
            }}
          >
            Cancel
          </Button>
          <Button 
            startIcon={<DeleteIcon />}
            onClick={() => {
              handleDelete(deleteDialog.postId);
              setDeleteDialog({ open: false, postId: null });
            }} 
            color="error"
            variant="contained"
            autoFocus
            sx={{ 
              borderRadius: 4,
              px: 2,
              py: 1,
              boxShadow: '0 4px 10px rgba(244, 67, 54, 0.25)',
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MCQQuestions;

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import PostHistory from './components/PostHistory';
import CreatePost from './components/CreatePost';
import Settings from './components/Settings';
import MCQQuestions from './components/MCQQuestions';
import AnimationProvider from './components/AnimationProvider';
import { getPostHistory } from './services/apiService';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPostHistory();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load post history. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Page transition variants
  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <AnimationProvider>
      <Box sx={{ 
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <Navbar />
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 }, 
            mt: 8,
            overflow: 'hidden'
          }}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  key="dashboard"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  transition={{ duration: 0.4 }}
                >
                  <Dashboard posts={posts} loading={loading} error={error} />
                </motion.div>
              } />
              <Route path="/history" element={
                <motion.div
                  key="history"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  transition={{ duration: 0.4 }}
                >
                  <PostHistory posts={posts} loading={loading} error={error} />
                </motion.div>
              } />
              <Route path="/create" element={
                <motion.div
                  key="create"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  transition={{ duration: 0.4 }}
                >
                  <CreatePost />
                </motion.div>
              } />
              <Route path="/mcq" element={
                <motion.div
                  key="mcq"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  transition={{ duration: 0.4 }}
                >
                  <MCQQuestions />
                </motion.div>
              } />
              <Route path="/settings" element={
                <motion.div
                  key="settings"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageTransition}
                  transition={{ duration: 0.4 }}
                >
                  <Settings />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </Box>
      </Box>
    </AnimationProvider>
  );
}

export default App;

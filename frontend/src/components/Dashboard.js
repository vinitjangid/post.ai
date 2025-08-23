import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, BarElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components for enhanced UI
const AnimatedPaper = styled(Paper)(({ theme, delay = 0 }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 28px rgba(0,0,0,0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #0077b5, #00a0dc)',
    transform: 'scaleX(0)',
    transformOrigin: 'left',
    transition: 'transform 0.3s ease',
  },
  '&:hover::before': {
    transform: 'scaleX(1)',
  }
}));

const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #0077b5 30%, #00a0dc 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)'
  }
}));

ChartJS.register(
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ posts, loading, error }) => {
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
  
  // Count posts by category
  const jsTips = posts.filter(post => post.category === 'javascript').length;
  const reactTips = posts.filter(post => post.category === 'react').length;
  
  // Count posts by month (last 6 months)
  const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse();
  
  const postsByMonth = lastSixMonths.map(month => {
    return posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate.toLocaleString('default', { month: 'short' }) === month;
    }).length;
  });
  
  // Data for the charts
  const categoryData = {
    labels: ['JavaScript', 'React'],
    datasets: [
      {
        label: 'Posts by Category',
        data: [jsTips, reactTips],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const monthlyData = {
    labels: lastSixMonths,
    datasets: [
      {
        label: 'Posts per Month',
        data: postsByMonth,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showCharts, setShowCharts] = useState(false);

  // Animate charts after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCharts(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants for motion components
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
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
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            mb: 3, 
            fontWeight: 600,
            fontSize: { xs: '1.8rem', md: '2.4rem' },
            background: 'linear-gradient(45deg, #0077b5 30%, #00a0dc 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Analytics Dashboard
        </Typography>
      </motion.div>
      
      <Grid 
        container 
        spacing={3} 
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <AnimatedPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: { xs: 200, md: 240 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: 'text.secondary',
                letterSpacing: '0.5px'
              }}
            >
              Total Posts
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flex: 1 
              }}
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
            >
              <StatValue variant="h2">
                {posts.length}
              </StatValue>
            </Box>
          </AnimatedPaper>
        </Grid>
        
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <AnimatedPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: { xs: 200, md: 240 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: 'text.secondary',
                letterSpacing: '0.5px'
              }}
            >
              JavaScript Tips
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flex: 1 
              }}
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
            >
              <StatValue variant="h2" sx={{ color: theme.palette.secondary.main }}>
                {jsTips}
              </StatValue>
            </Box>
          </AnimatedPaper>
        </Grid>
        
        <Grid item xs={12} md={4} component={motion.div} variants={itemVariants}>
          <AnimatedPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', height: { xs: 200, md: 240 } }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: 'text.secondary',
                letterSpacing: '0.5px'
              }}
            >
              React Tips
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flex: 1 
              }}
              component={motion.div}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            >
              <StatValue variant="h2" sx={{ color: '#00a0dc' }}>
                {reactTips}
              </StatValue>
            </Box>
          </AnimatedPaper>
        </Grid>
        
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <AnimatedPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: { xs: 300, md: 350 } }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              component="div" 
              align="center"
              sx={{ 
                fontWeight: 500,
                mb: 2,
                color: 'text.secondary',
                letterSpacing: '0.5px'
              }}
            >
              Posts by Category
            </Typography>
            <Box 
              sx={{ 
                height: 250, 
                mt: 2, 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {showCharts && (
                <motion.div 
                  style={{ width: '100%', height: '100%' }}
                  initial={{ opacity: 0, rotateY: -30 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Doughnut data={categoryData} options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    },
                    animation: {
                      animateScale: true,
                      animateRotate: true
                    }
                  }} />
                </motion.div>
              )}
            </Box>
          </AnimatedPaper>
        </Grid>
        
        <Grid item xs={12} md={6} component={motion.div} variants={itemVariants}>
          <AnimatedPaper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: { xs: 300, md: 350 } }}>
            <Typography 
              variant="h6" 
              gutterBottom 
              component="div" 
              align="center"
              sx={{ 
                fontWeight: 500,
                mb: 2,
                color: 'text.secondary',
                letterSpacing: '0.5px'
              }}
            >
              Posts by Month
            </Typography>
            <Box sx={{ height: 250 }}>
              {showCharts && (
                <motion.div 
                  style={{ width: '100%', height: '100%' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Bar 
                    data={monthlyData} 
                    options={{ 
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1
                          }
                        }
                      },
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      },
                      animation: {
                        delay: 500,
                        duration: 1000
                      }
                    }} 
                  />
                </motion.div>
              )}
            </Box>
          </AnimatedPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

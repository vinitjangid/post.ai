import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import QuizIcon from '@mui/icons-material/Quiz';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

// Styled components for animations
const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '4px 8px',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 119, 181, 0.08)',
    transform: 'translateX(4px)'
  },
  ...(active && {
    backgroundColor: 'rgba(0, 119, 181, 0.12)',
    '&:hover': {
      backgroundColor: 'rgba(0, 119, 181, 0.15)',
    }
  })
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'rotate(90deg)'
  }
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Post History', icon: <HistoryIcon />, path: '/history' },
  { text: 'Create Post', icon: <AddIcon />, path: '/create' },
  { text: 'Instagram Post', icon: <InstagramIcon sx={{ color: '#E1306C' }} />, path: '/instagram' },
  { text: 'MCQ Questions', icon: <QuizIcon />, path: '/mcq' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState([]);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Animation effect for menu items
  useEffect(() => {
    // Animate menu items one by one
    const animateItems = async () => {
      const newItems = [];
      for (let i = 0; i < menuItems.length; i++) {
        newItems.push(menuItems[i]);
        setDrawerItems([...newItems]);
        if (isMobile && !mobileOpen) continue; // Skip animation if drawer is closed on mobile
        await new Promise(r => setTimeout(r, 100)); // Stagger the animation
      }
    };
    
    animateItems();
  }, [mobileOpen, isMobile]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
        <LogoContainer>
          <LinkedInIcon sx={{ 
            mr: 1, 
            color: 'primary.main',
            fontSize: '2rem' 
          }} />
          <Typography 
            variant="h6" 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: 'linear-gradient(45deg, #0077b5 30%, #00a0dc 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            JS Tips Poster
          </Typography>
        </LogoContainer>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle} 
            sx={{ 
              marginLeft: 'auto',
              transition: 'transform 0.3s ease' 
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      
      <List sx={{ width: '100%', overflowY: 'auto', px: 1, mt: 1 }}>
        {drawerItems.map((item, index) => (
          <Fade key={item.text} in={true} timeout={300 + index * 100}>
            <StyledListItem
              disablePadding 
              component={Link} 
              to={item.path} 
              active={location.pathname === item.path ? 1 : 0}
              sx={{ 
                color: 'inherit',
                textDecoration: 'none',
                borderLeft: location.pathname === item.path ? '4px solid' : '0px solid',
                borderColor: 'primary.main',
              }}
            >
              <ListItemButton sx={{ borderRadius: 1 }}>
                <ListItemIcon 
                  sx={{ 
                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                    transition: 'transform 0.2s ease, color 0.2s ease',
                    transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      transition: 'font-weight 0.2s ease',
                    }
                  }}
                />
              </ListItemButton>
            </StyledListItem>
          </Fade>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #0077b5 0%, #0a66c2 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        elevation={2}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnimatedIconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </AnimatedIconButton>
            
            <Fade in={true} timeout={800}>
              <LogoContainer sx={{ display: 'flex', alignItems: 'center' }}>
                <LinkedInIcon sx={{ 
                  display: { xs: 'block', sm: 'block' }, 
                  mr: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' } 
                }} />
                <Typography 
                  variant="h6" 
                  noWrap 
                  component="div"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    letterSpacing: '0.5px'
                  }}
                >
                  LinkedIn JS Tips Poster
                </Typography>
              </LogoContainer>
            </Fade>
          </Box>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            {/* You can add action buttons here in the future */}
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRadius: { xs: '0 16px 16px 0' },
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '1px 0 10px rgba(0, 0, 0, 0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from '../shared/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLink from '../shared/NavigationLink';
import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate(); // <-- Added useNavigate
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    if (auth?.logout) {
      auth.logout();
    }
    navigate("/"); // <-- Redirects to home after logout
  };

  return (
    <AppBar position="static" sx={{ 
      bgcolor: 'rgba(17, 29, 39, 0.85)', 
      backdropFilter: 'blur(8px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Logo />

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              PaperProps={{
                sx: {
                  bgcolor: 'var(--primary-dark)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                }
              }}
            >
              {auth?.isLoggedIn ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 252, 0.1)' } }}>
                    <Typography textAlign="center" component="a" href="/chat" sx={{ textDecoration: 'none', color: 'inherit' }}>
                      Chat
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b', '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' } }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 252, 0.1)' } }}>
                    <Typography textAlign="center" component="a" href="/login" sx={{ textDecoration: 'none', color: 'inherit' }}>
                      Login
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 252, 0.1)' } }}>
                    <Typography textAlign="center" component="a" href="/signup" sx={{ textDecoration: 'none', color: 'inherit' }}>
                      Signup
                    </Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        )}

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink 
                bg="var(--primary-color)" 
                to="/chat" 
                text="Chat" 
                textColor="white"
                hoverBg="var(--primary-light)"
              />
              <Box sx={{ ml: 2 }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'var(--accent-color)', 
                        color: 'black',
                        fontWeight: 700,
                      }}
                    >
                      {auth?.user?.name ? auth.user.name[0].toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      bgcolor: 'var(--primary-dark)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {auth?.user?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="var(--text-muted)" sx={{ mb: 1 }}>
                      {auth?.user?.email}
                    </Typography>
                  </Box>
                  <MenuItem onClick={handleCloseUserMenu} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 252, 0.1)' } }}>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu} sx={{ '&:hover': { bgcolor: 'rgba(0, 255, 252, 0.1)' } }}>
                    <Typography textAlign="center">Settings</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout} sx={{ color: '#ff6b6b', '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' } }}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <>
              <NavigationLink 
                to="/login" 
                text="Login" 
                bg="var(--primary-color)" 
                textColor="white" 
              />
              <NavigationLink 
                to="/signup" 
                text="Sign Up" 
                bg="var(--primary-color)" 
                textColor="white" 
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

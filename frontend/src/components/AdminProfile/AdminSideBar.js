import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';
import { sidebarMenuConfig } from '../siderBar/sidebarConfig';
import imageUrl from '../../utils/imageUrl';

const drawerWidth = 280;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background:
      'linear-gradient(165deg, #F5F7FA 0%, #E3F2FD 50%, #F5F7FA 100%)',
    borderRight: '1px solid rgba(74, 144, 226, 0.15)',
    color: '#2D3748',
    backdropFilter: 'blur(20px)',
  },
}));

const UserProfile = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(74, 144, 226, 0.15)',
  position: 'relative',
}));

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderBottom: '1px solid rgba(74, 144, 226, 0.15)',
  background: 'rgba(255, 255, 255, 0.8)',
}));

const StyledListItem = styled(ListItemButton)(({ theme }) => ({
  margin: '6px 12px',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  minHeight: '48px',
  '&:hover': {
    backgroundColor: 'rgba(74, 144, 226, 0.08)',
    transform: 'translateX(4px)',
    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.15)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    '&:hover': {
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
    },
    '& .MuiListItemIcon-root': {
      color: '#4A90E2',
    },
    '& .MuiListItemText-primary': {
      color: '#2D3748',
      fontWeight: 600,
    },
  },
}));

const AdminSideBar = ({ open, onClose, selectedItem, onItemSelect, user }) => {
  // Lấy các mục menu chỉ dành cho ADMIN
  const adminMenuItems = sidebarMenuConfig.filter((item) =>
    item.roles.includes('ADMIN')
  );

  return (
    <StyledDrawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        display: { xs: open ? 'block' : 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          position: { xs: 'fixed', md: 'relative' },
          zIndex: { xs: 1300, md: 'auto' },
        },
      }}
    >
      {/* Header with close button for mobile */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Healthcare
        </Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Logo Section for Desktop */}
      <LogoSection sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4A90E2, #1ABC9C)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Healthcare
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#607D8B',
            fontSize: '12px',
          }}
        >
          Gender Healthcare Service
        </Typography>
      </LogoSection>

      {/* User Profile Section */}
      <UserProfile>
        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
          <Avatar
            src={
              user?.avatar ? imageUrl.getFullImageUrl(user.avatar) : undefined
            }
            alt={user?.fullName || 'User'}
            sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              margin: '0 auto',
              background: 'linear-gradient(135deg, #4A90E2, #1ABC9C)',
              fontSize: { xs: '24px', md: '32px' },
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)',
              border: '3px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            {!user?.avatar
              ? user?.fullName?.[0] || user?.email?.[0] || 'U'
              : null}
          </Avatar>
        </Box>
        <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
          {user?.fullName || 'Admin'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user?.email || ''}
        </Typography>
      </UserProfile>

      {/* Menu List */}
      <List sx={{ mt: 2 }}>
        {adminMenuItems.map((item) => (
          <StyledListItem
            key={item.id}
            selected={selectedItem === item.id}
            onClick={() => onItemSelect(item.id)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </StyledListItem>
        ))}
      </List>
    </StyledDrawer>
  );
};

export default AdminSideBar;

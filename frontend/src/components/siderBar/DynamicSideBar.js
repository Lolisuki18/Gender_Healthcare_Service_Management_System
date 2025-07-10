import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  Collapse,
  IconButton,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
} from '@mui/icons-material';
import { sidebarMenuConfig } from './sidebarConfig';
import { useUser } from '@/context/UserContext';
import imageUrl from '../../utils/imageUrl';

// Constants
const drawerWidth = 280;

// Styled Components giống CustomerSideBar.js
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

const LogoSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderBottom: '1px solid rgba(74, 144, 226, 0.15)',
  background: 'rgba(255, 255, 255, 0.8)',
}));

const DynamicSideBar = ({ open, onClose, selectedItem, onItemSelect }) => {
  const { user } = useUser();
  const [expandedItems, setExpandedItems] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const userRole = user?.role || 'CUSTOMER';

  // Lọc menu theo role
  const menuItems = sidebarMenuConfig.filter((item) =>
    item.roles.includes(userRole)
  );

  // Handler để toggle sub-menu expansion (nếu có subItems)
  const handleExpandClick = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Force refresh avatar nếu cần
  const forceRefresh = () => setRefreshKey((old) => old + 1);

  // Đổi role sang tiếng Việt nếu là CUSTOMER
  const getRoleLabel = (role) => {
    switch (role) {
      case 'CUSTOMER':
        return 'Khách hàng';
      case 'ADMIN':
        return 'Quản trị viên';
      case 'STAFF':
        return 'Nhân viên';
      case 'CONSULTANT':
        return 'Tư vấn viên';
      default:
        return role;
    }
  };

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
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/img/avatar/default.jpg';
            }}
            alt={user?.fullName || 'User'}
            imgProps={{
              loading: 'eager',
              key: `sidebar-avatar-${Date.now()}-${refreshKey}`,
              onError: () => forceRefresh(),
              onLoad: () => {},
            }}
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
          <Box
            sx={{
              position: 'absolute',
              bottom: -2,
              right: '50%',
              transform: 'translateX(50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#fff',
              }}
            />
          </Box>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            fontSize: { xs: '16px', md: '18px' },
            color: '#2D3748',
          }}
        >
          {user?.fullName || 'Người dùng'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#4A5568',
            fontSize: '13px',
            mb: 1,
            wordBreak: 'break-all',
          }}
        >
          {user?.email || 'email@example.com'}
        </Typography>
        <Chip
          label={getRoleLabel(userRole)}
          size="small"
          sx={{
            background: 'linear-gradient(45deg, #4CAF50, #2ECC71)',
            color: '#fff',
            fontWeight: 500,
            fontSize: '11px',
            height: '24px',
            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.25)',
          }}
        />
      </UserProfile>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <StyledListItem
                selected={selectedItem === item.id}
                onClick={() => {
                  if (item.subItems) {
                    handleExpandClick(item.id);
                  } else {
                    onItemSelect(item.id);
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    color: selectedItem === item.id ? '#4A90E2' : '#4A5568',
                    minWidth: 40,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                      fontWeight: selectedItem === item.id ? 600 : 500,
                      color: selectedItem === item.id ? '#2D3748' : '#4A5568',
                      transition: 'all 0.3s ease',
                    },
                  }}
                />
                {item.subItems && (
                  <Box sx={{ color: '#4A5568' }}>
                    {expandedItems[item.id] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </StyledListItem>
            </ListItem>
            {/* Sub Items */}
            {item.subItems && (
              <Collapse
                in={expandedItems[item.id]}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <StyledListItem
                        selected={selectedItem === subItem.id}
                        onClick={() => {
                          onItemSelect(subItem.id);
                          if (window.innerWidth < 900) {
                            onClose();
                          }
                        }}
                        sx={{
                          pl: 6,
                          ml: 1,
                          mr: 1,
                          borderLeft:
                            selectedItem === subItem.id
                              ? '2px solid #3b82f6'
                              : '2px solid transparent',
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color:
                              selectedItem === subItem.id
                                ? '#4A90E2'
                                : '#4A5568',
                            minWidth: 40,
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.label}
                          sx={{
                            '& .MuiTypography-root': {
                              fontSize: '13px',
                              fontWeight:
                                selectedItem === subItem.id ? 600 : 400,
                              color:
                                selectedItem === subItem.id
                                  ? '#2D3748'
                                  : '#4A5568',
                              transition: 'all 0.3s ease',
                            },
                          }}
                        />
                      </StyledListItem>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mx: 2 }} />
    </StyledDrawer>
  );
};

export default DynamicSideBar;

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  useTheme,
  Collapse,
  ListItemButton,
  Avatar,
  Button,
  Tooltip,
  alpha,
  IconButton,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  SportsEsports as GamesIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  AccountCircle as AdminIcon,
  Money as MoneyIcon,
  Receipt as BettingIcon,
  Calculate as CalculationIcon,
  CurrencyExchange as DepositIcon,
  EmojiEvents as GameResultIcon,
  Headset as CustomerServiceIcon,
  ForumOutlined as BoardIcon,
  Casino as GameSettingIcon,
  Web as SiteSettingIcon,
  ListAlt as LogIcon,
  Person,
  ChevronRight,
  ViewSidebar as ViewSidebarIcon,
  ViewStream as ViewStreamIcon,
  DesignServices as TemplateIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { selectSidebarMode, toggleSidebarMode } from '../../features/ui/uiSlice';
import { menuItems } from '../../config/menuConfig';
import '../../styles/sidebar.css';

// 메뉴 아이템정의는 menuConfig.jsx에서 import하여 사용

/**
 * 사이드바 컴포넌트
 * 
 * @param {Object} props
 * @param {Window} props.window - 창 객체
 * @param {boolean} props.mobileOpen - 모바일에서 사이드바 열림 상태
 * @param {Function} props.handleDrawerToggle - 사이드바 토글 함수
 * @returns {React.ReactElement} 사이드바 컴포넌트
 */
const Sidebar = ({ window, mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarMode = useSelector(selectSidebarMode);
  
  // 현재 열린 메뉴 상태 관리
  const [openMenus, setOpenMenus] = useState({});
  const [menuSettings, setMenuSettings] = useState(() => {
    // 초기값으로 localStorage에서 바로 로드
    const stored = localStorage.getItem('menuSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse menu settings:', e);
        return {};
      }
    }
    return {};
  });
  const [isMenuSettingsLoaded, setIsMenuSettingsLoaded] = useState(true); // 초기 로드 완료 상태

  // localStorage에서 메뉴 설정 불러오기
  const loadMenuSettings = () => {
    const stored = localStorage.getItem('menuSettings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse menu settings:', e);
        return {};
      }
    }
    return {};
  };

  // 메뉴 설정 업데이트 리스너
  useEffect(() => {
    const handleMenuSettingsUpdate = () => {
      setMenuSettings(loadMenuSettings());
    };

    // 초기 로드는 useState에서 이미 처리했으므로 제거

    // 이벤트 리스너 등록 (전역 window 객체 사용)
    if (typeof window !== 'undefined') {
      window.addEventListener('menuSettingsUpdated', handleMenuSettingsUpdate);

      return () => {
        window.removeEventListener('menuSettingsUpdated', handleMenuSettingsUpdate);
      };
    }
  }, []);

  // 메뉴 아이템이 활성화되어 있는지 확인
  const isMenuEnabled = (menuId, parentId = null) => {
    const key = parentId ? `${parentId}.${menuId}` : menuId;
    const setting = menuSettings[key];
    // 설정이 존재하고 enabled가 false인 경우만 false 반환
    if (setting && setting.enabled === false) {
      return false;
    }
    return true;
  };
  
  // 현재 경로에 따라 활성화된 메뉴 찾기
  const findActiveParent = (items) => {
    for (const item of items) {
      // 비활성화된 메뉴는 건너뛰기
      if (item.id && !item.isSpecial && !isMenuEnabled(item.id)) {
        continue;
      }
      if (item.path && location.pathname === item.path) {
        return item.text;
      }
      if (item.children) {
        for (const child of item.children) {
          // 비활성화된 자식 메뉴는 건너뛰기
          if (child.id && !isMenuEnabled(child.id, item.id)) {
            continue;
          }
          if (location.pathname === child.path) {
            return item.text;
          }
        }
      }
    }
    return null;
  };
  
  // 초기 열린 메뉴 설정
  React.useEffect(() => {
    const activeParent = findActiveParent(menuItems);
    if (activeParent) {
      setOpenMenus({
        [activeParent]: true
      });
    } else {
      // 활성화된 메뉴가 없으면 모든 메뉴를 닫음
      setOpenMenus({});
    }
  }, [location.pathname]);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleMenuItemClick = (item) => {
    if (item.id === 'logout') {
      handleLogout();
    } else if (item.path && !item.children) {
      navigate(item.path);
    }
  };
  
  // 필터링된 메뉴 아이템 (비활성화된 메뉴 제외)
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      // isSpecial 메뉴는 항상 표시
      if (item.isSpecial) return true;
      // id가 없는 메뉴는 표시
      if (!item.id) return true;
      // 설정 확인
      return isMenuEnabled(item.id);
    }).map(item => {
      // 자식 메뉴도 필터링
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => {
            if (!child.id) return true;
            return isMenuEnabled(child.id, item.id);
          })
        };
      }
      return item;
    });
  }, [menuSettings]);
  
  const handleMenuToggle = (menuText) => {
    setOpenMenus(prev => {
      // 다른 메뉴를 클릭했을 때 이전에 열려있던 모든 메뉴를 닫고 현재 클릭한 메뉴만 토글
      const newState = {};
      // 현재 클릭한 메뉴의 상태만 토글
      newState[menuText] = !prev[menuText];
      return newState;
    });
  };

  const handleSidebarModeToggle = () => {
    dispatch(toggleSidebarMode());
  };
  
  // 중첩된 메뉴 아이템 렌더링 (세로 모드)
  const NestedMenuItem = ({ item, level = 0 }) => {
    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openMenus[item.text] || false;
    
    // 메뉴가 활성화되어 있는지 확인 (isSpecial 메뉴는 항상 표시)
    if (item.id && !item.isSpecial && !isMenuEnabled(item.id)) {
      return null;
    }
    
    // 자식 항목 중 현재 경로와 일치하는 항목이 있는지 확인
    const hasActiveChild = hasChildren && item.children.some(child => location.pathname === child.path);
    
    return (
      <>
        <ListItemButton
          component={item.path && !hasChildren && item.id !== 'logout' ? Link : 'div'}
          to={item.path && !hasChildren && item.id !== 'logout' ? item.path : undefined}
          onClick={() => {
            if (item.id === 'logout') {
              handleLogout();
            } else if (hasChildren) {
              handleMenuToggle(item.text);
            }
          }}
          sx={{
            pl: level * 2 + 2,
            py: 1.5,
            borderRadius: '8px',
            mb: 0.5,
            backgroundColor: (isActive || hasActiveChild) ? 'rgba(54, 153, 255, 0.1)' : 'transparent',
            color: (isActive || hasActiveChild) ? '#3699FF' : '#5e6278',
            '&:hover': {
              backgroundColor: 'rgba(54, 153, 255, 0.05)',
            },
            mx: 1,
          }}
        >
          {item.icon && (
            <ListItemIcon 
              sx={{ 
                minWidth: 36, 
                color: (isActive || hasActiveChild) ? '#3699FF' : '#5e6278',
                '& .MuiSvgIcon-root': {
                  fontSize: '20px'
                }
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText 
            primary={item.text} 
            primaryTypographyProps={{ 
              fontSize: '14px',
              fontWeight: (isActive || hasActiveChild) ? 600 : 500,
            }}
          />
          {hasChildren && (
            <Box
              sx={{
                transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            >
              {isOpen ? <ExpandLess /> : <ExpandMore />}
            </Box>
          )}
        </ListItemButton>
        
        {hasChildren && (
          <Collapse 
            in={isOpen} 
            timeout={600}
            unmountOnExit
            sx={{
              '& .MuiList-root': {
                transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }
            }}
          >
            <List component="div" disablePadding>
              {item.children.map((child, index) => (
                <ListItemButton
                  key={index}
                  component={Link}
                  to={child.path}
                  sx={{
                    pl: (level + 1) * 2 + 2,
                    py: 1.25,
                    borderRadius: '8px',
                    mb: 0.5,
                    backgroundColor: location.pathname === child.path ? 'rgba(54, 153, 255, 0.1)' : 'transparent',
                    color: location.pathname === child.path ? '#3699FF' : '#5e6278',
                    '&:hover': {
                      backgroundColor: 'rgba(54, 153, 255, 0.05)',
                    },
                    mx: 1,
                    transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    opacity: 1,
                    transform: 'translateX(0)',
                    animation: isOpen ? 'fadeInLeft 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 36, 
                      color: location.pathname === child.path ? '#3699FF' : '#5e6278',
                    }}
                  >
                    <ChevronRight sx={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={child.text} 
                    primaryTypographyProps={{ 
                      fontSize: '13px',
                      fontWeight: location.pathname === child.path ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  // 가로 모드 메뉴 아이템 렌더링
  const HorizontalMenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const hasActiveChild = hasChildren && item.children.some(child => location.pathname === child.path);
    
    // 메뉴가 활성화되어 있는지 확인 (isSpecial 메뉴는 항상 표시)
    if (item.id && !item.isSpecial && !isMenuEnabled(item.id)) {
      return null;
    }
    
    // 메뉴 아이템 클릭 핸들러
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    
    const handleClick = (event) => {
      if (item.id === 'logout') {
        handleLogout();
      } else if (hasChildren) {
        setAnchorEl(event.currentTarget);
      } else if (item.path) {
        navigate(item.path);
      }
    };
    
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    return (
      <Box>
        <Tooltip title={item.text}>
          <ListItemButton
            onClick={handleClick}
            sx={{
              borderRadius: '8px',
              mx: -2,
              px: 1.5,
              py: 1,
              minWidth: '20px',
              backgroundColor: (isActive || hasActiveChild) ? 'rgba(54, 153, 255, 0.1)' : 'transparent',
              color: (isActive || hasActiveChild) ? '#3699FF' : '#5e6278',
              '&:hover': {
                backgroundColor: 'rgba(54, 153, 255, 0.05)',
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              height: '45px',
            }}
          >
            {item.icon && (
              <ListItemIcon 
                sx={{ 
                  minWidth: 'auto',
                  color: (isActive || hasActiveChild) ? '#3699FF' : '#5e6278',
                  '& .MuiSvgIcon-root': {
                    fontSize: '22px'
                  },
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 0.5,
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '11px',
                fontWeight: (isActive || hasActiveChild) ? 600 : 500,
                mt: 0.2,
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {item.text}
            </Typography>
          </ListItemButton>
        </Tooltip>
        
        {/* 서브메뉴 */}
        {hasChildren && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                borderRadius: '8px',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  fontSize: '14px',
                  fontWeight: 500,
                },
              },
            }}
          >
            {item.children.map((child, index) => (
              <MenuItem 
                key={index} 
                onClick={() => {
                  handleClose();
                  if (child.path) navigate(child.path);
                }}
                sx={{
                  color: location.pathname === child.path ? '#3699FF' : '#5e6278',
                  backgroundColor: location.pathname === child.path ? 'rgba(54, 153, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(54, 153, 255, 0.05)',
                  },
                }}
              >
                {child.icon && (
                  <ListItemIcon sx={{ color: location.pathname === child.path ? '#3699FF' : '#5e6278', minWidth: '30px' }}>
                    {child.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={child.text} />
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>
    );
  };
  
  // 세로 모드 드로어 컨텐츠
  const verticalDrawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 사이드바 헤더 */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid #eff2f5',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#181c32',
            fontSize: '18px',
          }}
        >
          관리자 대시보드
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleSidebarModeToggle}
          sx={{ 
            color: '#5e6278',
            '&:hover': {
              backgroundColor: 'rgba(54, 153, 255, 0.05)',
            }
          }}
        >
          <ViewStreamIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {/* 사용자 프로필 */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          p: 3,
          borderBottom: '1px solid #eff2f5',
        }}
      >
        <Avatar 
          sx={{ 
            width: 80, 
            height: 80, 
            mb: 2,
            border: '3px solid #e4e6ef',
          }}
          alt="Admin User"
          src="/static/images/avatar/1.jpg"
        />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 600, 
            color: '#181c32',
            fontSize: '16px',
          }}
        >
          관리자
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#a1a5b7',
            fontSize: '13px',
            mb: 2,
          }}
        >
          admin@example.com
        </Typography>
        <IconButton 
          size="medium"
          onClick={handleLogout}
          sx={{ 
            color: '#7e8299',
            border: '1px solid #e4e6ef',
            p: 1,
            '&:hover': {
              backgroundColor: '#f5f8fa',
              borderColor: '#d6d6e0'
            }
          }}
        >
          <LogoutIcon />
        </IconButton>
      </Box>
      
      {/* 메뉴 리스트 */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          px: 1.5,
          py: 2,
        }}
      >
        <List component="nav" disablePadding>
          {filteredMenuItems.map((item, index) => (
            <NestedMenuItem key={index} item={item} />
          ))}
        </List>
      </Box>
      
      {/* 사이드바 푸터 */}
      <Box 
        sx={{ 
          p: 2, 
          borderTop: '1px solid #eff2f5',
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: '#a1a5b7',
            fontSize: '12px',
          }}
        >
          © 2025 NEWMOON ADMIN
        </Typography>
      </Box>
    </Box>
  );

  // 가로 모드 컨텐츠
  const horizontalContent = (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        className="css-sidebar"
        sx={{ 
          boxShadow: 'none',
          backgroundColor: 'transparent',
          borderBottom: '1px solid #eff2f5',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '50px', py: 0.5, px: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            justifyContent: 'center',
            my: 0.5,
          }}>
            <Box sx={{ 
              display: 'flex', 
              overflowX: 'visible', 
              py: 0.5,
              minHeight: '40px',
              px: 1.5,
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 0.5,
            }} className="horizontal-menu">
              {filteredMenuItems.map((item, index) => (
                <HorizontalMenuItem key={index} item={item} />
              ))}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              size="small" 
              onClick={handleSidebarModeToggle}
              sx={{ 
                color: '#5e6278',
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(54, 153, 255, 0.05)',
                }
              }}
            >
              <ViewSidebarIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="medium"
              onClick={handleLogout}
              sx={{ 
                color: '#7e8299',
                border: '1px solid #e4e6ef',
                p: 1,
                '&:hover': {
                  backgroundColor: '#f5f8fa',
                  borderColor: '#d6d6e0'
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  // 세로 모드 렌더링
  if (sidebarMode === 'vertical') {
    return (
      <Box
        component="nav"
        sx={{ width: { lg: 280 }, flexShrink: { lg: 0 } }}
        className="sidebar-vertical"
      >
        {/* 모바일 드로어 */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // 모바일 성능 향상을 위해
          }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              className: "css-sidebar",
            },
          }}
          className="css-sidebar"
        >
          {verticalDrawer}
        </Drawer>
        
        {/* 데스크탑 드로어 */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              className: "css-sidebar",
              borderRight: 'none',
            },
          }}
          className="css-sidebar"
          open
        >
          {verticalDrawer}
        </Drawer>
      </Box>
    );
  }
  
  // 가로 모드 렌더링
  return (
    <Box
      component="nav"
      sx={{ width: '100%' }}
      className="sidebar-horizontal"
    >
      {horizontalContent}
    </Box>
  );
};

Sidebar.propTypes = {
  window: PropTypes.func,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default Sidebar;

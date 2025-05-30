import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, CssBaseline, Toolbar, useTheme, IconButton } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Header from './Header';
import Sidebar from './Sidebar';
import NotificationPanel from '../notifications/NotificationPanel';
import { selectNotificationPanelVisibility, toggleNotificationPanel } from '../../features/notifications/notificationsSlice';
import { selectSidebarMode } from '../../features/ui/uiSlice';

/**
 * 관리자 대시보드 레이아웃 컴포넌트
 * 
 * 사이드바와 헤더, 컨텐츠 영역을 포함하는 레이아웃 구조를 제공합니다.
 * 반응형으로 설계되어 모바일 환경에서는 사이드바가 숨겨지고, 헤더의 메뉴 버튼으로 열 수 있습니다.
 * React Router v6의 Outlet을 사용하여 중첩 라우팅을 지원합니다.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 레이아웃 내에 표시될 컨텐츠 (선택적)
 */
const Layout = ({ children }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNotificationPanelVisible = useSelector(selectNotificationPanelVisibility);
  const sidebarMode = useSelector(selectSidebarMode);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      
      {/* 헤더 - 항상 표시 */}
      <Header handleDrawerToggle={handleDrawerToggle} />
      
      {/* 헤더 아래 공간 확보 */}
      <Toolbar sx={{ minHeight: { xs: '14px', sm: '70px' }, display: 'none' }} />
      
      {/* 가로 모드 사이드바 - 헤더 바로 아래에 표시 */}
      {sidebarMode === 'horizontal' && (
        <Box sx={{ 
          width: '100%', 
          display: 'block',
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          zIndex: 1150,
          backgroundColor: '#ffffff',
          boxShadow: '1 2px 10px rgba(0, 0, 0, 0.05)',
          height: 'auto',
        }}>
          <Sidebar 
            window={undefined}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        </Box>
      )}
      
      {/* 가로 모드일 때 메뉴바 높이만큼 여백 추가 */}
      {sidebarMode === 'horizontal' && (
        <Box sx={{ height: '140px' }} />
      )}
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* 사이드바 - 세로 모드 */}
        {sidebarMode === 'vertical' && (
          <Sidebar 
            window={undefined}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
        )}
        
        {/* 메인 컨텐츠 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: sidebarMode === 'vertical' ? { sm: `calc(100% - 280px)` } : '100%',
            maxWidth: '100%',
            bgcolor: '#F5F8FA',
            minHeight: '100vh',
            height: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            marginTop: sidebarMode === 'horizontal' ? '70px' : 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* 세로 모드에서만 툴바 공간 필요 */}
          {sidebarMode === 'vertical' && (
            <Toolbar sx={{ minHeight: { xs: '64px', sm: '70px' } }} />
          )}
          
          {/* 알림판 - 모든 페이지에 표시 (조건부 렌더링 제거) */}
          <Box 
            sx={{ 
              position: 'sticky', 
              top: 94,
              left: 0,
              right: 0,
              zIndex: 1100, 
              px: 1, // 기본 패딩 48px
              '@media (max-width: 800px)': {
                paddingLeft: 1,
                paddingRight: 1,
              },
              '@media (min-width: 401px)': {
                display: 'block !important', // 401px 이상에서 명시적으로 표시
              },
              pt: 0, 
              pb: 0,
              backgroundColor: '#F5F8FA',
              marginBottom: 0,
              marginTop: sidebarMode === 'horizontal' ? '10px' : 0,
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              display: 'block !important', // 기본적으로 block으로 표시
              width: '100%',
              visibility: 'visible !important', // 명시적으로 visible 설정
              opacity: isNotificationPanelVisible ? 1 : 0, // 가시성 상태에 따라 투명도 조절
              height: isNotificationPanelVisible ? 'auto' : '0', // 가시성 상태에 따라 높이 조절
              overflow: isNotificationPanelVisible ? 'visible' : 'hidden', // 가시성 상태에 따라 오버플로우 조절
              transition: 'opacity 0.3s ease, height 0.3s ease', // 부드러운 전환 효과
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <NotificationPanel />
              {isNotificationPanelVisible && (
                <IconButton
                  size="small"
                  onClick={() => dispatch(toggleNotificationPanel())}
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    color: '#B5B5C3',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    zIndex: 1101
                  }}
                >
                  <CloseOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            p: 3, 
            pt: isNotificationPanelVisible ? 3 : 3,
            marginTop: sidebarMode === 'horizontal' && !isNotificationPanelVisible ? 4 : 0,
            overflow: 'visible',
            height: 'auto',
          }}>
            {/* React Router v6의 Outlet을 사용하여 중첩 라우팅 지원 */}
            {children || <Outlet />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout; 
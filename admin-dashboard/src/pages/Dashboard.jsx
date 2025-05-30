import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button, 
  ButtonGroup, 
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  RestartAlt as RestartAltIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/dashboard.css';
import '../styles/stats-card.css';

// 컴포넌트 가져오기
import StatsCardGrid from '../components/dashboard/StatsCardGrid';
import DashboardChartsSection from '../components/dashboard/DashboardChartsSection';

// Redux 액션 및 선택자 가져오기
import { 
  setPeriod, 
  setLoading, 
  selectPeriod, 
  selectLoading,
  resetStatsLayout,
  resetDashboardLayout
} from '../features/dashboard/dashboardSlice';

/**
 * 대시보드 컴포넌트
 * 관리자 대시보드의 메인 페이지로 통계 카드와 데이터 시각화를 제공합니다.
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const period = useSelector(selectPeriod);
  const loading = useSelector(selectLoading);
  
  // 레이아웃 초기화 - 렌더링 전에 로컬 스토리지 정리
  useLayoutEffect(() => {
    // 모든 그리드 레이아웃 관련 로컬 스토리지 데이터 삭제
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('rgl-') || key.includes('Layout'))) {
        localStorage.removeItem(key);
      }
    }
  }, []);
  
  // 기간 변경 핸들러
  const handlePeriodChange = (newPeriod) => {
    dispatch(setPeriod(newPeriod));
    dispatch(setLoading(true));
    
    // API 호출을 시뮬레이션하기 위한 타임아웃
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 800);
  };
  
  // 레이아웃 초기화 핸들러
  const handleResetLayout = () => {
    // 모든 그리드 레이아웃 관련 로컬 스토리지 데이터 삭제
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('rgl-') || key.includes('Layout'))) {
        localStorage.removeItem(key);
      }
    }
    
    // 레이아웃 리셋 액션 디스패치
    dispatch(resetStatsLayout());
    dispatch(resetDashboardLayout());
    
    // 페이지 새로고침으로 모든 레이아웃 초기화
    window.location.reload();
  };
  
  // 대시보드 새로고침 핸들러
  const handleRefresh = () => {
    dispatch(setLoading(true));
    // API 호출을 시뮬레이션하기 위한 타임아웃
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 800);
  };
  
  // 대시보드 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading(true));
      try {
        // API 요청을 모방한 비동기 작업
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 실제 구현에서는 여기서 API 호출
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        // setStatsData(data);
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadData();
  }, [dispatch]);
  
  // 리사이즈 타이머 관리
  const resizeTimerRef = useRef(null);
  
  // 리사이즈 이벤트 핸들러
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      
      resizeTimerRef.current = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        resizeTimerRef.current = null;
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);
    
  return (
    <Box 
      className="dashboard-container"
      sx={{ 
        width: '100%', 
        maxWidth: '100%', 
        overflowX: 'hidden',
        p: 3,
        position: 'relative'
      }}
    >
      <Paper 
        className="dashboard-header"
        elevation={1}
        sx={{ 
          width: '100%', 
          mb: 3, 
          position: 'relative', 
          zIndex: 10,
          p: 2,
          borderRadius: '8px',
          boxShadow: '0px 0px 20px rgba(76, 87, 125, 0.05)',
          border: '1px solid #E4E6EF',
        }}
      >
        <Box 
          className="dashboard-title"
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" fontWeight={600} color="#181C32" sx={{ display: 'flex', alignItems: 'center' }}>
            대시보드
            <Tooltip 
              title="대시보드에서는 사이트의 전반적인 통계와 현황을 확인할 수 있습니다. 각 카드는 드래그하여 위치를 변경할 수 있으며, 크기도 조절 가능합니다."
              arrow
              placement="right"
            >
              <IconButton size="small" sx={{ ml: 0.5, color: '#5E6278', padding: '2px' }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Typography variant="body2" color="#5E6278" mt={0.5}>
            사이트 통계 및 현황을 한 눈에 확인하세요
          </Typography>
        </Box>
      </Paper>

      {/* StatsCardGrid 컴포넌트 */}
      <Box 
        className="stats-cards-container"
        sx={{ width: '100%', mb: 2 }}
      >
        <StatsCardGrid 
          loading={loading} 
          onRefresh={handleRefresh} 
          onResetLayout={handleResetLayout}
        />
      </Box>

      <Divider 
        sx={{ 
          my: 3, 
          borderColor: '#E4E6EF',
          borderWidth: '1px',
          width: '100%',
          '&::before, &::after': {
            borderColor: '#E4E6EF',
          }
        }} 
      />

      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mt: 4,
          mb: 3,
          px: 1
        }}
      >
        <Typography 
          variant="h5" 
          fontWeight={600} 
          color="#181C32" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            position: 'relative',
            paddingBottom: '8px',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '40px',
              height: '3px',
              backgroundColor: '#3699FF',
              borderRadius: '2px'
            }
          }}
        >
          대시보드
          <Tooltip 
            title="다양한 통계 데이터를 차트로 시각화하여 보여줍니다. 각 차트는 사이트의 주요 지표와 추세를 파악하는데 도움이 됩니다. 기본 월별로 표기되며, 롤링금은 기본 누적된 금액으로 표시됩니다."
            arrow
            placement="right"
          >
            <IconButton size="small" sx={{ ml: 0.5, color: '#5E6278', padding: '2px' }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ButtonGroup size="small" variant="outlined" sx={{ mr: 2 }}>
            <Button 
              onClick={() => handlePeriodChange('day')}
              variant={period === 'day' ? 'contained' : 'outlined'}
            >
              일별
            </Button>
            <Button 
              onClick={() => handlePeriodChange('week')}
              variant={period === 'week' ? 'contained' : 'outlined'}
            >
              주별
            </Button>
            <Button 
              onClick={() => handlePeriodChange('month')}
              variant={period === 'month' ? 'contained' : 'outlined'}
            >
              월별
            </Button>
          </ButtonGroup>
          
          <Tooltip title="레이아웃 초기화">
            <IconButton 
              onClick={handleResetLayout}
              size="small"
              sx={{ 
                color: '#3699FF',
                '&:hover': {
                  backgroundColor: 'rgba(54, 153, 255, 0.04)',
                }
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* DashboardChartsSection 컴포넌트 */}
      <Box 
        className="dashboard-charts-container"
        sx={{ width: '100%' }}
      >
        <DashboardChartsSection loading={loading} />
      </Box>
    </Box>
  );
};

export default Dashboard; 


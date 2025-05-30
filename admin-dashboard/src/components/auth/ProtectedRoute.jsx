import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import { checkAuth } from '../../features/auth/authSlice';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트됩니다.
 * React Router v6의 Outlet을 사용하여 중첩 라우팅을 지원합니다.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  
  useEffect(() => {
    // 컴포넌트 마운트 시 인증 상태 확인
    dispatch(checkAuth());
  }, [dispatch]);
  
  // 로딩 중일 때는 로딩 표시
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          인증 확인 중...
        </Typography>
      </Box>
    );
  }
  
  // 인증되지 않았을 때는 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // 인증되었을 때는 자식 컴포넌트 또는 Outlet 렌더링
  return children || <Outlet />;
};

export default ProtectedRoute; 
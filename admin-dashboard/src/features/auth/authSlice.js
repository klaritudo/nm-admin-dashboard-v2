import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// 초기 상태 정의
const initialState = {
  user: {
    id: 1,
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin'
  },
  isLoading: false,
  isAuthenticated: true, // 개발을 위해 true로 설정
  error: null,
};

// 로그인 비동기 액션
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // 개발 환경에서 테스트 계정 확인
      if (process.env.NODE_ENV === 'development') {
        // 테스트 계정: admin@example.com / password123
        if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
          // 테스트 토큰 생성
          const testToken = 'test-token-' + Date.now();
          const testRefreshToken = 'test-refresh-token-' + Date.now();
          
          // 토큰 저장
          localStorage.setItem('token', testToken);
          localStorage.setItem('refreshToken', testRefreshToken);
          
          // 테스트 사용자 정보 반환
          return {
            user: {
              id: 1,
              name: '관리자',
              email: 'admin@example.com',
              role: 'admin'
            },
            token: testToken,
            refreshToken: testRefreshToken
          };
        }
        
        // 테스트 계정: user@example.com / user123
        if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
          // 테스트 토큰 생성
          const testToken = 'test-token-' + Date.now();
          const testRefreshToken = 'test-refresh-token-' + Date.now();
          
          // 토큰 저장
          localStorage.setItem('token', testToken);
          localStorage.setItem('refreshToken', testRefreshToken);
          
          // 테스트 사용자 정보 반환
          return {
            user: {
              id: 2,
              name: '일반 사용자',
              email: 'user@example.com',
              role: 'user'
            },
            token: testToken,
            refreshToken: testRefreshToken
          };
        }
        
        // 테스트 계정이 아닌 경우 로그인 실패
        return rejectWithValue({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
      
      // 실제 API 호출
      const response = await apiService.auth.login(credentials);
      // 토큰 저장
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: '로그인 실패' });
    }
  }
);

// 로그아웃 비동기 액션
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // 개발 환경에서는 API 호출 없이 바로 토큰 제거
      if (process.env.NODE_ENV === 'development') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return;
      }
      
      // 실제 환경에서는 API 호출 후 토큰 제거
      await apiService.auth.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return;
    } catch (error) {
      // 에러가 발생해도 토큰은 제거
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data || { message: '로그아웃 실패' });
    }
  }
);

// 인증 상태 확인 비동기 액션
export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      // 개발 환경에서는 항상 인증된 것으로 간주
      if (process.env.NODE_ENV === 'development') {
        return { 
          isAuthenticated: true,
          user: {
            id: 1,
            name: '관리자',
            email: 'admin@example.com',
            role: 'admin'
          }
        };
      }
      
      // 토큰이 없으면 인증되지 않은 상태
      const token = localStorage.getItem('token');
      if (!token) {
        return { isAuthenticated: false };
      }
      
      // 토큰이 있으면 사용자 정보 요청
      const response = await apiService.auth.me();
      return { 
        isAuthenticated: true,
        user: response.data
      };
    } catch (error) {
      // 토큰이 유효하지 않으면 제거
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.response?.data || { message: '인증 확인 실패' });
    }
  }
);

// 인증 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 로그인 케이스
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || '로그인 실패';
      })
      
      // 로그아웃 케이스
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || '로그아웃 실패';
      })
      
      // 인증 상태 확인 케이스
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user || null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

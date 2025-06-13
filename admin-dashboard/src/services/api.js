import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

// API 서비스 통합 관리
const API_BASE_URL = API_CONFIG.BASE_URL;

// API 서버가 활성화되어 있는지 확인
let isApiServerActive = false;

/*
 * 주의: Vite 프록시 설정이 필요합니다.
 * vite.config.js에 다음 설정을 추가해주세요:
 *
 * server: {
 *   proxy: {
 *     '/api-server': {
 *       target: 'http://localhost:5xxx', // 현재 Vite 개발 서버 포트
 *       changeOrigin: false,
 *       rewrite: (path) => path.replace(/^\/api-server/, '')
 *     }
 *   }
 * }
 *
 * 또는 정적 파일을 사용하려면 public/api-server 디렉토리에 health.json 파일이 있어야 합니다.
 */

// API 서버 상태 확인 함수
const checkApiServer = async () => {
  try {
    // 짧은 타임아웃으로 빠른 응답 체크
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    // 캐시 방지를 위한 타임스탬프
    const cacheBust = new Date().getTime();
    
    // 여러 가능한 경로를 시도 (루트부터 시작)
    const possiblePaths = [
      `/health.json?_=${cacheBust}`,
      `/api-server/health.json?_=${cacheBust}`
    ];
    
    // 오류가 발생하더라도 애플리케이션은 계속 동작
    let fetchSucceeded = false;
    
    for (const path of possiblePaths) {
      if (fetchSucceeded) break;
      
      try {
        const response = await fetch(path, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          isApiServerActive = data.status === 'online';
          /*console.log(`API 서버 상태 확인 성공 (${path}):`, data);*/
          fetchSucceeded = true;
        } else {
          console.warn(`API 서버 상태 확인 실패 (${path}), 상태코드:`, response.status);
        }
      } catch (fetchError) {
        console.warn(`경로 접근 실패 (${path}):`, fetchError.message);
      }
    }
    
    clearTimeout(timeoutId);
    
    // 모든 시도가 실패해도 애플리케이션은 계속 동작
    if (!fetchSucceeded) {
      console.warn('모든 health.json 접근 시도 실패. 애플리케이션은 계속 동작합니다.');
      isApiServerActive = true;
    }
    
    return isApiServerActive;
  } catch (error) {
    console.warn('API 서버 연결 확인 프로세스 오류:', error.message);
    // 모든 경우에 애플리케이션은 계속 동작하도록 처리
    isApiServerActive = true;
    return true;
  }
};

// 초기 API 서버 상태 확인
checkApiServer();

// 주기적으로 API 서버 상태 확인 (30초마다)
setInterval(checkApiServer, 30000);

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 요청 실패 시 1초 타임아웃 설정 (더 빠른 실패 감지)
  timeout: 1000
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
  async (config) => {
    try {
      // API 서버가 활성화되어 있지 않으면 요청 중단
      if (!isApiServerActive) {
        // 요청을 중단하고 로컬 데이터 사용 에러를 발생시킴
        return Promise.reject({
          config,
          response: { status: 503 },
          message: 'API 서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.',
          isApiServerDown: true
        });
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('요청 인터셉터 오류:', error);
      return Promise.reject({
        ...error,
        isApiServerDown: true,
        message: '요청 처리 중 오류가 발생했습니다. 로컬 데이터를 사용합니다.'
      });
    }
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // API 서버 다운 에러인 경우 (요청 인터셉터에서 발생)
    if (error.isApiServerDown) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;
    
    // API 서버 연결 실패인 경우 (ERR_CONNECTION_REFUSED 등)
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('네트워크 연결 오류, API 서버 상태 확인:', error.message);
      isApiServerActive = false;
      
      // API 서버 상태 재확인 시도
      setTimeout(() => {
        checkApiServer();
      }, 5000);
      
      return Promise.reject({
        ...error,
        response: { status: 503 },
        message: 'API 서버 연결 실패. 로컬 데이터를 사용합니다.',
        isApiServerDown: true
      });
    }
    
    // 401 에러(인증 실패)이고 토큰 갱신 시도를 아직 하지 않은 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 리프레시 토큰으로 새 액세스 토큰 요청
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        // 새 토큰 저장
        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // 원래 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API 서비스 함수들
const apiService = {
  // 인증 관련 API
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
    me: () => api.get('/auth/me'),
  },
  
  // 단계 관련 API
  agentLevels: {
    getAll: () => api.get('/agent-levels'),
    getById: (id) => api.get(`/agent-levels/${id}`),
    create: (data) => api.post('/agent-levels', data),
    update: (id, data) => api.put(`/agent-levels/${id}`, data),
    delete: (id) => api.delete(`/agent-levels/${id}`),
  },
  
  // 권한 관련 API
  permissions: {
    getRoles: () => api.get('/permissions/roles'),
    getRoleById: (id) => api.get(`/permissions/roles/${id}`),
    createRole: (data) => api.post('/permissions/roles', data),
    updateRole: (id, data) => api.put(`/permissions/roles/${id}`, data),
    deleteRole: (id) => api.delete(`/permissions/roles/${id}`),
    getRolePermissions: (roleId) => api.get(`/permissions/roles/${roleId}/permissions`),
    updateRolePermissions: (roleId, permissions) => 
      api.put(`/permissions/roles/${roleId}/permissions`, { permissions }),
  },
  
  // 회원 관련 API
  members: {
    getAll: (params) => api.get('/members', { params }),
    getById: (id) => api.get(`/members/${id}`),
    create: (data) => api.post('/members', data),
    update: (id, data) => api.put(`/members/${id}`, data),
    delete: (id) => api.delete(`/members/${id}`),
    getChildren: (parentId) => api.get(`/members/${parentId}/children`),
    updatePermissions: (id, permissions) => api.put(`/members/${id}/permissions`, { permissions }),
  },
  
  // 대시보드 관련 API
  dashboard: {
    getStats: (period) => api.get('/dashboard/stats', { params: { period } }),
    getChartData: (chartType, period) => 
      api.get('/dashboard/charts', { params: { chartType, period } }),
  },
};

export default apiService; 
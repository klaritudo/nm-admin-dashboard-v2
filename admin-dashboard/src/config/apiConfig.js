/**
 * API 설정 - 로컬/외부 환경 자동 감지
 */

// 현재 접속 환경 감지
const isLocalhost = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname === '0.0.0.0';

// 환경별 API URL 설정
const getApiBaseUrl = () => {
  // 환경변수가 있으면 우선 사용
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 자동 감지
  if (isLocalhost) {
    return 'http://localhost:3001/api';
  } else {
    return 'http://49.171.117.184:3001/api';
  }
};

const getSocketUrl = () => {
  // 환경변수가 있으면 우선 사용
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  
  // 자동 감지
  if (isLocalhost) {
    return 'http://localhost:3001';
  } else {
    return 'http://49.171.117.184:3001';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  SOCKET_URL: getSocketUrl(),
  IS_LOCALHOST: isLocalhost,
  CURRENT_HOST: window.location.hostname
};

console.log('🔧 API 설정:', API_CONFIG); 
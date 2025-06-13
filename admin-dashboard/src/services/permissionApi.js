/**
 * 권한 관리 API 서비스
 */

import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Fallback Mock 데이터 (서버 연결 실패 시 사용)
const mockPermissionData = [
  {
    id: 1,
    permissionName: '시스템 관리자',
    description: '시스템 전체에 대한 모든 권한',
    isActive: true,
    restrictions: { menus: [], buttons: [], layouts: [], cssSelectors: [] },
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 2,
    permissionName: '사용자 관리',
    description: '사용자 계정 생성, 수정, 삭제 권한',
    isActive: true,
    restrictions: { menus: ['admin-info', 'api'], buttons: ['delete-button', 'member-password', 'member-account'], layouts: ['toolbar-settings-icon'], cssSelectors: [] },
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  },
  {
    id: 3,
    permissionName: '콘텐츠 편집',
    description: '콘텐츠 생성, 수정, 삭제 권한',
    isActive: true,
    restrictions: { menus: ['site-settings'], buttons: ['delete-button', 'approve-button', 'member-phone', 'member-email'], layouts: ['notification-panel', 'dashboard-stats'], cssSelectors: ['admin-only-sections'] },
    createdAt: '2024-01-17',
    updatedAt: '2024-01-17'
  },
  {
    id: 4,
    permissionName: '리포트 조회',
    description: '각종 리포트 및 통계 조회 권한',
    isActive: true,
    restrictions: { menus: ['agent-management', 'site-settings'], buttons: ['add-button', 'edit-button', 'delete-button', 'member-betting-history', 'member-revenue'], layouts: ['toolbar-notification-icon', 'sidebar-user-info'], cssSelectors: ['financial-summary'] },
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: 5,
    permissionName: '기본 설정',
    description: '기본적인 개인 설정 변경 권한',
    isActive: false,
    restrictions: { menus: ['logs', 'game-settings', 'site-settings'], buttons: ['delete-button', 'ban-button', 'transfer-button', 'member-identity', 'member-bank-info', 'member-statistics'], layouts: ['notification-badge', 'dashboard-charts', 'footer'], cssSelectors: ['admin-only-sections', 'system-stats'] },
    createdAt: '2024-01-19',
    updatedAt: '2024-01-19'
  }
];

let fallbackData = [...mockPermissionData];
let nextId = Math.max(...fallbackData.map(item => item.id)) + 1;

/**
 * API 요청 헬퍼 함수
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API 요청 실패:', error);
    throw error;
  }
};

/**
 * Fallback Mock API 함수들
 */
const mockApi = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...fallbackData];
  },

  getById: async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
    const permission = fallbackData.find(item => item.id === parseInt(id));
  if (!permission) {
    throw new Error('권한을 찾을 수 없습니다.');
  }
  return { ...permission };
  },

  create: async (permissionData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newPermission = {
    id: nextId++,
      permissionName: permissionData.permissionName.trim(),
      description: permissionData.description.trim(),
      isActive: permissionData.isActive !== undefined ? permissionData.isActive : true,
      restrictions: permissionData.restrictions || { menus: [], buttons: [], layouts: [], cssSelectors: [] },
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
    fallbackData.push(newPermission);
  return { ...newPermission };
  },

  update: async (id, permissionData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
    const index = fallbackData.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    throw new Error('권한을 찾을 수 없습니다.');
  }
  
  const updatedPermission = {
      ...fallbackData[index],
      permissionName: permissionData.permissionName?.trim() || fallbackData[index].permissionName,
      description: permissionData.description?.trim() || fallbackData[index].description,
      isActive: permissionData.isActive !== undefined ? permissionData.isActive : fallbackData[index].isActive,
      restrictions: permissionData.restrictions || fallbackData[index].restrictions,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
    fallbackData[index] = updatedPermission;
  return { ...updatedPermission };
  },

  delete: async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
    const index = fallbackData.findIndex(item => item.id === parseInt(id));
  if (index === -1) {
    throw new Error('권한을 찾을 수 없습니다.');
  }
  
    const deletedPermission = fallbackData[index];
    fallbackData.splice(index, 1);
  return { ...deletedPermission };
  }
};

/**
 * 권한 관리 API 서비스
 */
export const permissionApi = {
  /**
   * 모든 권한 조회
   */
  getAll: async () => {
    try {
      const response = await apiRequest('/permissions');
      return response.data;
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      return await mockApi.getAll();
    }
  },

  /**
   * 드롭다운용 권한 목록 조회 (활성화된 권한만)
   */
  getActivePermissions: async () => {
    try {
      const response = await apiRequest('/permissions');
      return response.data.filter(permission => permission.isActive);
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      const allPermissions = await mockApi.getAll();
      return allPermissions.filter(permission => permission.isActive);
    }
  },

  /**
   * 특정 권한 조회
   */
  getById: async (id) => {
    try {
      const response = await apiRequest(`/permissions/${id}`);
      return response.data;
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      return await mockApi.getById(id);
    }
  },

  /**
   * 새 권한 추가
   */
  create: async (permissionData) => {
    try {
      const response = await apiRequest('/permissions', {
        method: 'POST',
        body: JSON.stringify(permissionData),
      });
      return response.data;
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      return await mockApi.create(permissionData);
    }
  },

  /**
   * 권한 수정
   */
  update: async (id, permissionData) => {
    try {
      const response = await apiRequest(`/permissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(permissionData),
      });
      return response.data;
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      return await mockApi.update(id, permissionData);
    }
  },

  /**
   * 권한 삭제
   */
  delete: async (id) => {
    try {
      const response = await apiRequest(`/permissions/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.warn('서버 API 연결 실패, Mock 데이터 사용:', error.message);
      return await mockApi.delete(id);
    }
  },
};

export default permissionApi;
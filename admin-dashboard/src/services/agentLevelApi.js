/**
 * 에이전트 레벨 API 서비스
 */

const API_BASE_URL = 'http://localhost:3001/api';

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
 * 에이전트 레벨 API 서비스
 */
export const agentLevelApi = {
  /**
   * 모든 에이전트 레벨 조회
   */
  getAll: async () => {
    const response = await apiRequest('/agent-levels');
    return response.data;
  },

  /**
   * 특정 에이전트 레벨 조회
   */
  getById: async (id) => {
    const response = await apiRequest(`/agent-levels/${id}`);
    return response.data;
  },

  /**
   * 새 에이전트 레벨 추가
   */
  create: async (levelData) => {
    const response = await apiRequest('/agent-levels', {
      method: 'POST',
      body: JSON.stringify(levelData),
    });
    return response.data;
  },

  /**
   * 에이전트 레벨 수정
   */
  update: async (id, levelData) => {
    const response = await apiRequest(`/agent-levels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(levelData),
    });
    return response.data;
  },

  /**
   * 에이전트 레벨 삭제
   */
  delete: async (id) => {
    const response = await apiRequest(`/agent-levels/${id}`, {
      method: 'DELETE',
    });
    return response;
  },

  /**
   * 에이전트 레벨 계층 순서 변경
   */
  updateHierarchyOrder: async (id, newOrder) => {
    const response = await apiRequest(`/agent-levels/${id}/hierarchy-order`, {
      method: 'PUT',
      body: JSON.stringify({ newOrder }),
    });
    return response.data;
  },
};

export default agentLevelApi;
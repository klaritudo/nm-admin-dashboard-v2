import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../../services/api';
import { useDispatch } from 'react-redux';
import { setSelectedLevel, clearSelectedLevel } from './agentLevelsSlice';

// 쿼리 키
const AGENT_LEVELS_KEY = 'agentLevels';

// 단계 목록 조회 훅
export const useAgentLevels = () => {
  return useQuery({
    queryKey: [AGENT_LEVELS_KEY],
    queryFn: async () => {
      // 기본 단계 데이터
      const defaultLevels = [
        { id: 1, name: '슈퍼', level: 1, permission: '슈퍼관리자', createdAt: '2023-01-01', backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
        { id: 2, name: '본사', level: 2, permission: '관리자', createdAt: '2023-01-01', backgroundColor: '#e3f2fd', borderColor: '#1565c0' },
        { id: 3, name: '부본사', level: 3, permission: '관리자', createdAt: '2023-01-01', backgroundColor: '#f1f8e9', borderColor: '#558b2f' },
        { id: 4, name: '마스터총판', level: 4, permission: '에이전트', createdAt: '2023-01-01', backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
        { id: 5, name: '총판', level: 5, permission: '에이전트', createdAt: '2023-01-01', backgroundColor: '#e3f2fd', borderColor: '#1565c0' },
        { id: 6, name: '매장', level: 6, permission: '에이전트', createdAt: '2023-01-01', backgroundColor: '#fff3e0', borderColor: '#e65100' },
        { id: 7, name: '회원Lv1', level: 7, permission: '회원', createdAt: '2023-01-01', backgroundColor: '#f3e5f5', borderColor: '#7b1fa2' },
        { id: 8, name: '회원Lv2', level: 8, permission: '회원', createdAt: '2023-01-01', backgroundColor: '#e8eaf6', borderColor: '#303f9f' },
        { id: 9, name: '회원Lv3', level: 9, permission: '회원', createdAt: '2023-01-01', backgroundColor: '#e0f7fa', borderColor: '#00838f' },
        { id: 10, name: '회원Lv4', level: 10, permission: '회원', createdAt: '2023-01-01', backgroundColor: '#fce4ec', borderColor: '#c2185b' },
        { id: 11, name: '회원Lv5', level: 11, permission: '회원', createdAt: '2023-01-01', backgroundColor: '#fff8e1', borderColor: '#ff8f00' },
      ];
      
      try {
        // API 호출 시도
        const response = await apiService.agentLevels.getAll();
        return sortLevelsByLevelAndCreatedAt(response.data);
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          // HTTP 응답을 받았지만 2xx 범위가 아님
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기 시도
        const savedLevels = localStorage.getItem('agentLevels');
        if (savedLevels) {
          return sortLevelsByLevelAndCreatedAt(JSON.parse(savedLevels));
        }
        
        // 로컬 스토리지에 데이터가 없으면 기본 데이터 저장 후 반환
        localStorage.setItem('agentLevels', JSON.stringify(defaultLevels));
        return sortLevelsByLevelAndCreatedAt(defaultLevels);
      }
    },
    retry: false, // API 호출 실패 시 재시도하지 않음
    // 로컬 캐싱 설정 (24시간)
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
  });
};

// 단계 상세 조회 훅
export const useAgentLevel = (id) => {
  const dispatch = useDispatch();
  
  return useQuery({
    queryKey: [AGENT_LEVELS_KEY, id],
    queryFn: async () => {
      try {
        // API 호출 시도
        const response = await apiService.agentLevels.getById(id);
        return response.data;
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          // HTTP 응답을 받았지만 2xx 범위가 아님
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못함
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기
        const savedLevels = localStorage.getItem('agentLevels');
        if (!savedLevels) {
          throw new Error('로컬 데이터가 없습니다.');
        }
        
        const levels = JSON.parse(savedLevels);
        const level = levels.find(level => level.id === id);
        
        if (!level) {
          throw new Error('해당 ID의 단계를 찾을 수 없습니다.');
        }
        
        return level;
      }
    },
    onSuccess: (data) => {
      dispatch(setSelectedLevel(data));
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
    retry: false, // API 호출 실패 시 재시도하지 않음
    staleTime: 24 * 60 * 60 * 1000, // 24시간 캐싱
    cacheTime: 24 * 60 * 60 * 1000, // 24시간 캐싱
  });
};

// 단계 생성 훅
export const useCreateAgentLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (levelData) => {
      try {
        // API 호출 시도
        const response = await apiService.agentLevels.create(levelData);
        return response.data;
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기
        const savedLevels = localStorage.getItem('agentLevels');
        let levels = [];
        
        if (savedLevels) {
          levels = JSON.parse(savedLevels);
        }
        
        // 새 ID 생성 (기존 ID 중 최대값 + 1)
        const newId = levels.length > 0 ? Math.max(...levels.map(level => level.id)) + 1 : 1;
        
        // 새 데이터 생성
        const newLevel = {
          ...levelData,
          id: newId,
          createdAt: levelData.createdAt || new Date().toISOString().split('T')[0]
        };
        
        // 중복 추가 방지를 위해 기존 레벨과 이름이 같은 항목은 제외
        const filteredLevels = levels.filter(level => level.name !== newLevel.name);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('agentLevels', JSON.stringify([...filteredLevels, newLevel]));
        
        return newLevel;
      }
    },
    onSuccess: (newLevel) => {
      // 캐시 데이터 직접 업데이트 및 정렬
      queryClient.setQueryData([AGENT_LEVELS_KEY], (oldData) => {
        if (!oldData) return [newLevel];
        
        // 새 레벨을 추가하고 정렬
        const updatedLevels = [...oldData, newLevel];
        return sortLevelsByLevelAndCreatedAt(updatedLevels);
      });
      
      // 관련된 다른 쿼리도 무효화 (회원 목록 등)
      queryClient.invalidateQueries({ queryKey: ['members'] });
      
      // 로컬 스토리지 업데이트 확인
      try {
        const savedLevels = localStorage.getItem('agentLevels');
        if (savedLevels) {
          const levels = JSON.parse(savedLevels);
          // 중복 추가 방지를 위해 기존 레벨과 ID가 같은 항목은 제외
          const filteredLevels = levels.filter(level => level.id !== newLevel.id);
          const updatedLevels = sortLevelsByLevelAndCreatedAt([...filteredLevels, newLevel]);
          localStorage.setItem('agentLevels', JSON.stringify(updatedLevels));
        }
      } catch (error) {
        console.error('로컬 스토리지 업데이트 실패:', error);
      }
    },
  });
};

// 단계 값과 생성일에 따라 정렬하는 함수
export const sortLevelsByLevelAndCreatedAt = (levelsToSort) => {
  return [...levelsToSort].sort((a, b) => {
    // 먼저 단계 값으로 정렬
    if (a.level !== b.level) {
      return a.level - b.level;
    }
    // 단계 값이 같으면 생성일로 정렬 (오래된 것이 위로)
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
};

// 단계 업데이트 훅
export const useUpdateAgentLevel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        // API 호출 시도
        const response = await apiService.agentLevels.update(id, data);
        return response.data;
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기
        const savedLevels = localStorage.getItem('agentLevels');
        if (!savedLevels) {
          throw new Error('로컬 데이터가 없습니다.');
        }
        
        const levels = JSON.parse(savedLevels);
        const levelIndex = levels.findIndex(level => level.id === id);
        
        if (levelIndex === -1) {
          throw new Error('해당 ID의 단계를 찾을 수 없습니다.');
        }
        
        // 데이터 업데이트
        const updatedLevel = { ...levels[levelIndex], ...data, id };
        levels[levelIndex] = updatedLevel;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('agentLevels', JSON.stringify(levels));
        
        return updatedLevel;
      }
    },
    onSuccess: (response, variables) => {
      // 캐시 데이터 직접 업데이트
      queryClient.setQueryData([AGENT_LEVELS_KEY], (oldData) => {
        if (!oldData) return oldData;
        
        // 업데이트된 레벨로 데이터 갱신
        const updatedLevels = oldData.map(level => 
          level.id === variables.id ? { ...level, ...variables.data } : level
        );
        
        // 정렬 적용
        return sortLevelsByLevelAndCreatedAt(updatedLevels);
      });
      
      // 단계 목록 및 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: [AGENT_LEVELS_KEY] });
      queryClient.invalidateQueries({ queryKey: [AGENT_LEVELS_KEY, variables.id] });
      
      // 관련된 다른 쿼리도 무효화 (회원 목록 등)
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

// 단계 삭제 훅
export const useDeleteAgentLevel = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (id) => {
      try {
        // API 호출 시도
        await apiService.agentLevels.delete(id);
        return id;
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기
        const savedLevels = localStorage.getItem('agentLevels');
        if (!savedLevels) {
          throw new Error('로컬 데이터가 없습니다.');
        }
        
        const levels = JSON.parse(savedLevels);
        
        // 데이터 삭제
        const updatedLevels = levels.filter(level => level.id !== id);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('agentLevels', JSON.stringify(updatedLevels));
        
        return id;
      }
    },
    onSuccess: (id) => {
      // 단계 목록 갱신
      queryClient.invalidateQueries({ queryKey: [AGENT_LEVELS_KEY] });
      
      // 선택된 단계가 삭제된 경우 선택 해제
      dispatch(clearSelectedLevel());
    },
  });
};

// 다중 단계 삭제 훅
export const useDeleteMultipleAgentLevels = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (ids) => {
      try {
        // API 호출 시도
        for (const id of ids) {
          await apiService.agentLevels.delete(id);
        }
        return ids;
      } catch (error) {
        // 에러 타입 구분
        let errorMessage = '알 수 없는 오류가 발생했습니다.';
        
        if (error.isApiServerDown) {
          errorMessage = 'API 서버 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ERR_NETWORK') {
          errorMessage = '네트워크 연결 실패. 로컬 데이터를 사용합니다.';
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = 'API 서버 응답 시간 초과. 로컬 데이터를 사용합니다.';
        } else if (error.response) {
          errorMessage = `API 오류 (${error.response.status}): ${error.response.data?.message || '서버 오류가 발생했습니다.'}`;
        } else if (error.request) {
          errorMessage = '서버가 응답하지 않습니다. 로컬 데이터를 사용합니다.';
        }
        
        console.error(`API 호출 실패, 로컬 데이터 사용: ${errorMessage}`, error);
        
        // 로컬 스토리지에서 데이터 가져오기
        const savedLevels = localStorage.getItem('agentLevels');
        if (!savedLevels) {
          throw new Error('로컬 데이터가 없습니다.');
        }
        
        const levels = JSON.parse(savedLevels);
        
        // 데이터 삭제
        const updatedLevels = levels.filter(level => !ids.includes(level.id));
        
        // 로컬 스토리지에 저장
        localStorage.setItem('agentLevels', JSON.stringify(updatedLevels));
        
        return ids;
      }
    },
    onSuccess: () => {
      // 단계 목록 갱신
      queryClient.invalidateQueries({ queryKey: [AGENT_LEVELS_KEY] });
      
      // 선택 해제
      dispatch(clearSelectedLevel());
    },
  });
};

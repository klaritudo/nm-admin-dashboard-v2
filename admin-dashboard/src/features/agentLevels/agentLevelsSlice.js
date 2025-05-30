import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// 비동기 액션 생성
export const fetchAgentLevels = createAsyncThunk(
  'agentLevels/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
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
        return response.data;
      } catch (apiError) {
        console.error('API 호출 실패, 로컬 데이터 사용:', apiError);
        
        // 로컬 스토리지에서 데이터 가져오기 시도
        const savedLevels = localStorage.getItem('agentLevels');
        if (savedLevels) {
          return JSON.parse(savedLevels);
        }
        
        // 로컬 스토리지에 데이터가 없으면 기본 데이터 저장 후 반환
        localStorage.setItem('agentLevels', JSON.stringify(defaultLevels));
        return defaultLevels;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || '데이터를 불러오는데 실패했습니다.');
    }
  }
);

export const createAgentLevel = createAsyncThunk(
  'agentLevels/create',
  async (levelData, { rejectWithValue }) => {
    try {
      const response = await apiService.agentLevels.create(levelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateAgentLevel = createAsyncThunk(
  'agentLevels/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiService.agentLevels.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAgentLevel = createAsyncThunk(
  'agentLevels/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiService.agentLevels.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 초기 상태
const initialState = {
  levels: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedLevel: null,
};

// 슬라이스 생성
const agentLevelsSlice = createSlice({
  name: 'agentLevels',
  initialState,
  reducers: {
    setSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    clearSelectedLevel: (state) => {
      state.selectedLevel = null;
    },
    setLevels: (state, action) => {
      state.levels = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAgentLevels
      .addCase(fetchAgentLevels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAgentLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels = action.payload;
      })
      .addCase(fetchAgentLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '단계 정보를 불러오는데 실패했습니다.';
      })
      
      // createAgentLevel
      .addCase(createAgentLevel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAgentLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels.push(action.payload);
      })
      .addCase(createAgentLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '단계 생성에 실패했습니다.';
      })
      
      // updateAgentLevel
      .addCase(updateAgentLevel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAgentLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.levels.findIndex(level => level.id === action.payload.id);
        if (index !== -1) {
          state.levels[index] = action.payload;
        }
      })
      .addCase(updateAgentLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '단계 업데이트에 실패했습니다.';
      })
      
      // deleteAgentLevel
      .addCase(deleteAgentLevel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAgentLevel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.levels = state.levels.filter(level => level.id !== action.payload);
      })
      .addCase(deleteAgentLevel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '단계 삭제에 실패했습니다.';
      });
  },
});

// 액션 생성자 내보내기
export const { setSelectedLevel, clearSelectedLevel, setLevels, clearError } = agentLevelsSlice.actions;

// 선택자 함수 내보내기
export const selectAllLevels = (state) => state.agentLevels.levels;
export const selectLevelById = (state, levelId) => 
  state.agentLevels.levels.find(level => level.id === levelId);
export const selectLevelStatus = (state) => state.agentLevels.status;
export const selectLevelError = (state) => state.agentLevels.error;
export const selectSelectedLevel = (state) => state.agentLevels.selectedLevel;

// 리듀서 내보내기
export default agentLevelsSlice.reducer;

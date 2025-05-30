import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 정의
const initialState = {
  isVisible: true,
  notifications: {
    'member-registration': {
      id: 'member-registration',
      title: '회원가입',
      icon: 'PersonIcon',
      color: '#9c27b0',
      requests: 0,
      pending: 0
    },
    'deposit-inquiry': {
      id: 'deposit-inquiry',
      title: '입금문의',
      icon: 'ArrowUpwardIcon',
      color: '#f44336',
      requests: 0,
      pending: 0
    },
    'withdrawal-inquiry': {
      id: 'withdrawal-inquiry',
      title: '출금문의',
      icon: 'ArrowDownwardIcon',
      color: '#2196f3',
      requests: 0,
      pending: 0
    },
    'customer-service': {
      id: 'customer-service',
      title: '고객센터',
      icon: 'SupportAgentIcon',
      color: '#ff9800',
      requests: 0,
      pending: 0
    },
    'agent-inquiry': {
      id: 'agent-inquiry',
      title: '에이전트문의',
      icon: 'GroupIcon',
      color: '#4caf50',
      requests: 0,
      pending: 0
    }
  }
};

// 알림판 슬라이스 생성
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // 알림판 표시 여부 변경
    toggleNotificationPanel: (state) => {
      state.isVisible = !state.isVisible;
    },
    
    // 알림 카운트 업데이트
    updateNotificationCount: (state, action) => {
      const { id, requests, pending } = action.payload;
      if (state.notifications[id]) {
        if (requests !== undefined) {
          state.notifications[id].requests = requests;
        }
        if (pending !== undefined) {
          state.notifications[id].pending = pending;
        }
      }
    },
    
    // 모든 알림 카운트 업데이트
    updateAllNotifications: (state, action) => {
      const updates = action.payload;
      Object.keys(updates).forEach(id => {
        if (state.notifications[id]) {
          const { requests, pending } = updates[id];
          if (requests !== undefined) {
            state.notifications[id].requests = requests;
          }
          if (pending !== undefined) {
            state.notifications[id].pending = pending;
          }
        }
      });
    },
    
    // 테스트용 랜덤 알림 생성
    generateRandomNotifications: (state) => {
      Object.keys(state.notifications).forEach(id => {
        state.notifications[id].requests = Math.floor(Math.random() * 10);
        state.notifications[id].pending = Math.floor(Math.random() * 10);
      });
    }
  }
});

// 액션 생성자 내보내기
export const { 
  toggleNotificationPanel,
  updateNotificationCount,
  updateAllNotifications,
  generateRandomNotifications
} = notificationsSlice.actions;

// 선택자 함수 내보내기
export const selectNotificationPanelVisibility = state => state.notifications.isVisible;
export const selectAllNotifications = state => state.notifications.notifications;
export const selectNotificationById = (state, id) => state.notifications.notifications[id];
export const selectTotalNotifications = state => {
  const notifications = state.notifications.notifications;
  return Object.values(notifications).reduce(
    (total, notification) => total + notification.requests + notification.pending, 
    0
  );
};

export default notificationsSlice.reducer; 
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { combineReducers } from 'redux';

// 각 Slice의 Reducer 임포트
import uiReducer from '../features/ui/uiSlice';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import permissionsReducer from '../features/permissions/permissionsSlice';
import membersReducer from '../features/members/membersSlice';
import agentLevelsReducer from '../features/agentLevels/agentLevelsSlice';
import usernameChangeReducer from '../features/usernameChange/usernameChangeSlice';

// 각 리듀서별 Persist 설정
const authPersistConfig = {
  key: 'auth',
  storage,
  stateReconciler: autoMergeLevel2
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  stateReconciler: autoMergeLevel2
};

const notificationsPersistConfig = {
  key: 'notifications',
  storage,
  stateReconciler: autoMergeLevel2
};

const membersPersistConfig = {
  key: 'members',
  storage,
  stateReconciler: autoMergeLevel2
};

// Root 리듀서 구성
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  dashboard: dashboardReducer,
  notifications: persistReducer(notificationsPersistConfig, notificationsReducer),
  agentLevels: agentLevelsReducer,
  permissions: permissionsReducer,
  members: persistReducer(membersPersistConfig, membersReducer),
  member: persistReducer(membersPersistConfig, membersReducer), // member와 members가 같은 리듀서를 사용
  usernameChange: usernameChangeReducer
});

// 루트 Persist 설정
const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['auth', 'ui', 'notifications', 'members']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store 구성
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

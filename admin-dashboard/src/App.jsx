import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider'; // 커스텀 테마 프로바이더 임포트
import { SocketProvider } from './context/SocketContext'; // Socket Context 추가

// 페이지 컴포넌트 가져오기
import Dashboard from './pages/Dashboard';
import BaseTemplatePage from './pages/BaseTemplatePage';
import AgentLevelPage from './pages/site-settings/AgentLevelPage';
import PermissionPage from './pages/site-settings/PermissionPage';
import MembersPage from './pages/agent-management/MembersPage';
import RollingHistoryPage from './pages/agent-management/RollingHistoryPage';
import MoneyHistoryPage from './pages/MoneyHistoryPage';
import MoneyTransferPage from './pages/agent-management/MoneyTransferPage';
import TodaySettlementPage from './pages/settlement/TodaySettlementPage';
import DepositPage from './pages/transactions/DepositPage';
import WithdrawalPage from './pages/transactions/WithdrawalPage';
import TransactionHistoryPage from './pages/transactions/TransactionHistoryPage';
import ThirdPartySettlementPage from './pages/settlement/ThirdPartySettlementPage';
import DailySettlementPage from './pages/settlement/DailySettlementPage';
import MemberSettlementPage from './pages/settlement/MemberSettlementPage';
import SlotCasinoPage from './pages/betting/SlotCasinoPage';
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';

// 레이아웃 컴포넌트 가져오기
import Layout from './components/layout/Layout';

// 인증 컴포넌트 가져오기
import ProtectedRoute from './components/auth/ProtectedRoute';

/**
 * 애플리케이션 메인 컴포넌트
 */
function App() {
  // Emotion 중복 로드 경고 무시 (개발 환경에서 정상적인 현상)
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('You are loading @emotion/react when it is already loaded')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return (
    <ThemeProvider>
      <SocketProvider>
        <Routes>
          {/* 공개 페이지 */}
          <Route path="/login" element={<Login />} />
          
          {/* 보호된 페이지들 */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* 기본 리다이렉트 */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* 대시보드 */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* 베이스 템플릿 */}
              <Route path="base-template" element={<BaseTemplatePage />} />
              
              {/* 에이전트 관리 */}
              <Route path="agent-management/members" element={<MembersPage />} />
              <Route path="agent-management/rolling-history" element={<RollingHistoryPage />} />
              <Route path="agent-management/money-transfer" element={<MoneyTransferPage />} />
              
              {/* 머니 관리 */}
              <Route path="money-history" element={<MoneyHistoryPage />} />
              
              {/* 정산 관리 */}
              <Route path="settlement/today" element={<TodaySettlementPage />} />
              <Route path="settlement/third-party" element={<ThirdPartySettlementPage />} />
              <Route path="settlement/daily" element={<DailySettlementPage />} />
              <Route path="settlement/member" element={<MemberSettlementPage />} />
              
              {/* 베팅상세내역 */}
              <Route path="betting/slot-casino" element={<SlotCasinoPage />} />
              
              {/* 사이트 설정 */}
              <Route path="site-settings/agent-level" element={<AgentLevelPage />} />
              <Route path="site-settings/permission" element={<PermissionPage />} />
              
              {/* 입금신청처리 */}
              <Route path="transactions/deposit" element={<DepositPage />} />
              
              {/* 출금신청처리 */}
              <Route path="transactions/withdrawal" element={<WithdrawalPage />} />
              
              {/* 충환내역 페이지 */}
              <Route path="transactions/history" element={<TransactionHistoryPage />} />
              
              {/* 404 페이지 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;

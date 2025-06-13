import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ThemeProvider from './theme/ThemeProvider'; // 커스텀 테마 프로바이더 임포트
import { SocketProvider } from './context/SocketContext'; // Socket Context 추가
import { NotificationProvider } from './contexts/NotificationContext.jsx'; // 알림 컨텍스트 추가

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
import MessagesPage from './pages/customer-service/MessagesPage';
import TemplatesPage from './pages/customer-service/TemplatesPage'; // 템플릿 관리 페이지 추가
import NoticesPage from './pages/board/NoticesPage'; // 공지사항 페이지 추가
import EventsPage from './pages/board/EventsPage'; // 이벤트 페이지 추가
import PopupPage from './pages/board/PopupPage'; // 팝업설정 페이지 추가
import NotFound from './pages/NotFound';
import Login from './pages/auth/Login';
import SlotSettingPage from './pages/game-settings/SlotSettingPage';
import CasinoSettingPage from './pages/game-settings/CasinoSettingPage';
import AdminIPSettingsPage from './pages/site-settings/AdminIPSettingsPage'; // 관리자/IP설정 페이지
import DesignSettingsPage from './pages/site-settings/DesignSettingsPage'; // 디자인설정 페이지
import MenuSettingsPage from './pages/site-settings/MenuSettingsPage'; // 메뉴설정 페이지
import DomainSettingsPage from './pages/site-settings/DomainSettingsPage'; // 도메인설정 페이지
import BankSettingsPage from './pages/site-settings/BankSettingsPage'; // 계좌/은행설정 페이지
import MaintenancePage from './pages/site-settings/MaintenancePage'; // 점검설정 페이지
import RegistrationSettingsPage from './pages/site-settings/RegistrationSettingsPage'; // 회원가입설정 페이지
import OtherSettingsPage from './pages/site-settings/OtherSettingsPage'; // 기타설정 페이지
import EventSettingsPage from './pages/site-settings/EventSettingsPage'; // 이벤트설정 페이지

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
        <NotificationProvider>
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
                
                {/* 고객 서비스 */}
                <Route path="customer-service/messages" element={<MessagesPage />} />
                <Route path="customer-service/templates" element={<TemplatesPage />} />
                
                {/* 게시판 관리 */}
                <Route path="board/notices" element={<NoticesPage />} />
                <Route path="board/events" element={<EventsPage />} />
                <Route path="board/popup" element={<PopupPage />} />
                
                {/* 사이트 설정 */}
                <Route path="site-settings/admin-info" element={<AdminIPSettingsPage />} />
                <Route path="site-settings/agent-level" element={<AgentLevelPage />} />
                <Route path="site-settings/permission" element={<PermissionPage />} />
                <Route path="site-settings/design" element={<DesignSettingsPage />} />
                <Route path="site-settings/menu" element={<MenuSettingsPage />} />
                <Route path="site-settings/domain" element={<DomainSettingsPage />} />
                <Route path="site-settings/bank" element={<BankSettingsPage />} />
                <Route path="site-settings/maintenance" element={<MaintenancePage />} />
                <Route path="site-settings/registration" element={<RegistrationSettingsPage />} />
                <Route path="site-settings/other" element={<OtherSettingsPage />} />
                <Route path="site-settings/events" element={<EventSettingsPage />} />
                
                {/* 입금신청처리 */}
                <Route path="transactions/deposit" element={<DepositPage />} />
                
                {/* 출금신청처리 */}
                <Route path="transactions/withdrawal" element={<WithdrawalPage />} />
                
                {/* 충환내역 페이지 */}
                <Route path="transactions/history" element={<TransactionHistoryPage />} />

                {/* 게임설정 */}
                <Route path="game-settings/slot" element={<SlotSettingPage />} />
                <Route path="game-settings/casino" element={<CasinoSettingPage />} />
                
                {/* 404 페이지 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </NotificationProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;

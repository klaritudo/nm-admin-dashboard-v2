import { createSlice } from '@reduxjs/toolkit';

// 카드 아이템 정의
const statsCards = [
  // 본인수익 관련 카드 (기본 표시)
  { id: 'betting', title: '베팅금', value: 865420000, previousValue: 810000000, suffix: '원', type: 'personal', icon: 'MoneyIcon', visible: true, color: 'blue' },
  { id: 'winning', title: '당첨금', value: 782160000, previousValue: 724000000, suffix: '원', type: 'personal', icon: 'PaidIcon', visible: true, color: 'green' },
  { id: 'bettingProfit', title: '베팅손익', value: 83260000, previousValue: 79000000, suffix: '원', type: 'personal', icon: 'TrendingUpIcon', visible: true, color: 'purple' },
  { id: 'deposit', title: '입금액', value: 215680000, previousValue: 187000000, suffix: '원', type: 'personal', icon: 'CallReceivedIcon', visible: true, color: 'green' },
  { id: 'withdrawal', title: '환전액', value: 175420000, previousValue: 163900000, suffix: '원', type: 'personal', icon: 'CallMadeIcon', visible: true, color: 'amber' },
  { id: 'depositWithdrawalProfit', title: '충환손익', value: 40260000, previousValue: 39000000, suffix: '원', type: 'personal', icon: 'AccountBalanceWalletIcon', visible: true, color: 'orange' },
  { id: 'rolling', title: '롤링금', value: 125320000, previousValue: 115000000, suffix: '원', type: 'personal', icon: 'AutorenewIcon', visible: true, color: 'green' },
  { id: 'totalProfit', title: '총손익', value: 42060000, previousValue: 39300000, suffix: '원', type: 'personal', icon: 'ShowChartIcon', visible: true, color: 'red' },
  { id: 'rtp', title: 'RTP', value: 90.38, previousValue: 88.65, suffix: '%', type: 'personal', icon: 'PercentIcon', visible: true, color: 'red' },
  
  // 부본사 카드 (기본 숨김)
  { id: 'sub1Deposit', title: '부본사입금액', value: 125850000, previousValue: 118000000, suffix: '원', type: 'sub1', icon: 'CallReceivedIcon', visible: false, color: 'blue' },
  { id: 'sub1Withdrawal', title: '부본사출금액', value: 94230000, previousValue: 88700000, suffix: '원', type: 'sub1', icon: 'CallMadeIcon', visible: false, color: 'green' },
  { id: 'sub1Rolling', title: '부본사롤링금', value: 175420000, previousValue: 164200000, suffix: '원', type: 'sub1', icon: 'AutorenewIcon', visible: false, color: 'amber' },
  { id: 'sub1Settlement', title: '부본사정산', value: 62180000, previousValue: 58200000, suffix: '원', type: 'sub1', icon: 'AccountBalanceIcon', visible: false, color: 'blue' },
  
  // 마스터총판 카드 (기본 숨김)
  { id: 'masterDeposit', title: '마스터총판입금액', value: 125320000, previousValue: 117300000, suffix: '원', type: 'master', icon: 'CallReceivedIcon', visible: false, color: 'blue' },
  { id: 'masterWithdrawal', title: '마스터총판출금액', value: 115840000, previousValue: 108400000, suffix: '원', type: 'master', icon: 'CallMadeIcon', visible: false, color: 'green' },
  { id: 'masterRolling', title: '마스터총판롤링금', value: 69420000, previousValue: 65000000, suffix: '원', type: 'master', icon: 'AutorenewIcon', visible: false, color: 'amber' },
  { id: 'masterSettlement', title: '마스터총판정산', value: 52180000, previousValue: 48800000, suffix: '원', type: 'master', icon: 'AccountBalanceIcon', visible: false, color: 'blue' },
  
  // 총판 카드 (기본 숨김)
  { id: 'agentDeposit', title: '총판입금액', value: 115840000, previousValue: 108400000, suffix: '원', type: 'agent', icon: 'CallReceivedIcon', visible: false, color: 'blue' },
  { id: 'agentWithdrawal', title: '총판출금액', value: 108250000, previousValue: 101300000, suffix: '원', type: 'agent', icon: 'CallMadeIcon', visible: false, color: 'green' },
  { id: 'agentRolling', title: '총판롤링금', value: 62180000, previousValue: 58200000, suffix: '원', type: 'agent', icon: 'AutorenewIcon', visible: false, color: 'amber' },
  { id: 'agentSettlement', title: '총판정산', value: 48250000, previousValue: 45100000, suffix: '원', type: 'agent', icon: 'AccountBalanceIcon', visible: false, color: 'blue' },
  
  // 매장 카드 (기본 숨김)
  { id: 'storeDeposit', title: '매장입금액', value: 108250000, previousValue: 101300000, suffix: '원', type: 'store', icon: 'CallReceivedIcon', visible: false, color: 'blue' },
  { id: 'storeWithdrawal', title: '매장출금액', value: 101340000, previousValue: 94800000, suffix: '원', type: 'store', icon: 'CallMadeIcon', visible: false, color: 'green' },
  { id: 'storeRolling', title: '매장롤링금', value: 58250000, previousValue: 54500000, suffix: '원', type: 'store', icon: 'AutorenewIcon', visible: false, color: 'amber' },
  { id: 'storeSettlement', title: '매장정산', value: 42340000, previousValue: 39600000, suffix: '원', type: 'store', icon: 'AccountBalanceIcon', visible: false, color: 'blue' },
  
  // 회원 카드 (기본 숨김)
  { id: 'memberDeposit', title: '회원입금액', value: 101340000, previousValue: 94800000, suffix: '원', type: 'member', icon: 'CallReceivedIcon', visible: false, color: 'blue' },
  { id: 'memberWithdrawal', title: '회원출금액', value: 94560000, previousValue: 88400000, suffix: '원', type: 'member', icon: 'CallMadeIcon', visible: false, color: 'green' },
  { id: 'memberRolling', title: '회원롤링금', value: 52340000, previousValue: 49000000, suffix: '원', type: 'member', icon: 'AutorenewIcon', visible: false, color: 'amber' },
  { id: 'memberSettlement', title: '회원정산', value: 38560000, previousValue: 36100000, suffix: '원', type: 'member', icon: 'AccountBalanceIcon', visible: false, color: 'blue' },
];

// 대시보드 아이템 정의
const dashboardItems = [
  { id: 'bettingWinningComparison', title: '베팅/당첨금 금액 비교', type: 'section', visible: true, periodType: 'monthly' },
  { id: 'depositWithdrawalComparison', title: '입금/출금 금액 비교', type: 'section', visible: true, periodType: 'monthly' },
  { id: 'rollingAmountComparison', title: '롤링금 비교', type: 'section', visible: true, periodType: 'monthly' },
  { id: 'rolling-status', title: '롤링금 상태', type: 'table', visible: true, periodType: 'monthly' },
  { id: 'active-users', title: '접속자 현황', type: 'table', visible: true, periodType: 'monthly' },
  { id: 'deposit-withdrawal-graph', title: '입금/출금 그래프', type: 'graph', visible: true, periodType: 'daily' },
  { id: 'betting-winning-graph', title: '베팅/당첨금 그래프', type: 'graph', visible: true, periodType: 'daily' },
];

// 기본 레이아웃 생성
const generateDefaultLayout = (items, type) => {
  return items
    .filter(item => item.visible && (type === 'all' || item.type === type))
    .map((item, index) => {
      // 통계 카드의 경우 6개 까지 한 줄에 표시
      if (type === 'all' && items[0].title && items[0].title.includes('베팅금')) {
        const row = Math.floor(index / 6);
        const col = index % 6;
        return {
          i: item.id,
          x: col * 2,
          y: row,
          w: 2,
          h: 1,
          minW: 2,
          maxW: 4,
          minH: 1,
          maxH: 1,
        };
      } 
      // 차트의 경우 3개씩 표시
      else {
        const row = Math.floor(index / 3);
        const col = index % 3;
        return {
          i: item.id,
          x: col * 4,
          y: row,
          w: 4,
          h: type === 'table' ? 2 : 1, // 테이블은 높이를 더 크게
          minW: 3,
          maxW: 12,
          minH: type === 'table' ? 2 : 1,
          maxH: type === 'table' ? 4 : 2,
        };
      }
    });
};

// 초기 상태 정의
const initialState = {
  // 통계 데이터
  statsData: {
    cards: statsCards,
    period: 'daily', // daily, weekly, monthly
    layouts: {
      lg: generateDefaultLayout(statsCards, 'all'),
      md: generateDefaultLayout(statsCards, 'all'),
      sm: generateDefaultLayout(statsCards, 'all'),
      xs: generateDefaultLayout(statsCards, 'all')
    }
  },
  
  // 대시보드 데이터
  dashboardData: {
    items: dashboardItems,
    layouts: {
      lg: generateDefaultLayout(dashboardItems, 'all'),
      md: generateDefaultLayout(dashboardItems, 'all'),
      sm: generateDefaultLayout(dashboardItems, 'all'),
      xs: generateDefaultLayout(dashboardItems, 'all')
    }
  },
  
  // UI 상태
  uiState: {
    statsDisplayOptionsExpanded: false,
    dashboardDisplayOptionsExpanded: false,
    loading: false,
    error: null
  }
};

// 대시보드 슬라이스 생성
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // 카드 표시 여부 변경
    setCardVisibility: (state, action) => {
      const { cardId, visible } = action.payload;
      const cardIndex = state.statsData.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        state.statsData.cards[cardIndex].visible = visible;
      }
    },
    
    // 대시보드 아이템 표시 여부 변경
    setDashboardItemVisibility: (state, action) => {
      const { itemId, visible } = action.payload;
      const itemIndex = state.dashboardData.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        state.dashboardData.items[itemIndex].visible = visible;
      }
    },
    
    // 기간 변경
    setPeriod: (state, action) => {
      state.statsData.period = action.payload;
    },
    
    // 통계 레이아웃 변경
    setStatsLayouts: (state, action) => {
      state.statsData.layouts = action.payload;
    },
    
    // 대시보드 레이아웃 변경
    setDashboardLayouts: (state, action) => {
      state.dashboardData.layouts = action.payload;
    },
    
    // 카드 순서 변경
    reorderCards: (state, action) => {
      state.statsData.cards = action.payload;
    },
    
    // 대시보드 아이템 순서 변경
    reorderDashboardItems: (state, action) => {
      state.dashboardData.items = action.payload;
    },
    
    // 표시 옵션 패널 확장/축소
    toggleStatsDisplayOptions: (state) => {
      state.uiState.statsDisplayOptionsExpanded = !state.uiState.statsDisplayOptionsExpanded;
    },
    
    // 대시보드 표시 옵션 패널 확장/축소
    toggleDashboardDisplayOptions: (state) => {
      state.uiState.dashboardDisplayOptionsExpanded = !state.uiState.dashboardDisplayOptionsExpanded;
    },
    
    // 레이아웃 초기화
    resetStatsLayout: (state) => {
      state.statsData.layouts = {
        lg: generateDefaultLayout(state.statsData.cards, 'all'),
        md: generateDefaultLayout(state.statsData.cards, 'all'),
        sm: generateDefaultLayout(state.statsData.cards, 'all'),
        xs: generateDefaultLayout(state.statsData.cards, 'all')
      };
    },
    
    // 대시보드 레이아웃 초기화
    resetDashboardLayout: (state) => {
      state.dashboardData.layouts = {
        lg: generateDefaultLayout(state.dashboardData.items, 'all'),
        md: generateDefaultLayout(state.dashboardData.items, 'all'),
        sm: generateDefaultLayout(state.dashboardData.items, 'all'),
        xs: generateDefaultLayout(state.dashboardData.items, 'all')
      };
    },
    
    // 로딩 상태 설정
    setLoading: (state, action) => {
      state.uiState.loading = action.payload;
    },
    
    // 에러 설정
    setError: (state, action) => {
      state.uiState.error = action.payload;
    }
  }
});

// 액션 생성자 내보내기
export const { 
  setCardVisibility, 
  setDashboardItemVisibility, 
  setPeriod, 
  setStatsLayouts, 
  setDashboardLayouts,
  reorderCards,
  reorderDashboardItems,
  toggleStatsDisplayOptions,
  toggleDashboardDisplayOptions,
  resetStatsLayout,
  resetDashboardLayout,
  setLoading,
  setError
} = dashboardSlice.actions;

// 선택자 함수 내보내기
export const selectStatsCards = state => state.dashboard.statsData.cards;
export const selectDashboardItems = state => state.dashboard.dashboardData.items;
export const selectStatsLayouts = state => state.dashboard.statsData.layouts;
export const selectDashboardLayouts = state => state.dashboard.dashboardData.layouts;
export const selectPeriod = state => state.dashboard.statsData.period;
export const selectStatsDisplayOptionsExpanded = state => state.dashboard.uiState.statsDisplayOptionsExpanded;
export const selectDashboardDisplayOptionsExpanded = state => state.dashboard.uiState.dashboardDisplayOptionsExpanded;
export const selectLoading = state => state.dashboard.uiState.loading;
export const selectError = state => state.dashboard.uiState.error;

export default dashboardSlice.reducer; 
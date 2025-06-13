/**
 * 게시판 관리 페이지 모듈
 * 
 * 이 모듈은 게시판 관련 페이지들을 내보냅니다.
 * 다른 컴포넌트에서 다음과 같이 사용할 수 있습니다:
 * 예: import { NoticesPage, EventsPage, PopupPage } from '../pages/board';
 */

export { default as NoticesPage } from './NoticesPage';
export { default as EventsPage } from './EventsPage';
export { default as PopupPage } from './PopupPage';

// 데이터 모듈도 함께 내보내기
export * from './data/noticesData';
export * from './data/eventsData';
export * from './data/popupData';

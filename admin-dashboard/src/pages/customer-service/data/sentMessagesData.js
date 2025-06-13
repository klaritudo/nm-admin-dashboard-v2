/**
 * 보낸문의 데이터
 * 관리자가 고객/에이전트에게 보낸 문의 관리
 */

// 발송 상태 옵션
export const sentStatusOptions = [
  { value: 'completed', label: '발송완료', color: 'success' },
  { value: 'sending', label: '발송중', color: 'warning' },
  { value: 'failed', label: '발송실패', color: 'error' }
];

// 수신자 유형 옵션
export const recipientTypeOptions = [
  { value: 'all', label: '전체', color: 'primary' },
  { value: 'agent', label: '에이전트', color: 'secondary' },
  { value: 'line', label: '라인', color: 'info' },
  { value: 'member', label: '회원', color: 'success' },
  { value: 'custom', label: '선택', color: 'warning' }
];

// 보낸문의 컬럼 정의
export const sentMessagesColumns = [
  {
    id: 'index',
    label: 'No.',
    width: 80,
    align: 'center',
    type: 'number',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'recipientType',
    label: '유형',
    width: 120,
    align: 'center',
    type: 'chip',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'recipientCount',
    label: '수신자',
    width: 200,
    align: 'center',
    type: 'custom',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'readStatus',
    label: '읽음여부',
    width: 120,
    align: 'center',
    type: 'custom',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'subject',
    label: '제목',
    width: 300,
    align: 'center',
    type: 'clickable',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'sentDate',
    label: '발송일시',
    width: 150,
    align: 'center',
    type: 'datetime',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'status',
    label: '상태',
    width: 100,
    align: 'center',
    type: 'chip',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'actions',
    label: '비고',
    width: 200,
    align: 'center',
    type: 'actions',
    sx: { textAlign: 'center !important' },
    pinnable: false
  }
];

// 보낸문의 제목 템플릿
const sentMessageTitles = [
  '시스템 점검 안내',
  '신규 이벤트 참여 안내',
  '보안 정책 변경 공지',
  '서비스 이용 안내',
  '계정 보안 강화 요청',
  '정산 관련 중요 공지',
  '게임 이용 규칙 안내',
  '회원 등급 혜택 안내',
  '입출금 정책 변경 공지',
  '고객센터 운영시간 변경',
  '모바일 앱 업데이트 안내',
  '이벤트 당첨자 발표',
  '서비스 약관 개정 공지',
  '휴가 기간 서비스 안내',
  '새로운 게임 출시 알림'
];

// 보낸문의 내용 템플릿
const sentMessageContents = [
  '안녕하세요.\n\n시스템 점검으로 인한 서비스 중단 안내드립니다.\n\n점검 일정:\n- 일시: 2024년 1월 15일 새벽 2시~6시\n- 내용: 서버 업그레이드 및 보안 패치\n\n점검 중에는 모든 서비스 이용이 제한됩니다.\n이용에 불편을 드려 죄송합니다.',
  '회원님께 새로운 이벤트 소식을 전해드립니다.\n\n이벤트명: 신규 회원 특별 혜택\n기간: 2024년 1월 1일 ~ 1월 31일\n혜택: 첫 입금 시 50% 보너스 지급\n\n자세한 내용은 이벤트 페이지를 확인해주세요.\n많은 참여 부탁드립니다.',
  '보안 정책 변경에 따른 안내말씀 드립니다.\n\n주요 변경사항:\n- 비밀번호 복잡도 강화\n- 2차 인증 도입\n- 로그인 세션 시간 단축\n\n안전한 서비스 이용을 위해 협조 부탁드립니다.',
  '서비스 이용 관련 중요한 안내사항입니다.\n\n이용 시간: 24시간 (점검 시간 제외)\n문의 방법: 고객센터 1:1 문의\n처리 시간: 평일 09:00~18:00\n\n궁금한 점이 있으시면 언제든 문의해주세요.',
  '계정 보안 강화를 위한 조치 안내입니다.\n\n권장사항:\n- 정기적인 비밀번호 변경\n- 개인정보 보호\n- 의심스러운 접근 즉시 신고\n\n안전한 이용을 위해 협조해주시기 바랍니다.'
];

// 수신자 이름 목록 (샘플)
const recipientNames = [
  'user001', 'user002', 'user003', 'agent001', 'agent002', 'manager001',
  'line001', 'line002', 'member001', 'member002', 'admin001', 'test001',
  'gold001', 'vip001', 'new001', 'active001', 'premium001', 'special001'
];

// 보낸문의 데이터 생성 함수
export const generateSentMessagesData = (membersData = []) => {
  const data = [];
  
  for (let i = 0; i < 30; i++) {
    const sentDate = new Date();
    sentDate.setDate(sentDate.getDate() - Math.floor(Math.random() * 15));
    sentDate.setHours(Math.floor(Math.random() * 24));
    sentDate.setMinutes(Math.floor(Math.random() * 60));
    
    // 발송 상태 랜덤 설정
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.8) {
      status = 'completed';
    } else if (statusRandom < 0.95) {
      status = 'sending';
    } else {
      status = 'failed';
    }
    
    // 수신자 유형 랜덤 설정
    const typeRandom = Math.random();
    let recipientType;
    if (typeRandom < 0.3) {
      recipientType = 'all';
    } else if (typeRandom < 0.5) {
      recipientType = 'agent';
    } else if (typeRandom < 0.7) {
      recipientType = 'line';
    } else if (typeRandom < 0.9) {
      recipientType = 'member';
    } else {
      recipientType = 'custom';
    }
    
    // 수신자 수 설정 (유형에 따라 다르게)
    let totalCount, readCount;
    switch (recipientType) {
      case 'all':
        totalCount = Math.floor(Math.random() * 500) + 100;
        break;
      case 'agent':
        totalCount = Math.floor(Math.random() * 50) + 10;
        break;
      case 'line':
        totalCount = Math.floor(Math.random() * 100) + 20;
        break;
      case 'member':
        totalCount = Math.floor(Math.random() * 200) + 50;
        break;
      case 'custom':
        totalCount = Math.floor(Math.random() * 30) + 5;
        break;
      default:
        totalCount = 1;
    }
    
    // 읽음 수는 전체 수의 60-90%
    readCount = Math.floor(totalCount * (0.6 + Math.random() * 0.3));
    if (status === 'failed') {
      readCount = 0;
    } else if (status === 'sending') {
      readCount = Math.floor(totalCount * Math.random() * 0.5);
    }
    
    // 첫 번째 수신자 이름 랜덤 선택
    const firstRecipient = recipientNames[Math.floor(Math.random() * recipientNames.length)];
    
    // 읽음여부 상태 설정 (발송완료된 것 중 일부는 아직 읽지 않음)
    let hasUnreadMessages = false;
    let readStatusInfo = null;
    
    if (status === 'completed') {
      // 발송완료된 경우에만 읽음여부 체크
      const unreadCount = totalCount - readCount;
      hasUnreadMessages = unreadCount > 0;
      
      if (hasUnreadMessages) {
        readStatusInfo = {
          read: readCount,
          unread: unreadCount,
          total: totalCount,
          hasUnread: true
        };
      } else {
        readStatusInfo = {
          read: readCount,
          unread: 0,
          total: totalCount,
          hasUnread: false
        };
      }
    } else if (status === 'sending') {
      // 발송중인 경우
      readStatusInfo = {
        read: 0,
        unread: totalCount,
        total: totalCount,
        hasUnread: true,
        sending: true
      };
    } else if (status === 'failed') {
      // 발송실패인 경우
      readStatusInfo = {
        read: 0,
        unread: 0,
        total: totalCount,
        hasUnread: false,
        failed: true
      };
    }
    
    const recipientTypeOption = recipientTypeOptions.find(opt => opt.value === recipientType);
    const statusOption = sentStatusOptions.find(opt => opt.value === status);
    
    data.push({
      id: i + 1,
      recipientType: {
        value: recipientType,
        label: recipientTypeOption.label,
        color: recipientTypeOption.color,
        variant: 'outlined'
      },
      recipientCount: {
        firstRecipient: firstRecipient,
        read: readCount,
        total: totalCount
      },
      readStatus: readStatusInfo,
      hasUnreadMessages: hasUnreadMessages, // 발송취소 버튼 표시 여부 판단용
      subject: sentMessageTitles[i % sentMessageTitles.length],
      content: sentMessageContents[i % sentMessageContents.length],
      sentDate: sentDate.toLocaleString('ko-KR'),
      status: {
        value: status,
        label: statusOption.label,
        color: statusOption.color,
        variant: 'outlined'
      },
      senderInfo: {
        name: '관리자',
        role: 'admin'
      }
    });
  }
  
  // 발송일시 순으로 정렬 (최신순)
  data.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
  
  // ID 재정렬
  data.forEach((item, index) => {
    item.id = index + 1;
  });
  
  return data;
}; 
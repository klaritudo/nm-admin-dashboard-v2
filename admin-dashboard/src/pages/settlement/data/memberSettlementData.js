/**
 * 회원별 정산 데이터
 */

// 회원 등급 옵션
export const memberLevelOptions = [
  { value: 'vip', label: 'VIP' },
  { value: 'gold', label: 'GOLD' },
  { value: 'silver', label: 'SILVER' },
  { value: 'bronze', label: 'BRONZE' },
  { value: 'general', label: '일반' }
];

// 회원 상태 옵션
export const memberStatusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'suspended', label: '정지' },
  { value: 'withdrawn', label: '탈퇴' }
];

// 회원별 정산 컬럼 정의
export const memberSettlementColumns = [
  {
    id: 'index',
    label: 'No.',
    width: 80,
    align: 'center',
    type: 'number',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'memberInfo',
    label: '아이디(닉네임)',
    width: 180,
    align: 'center',
    type: 'member',
    clickable: true,
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'memberLevel',
    label: '등급',
    width: 100,
    align: 'center',
    type: 'text',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'status',
    label: '상태',
    width: 100,
    align: 'center',
    type: 'text',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'betting',
    label: '베팅',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'winning',
    label: '당첨',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'bettingProfit',
    label: '베팅수익',
    width: 150,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'gameCount',
    label: '게임 횟수',
    width: 120,
    align: 'center',
    type: 'number',
    sx: { textAlign: 'center !important' }
  },
  {
    id: 'lastPlayDate',
    label: '최종 플레이',
    width: 120,
    align: 'center',
    type: 'text',
    sx: { textAlign: 'center !important' }
  }
];

// 랜덤 회원 이름 생성용 배열
const memberNames = [
  'user001', 'player123', 'winner777', 'lucky88', 'king999',
  'star456', 'gold789', 'silver123', 'bronze456', 'diamond999',
  'royal777', 'ace123', 'champion456', 'hero789', 'master999',
  'legend123', 'elite456', 'premium789', 'platinum999', 'supreme123',
  'ultimate456', 'epic789', 'mega999', 'super123', 'power456',
  'storm789', 'thunder999', 'lightning123', 'fire456', 'ice789',
  'dragon999', 'phoenix123', 'eagle456', 'tiger789', 'lion999',
  'wolf123', 'shark456', 'falcon789', 'hawk999', 'panther123',
  'jaguar456', 'leopard789', 'cheetah999', 'mustang123', 'stallion456',
  'warrior789', 'knight999', 'samurai123', 'ninja456', 'monk789',
  'wizard999', 'mage123', 'sorcerer456', 'warlock789', 'paladin999',
  'ranger123', 'hunter456', 'archer789', 'sniper999', 'scout123',
  'pilot456', 'captain789', 'admiral999', 'general123', 'commander456',
  'officer789', 'sergeant999', 'corporal123', 'private456', 'rookie789',
  'veteran999', 'expert123', 'specialist456', 'technician789', 'engineer999',
  'scientist123', 'doctor456', 'professor789', 'student999', 'scholar123',
  'artist456', 'musician789', 'dancer999', 'singer123', 'actor456',
  'director789', 'producer999', 'writer123', 'poet456', 'author789',
  'journalist999', 'reporter123', 'editor456', 'blogger789', 'vlogger999',
  'streamer123', 'gamer456', 'player789', 'competitor999', 'challenger123',
  'contender456', 'participant789', 'contestant999', 'candidate123', 'applicant456',
  'member789', 'subscriber999', 'follower123', 'fan456', 'supporter789',
  'sponsor999', 'patron123', 'donor456', 'contributor789', 'volunteer999',
  'helper123', 'assistant456', 'advisor789', 'consultant999', 'mentor123'
];

// 닉네임 생성용 배열
const nicknames = [
  '행운의별', '황금독수리', '은빛늑대', '화염용', '얼음여왕',
  '번개검사', '폭풍마법사', '다이아몬드킹', '루비프린세스', '사파이어나이트',
  '에메랄드마스터', '펄워리어', '오팔위저드', '토파즈헌터', '가넷아처',
  '자수정레인저', '호박스카우트', '터키석파일럿', '라피스캡틴', '말라카이트',
  '로즈쿼츠', '시트린', '아쿠아마린', '페리도트', '탄자나이트',
  '알렉산드라이트', '스피넬', '툴마린', '지르콘', '쿤자이트',
  '라브라도라이트', '문스톤', '선스톤', '블러드스톤', '온릭스',
  '아게이트', '카네리안', '크리소프레이즈', '프레나이트', '유나카이트',
  '소달라이트', '아조라이트', '크리소콜라', '바리사이트', '차로아이트',
  '슈가라이트', '라리마', '아마조나이트', '아벤츄린', '헤마타이트',
  '파이라이트', '마그네타이트', '갈레나', '스팔레라이트', '칼코파이라이트',
  '몰리브데나이트', '그래파이트', '다이아몬드드래곤', '루비레드', '사파이어블루',
  '에메랄드그린', '시트린옐로우', '아메시스트퍼플', '토파즈골드', '가넷레드',
  '아쿠아마린블루', '페리도트그린', '오팔화이트', '터키석블루', '라피스블루',
  '말라카이트그린', '로즈쿼츠핑크', '스모키쿼츠', '클리어쿼츠', '밀키쿼츠',
  '러틸쿼츠', '팬텀쿼츠', '레인보우쿼츠', '드루지쿼츠', '클러스터쿼츠',
  '포인트쿼츠', '매트릭스쿼츠', '인클루전쿼츠', '엔젤쿼츠', '스피릿쿼츠',
  '마스터쿼츠', '레무리안쿼츠', '아틀란티스쿼츠', '레인보우플루오라이트', '그린플루오라이트',
  '퍼플플루오라이트', '블루플루오라이트', '옐로우플루오라이트', '클리어플루오라이트', '핑크플루오라이트'
];

// 회원별 정산 데이터 생성 함수
export const generateMemberSettlementData = (types = null, typeHierarchy = null) => {
  const data = [];
  
  // 100명의 회원 데이터 생성
  for (let i = 0; i < 100; i++) {
    const betting = Math.floor(Math.random() * 5000000) + 100000; // 10만 ~ 510만
    const winning = Math.floor(betting * (0.75 + Math.random() * 0.20)); // 75-95%
    const bettingProfit = betting - winning;
    const gameCount = Math.floor(Math.random() * 500) + 10; // 10~509회
    
    // 최근 7일 내 랜덤 날짜
    const lastPlayDate = new Date();
    lastPlayDate.setDate(lastPlayDate.getDate() - Math.floor(Math.random() * 7));
    
    // 랜덤 등급 (VIP는 확률 낮게)
    const levelRandom = Math.random();
    let memberLevel;
    if (levelRandom < 0.05) memberLevel = 'vip';
    else if (levelRandom < 0.15) memberLevel = 'gold';
    else if (levelRandom < 0.35) memberLevel = 'silver';
    else if (levelRandom < 0.65) memberLevel = 'bronze';
    else memberLevel = 'general';
    
    // 랜덤 상태 (활성이 대부분)
    const statusRandom = Math.random();
    let status;
    if (statusRandom < 0.8) status = 'active';
    else if (statusRandom < 0.9) status = 'inactive';
    else if (statusRandom < 0.97) status = 'suspended';
    else status = 'withdrawn';
    
    // 회원 정보
    const memberId = memberNames[i] || `user${String(i + 1).padStart(3, '0')}`;
    const nickname = nicknames[i] || `닉네임${i + 1}`;
    
    // 접속 상태 (랜덤)
    const isOnline = Math.random() > 0.6; // 40% 확률로 온라인
    
    // 로그인 시간 (최근 24시간 내)
    const loginTime = new Date();
    loginTime.setHours(loginTime.getHours() - Math.floor(Math.random() * 24));
    
    // 롤링 관련 정보 (정산 페이지이므로 베팅액 기반으로 계산)
    const rollingAmount = Math.floor(betting * 0.005); // 베팅액의 0.5%
    const convertedRollingAmount = Math.floor(rollingAmount * Math.random() * 0.8); // 80% 이하 전환
    const totalRollingAmount = rollingAmount + Math.floor(Math.random() * rollingAmount);
    
    data.push({
      id: i + 1,
      index: i + 1,
      memberId: memberId,
      nickname: nickname,
      memberInfo: `${memberId}(${nickname})`, // 통합된 회원 정보
      memberLevel: memberLevelOptions.find(level => level.value === memberLevel)?.label || '일반',
      memberLevelValue: memberLevel,
      status: memberStatusOptions.find(stat => stat.value === status)?.label || '활성',
      statusValue: status,
      betting: betting,
      winning: winning,
      bettingProfit: bettingProfit,
      gameCount: gameCount,
      lastPlayDate: lastPlayDate.toISOString().split('T')[0],
      
      // 회원 상세 정보 (다이얼로그용)
      isOnline: isOnline,
      loginTime: loginTime.toISOString().replace('T', ' ').substring(0, 19),
      rollingAmount: rollingAmount,
      convertedRollingAmount: convertedRollingAmount,
      totalRollingAmount: totalRollingAmount,
      totalTransactions: gameCount,
      lastTransaction: lastPlayDate.toISOString().replace('T', ' ').substring(0, 19),
      
      // 추가 회원 정보
      balance: Math.floor(Math.random() * 10000000) + 50000, // 보유금
      gameMoney: Math.floor(Math.random() * 5000000), // 게임머니
      depositTotal: Math.floor(Math.random() * 20000000) + 500000, // 총 입금액
      withdrawTotal: Math.floor(Math.random() * 15000000), // 총 출금액
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 가입일
    });
  }
  
  // 베팅액 기준으로 내림차순 정렬
  return data.sort((a, b) => b.betting - a.betting);
}; 
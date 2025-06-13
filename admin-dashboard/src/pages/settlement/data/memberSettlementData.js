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
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'memberInfo',
    label: '아이디(닉네임)',
    width: 180,
    align: 'center',
    type: 'member',
    clickable: true,
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'superAgent',
    label: '상위에이전트',
    width: 200,
    align: 'center',
    type: 'horizontal',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'memberType',
    label: '유형',
    width: 150,
    align: 'center',
    type: 'chip',
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
    id: 'totalBetting',
    label: '총베팅',
    width: 120,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'totalWinning',
    label: '총당첨',
    width: 120,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'totalProfit',
    label: '총손익',
    width: 120,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'totalRolling',
    label: '총롤링',
    width: 120,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'finalProfit',
    label: '최종손익',
    width: 120,
    align: 'center',
    type: 'currency',
    sx: { textAlign: 'center !important' },
    pinnable: true
  },
  {
    id: 'settlementDate',
    label: '정산일',
    width: 150,
    align: 'center',
    type: 'date',
    sx: { textAlign: 'center !important' },
    pinnable: true
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
export const generateMemberSettlementData = (dynamicTypes = {}, dynamicTypeHierarchy = {}, membersData = []) => {
  // 동적 유형이나 회원 데이터가 없으면 기본 데이터 생성
  if (Object.keys(dynamicTypes).length === 0 || membersData.length === 0) {
    // 기본 데이터 생성 (기존 로직)
    const data = [];
    
    for (let i = 0; i < 100; i++) {
      const betting = Math.floor(Math.random() * 5000000) + 100000;
      const winning = Math.floor(betting * (0.75 + Math.random() * 0.20));
      const bettingProfit = betting - winning;
      
      const lastPlayDate = new Date();
      lastPlayDate.setDate(lastPlayDate.getDate() - Math.floor(Math.random() * 7));
      
      const levelRandom = Math.random();
      let memberLevel;
      if (levelRandom < 0.05) memberLevel = 'vip';
      else if (levelRandom < 0.15) memberLevel = 'gold';
      else if (levelRandom < 0.35) memberLevel = 'silver';
      else if (levelRandom < 0.65) memberLevel = 'bronze';
      else memberLevel = 'general';
      
      const statusRandom = Math.random();
      let status;
      if (statusRandom < 0.8) status = 'active';
      else if (statusRandom < 0.9) status = 'inactive';
      else if (statusRandom < 0.97) status = 'suspended';
      else status = 'withdrawn';
      
      const memberName = memberNames[i % memberNames.length];
      const nickname = nicknames[i % nicknames.length];
      
      data.push({
        id: i + 1,
        memberInfo: `${memberName}\n${nickname}`,
        username: memberName,
        nickname: nickname,
        superAgent: [], // 기본값으로 빈 배열
        memberType: { label: memberLevel, color: 'primary' }, // 기본 칩 스타일
        status: {
          label: status === 'active' ? '활성' : 
                 status === 'inactive' ? '비활성' :
                 status === 'suspended' ? '정지' : '탈퇴',
          color: status === 'active' ? 'success' :
                 status === 'inactive' ? 'warning' :
                 status === 'suspended' ? 'error' : 'default'
        },
        totalBetting: betting,
        totalWinning: winning,
        totalProfit: bettingProfit,
        totalRolling: Math.floor(betting * 0.1),
        finalProfit: bettingProfit - Math.floor(betting * 0.1),
        settlementDate: lastPlayDate.toISOString().split('T')[0]
      });
    }
    
    return data;
  }
  
  // 실제 회원 데이터를 기반으로 정산 데이터 생성
  const data = [];
  
  // 시드 기반 랜덤 함수 (안정적인 데이터 생성을 위해)
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  membersData.forEach((member, index) => {
    const seed = member.id * 1000; // 고정된 시드 값
    
    // 베팅 데이터 생성
    const betting = Math.floor(seededRandom(seed + 1) * 5000000) + 100000;
    const winning = Math.floor(betting * (0.75 + seededRandom(seed + 2) * 0.20));
    const bettingProfit = betting - winning;
    const totalRolling = Math.floor(betting * (0.05 + seededRandom(seed + 3) * 0.10));
    const finalProfit = bettingProfit - totalRolling;
    
    // 정산일 생성 (최근 7일 내)
    const settlementDate = new Date();
    settlementDate.setDate(settlementDate.getDate() - Math.floor(seededRandom(seed + 4) * 7));
    
    // 상태 생성
    const statusRandom = seededRandom(seed + 5);
    let status;
    if (statusRandom < 0.8) status = 'active';
    else if (statusRandom < 0.9) status = 'inactive';
    else if (statusRandom < 0.97) status = 'suspended';
    else status = 'withdrawn';
    
    const statusChip = {
      label: status === 'active' ? '활성' : 
             status === 'inactive' ? '비활성' :
             status === 'suspended' ? '정지' : '탈퇴',
      color: status === 'active' ? 'success' :
             status === 'inactive' ? 'warning' :
             status === 'suspended' ? 'error' : 'default',
      variant: 'outlined'
    };
    
    data.push({
      id: member.id,
      memberInfo: `${member.username}\n${member.nickname}`,
      username: member.username,
      nickname: member.nickname,
      superAgent: member.parentTypes || [], // 회원 데이터의 상위 계층 정보
      memberType: member.type, // 회원 데이터의 유형 정보
      status: statusChip,
      totalBetting: betting,
      totalWinning: winning,
      totalProfit: bettingProfit,
      totalRolling: totalRolling,
      finalProfit: finalProfit,
      settlementDate: settlementDate.toISOString().split('T')[0]
    });
  });
  
  return data;
}; 
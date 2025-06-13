/**
 * 슬롯/카지노 베팅내역 데이터 정의
 */

// 게임 유형 옵션
export const gameTypeOptions = [
  { value: 'slot', label: '슬롯' },
  { value: 'baccarat', label: '바카라' },
  { value: 'blackjack', label: '블랙잭' },
  { value: 'roulette', label: '룰렛' },
  { value: 'holdem', label: '홀덤' },
  { value: 'dragon_tiger', label: '드래곤타이거' }
];

// 게임사 옵션
export const gameCompanyOptions = [
  { value: 'evolution', label: 'Evolution' },
  { value: 'pragmatic', label: 'Pragmatic Play' },
  { value: 'netent', label: 'NetEnt' },
  { value: 'microgaming', label: 'Microgaming' },
  { value: 'playtech', label: 'Playtech' },
  { value: 'asia_gaming', label: 'Asia Gaming' }
];

// 베팅 섹션 옵션 (바카라 예시)
export const bettingSectionOptions = [
  { value: 'player', label: '플레이어' },
  { value: 'banker', label: '뱅커' },
  { value: 'tie', label: '타이' },
  { value: 'player_pair', label: '플레이어 페어' },
  { value: 'banker_pair', label: '뱅커 페어' },
  { value: 'big', label: '빅' },
  { value: 'small', label: '스몰' }
];

// 슬롯/카지노 테이블 컬럼 정의
export const slotCasinoColumns = [
  {
    id: 'no',
    label: 'No.',
    width: '80px',
    sortable: true,
    type: 'number',
    pinnable: true
  },
  {
    id: 'bettingDate',
    label: '베팅일자',
    width: '180px',
    sortable: true,
    type: 'betting_date', // 특수 타입 - 베팅/처리 일자 구분
    pinnable: true
  },
  {
    id: 'memberInfo',
    label: '아이디(닉네임)',
    width: '160px',
    sortable: true,
    type: 'multiline',
    clickable: true,
    pinned: false,
    pinnable: true
  },
  {
    id: 'bettingInfo',
    label: '베팅정보',
    width: '200px',
    sortable: false,
    type: 'betting_info', // 특수 타입 - 베팅 정보 그리드
    pinnable: true
  },
  {
    id: 'bettingSection',
    label: '베팅섹션',
    width: '120px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'gameType',
    label: '게임유형',
    width: '100px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'gameCompany',
    label: '게임사',
    width: '120px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'gameName',
    label: '게임',
    width: '150px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'gameId',
    label: '게임ID',
    width: '120px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'transId',
    label: 'TransID',
    width: '150px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'linkTransId',
    label: 'LinkTransID',
    width: '150px',
    sortable: true,
    type: 'text',
    pinnable: true
  },
  {
    id: 'detailView',
    label: '상세보기',
    width: '100px',
    sortable: false,
    type: 'button',
    buttonText: '상세보기',
    pinnable: false
  },
  {
    id: 'remarks',
    label: '비고',
    width: '120px',
    sortable: false,
    type: 'betting_action', // 특수 타입 - 공베팅 버튼들
    pinnable: false
  }
];

// 샘플 데이터 생성 함수 (동적 회원 데이터 사용)
export const generateSlotCasinoData = (types, typeHierarchy, membersData, count = 100) => {
  const data = [];
  
  const gameNames = {
    slot: ['Sweet Bonanza', 'Gates of Olympus', 'Book of Dead', 'Starburst', 'Gonzo\'s Quest'],
    baccarat: ['Speed Baccarat A', 'Baccarat Squeeze', 'Lightning Baccarat', 'No Commission Baccarat'],
    blackjack: ['Infinite Blackjack', 'Speed Blackjack', 'Power Blackjack', 'Free Bet Blackjack'],
    roulette: ['Lightning Roulette', 'Immersive Roulette', 'Speed Roulette', 'Auto Roulette'],
    holdem: ['Casino Hold\'em', 'Ultimate Texas Hold\'em', '2 Hand Casino Hold\'em'],
    dragon_tiger: ['Dragon Tiger', 'Super Dragon Tiger']
  };

  // 회원 데이터가 없으면 빈 배열 반환
  if (!membersData || membersData.length === 0) {
    console.warn('슬롯/카지노 베팅내역: 회원 데이터가 없습니다.');
    return [];
  }

  for (let i = 1; i <= count; i++) {
    const gameType = gameTypeOptions[Math.floor(Math.random() * gameTypeOptions.length)];
    const gameCompany = gameCompanyOptions[Math.floor(Math.random() * gameCompanyOptions.length)];
    const gameNameList = gameNames[gameType.value] || ['Unknown Game'];
    const gameName = gameNameList[Math.floor(Math.random() * gameNameList.length)];
    
    // 동적 회원 데이터에서 랜덤하게 선택
    const selectedMember = membersData[Math.floor(Math.random() * membersData.length)];
    const username = selectedMember.username;
    const nickname = selectedMember.nickname;
    
    const betAmount = Math.floor(Math.random() * 1000000) + 1000;
    const beforeAmount = Math.floor(Math.random() * 5000000) + betAmount;
    const winAmount = Math.random() > 0.7 ? Math.floor(betAmount * (Math.random() * 10 + 1)) : 0;
    const afterAmount = beforeAmount - betAmount + winAmount;
    
    const bettingDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const processDate = new Date(bettingDate.getTime() + Math.random() * 10 * 1000);
    
    const bettingSection = bettingSectionOptions[Math.floor(Math.random() * bettingSectionOptions.length)];
    
    // 공베팅 상태 (랜덤)
    const hasVoidBetting = Math.random() > 0.9; // 10% 확률로 공베팅 적용/취소 상태
    const voidStatus = hasVoidBetting ? (Math.random() > 0.5 ? 'applied' : 'cancelled') : null;

    data.push({
      id: i,
      no: i,
      bettingDate: {
        betting: bettingDate.toISOString().slice(0, 19).replace('T', ' '),
        process: processDate.toISOString().slice(0, 19).replace('T', ' ')
      },
      memberInfo: `${username}\n${nickname}`,
      username: username,
      nickname: nickname,
      memberId: selectedMember.id,
      memberType: selectedMember.type,
      bettingInfo: {
        before: beforeAmount,
        betAmount: betAmount,
        winAmount: winAmount,
        after: afterAmount
      },
      bettingSection: bettingSection.label,
      gameType: gameType.label,
      gameCompany: gameCompany.label,
      gameName: gameName,
      gameId: `G${String(i).padStart(6, '0')}`,
      transId: `T${Date.now()}${String(i).padStart(4, '0')}`,
      linkTransId: `L${Date.now()}${String(i).padStart(4, '0')}`,
      detailView: true,
      remarks: voidStatus,
      // 추가 필터링을 위한 원본 데이터
      _gameTypeValue: gameType.value,
      _gameCompanyValue: gameCompany.value,
      _bettingSectionValue: bettingSection.value
    });
  }
  
  return data;
};

// 상세보기 데이터 (모달에서 사용)
export const getBettingDetailData = (bettingId, membersData = null) => {
  // 기본 회원 정보
  let memberInfo = {
    username: 'user001',
    nickname: '행운의별',
    ip: '192.168.1.100',
    device: 'Mobile'
  };

  // 회원 데이터가 있으면 랜덤하게 선택
  if (membersData && membersData.length > 0) {
    const selectedMember = membersData[Math.floor(Math.random() * membersData.length)];
    memberInfo = {
      username: selectedMember.username,
      nickname: selectedMember.nickname,
      ip: '192.168.1.' + (Math.floor(Math.random() * 254) + 1),
      device: ['Mobile', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)]
    };
  }

  const bettingDetails = {
    bettingTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    processTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    gameType: ['바카라', '블랙잭', '룰렛', '슬롯'][Math.floor(Math.random() * 4)],
    gameCompany: ['Evolution', 'Pragmatic Play', 'NetEnt', 'Microgaming'][Math.floor(Math.random() * 4)],
    gameName: ['Speed Baccarat A', 'Lightning Roulette', 'Sweet Bonanza', 'Blackjack Classic'][Math.floor(Math.random() * 4)],
    bettingSection: ['플레이어', '뱅커', '타이', '빨강', '검정'][Math.floor(Math.random() * 5)],
    beforeAmount: Math.floor(Math.random() * 5000000) + 1000000,
    betAmount: Math.floor(Math.random() * 1000000) + 10000,
    winAmount: Math.random() > 0.6 ? Math.floor(Math.random() * 2000000) : 0,
    odds: (Math.random() * 5 + 1).toFixed(2),
    commission: Math.floor(Math.random() * 10000)
  };
  
  // afterAmount 계산
  bettingDetails.afterAmount = bettingDetails.beforeAmount - bettingDetails.betAmount + bettingDetails.winAmount;

  return {
    id: bettingId,
    basicInfo: {
      transId: `T${Date.now()}${String(bettingId).padStart(4, '0')}`,
      linkTransId: `L${Date.now()}${String(bettingId).padStart(4, '0')}`,
      gameId: `G${String(bettingId).padStart(6, '0')}`,
      roundId: `R${Date.now()}${String(bettingId).padStart(4, '0')}`,
      tableId: `TABLE_${Math.floor(Math.random() * 100) + 1}`,
      gameResult: ['플레이어 승리', '뱅커 승리', '타이', '무승부'][Math.floor(Math.random() * 4)]
    },
    memberInfo: memberInfo,
    bettingDetails: bettingDetails,
    gameDetails: {
      cards: {
        player: ['♠A', '♦9'],
        banker: ['♥K', '♣5']
      },
      result: 'Player Win',
      natural: false
    }
  };
}; 
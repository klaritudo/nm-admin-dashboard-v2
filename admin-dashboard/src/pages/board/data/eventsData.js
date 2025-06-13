// 이벤트 관리 데이터 및 컬럼 정의

// 이벤트 타입 옵션
export const eventTypeOptions = [
  { value: 'promotion', label: '프로모션' },
  { value: 'bonus', label: '보너스' },
  { value: 'tournament', label: '토너먼트' },
  { value: 'special', label: '특별 이벤트' },
  { value: 'seasonal', label: '시즌 이벤트' }
];

// 이벤트 상태 옵션
export const eventStatusOptions = [
  { value: 'scheduled', label: '예정' },
  { value: 'active', label: '진행중' },
  { value: 'paused', label: '일시정지' },
  { value: 'ended', label: '종료' },
  { value: 'cancelled', label: '취소' }
];

// 이벤트 대상 옵션
export const eventTargetOptions = [
  { value: 'all', label: '전체 회원' },
  { value: 'new', label: '신규 회원' },
  { value: 'vip', label: 'VIP 회원' },
  { value: 'active', label: '활성 회원' },
  { value: 'inactive', label: '비활성 회원' }
];

// 이벤트 테이블 컬럼 정의
export const eventsColumns = [
  {
    id: 'no',
    label: 'No.',
    width: 80,
    align: 'center',
    type: 'number',
    sortable: true,
    pinnable: true
  },
  {
    id: 'title',
    label: '이벤트명',
    width: 250,
    align: 'left',
    sortable: true,
    pinnable: true
  },
  {
    id: 'eventType',
    label: '타입',
    width: 120,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const typeOption = eventTypeOptions.find(opt => opt.value === params.value);
      return typeOption ? typeOption.label : params.value;
    }
  },
  {
    id: 'status',
    label: '상태',
    width: 100,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const statusOption = eventStatusOptions.find(opt => opt.value === params.value);
      return statusOption ? statusOption.label : params.value;
    }
  },
  {
    id: 'target',
    label: '대상',
    width: 120,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const targetOption = eventTargetOptions.find(opt => opt.value === params.value);
      return targetOption ? targetOption.label : params.value;
    }
  },
  {
    id: 'startDate',
    label: '시작일',
    width: 120,
    align: 'center',
    sortable: true
  },
  {
    id: 'endDate',
    label: '종료일',
    width: 120,
    align: 'center',
    sortable: true
  },
  {
    id: 'participantCount',
    label: '참여자수',
    width: 100,
    align: 'right',
    sortable: true,
    renderCell: (params) => {
      return params.value ? params.value.toLocaleString() : '0';
    }
  },
  {
    id: 'rewardAmount',
    label: '보상금액',
    width: 120,
    align: 'right',
    sortable: true,
    renderCell: (params) => {
      return params.value ? `${params.value.toLocaleString()}원` : '0원';
    }
  },
  {
    id: 'writer',
    label: '작성자',
    width: 100,
    align: 'center',
    sortable: true
  },
  {
    id: 'createdAt',
    label: '등록일',
    width: 120,
    align: 'center',
    sortable: true
  },
  {
    id: 'actions',
    label: '관리',
    width: 120,
    align: 'center',
    sortable: false,
    pinnable: false
  }
];

// 이벤트 데이터 생성 함수
export const generateEventsData = (count = 30) => {
  const events = [];
  const eventTitles = [
    '신규 회원 가입 보너스',
    '주말 특별 프로모션',
    '슬롯 토너먼트 대회',
    '첫 입금 보너스 이벤트',
    'VIP 회원 전용 이벤트',
    '월말 정산 보너스',
    '친구 추천 이벤트',
    '생일 축하 보너스',
    '연속 접속 보상',
    '대박 잭팟 이벤트',
    '카지노 챌린지',
    '럭키 드로우 이벤트',
    '시즌 특별 보너스',
    '출석체크 이벤트',
    '레벨업 축하 보너스'
  ];

  const eventDescriptions = [
    '신규 회원을 위한 특별한 혜택을 제공합니다.',
    '주말 동안 진행되는 특별 프로모션입니다.',
    '슬롯 게임 토너먼트에 참여하여 상금을 획득하세요.',
    '첫 입금 시 추가 보너스를 받을 수 있습니다.',
    'VIP 회원만을 위한 독점 이벤트입니다.',
    '월말 정산 시 추가 보너스를 지급합니다.',
    '친구를 추천하고 보상을 받으세요.',
    '생일을 맞은 회원에게 특별한 선물을 드립니다.',
    '연속으로 접속하면 보상이 증가합니다.',
    '대박 잭팟을 터뜨릴 기회입니다.',
    '다양한 카지노 게임 챌린지에 도전하세요.',
    '운이 좋은 회원에게 특별한 상품을 드립니다.',
    '시즌을 맞아 특별한 보너스를 제공합니다.',
    '매일 출석체크하고 보상을 받으세요.',
    '레벨업을 축하하는 특별한 보너스입니다.'
  ];

  for (let i = 1; i <= count; i++) {
    const titleIndex = Math.floor(Math.random() * eventTitles.length);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const now = new Date();
    let status;
    if (startDate > now) {
      status = 'scheduled';
    } else if (endDate < now) {
      status = Math.random() > 0.8 ? 'cancelled' : 'ended';
    } else {
      status = Math.random() > 0.1 ? 'active' : 'paused';
    }

    events.push({
      id: i,
      no: i,
      title: `${eventTitles[titleIndex]} ${i}`,
      content: eventDescriptions[titleIndex],
      eventType: eventTypeOptions[Math.floor(Math.random() * eventTypeOptions.length)].value,
      status: status,
      target: eventTargetOptions[Math.floor(Math.random() * eventTargetOptions.length)].value,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      participantCount: Math.floor(Math.random() * 5000),
      rewardAmount: Math.floor(Math.random() * 10000000) + 100000,
      writer: ['관리자', '이벤트팀', '마케팅팀'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  // 정렬하지 않고 원래 순서 그대로 반환
  return events;
};

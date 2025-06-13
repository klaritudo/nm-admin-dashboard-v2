// 팝업 설정 데이터 및 컬럼 정의

// 팝업 타입 옵션
export const popupTypeOptions = [
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: '이벤트' },
  { value: 'promotion', label: '프로모션' },
  { value: 'warning', label: '경고' },
  { value: 'maintenance', label: '점검안내' }
];

// 팝업 위치 옵션
export const popupPositionOptions = [
  { value: 'center', label: '중앙' },
  { value: 'top-left', label: '좌상단' },
  { value: 'top-right', label: '우상단' },
  { value: 'bottom-left', label: '좌하단' },
  { value: 'bottom-right', label: '우하단' }
];

// 팝업 상태 옵션
export const popupStatusOptions = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
  { value: 'scheduled', label: '예약' },
  { value: 'expired', label: '만료' }
];

// 팝업 대상 옵션
export const popupTargetOptions = [
  { value: 'all', label: '전체 회원' },
  { value: 'new', label: '신규 회원' },
  { value: 'vip', label: 'VIP 회원' },
  { value: 'guest', label: '비회원' },
  { value: 'mobile', label: '모바일 사용자' },
  { value: 'desktop', label: '데스크톱 사용자' }
];

// 팝업 테이블 컬럼 정의
export const popupColumns = [
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
    label: '팝업명',
    width: 200,
    align: 'left',
    sortable: true,
    pinnable: true
  },
  {
    id: 'popupType',
    label: '타입',
    width: 100,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const typeOption = popupTypeOptions.find(opt => opt.value === params.value);
      return typeOption ? typeOption.label : params.value;
    }
  },
  {
    id: 'status',
    label: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const statusOption = popupStatusOptions.find(opt => opt.value === params.value);
      return statusOption ? statusOption.label : params.value;
    }
  },
  {
    id: 'position',
    label: '위치',
    width: 100,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const positionOption = popupPositionOptions.find(opt => opt.value === params.value);
      return positionOption ? positionOption.label : params.value;
    }
  },
  {
    id: 'target',
    label: '대상',
    width: 120,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      const targetOption = popupTargetOptions.find(opt => opt.value === params.value);
      return targetOption ? targetOption.label : params.value;
    }
  },
  {
    id: 'width',
    label: '가로',
    width: 80,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      return `${params.value}px`;
    }
  },
  {
    id: 'height',
    label: '세로',
    width: 80,
    align: 'center',
    sortable: true,
    renderCell: (params) => {
      return `${params.value}px`;
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
    id: 'viewCount',
    label: '노출수',
    width: 100,
    align: 'right',
    sortable: true,
    renderCell: (params) => {
      return params.value ? params.value.toLocaleString() : '0';
    }
  },
  {
    id: 'clickCount',
    label: '클릭수',
    width: 100,
    align: 'right',
    sortable: true,
    renderCell: (params) => {
      return params.value ? params.value.toLocaleString() : '0';
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

// 팝업 데이터 생성 함수
export const generatePopupData = (count = 20) => {
  const popups = [];
  const popupTitles = [
    '신규 회원 가입 안내',
    '이벤트 참여 안내',
    '시스템 점검 공지',
    '보안 업데이트 안내',
    '새로운 게임 출시',
    '프로모션 혜택 안내',
    '고객센터 운영시간 변경',
    '약관 개정 안내',
    '특별 보너스 지급',
    '서비스 이용 안내',
    '모바일 앱 다운로드',
    'VIP 회원 혜택',
    '주말 특별 이벤트',
    '생일 축하 이벤트',
    '친구 추천 이벤트'
  ];

  const popupContents = [
    '신규 회원 가입을 환영합니다! 특별한 혜택을 확인해보세요.',
    '진행 중인 이벤트에 참여하여 다양한 보상을 받으세요.',
    '시스템 점검으로 인한 서비스 일시 중단 안내입니다.',
    '보안 강화를 위한 업데이트가 진행됩니다.',
    '새로운 게임이 출시되었습니다. 지금 바로 체험해보세요!',
    '한정 기간 프로모션 혜택을 놓치지 마세요.',
    '고객센터 운영시간이 변경되었습니다.',
    '서비스 약관이 개정되었습니다. 확인해주세요.',
    '특별 보너스가 지급되었습니다.',
    '서비스 이용 방법을 안내해드립니다.',
    '모바일 앱을 다운로드하여 더 편리하게 이용하세요.',
    'VIP 회원만의 특별한 혜택을 확인하세요.',
    '주말 동안 진행되는 특별 이벤트입니다.',
    '생일을 맞은 회원에게 특별한 선물을 드립니다.',
    '친구를 추천하고 보상을 받으세요.'
  ];

  for (let i = 1; i <= count; i++) {
    const titleIndex = Math.floor(Math.random() * popupTitles.length);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 15);
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    const now = new Date();
    let status;
    if (startDate > now) {
      status = 'scheduled';
    } else if (endDate < now) {
      status = 'expired';
    } else {
      status = Math.random() > 0.2 ? 'active' : 'inactive';
    }

    const viewCount = Math.floor(Math.random() * 50000);
    const clickCount = Math.floor(viewCount * (Math.random() * 0.1 + 0.01)); // 1-10% 클릭률

    popups.push({
      id: i,
      no: i,
      title: `${popupTitles[titleIndex]} ${i}`,
      content: popupContents[titleIndex],
      popupType: popupTypeOptions[Math.floor(Math.random() * popupTypeOptions.length)].value,
      status: status,
      position: popupPositionOptions[Math.floor(Math.random() * popupPositionOptions.length)].value,
      target: popupTargetOptions[Math.floor(Math.random() * popupTargetOptions.length)].value,
      width: [300, 400, 500, 600][Math.floor(Math.random() * 4)],
      height: [200, 300, 400, 500][Math.floor(Math.random() * 4)],
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      viewCount: viewCount,
      clickCount: clickCount,
      closeOnClick: Math.random() > 0.5,
      showOnce: Math.random() > 0.3,
      imageUrl: Math.random() > 0.5 ? `/images/popup${i % 5 + 1}.jpg` : '',
      linkUrl: Math.random() > 0.7 ? 'https://example.com' : '',
      writer: ['관리자', '마케팅팀', '운영팀'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }

  return popups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

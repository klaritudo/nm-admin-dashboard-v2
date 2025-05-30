/**
 * 회원관리 테이블 컬럼 정의
 */

export const memberColumns = [
  {
    id: 'checkbox',
    label: '',
    type: 'checkbox',
    width: 50,
    sortable: false,
    filterable: false,
    hideable: false,
    pinnable: true,
    align: 'center'
  },
  {
    id: 'number',
    label: 'No.',
    type: 'number',
    width: 70,
    sortable: true,
    filterable: false,
    hideable: false,
    pinnable: true,
    align: 'center'
  },
  {
    id: 'memberType',
    label: '유형',
    type: 'text',
    width: 80,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: true,
    align: 'center',
    filterType: 'select',
    filterOptions: [
      { value: 'all', label: '전체' },
      { value: 'normal', label: '일반' },
      { value: 'vip', label: 'VIP' },
      { value: 'agent', label: '에이전트' }
    ]
  },
  {
    id: 'userId',
    label: '아이디(닉네임)',
    type: 'text',
    width: 150,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: true,
    align: 'left',
    render: (value, row) => (
      <div>
        <div style={{ fontWeight: '700', fontSize: '14px' }}>{row.userId}</div>
        <div style={{ fontSize: '12px', color: '#9e9e9e', fontWeight: 'normal' }}>({row.nickname})</div>
      </div>
    )
  },
  {
    id: 'paymentActions',
    label: '지급/회수',
    type: 'actions',
    width: 120,
    sortable: false,
    filterable: false,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value, row) => (
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <button 
          style={{ 
            padding: '2px 8px', 
            fontSize: '11px', 
            backgroundColor: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => console.log('지급:', row.id)}
        >
          지급
        </button>
        <button 
          style={{ 
            padding: '2px 8px', 
            fontSize: '11px', 
            backgroundColor: '#f44336', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => console.log('회수:', row.id)}
        >
          회수
        </button>
      </div>
    )
  },
  {
    id: 'balance',
    label: '보유금액',
    type: 'currency',
    width: 120,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'right',
    render: (value) => `${Number(value || 0).toLocaleString()}원`
  },
  {
    id: 'gameMoney',
    label: '게임머니',
    type: 'currency',
    width: 120,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'right',
    render: (value) => `${Number(value || 0).toLocaleString()}원`
  },
  {
    id: 'rollingRate',
    label: '롤링%',
    type: 'percentage',
    width: 80,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value) => `${Number(value || 0).toFixed(1)}%`
  },
  {
    id: 'rollingAmount',
    label: '롤링금',
    type: 'currency',
    width: 120,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'right',
    render: (value) => `${Number(value || 0).toLocaleString()}원`
  },
  {
    id: 'apiStatus',
    label: 'API',
    type: 'status',
    width: 80,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    filterType: 'select',
    filterOptions: [
      { value: 'all', label: '전체' },
      { value: 'active', label: '활성' },
      { value: 'inactive', label: '비활성' }
    ],
    render: (value) => (
      <span 
        style={{ 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '11px',
          backgroundColor: value === 'active' ? '#e8f5e9' : '#ffebee',
          color: value === 'active' ? '#2e7d32' : '#c62828'
        }}
      >
        {value === 'active' ? '활성' : '비활성'}
      </span>
    )
  },
  {
    id: 'depositWithdraw',
    label: '입금/출금',
    type: 'actions',
    width: 120,
    sortable: false,
    filterable: false,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value, row) => (
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        <button 
          style={{ 
            padding: '2px 8px', 
            fontSize: '11px', 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => console.log('입금:', row.id)}
        >
          입금
        </button>
        <button 
          style={{ 
            padding: '2px 8px', 
            fontSize: '11px', 
            backgroundColor: '#ff9800', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          onClick={() => console.log('출금:', row.id)}
        >
          출금
        </button>
      </div>
    )
  },
  {
    id: 'connectionStatus',
    label: '접속상태',
    type: 'status',
    width: 100,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    filterType: 'select',
    filterOptions: [
      { value: 'all', label: '전체' },
      { value: 'online', label: '온라인' },
      { value: 'offline', label: '오프라인' }
    ],
    render: (value) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
        <div 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: value === 'online' ? '#4caf50' : '#9e9e9e' 
          }}
        />
        <span style={{ fontSize: '12px' }}>
          {value === 'online' ? '온라인' : '오프라인'}
        </span>
      </div>
    )
  },
  {
    id: 'lastGame',
    label: '마지막게임',
    type: 'text',
    width: 120,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center'
  },
  {
    id: 'realName',
    label: '이름',
    type: 'text',
    width: 100,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center'
  },
  {
    id: 'accountNumber',
    label: '계좌번호',
    type: 'text',
    width: 150,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value) => value ? `****-****-${value.slice(-4)}` : '-'
  },
  {
    id: 'bankName',
    label: '은행',
    type: 'text',
    width: 100,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center'
  },
  {
    id: 'profitLoss',
    label: '손익',
    type: 'group',
    width: 300,
    sortable: false,
    filterable: false,
    hideable: true,
    pinnable: false,
    align: 'center',
    subColumns: [
      {
        id: 'slotProfit',
        label: '슬롯',
        type: 'currency',
        width: 100,
        align: 'right',
        render: (value) => (
          <span style={{ color: value >= 0 ? '#4caf50' : '#f44336' }}>
            {value >= 0 ? '+' : ''}{Number(value || 0).toLocaleString()}원
          </span>
        )
      },
      {
        id: 'casinoProfit',
        label: '카지노',
        type: 'currency',
        width: 100,
        align: 'right',
        render: (value) => (
          <span style={{ color: value >= 0 ? '#4caf50' : '#f44336' }}>
            {value >= 0 ? '+' : ''}{Number(value || 0).toLocaleString()}원
          </span>
        )
      },
      {
        id: 'totalProfit',
        label: '종합',
        type: 'currency',
        width: 100,
        align: 'right',
        render: (value) => (
          <span style={{ 
            color: value >= 0 ? '#4caf50' : '#f44336',
            fontWeight: 'bold'
          }}>
            {value >= 0 ? '+' : ''}{Number(value || 0).toLocaleString()}원
          </span>
        )
      }
    ]
  },
  {
    id: 'lastLoginDate',
    label: '접속일',
    type: 'datetime',
    width: 150,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
  {
    id: 'registrationDate',
    label: '가입일',
    type: 'datetime',
    width: 150,
    sortable: true,
    filterable: true,
    hideable: true,
    pinnable: false,
    align: 'center',
    render: (value) => value ? new Date(value).toLocaleDateString('ko-KR') : '-'
  },
  {
    id: 'actions',
    label: '작업',
    type: 'actions',
    width: 120,
    sortable: false,
    filterable: false,
    hideable: false,
    pinnable: true,
    align: 'center'
  }
];

// 필터 옵션 정의
export const memberFilterOptions = [
  {
    key: 'memberType',
    label: '회원 유형',
    type: 'select',
    options: [
      { value: 'all', label: '전체' },
      { value: 'normal', label: '일반' },
      { value: 'vip', label: 'VIP' },
      { value: 'agent', label: '에이전트' }
    ]
  },
  {
    key: 'connectionStatus',
    label: '접속 상태',
    type: 'select',
    options: [
      { value: 'all', label: '전체' },
      { value: 'online', label: '온라인' },
      { value: 'offline', label: '오프라인' }
    ]
  },
  {
    key: 'apiStatus',
    label: 'API 상태',
    type: 'select',
    options: [
      { value: 'all', label: '전체' },
      { value: 'active', label: '활성' },
      { value: 'inactive', label: '비활성' }
    ]
  },
  {
    key: 'dateRange',
    label: '가입일 범위',
    type: 'dateRange'
  }
]; 
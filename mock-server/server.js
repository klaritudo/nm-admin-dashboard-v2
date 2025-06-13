const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

// 미들웨어
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://49.171.117.184:5173"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mock server is running' });
});

// 회원 데이터 목 API
app.get('/api/members', (req, res) => {
  const mockMembers = [
    {
      id: 1,
      username: 'user001',
      nickname: '행운의별',
      level: '회원Lv1',
      status: 'active',
      balance: 1500000,
      lastLogin: new Date().toISOString()
    },
    {
      id: 2,
      username: 'user002',
      nickname: '황금손',
      level: '회원Lv2',
      status: 'active',
      balance: 2300000,
      lastLogin: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: mockMembers,
    total: mockMembers.length
  });
});

// 정산 데이터 목 API
app.get('/api/settlement', (req, res) => {
  const mockSettlement = [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      slotBetting: 50000000,
      slotWinning: 45000000,
      slotProfit: 5000000,
      casinoBetting: 30000000,
      casinoWinning: 27000000,
      casinoProfit: 3000000
    }
  ];
  
  res.json({
    success: true,
    data: mockSettlement,
    total: mockSettlement.length
  });
});

// 베팅 데이터 목 API
app.get('/api/betting', (req, res) => {
  const mockBetting = [
    {
      id: 1,
      userId: 'user001',
      gameType: 'slot',
      betAmount: 10000,
      winAmount: 15000,
      createdAt: new Date().toISOString()
    }
  ];
  
  res.json({
    success: true,
    data: mockBetting,
    total: mockBetting.length
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Mock server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock server is running on http://0.0.0.0:${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
}); 
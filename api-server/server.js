const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { Server } = require('socket.io');
const db = require('./database');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000", "http://49.171.117.184:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://49.171.117.184:5173"],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Socket.IO 연결 관리
io.on('connection', (socket) => {
  console.log('클라이언트가 연결되었습니다:', socket.id);
  
  // 클라이언트가 단계 설정 페이지에 접속했을 때
  socket.on('join-agent-levels', () => {
    socket.join('agent-levels');
    console.log('클라이언트가 agent-levels 룸에 참가했습니다:', socket.id);
  });
  
  // 클라이언트가 테이블 페이지에 접속했을 때
  socket.on('join-table-updates', () => {
    socket.join('table-updates');
    console.log('클라이언트가 table-updates 룸에 참가했습니다:', socket.id);
  });

  // 다른 페이지에서 초기 데이터 요청 (Socket 전용)
  socket.on('request-agent-levels', () => {
    console.log('Socket을 통한 에이전트 레벨 데이터 요청:', socket.id);
    
    const sql = 'SELECT * FROM agent_levels ORDER BY hierarchyOrder ASC, id ASC';
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Socket 데이터 조회 실패:', err.message);
        socket.emit('agent-levels-data', { 
          success: false, 
          error: '데이터 조회에 실패했습니다.' 
        });
      } else {
        console.log(`Socket을 통해 ${rows.length}개의 에이전트 레벨 데이터 전송:`, socket.id);
        socket.emit('agent-levels-data', {
          success: true,
          data: rows,
          count: rows.length
        });
      }
    });
  });
  
  // 연결 해제
  socket.on('disconnect', () => {
    console.log('클라이언트가 연결을 해제했습니다:', socket.id);
  });
});

// Socket.IO 인스턴스를 전역으로 사용할 수 있도록 설정
global.io = io;

// 에이전트 레벨 API 라우트

// 1. 모든 에이전트 레벨 조회
app.get('/api/agent-levels', (req, res) => {
  const sql = 'SELECT * FROM agent_levels ORDER BY hierarchyOrder ASC, id ASC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('데이터 조회 실패:', err.message);
      res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
    } else {
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    }
  });
});

// 2. 특정 에이전트 레벨 조회
app.get('/api/agent-levels/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM agent_levels WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('데이터 조회 실패:', err.message);
      res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
    } else if (!row) {
      res.status(404).json({ error: '해당 레벨을 찾을 수 없습니다.' });
    } else {
      res.json({
        success: true,
        data: row
      });
    }
  });
});

// 3. 새 에이전트 레벨 추가
app.post('/api/agent-levels', (req, res) => {
  const { levelType, permissions, hierarchyOrder, backgroundColor, borderColor } = req.body;
  
  // 입력 검증
  if (!levelType || !permissions) {
    return res.status(400).json({ 
      error: '단계 이름과 권한은 필수 입력 항목입니다.' 
    });
  }
  
  // hierarchyOrder가 지정되지 않은 경우 최대값 + 1로 설정
  if (!hierarchyOrder) {
    const maxOrderSql = 'SELECT MAX(hierarchyOrder) as maxOrder FROM agent_levels';
    
    db.get(maxOrderSql, [], (err, row) => {
      if (err) {
        console.error('최대 순서 조회 실패:', err.message);
        return res.status(500).json({ error: '데이터 처리에 실패했습니다.' });
      }
      
      const newOrder = (row.maxOrder || 0) + 1;
      insertAgentLevel(newOrder);
    });
  } else {
    insertAgentLevel(hierarchyOrder);
  }
  
  function insertAgentLevel(order) {
  const sql = `
      INSERT INTO agent_levels (levelType, permissions, hierarchyOrder, backgroundColor, borderColor)
      VALUES (?, ?, ?, ?, ?)
  `;
  
  const params = [
    levelType.trim(),
    permissions.trim(),
      order,
    backgroundColor || '#e8f5e9',
    borderColor || '#2e7d32'
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('데이터 추가 실패:', err.message);
      res.status(500).json({ error: '데이터 추가에 실패했습니다.' });
    } else {
      // 추가된 데이터 조회
      const selectSql = 'SELECT * FROM agent_levels WHERE id = ?';
      db.get(selectSql, [this.lastID], (err, row) => {
        if (err) {
          console.error('추가된 데이터 조회 실패:', err.message);
          res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
        } else {
          // Socket.IO로 실시간 업데이트 전송
          if (global.io) {
            global.io.to('agent-levels').emit('agent-level-added', row);
            global.io.to('table-updates').emit('agent-levels-updated', { type: 'added', data: row });
          }
          
          res.status(201).json({
            success: true,
            message: '에이전트 레벨이 성공적으로 추가되었습니다.',
            data: row
          });
        }
      });
    }
  });
  }
});

// 4. 에이전트 레벨 수정
app.put('/api/agent-levels/:id', (req, res) => {
  const { id } = req.params;
  const { levelType, permissions, hierarchyOrder, backgroundColor, borderColor } = req.body;
  
  // 입력 검증
  if (!levelType || !permissions) {
    return res.status(400).json({ 
      error: '단계 이름과 권한은 필수 입력 항목입니다.' 
    });
  }
  
  const sql = `
    UPDATE agent_levels 
    SET levelType = ?, permissions = ?, hierarchyOrder = ?, backgroundColor = ?, borderColor = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const params = [
    levelType.trim(),
    permissions.trim(),
    hierarchyOrder || 0,
    backgroundColor || '#e8f5e9',
    borderColor || '#2e7d32',
    id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('데이터 수정 실패:', err.message);
      res.status(500).json({ error: '데이터 수정에 실패했습니다.' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '해당 레벨을 찾을 수 없습니다.' });
    } else {
      // 수정된 데이터 조회
      const selectSql = 'SELECT * FROM agent_levels WHERE id = ?';
      db.get(selectSql, [id], (err, row) => {
        if (err) {
          console.error('수정된 데이터 조회 실패:', err.message);
          res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
        } else {
          // Socket.IO로 실시간 업데이트 전송
          if (global.io) {
            global.io.to('agent-levels').emit('agent-level-updated', row);
            global.io.to('table-updates').emit('agent-levels-updated', { type: 'updated', data: row });
          }
          
          res.json({
            success: true,
            message: '에이전트 레벨이 성공적으로 수정되었습니다.',
            data: row
          });
        }
      });
    }
  });
});

// 5. 에이전트 레벨 삭제
app.delete('/api/agent-levels/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM agent_levels WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('데이터 삭제 실패:', err.message);
      res.status(500).json({ error: '데이터 삭제에 실패했습니다.' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '해당 레벨을 찾을 수 없습니다.' });
    } else {
      // Socket.IO로 실시간 업데이트 전송
      if (global.io) {
        global.io.to('agent-levels').emit('agent-level-deleted', { id });
        global.io.to('table-updates').emit('agent-levels-updated', { type: 'deleted', id });
      }
      
      res.json({
        success: true,
        message: '에이전트 레벨이 성공적으로 삭제되었습니다.'
      });
    }
  });
});

// 6. 에이전트 레벨 계층 순서 변경
app.put('/api/agent-levels/:id/hierarchy-order', (req, res) => {
  const { id } = req.params;
  const { newOrder } = req.body;
  
  // 입력 검증
  if (!newOrder || newOrder < 1) {
    return res.status(400).json({ 
      error: '올바른 순서 값을 입력해주세요.' 
    });
  }
  
  // 트랜잭션으로 순서 변경 처리
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // 현재 레벨의 기존 순서 조회
    const getCurrentOrderSql = 'SELECT hierarchyOrder FROM agent_levels WHERE id = ?';
    
    db.get(getCurrentOrderSql, [id], (err, row) => {
      if (err) {
        db.run('ROLLBACK');
        return res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
      }
      
      if (!row) {
        db.run('ROLLBACK');
        return res.status(404).json({ error: '해당 레벨을 찾을 수 없습니다.' });
      }
      
      const currentOrder = row.hierarchyOrder;
      
      if (currentOrder === newOrder) {
        db.run('ROLLBACK');
        return res.json({
          success: true,
          message: '순서가 변경되지 않았습니다.',
          data: row
        });
      }
      
      // 다른 레벨들의 순서 조정
      let updateOthersSql;
      if (newOrder > currentOrder) {
        // 아래로 이동: 사이에 있는 레벨들을 위로 이동
        updateOthersSql = `
          UPDATE agent_levels 
          SET hierarchyOrder = hierarchyOrder - 1 
          WHERE hierarchyOrder > ? AND hierarchyOrder <= ? AND id != ?
        `;
      } else {
        // 위로 이동: 사이에 있는 레벨들을 아래로 이동
        updateOthersSql = `
          UPDATE agent_levels 
          SET hierarchyOrder = hierarchyOrder + 1 
          WHERE hierarchyOrder >= ? AND hierarchyOrder < ? AND id != ?
        `;
      }
      
      const updateParams = newOrder > currentOrder 
        ? [currentOrder, newOrder, id]
        : [newOrder, currentOrder, id];
      
      db.run(updateOthersSql, updateParams, (err) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: '순서 조정에 실패했습니다.' });
        }
        
        // 대상 레벨의 순서 변경
        const updateTargetSql = `
          UPDATE agent_levels 
          SET hierarchyOrder = ?, updatedAt = CURRENT_TIMESTAMP 
          WHERE id = ?
        `;
        
        db.run(updateTargetSql, [newOrder, id], function(err) {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: '순서 변경에 실패했습니다.' });
          }
          
          db.run('COMMIT', (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: '트랜잭션 커밋에 실패했습니다.' });
            }
            
            // 변경된 데이터 조회
            const selectSql = 'SELECT * FROM agent_levels WHERE id = ?';
            db.get(selectSql, [id], (err, updatedRow) => {
              if (err) {
                return res.status(500).json({ error: '변경된 데이터 조회에 실패했습니다.' });
              }
              
              res.json({
                success: true,
                message: '계층 순서가 성공적으로 변경되었습니다.',
                data: updatedRow
              });
            });
          });
        });
      });
    });
  });
});

// 권한 관리 API 라우트

// 1. 모든 권한 조회
app.get('/api/permissions', (req, res) => {
  const sql = 'SELECT * FROM permissions ORDER BY id ASC';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('권한 데이터 조회 실패:', err.message);
      res.status(500).json({ error: '권한 데이터 조회에 실패했습니다.' });
    } else {
      // restrictions 필드를 JSON으로 파싱
      const processedRows = rows.map(row => ({
        ...row,
        restrictions: row.restrictions ? JSON.parse(row.restrictions) : { menus: [], buttons: [], layouts: [], cssSelectors: [] }
      }));
      
      res.json({
        success: true,
        data: processedRows,
        count: processedRows.length
      });
    }
  });
});

// 2. 특정 권한 조회
app.get('/api/permissions/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM permissions WHERE id = ?';
  
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('권한 데이터 조회 실패:', err.message);
      res.status(500).json({ error: '권한 데이터 조회에 실패했습니다.' });
    } else if (!row) {
      res.status(404).json({ error: '해당 권한을 찾을 수 없습니다.' });
    } else {
      // restrictions 필드를 JSON으로 파싱
      const processedRow = {
        ...row,
        restrictions: row.restrictions ? JSON.parse(row.restrictions) : { menus: [], buttons: [], layouts: [], cssSelectors: [] }
      };
      
      res.json({
        success: true,
        data: processedRow
      });
    }
  });
});

// 3. 새 권한 추가
app.post('/api/permissions', (req, res) => {
  const { permissionName, description, isActive, restrictions } = req.body;
  
  // 입력 검증
  if (!permissionName) {
    return res.status(400).json({ 
      error: '권한명은 필수 입력 항목입니다.' 
    });
  }
  
  // restrictions를 JSON 문자열로 변환
  const restrictionsJson = restrictions ? JSON.stringify(restrictions) : JSON.stringify({ menus: [], buttons: [], layouts: [], cssSelectors: [] });
  
  const sql = `
    INSERT INTO permissions (permissionName, description, isActive, restrictions)
    VALUES (?, ?, ?, ?)
  `;
  
  const params = [
    permissionName.trim(),
    description ? description.trim() : '',
    isActive !== undefined ? isActive : 1,
    restrictionsJson
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('권한 데이터 추가 실패:', err.message);
      res.status(500).json({ error: '권한 데이터 추가에 실패했습니다.' });
    } else {
      // 추가된 데이터 조회
      const selectSql = 'SELECT * FROM permissions WHERE id = ?';
      db.get(selectSql, [this.lastID], (err, row) => {
        if (err) {
          console.error('추가된 권한 데이터 조회 실패:', err.message);
          res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
        } else {
          // restrictions 필드를 JSON으로 파싱
          const processedRow = {
            ...row,
            restrictions: row.restrictions ? JSON.parse(row.restrictions) : { menus: [], buttons: [], layouts: [], cssSelectors: [] }
          };
          
          res.status(201).json({
            success: true,
            message: '권한이 성공적으로 추가되었습니다.',
            data: processedRow
          });
        }
      });
    }
  });
});

// 4. 권한 수정
app.put('/api/permissions/:id', (req, res) => {
  const { id } = req.params;
  const { permissionName, description, isActive, restrictions } = req.body;
  
  // 입력 검증
  if (!permissionName) {
    return res.status(400).json({ 
      error: '권한명은 필수 입력 항목입니다.' 
    });
  }
  
  // restrictions를 JSON 문자열로 변환
  const restrictionsJson = restrictions ? JSON.stringify(restrictions) : JSON.stringify({ menus: [], buttons: [], layouts: [], cssSelectors: [] });
  
  const sql = `
    UPDATE permissions 
    SET permissionName = ?, description = ?, isActive = ?, restrictions = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  const params = [
    permissionName.trim(),
    description ? description.trim() : '',
    isActive !== undefined ? isActive : 1,
    restrictionsJson,
    id
  ];
  
  db.run(sql, params, function(err) {
    if (err) {
      console.error('권한 데이터 수정 실패:', err.message);
      res.status(500).json({ error: '권한 데이터 수정에 실패했습니다.' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '해당 권한을 찾을 수 없습니다.' });
    } else {
      // 수정된 데이터 조회
      const selectSql = 'SELECT * FROM permissions WHERE id = ?';
      db.get(selectSql, [id], (err, row) => {
        if (err) {
          console.error('수정된 권한 데이터 조회 실패:', err.message);
          res.status(500).json({ error: '데이터 조회에 실패했습니다.' });
        } else {
          // restrictions 필드를 JSON으로 파싱
          const processedRow = {
            ...row,
            restrictions: row.restrictions ? JSON.parse(row.restrictions) : { menus: [], buttons: [], layouts: [], cssSelectors: [] }
          };
          
          res.json({
            success: true,
            message: '권한이 성공적으로 수정되었습니다.',
            data: processedRow
          });
        }
      });
    }
  });
});

// 5. 권한 삭제
app.delete('/api/permissions/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM permissions WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error('권한 데이터 삭제 실패:', err.message);
      res.status(500).json({ error: '권한 데이터 삭제에 실패했습니다.' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: '해당 권한을 찾을 수 없습니다.' });
    } else {
      res.json({
        success: true,
        message: '권한이 성공적으로 삭제되었습니다.'
      });
    }
  });
});

// 서버 시작
server.listen(PORT, '0.0.0.0', () => {
  console.log(`API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`Socket.IO 서버가 활성화되었습니다.`);
  console.log(`http://0.0.0.0:${PORT}`);
  console.log(`외부 접속: http://49.171.117.184:${PORT}`);
});

// 서버 종료 시 데이터베이스 연결 해제
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('데이터베이스 연결 해제 실패:', err.message);
    } else {
      console.log('데이터베이스 연결이 해제되었습니다.');
    }
    process.exit(0);
  });
});
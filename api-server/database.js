const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 파일 경로
const dbPath = path.join(__dirname, 'agent_levels.db');

// 데이터베이스 연결
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 실패:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
  }
});

// agent_levels 테이블 생성
const createAgentLevelsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS agent_levels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      levelType TEXT NOT NULL,
      permissions TEXT NOT NULL,
      hierarchyOrder INTEGER DEFAULT 0,
      backgroundColor TEXT DEFAULT '#e8f5e9',
      borderColor TEXT DEFAULT '#2e7d32',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('agent_levels 테이블 생성 실패:', err.message);
    } else {
      console.log('agent_levels 테이블이 생성되었습니다.');
      // 기존 테이블에 hierarchyOrder 컬럼이 없는 경우 추가
      addHierarchyOrderColumnIfNotExists();
      insertAgentLevelsInitialData();
    }
  });
};

// permissions 테이블 생성
const createPermissionsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      permissionName TEXT NOT NULL,
      description TEXT,
      isActive BOOLEAN DEFAULT 1,
      restrictions TEXT DEFAULT '{"menus":[],"buttons":[],"layouts":[],"cssSelectors":[]}',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(sql, (err) => {
    if (err) {
      console.error('permissions 테이블 생성 실패:', err.message);
    } else {
      console.log('permissions 테이블이 생성되었습니다.');
      // 기존 테이블에 restrictions 컬럼이 없는 경우 추가
      addRestrictionsColumnIfNotExists();
      insertPermissionsInitialData();
    }
  });
};

// restrictions 컬럼 추가 (기존 테이블 호환성)
const addRestrictionsColumnIfNotExists = () => {
  // 컬럼 존재 여부 확인
  const checkColumnSql = "PRAGMA table_info(permissions)";
  
  db.all(checkColumnSql, (err, rows) => {
    if (err) {
      console.error('permissions 테이블 정보 확인 실패:', err.message);
      return;
    }
    
    // restrictions 컬럼이 있는지 확인
    const hasRestrictionsColumn = rows.some(row => row.name === 'restrictions');
    
    if (!hasRestrictionsColumn) {
      // restrictions 컬럼 추가
      const addColumnSql = `
        ALTER TABLE permissions 
        ADD COLUMN restrictions TEXT DEFAULT '{"menus":[],"buttons":[],"layouts":[],"cssSelectors":[]}'
      `;
      
      db.run(addColumnSql, (err) => {
        if (err) {
          console.error('restrictions 컬럼 추가 실패:', err.message);
        } else {
          console.log('permissions 테이블에 restrictions 컬럼이 추가되었습니다.');
          
          // 기존 데이터의 restrictions 필드를 기본값으로 업데이트
          const updateSql = `
            UPDATE permissions 
            SET restrictions = '{"menus":[],"buttons":[],"layouts":[],"cssSelectors":[]}' 
            WHERE restrictions IS NULL
          `;
          
          db.run(updateSql, (err) => {
            if (err) {
              console.error('기존 데이터 restrictions 업데이트 실패:', err.message);
            } else {
              console.log('기존 permissions 데이터의 restrictions 필드가 업데이트되었습니다.');
            }
          });
        }
      });
    }
  });
};

// hierarchyOrder 컬럼 추가 (기존 테이블 호환성)
const addHierarchyOrderColumnIfNotExists = () => {
  // 컬럼 존재 여부 확인
  const checkColumnSql = "PRAGMA table_info(agent_levels)";
  
  db.all(checkColumnSql, (err, rows) => {
    if (err) {
      console.error('agent_levels 테이블 정보 확인 실패:', err.message);
      return;
    }
    
    // hierarchyOrder 컬럼이 있는지 확인
    const hasHierarchyOrderColumn = rows.some(row => row.name === 'hierarchyOrder');
    
    if (!hasHierarchyOrderColumn) {
      // hierarchyOrder 컬럼 추가
      const addColumnSql = `
        ALTER TABLE agent_levels 
        ADD COLUMN hierarchyOrder INTEGER DEFAULT 0
      `;
      
      db.run(addColumnSql, (err) => {
        if (err) {
          console.error('hierarchyOrder 컬럼 추가 실패:', err.message);
        } else {
          console.log('agent_levels 테이블에 hierarchyOrder 컬럼이 추가되었습니다.');
          
          // 기존 데이터의 hierarchyOrder를 순차적으로 설정
          const updateSql = `
            UPDATE agent_levels 
            SET hierarchyOrder = (
              SELECT COUNT(*) 
              FROM agent_levels AS a2 
              WHERE a2.id <= agent_levels.id
            )
            WHERE hierarchyOrder = 0
          `;
          
          db.run(updateSql, (err) => {
            if (err) {
              console.error('기존 데이터 hierarchyOrder 업데이트 실패:', err.message);
            } else {
              console.log('기존 agent_levels 데이터의 hierarchyOrder 필드가 업데이트되었습니다.');
            }
          });
        }
      });
    }
  });
};

// agent_levels 초기 데이터 삽입
const insertAgentLevelsInitialData = () => {
  const checkSql = 'SELECT COUNT(*) as count FROM agent_levels';
  
  db.get(checkSql, (err, row) => {
    if (err) {
      console.error('agent_levels 데이터 확인 실패:', err.message);
      return;
    }
    
    // 데이터가 없으면 초기 데이터 삽입
    if (row.count === 0) {
      const initialData = [
        {
          levelType: '슈퍼관리자',
          permissions: '시스템 전체 관리, 사용자 관리, 설정 변경',
          hierarchyOrder: 1,
          backgroundColor: '#e8f5e9',
          borderColor: '#2e7d32'
        },
        {
          levelType: '관리자',
          permissions: '사용자 관리, 콘텐츠 관리, 통계 조회',
          hierarchyOrder: 2,
          backgroundColor: '#e3f2fd',
          borderColor: '#1565c0'
        },
        {
          levelType: '운영자',
          permissions: '콘텐츠 관리, 고객 지원, 기본 통계 조회',
          hierarchyOrder: 3,
          backgroundColor: '#fff3e0',
          borderColor: '#e65100'
        },
        {
          levelType: '에이전트',
          permissions: '고객 지원, 기본 조회',
          hierarchyOrder: 4,
          backgroundColor: '#f3e5f5',
          borderColor: '#7b1fa2'
        },
        {
          levelType: '게스트',
          permissions: '기본 조회만 가능',
          hierarchyOrder: 5,
          backgroundColor: '#ffebee',
          borderColor: '#c62828'
        }
      ];
      
      const insertSql = `
        INSERT INTO agent_levels (levelType, permissions, hierarchyOrder, backgroundColor, borderColor)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      initialData.forEach((data) => {
        db.run(insertSql, [data.levelType, data.permissions, data.hierarchyOrder, data.backgroundColor, data.borderColor], (err) => {
          if (err) {
            console.error('agent_levels 초기 데이터 삽입 실패:', err.message);
          }
        });
      });
      
      console.log('agent_levels 초기 데이터가 삽입되었습니다.');
    }
  });
};

// permissions 초기 데이터 삽입
const insertPermissionsInitialData = () => {
  const checkSql = 'SELECT COUNT(*) as count FROM permissions';
  
  db.get(checkSql, (err, row) => {
    if (err) {
      console.error('permissions 데이터 확인 실패:', err.message);
      return;
    }
    
    // 데이터가 없으면 초기 데이터 삽입
    if (row.count === 0) {
      const initialData = [
        {
          permissionName: '사용자 관리',
          description: '사용자 계정 생성, 수정, 삭제 권한',
          isActive: 1
        },
        {
          permissionName: '콘텐츠 관리',
          description: '게시물 및 콘텐츠 관리 권한',
          isActive: 1
        },
        {
          permissionName: '시스템 설정',
          description: '시스템 전반적인 설정 변경 권한',
          isActive: 1
        },
        {
          permissionName: '통계 조회',
          description: '각종 통계 및 리포트 조회 권한',
          isActive: 1
        },
        {
          permissionName: '고객 지원',
          description: '고객 문의 및 지원 업무 권한',
          isActive: 0
        }
      ];
      
      const insertSql = `
        INSERT INTO permissions (permissionName, description, isActive)
        VALUES (?, ?, ?)
      `;
      
      initialData.forEach((data) => {
        db.run(insertSql, [data.permissionName, data.description, data.isActive], (err) => {
          if (err) {
            console.error('permissions 초기 데이터 삽입 실패:', err.message);
          }
        });
      });
      
      console.log('permissions 초기 데이터가 삽입되었습니다.');
    }
  });
};

// 데이터베이스 초기화
createAgentLevelsTable();
createPermissionsTable();

module.exports = db;
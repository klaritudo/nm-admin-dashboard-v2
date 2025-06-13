# 슬롯 설정 페이지 Sequential/Page Number Toggle 테스트 리포트

## 테스트 환경
- 개발 서버: http://localhost:5173
- 테스트 페이지: /game-settings/slot
- 브라우저: 개발자 도구의 Console 탭 확인

## 테스트 단계

### 1. 페이지 접속
- URL: http://localhost:5173/game-settings/slot
- 초기 로드 시 예상 로그:

```javascript
// SlotSettingPage.jsx:293에서 출력
CellRenderer 호출: {
  columnId: "no", 
  columnType: "number", 
  sequentialPageNumbers: true, // 초기값 true
  page: 0, 
  rowIndex: 0
}

// CellRenderer.jsx:89에서 출력 (모든 행에서)
CellRenderer 번호 컬럼 렌더링 [행0]: {
  sequentialPageNumbers: true,
  page: 0,
  rowsPerPage: 10,
  rowIndex: 0,
  displayNumber: 1,
  columnId: "no",
  rowData: "vendor_id"
}
```

### 2. 토글 버튼 클릭
- 위치: 테이블 헤더의 "연속번호/페이지별번호" 토글 버튼
- 클릭 시 예상 로그:

```javascript
// SlotSettingPage.jsx:301에서 출력
슬롯 페이지 번호 모드 토글: false // true에서 false로 변경
토글 후 sequentialPageNumbers 값: false

// SlotSettingPage.jsx:556에서 출력
SlotSettingPage finalColumns: [
  {id: "no", type: "number", label: "No."},
  // ... 기타 컬럼들
]

// 테이블 리렌더링 후 CellRenderer.jsx:89에서 출력
CellRenderer 번호 컬럼 렌더링 [행0]: {
  sequentialPageNumbers: false, // false로 변경됨
  page: 0,
  rowsPerPage: 10,
  rowIndex: 0,
  displayNumber: 1, // 첫 페이지에서는 동일하게 1
  columnId: "no",
  rowData: "vendor_id"
}
```

### 3. UI 변화 확인
- **연속번호 모드 (초기값)**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
- **페이지별번호 모드**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (첫 페이지에서는 동일)

### 4. 페이지 변경 후 차이 확인
페이지를 2페이지로 변경했을 때:
- **연속번호 모드**: 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
- **페이지별번호 모드**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

## 중요한 확인 포인트

1. **useTableHeader 훅의 onTogglePageNumberMode 콜백 실행**
   - SlotSettingPage.jsx:300-303 라인의 로그 출력 확인

2. **CellRenderer의 번호 계산 로직**
   - CellRenderer.jsx:75-98 라인의 로직 실행 확인
   - sequentialPageNumbers 값에 따른 displayNumber 계산 차이

3. **테이블 리렌더링**
   - SlotSettingPage.jsx:505의 useEffect가 실행되어 tableKey 업데이트
   - BaseTable 컴포넌트 리렌더링으로 인한 CellRenderer 재호출

## 실제 테스트 결과
[여기에 브라우저 Console에서 확인한 실제 로그 내용을 기록하세요]

### 초기 로드 시 로그:
```
[실제 로그 내용]
```

### 토글 클릭 시 로그:
```
[실제 로그 내용]
```

### UI 변화:
- [ ] 번호 컬럼이 올바르게 업데이트됨
- [ ] 토글 상태가 UI에 반영됨
- [ ] 에러나 경고 없음

## 문제점 (있는 경우):
[발견된 문제점이나 예상과 다른 동작 기록]
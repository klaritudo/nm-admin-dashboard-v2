# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (admin-dashboard)
```bash
# Development
cd admin-dashboard
npm install          # Install dependencies
npm run dev          # Start dev server on port 5173
npm run devboard     # Alternative dev server on port 5175
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Services
```bash
# API Server
cd api-server
npm install
npm start            # Production mode
npm run dev          # Development with nodemon

# Mock Server
cd mock-server
npm install
npm start            # Production mode
npm run dev          # Development with nodemon
```

## Architecture Overview

### Component Architecture - BaseTemplate System

This codebase uses a sophisticated reusable component system. All data management pages (Members, Settlement, Transactions, etc.) are built using the BaseTemplate components:

- **BaseTable**: Core table with sorting, filtering, selection, column management
- **TableHeader**: Unified header with search, filters, and action buttons
- **PageContainer**: Standard page layout wrapper
- **TableFilterAndPagination**: Combined filter toolbar and pagination

### Data Loading Pattern - usePageData Hook

All pages use the universal `usePageData` hook for data management:

```javascript
const { data, types, typeHierarchy, isLoading, error } = usePageData({
  pageType: 'members',              // Page identifier
  dataGenerator: customGenerator,    // Optional custom data generator
  requiresMembersData: false        // For 2-stage data structures
});
```

### State Management

Redux Toolkit with Redux Persist for global state:
- Each feature has its own slice in `features/`
- Automatic persistence configuration
- API service layer in `services/api.js` with centralized endpoints

### Dynamic Type System

The codebase implements a hierarchical type system for categorizing data:
- Types define visual properties (colors, labels)
- Type hierarchy defines parent-child relationships
- Used for member roles, game categories, etc.

### Page Creation Pattern

When creating new pages:
1. Use `usePageData` for data loading
2. Compose hooks from `baseTemplate/hooks/` for features
3. Use BaseTemplate components for UI
4. Follow the existing page structure in `pages/`

### Column Configuration

Tables use a column configuration pattern with action handlers:
```javascript
const columns = [
  { id: 'userId', label: '아이디', width: 150, sortable: true },
  { id: 'actions', label: '액션', width: 100, buttons: [...] }
];
```

### Performance Considerations

- Heavy use of `useMemo` and `useCallback` for optimization
- Virtual pagination for large datasets
- Debounced search inputs
- State persistence for critical data

## Key Patterns to Follow

1. **Always use the BaseTemplate system** - Don't create custom tables from scratch
2. **Follow the usePageData pattern** - For consistent data loading
3. **Add API endpoints to services/api.js** - Centralized API management
4. **Create feature slices for new domains** - Keep state organized
5. **Use the existing hook composition pattern** - Reuse logic through hooks
6. **Follow the column configuration pattern** - For table definitions
7. **Use the dynamic type system** - For hierarchical data

## Project Overview

본 프로젝트는 도박사이트 관리자와 유저페이지 및 DB 제작 및 외부 API와 연결 개발을 목표로 하고 있습니다.

## Development Guidelines

### 1. 정확성
- 임의로 규칙을 해석하거나 변경하지 않습니다
- 모든 테스트 케이스는 명확한 근거가 있어야 합니다
- 요청사항 및 질문 등 모든 대화를 먼저 정확히 이해해야 합니다

### 2. 체계성
- 테스트는 기능별로 체계적으로 구성해야 합니다
- 각 테스트 케이스의 목적이 명확해야 합니다
- 테스트 결과를 쉽게 확인할 수 있어야 합니다

### 3. 완전성
- 모든 가능한 케이스를 테스트해야 합니다
- 엣지 케이스도 반드시 포함해야 합니다
- 누락된 케이스가 없어야 합니다

### 4. 신뢰성
- 테스트 코드가 안정적으로 동작해야 합니다
- 동일한 입력에 대해 항상 동일한 결과가 나와야 합니다
- 오류가 발생하면 명확한 메시지를 제공해야 합니다

### 5. 유지보수성
- 테스트 코드는 읽기 쉽게 작성되어야 합니다
- 필요한 경우 쉽게 수정할 수 있어야 합니다
- 주석과 문서화가 잘 되어있어야 합니다
- 코드가 이미 완성형이거나 수정되어 문제가 없는 경우 다른 수정 사항에 의해 수정되지 않습니다. 꼭 필요한 경우 허락을 받습니다

### 6. 코드 변경 프로세스
- 코드를 적용시키기 전 필수적으로 관련 파일을 모두 나열하여 분석한 후 중복과 충돌여부 그리고 정확성, 체계성, 완전성, 신뢰성을 먼저 검사합니다
- 각 문제에 대한 해결 방안을 제시하고 실행하기 전에 먼저 검토를 받고 진행합니다
- 정상적 기능을 하는 기존 코드와 디자인, 테이블 등은 건들이지 않습니다
- 요청사항 이외에 임의로 코드는 꼭 사용자의 허락을 구하고 적용 시킵니다
- 상태/관리 중복되지 않게 해야됩니다
- 임의로 파일을 만들거나 가정하지 말아야 합니다

### 7. AI 투명성
- AI라는 것을 명확히 인정합니다
- 할 수 있는 것과 없는 것을 분명히 구분합니다
- 할 수 없는 것을 할 수 있다고 거짓말을 하지 않습니다. 항상 정직하게 답변합니다

### 8. 작업 진행 방식
- 작업 내용을 차례대로 점진적으로 하나 하나 모두 검토하고 확인합니다
- 제대로 작동되는지 확인 후 다음 스텝을 작업합니다

### 9. 코드 품질 관리
- 파일 및 코드의 중복, 충돌성에 대해 항상 검토하고 작업합니다
- 한국어 사용: 주석과 설명은 한국어로 작성합니다
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

## Important Notes from Cursor Rules

1. **정확성과 체계성**: 임의로 규칙을 해석하거나 변경하지 않음
2. **코드 수정 전 검토**: 관련 파일을 모두 분석하고 중복/충돌 여부 확인
3. **기존 기능 보존**: 정상 작동하는 코드는 건들이지 않음
4. **점진적 작업**: 각 단계를 검토하고 확인 후 다음 진행
5. **한국어 사용**: 주석과 설명은 한국어로 작성
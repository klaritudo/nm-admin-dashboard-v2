import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { 
  TableFilterAndPagination, 
  TableHeader, 
  BaseTable, 
  TableHeightSetting, 
  TableResizeHandle, 
  ColumnVisibilityDialog, 
  PageHeader, 
  PageContainer,
  TableDebugInfo 
} from '../../components/baseTemplate/components';
import { 
  useTableFilterAndPagination, 
  useTableHeader, 
  useTableColumnDrag,
  useTableData,
  useTableHeaderFixed,
  useTableAutoHeight,
  useTableResize,
  useColumnVisibility,
  useTable
} from '../../components/baseTemplate/hooks';
import { 
  moneyTransferColumns,
  routeOptions,
  generateMoneyTransferData
} from './data/moneyTransferData';
import { apiOptions, bankList } from './data/membersData';
import useDynamicTypes from '../../hooks/useDynamicTypes';
import MemberDetailDialog from '../../components/dialogs/MemberDetailDialog';

/**
 * 머니이동내역 페이지
 * 머니 이동 내역 조회, 필터링, 페이지네이션 등의 기능을 제공합니다.
 */
const MoneyTransferPage = () => {
  const theme = useTheme();

  // 동적 유형 관리 훅 사용
  const {
    types,
    typeHierarchy,
    isLoading: typesLoading,
    error: typesError,
    isInitialized: typesInitialized
  } = useDynamicTypes();

  // 회원 데이터 생성 함수 (실제로는 서버에서 받아와야 함)
  const generateMembersData = useCallback((dynamicTypes, dynamicTypeHierarchy) => {
    if (!dynamicTypes || Object.keys(dynamicTypes).length === 0) {
      return [];
    }

    const typeKeys = Object.keys(dynamicTypes);
    const membersData = [];

    // 각 유형별로 회원 데이터 생성
    typeKeys.forEach((typeKey, index) => {
      const type = dynamicTypes[typeKey];
      
      // 상위 유형들 계산
      const getParentTypes = (currentTypeKey) => {
        const parents = [];
        const findParents = (key, visited = new Set()) => {
          if (visited.has(key)) return;
          visited.add(key);
          
          Object.entries(dynamicTypeHierarchy).forEach(([parentKey, children]) => {
            if (children.includes(key) && !visited.has(parentKey)) {
              const parentType = dynamicTypes[parentKey];
              parents.unshift({ 
                label: parentType?.label || parentKey, 
                color: parentType?.color || 'default',
                backgroundColor: parentType?.backgroundColor,
                borderColor: parentType?.borderColor
              });
              findParents(parentKey, visited);
            }
          });
        };
        findParents(currentTypeKey);
        return parents;
      };

      const parentTypes = getParentTypes(typeKey);
      
      // 각 유형별로 2-3명의 회원 생성
      for (let i = 0; i < 2; i++) {
        const memberId = index * 10 + i + 1;
        membersData.push({
          id: memberId,
          userId: `${typeKey}_user${i + 1}\n${type.label}${i + 1}`,
          username: `${typeKey}_user${i + 1}`, // PaymentDialog에서 사용
          nickname: `${type.label}${i + 1}`, // PaymentDialog에서 사용
          type: { 
            label: type.label || typeKey, 
            color: type.color || 'default',
            backgroundColor: type.backgroundColor,
            borderColor: type.borderColor
          },
          parentTypes: parentTypes,
          balance: Math.floor(Math.random() * 5000000) + 1000000,
          gameMoney: Math.floor(Math.random() * 2000000) + 500000,
          rollingPercent: Math.round(Math.random() * 10) / 10,
          rollingAmount: Math.floor(Math.random() * 100000),
          api: apiOptions[Math.floor(Math.random() * apiOptions.length)].value,
          deposit: Math.floor(Math.random() * 3000000) + 1000000,
          withdrawal: Math.floor(Math.random() * 500000),
          connectionStatus: ['온라인', '오프라인', '정지'][Math.floor(Math.random() * 3)],
          lastGame: `2024-01-${String(20 + Math.floor(Math.random() * 10)).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          name: `${type.label}${i + 1}`,
          accountNumber: `${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900000) + 100000)}`,
          bank: bankList[Math.floor(Math.random() * bankList.length)],
          profitLoss: {
            slot: Math.floor(Math.random() * 1000000) - 500000,
            casino: Math.floor(Math.random() * 500000) - 250000,
            total: 0 // 계산됨
          },
          connectionDate: `2024-01-${String(20 + Math.floor(Math.random() * 10)).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          registrationDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          description: `${type.label || typeKey} 계정입니다.`,
          child1: `${type.label?.charAt(0) || 'X'}${i + 1}`,
          child2: `${type.label?.charAt(0) || 'X'}${i + 2}`,
          child3: `${type.label?.charAt(0) || 'X'}${i + 3}`,
          child4: `${type.label?.charAt(0) || 'X'}${i + 4}`,
          child5: `${type.label?.charAt(0) || 'X'}${i + 5}`,
          child6: `${type.label?.charAt(0) || 'X'}${i + 6}`
        });
      }
    });

    // profitLoss.total 계산
    membersData.forEach(member => {
      member.profitLoss.total = member.profitLoss.slot + member.profitLoss.casino;
    });

    return membersData;
  }, []);

  // 회원 데이터 (동적 유형으로 생성)
  const membersData = useMemo(() => {
    if (typesInitialized && Object.keys(types).length > 0) {
      return generateMembersData(types, typeHierarchy);
    }
    return [];
  }, [typesInitialized, types, typeHierarchy, generateMembersData]);

  // 테이블 데이터 생성
  const data = useMemo(() => {
    if (typesInitialized && Object.keys(types).length > 0 && membersData.length > 0) {
      return generateMoneyTransferData(types, typeHierarchy, membersData);
    }
    return [];
  }, [typesInitialized, types, typeHierarchy, membersData]);
  
  // 테이블 높이 자동 조정 - useTableAutoHeight 훅 사용
  const {
    containerRef,
    tableHeight,
    autoHeight,
    toggleAutoHeight,
    setManualHeight
  } = useTableAutoHeight({
    defaultHeight: '500px',
    defaultAutoHeight: true,
    minHeight: 300,
    bottomMargin: 100
  });

  // 테이블 리사이즈 기능 - useTableResize 훅 사용
  const {
    isDragging,
    getResizeHandleProps,
    calculateMaxHeight
  } = useTableResize({
    minHeight: 200,
    maxHeight: null,
    useViewportLimit: true,
    viewportMargin: 50,
    onResize: (newHeight) => {
      if (autoHeight) {
        toggleAutoHeight(false);
      }
      setManualHeight(`${newHeight}px`);
    }
  });
  
  // 헤더 행 고정 기능 - useTableHeaderFixed 훅 사용
  const {
    tableHeaderRef,
    getTableHeaderStyles
  } = useTableHeaderFixed({
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  });

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(() => {
    console.log('머니이동내역 엑셀 다운로드');
    alert('머니이동내역을 엑셀로 다운로드합니다.');
  }, []);

  // 인쇄 핸들러
  const handlePrint = useCallback(() => {
    console.log('머니이동내역 인쇄');
    alert('머니이동내역을 인쇄합니다.');
  }, []);

  // 페이지네이션 직접 제어 로직
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(25);

  // 회원상세정보 다이얼로그 상태
  const [memberDetailDialogOpen, setMemberDetailDialogOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);

  // 회원상세정보 다이얼로그 핸들러들
  const handleMemberDetailOpen = useCallback((member) => {
    // 회원관리 데이터에서 해당 회원의 전체 정보 찾기
    const fullMemberData = membersData.find(m => 
      m.username === member.username || m.userId === member.userId
    );
    
    if (fullMemberData) {
      setSelectedMemberForDetail(fullMemberData);
    } else {
      // 회원 정보를 찾을 수 없는 경우 기본 정보 사용
      setSelectedMemberForDetail(member);
    }
    
    setMemberDetailDialogOpen(true);
  }, [membersData]);

  const handleMemberDetailClose = useCallback(() => {
    setMemberDetailDialogOpen(false);
    setSelectedMemberForDetail(null);
  }, []);

  const handleMemberDetailSave = useCallback((updatedMember) => {
    alert(`${updatedMember.nickname || updatedMember.username}님의 정보가 저장되었습니다.`);
    handleMemberDetailClose();
  }, [handleMemberDetailClose]);

  // useTable 훅 사용 (체크박스 관련 기능)
  const {
    checkedItems: tableCheckedItems,
    sortConfig: tableSortConfig,
    expandedRows: tableExpandedRows,
    allChecked: tableAllChecked,
    handleSort: tableHandleSort,
    handleCheck: tableHandleCheck,
    handleToggleAll: tableHandleToggleAll,
    handleToggleExpand: tableHandleToggleExpand
  } = useTable({
    data: data,
    initialSort: { key: null, direction: 'asc' },
    initialCheckedItems: {},
    initialExpandedRows: {},
    indentMode: false, // 계층 기능 비활성화
    page: currentPage,
    rowsPerPage: currentRowsPerPage
  });

  // 버튼 액션이 포함된 컬럼 설정
  const columnsWithActions = useMemo(() => {
    return moneyTransferColumns.map(column => {
      // userId 컬럼에 클릭 핸들러 추가
      if (column.id === 'userId') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => {
            console.log('아이디 클릭:', row);
            handleMemberDetailOpen(row);
          }
        };
      }
      
      return column;
    });
  }, [handleMemberDetailOpen]);

  // 동적 필터 옵션 생성
  const dynamicFilterOptions = useMemo(() => {
    const baseOptions = [
      {
        id: 'route',
        label: '경로',
        items: [
          { value: '', label: '전체' },
          ...routeOptions.map(option => ({
            value: option.value,
            label: option.label
          }))
        ]
      },
      {
        id: 'memberType',
        label: '회원유형',
        items: [
          { value: '', label: '전체' },
          ...(typesInitialized && types ? Object.keys(types).map(typeId => ({
            value: typeId,
            label: types[typeId].label || typeId
          })) : [])
        ]
      }
    ];
    
    return baseOptions;
  }, [typesInitialized, types]);

  // useTableFilterAndPagination 훅 사용
  const {
    // 필터 관련 상태 및 핸들러
    activeFilters,
    handleFilterChange,
    isDateFilterActive,
    handleOpenDateFilter,
    resetDateFilter,
    dateRange,
    
    // 페이지네이션 관련 상태 및 핸들러
    page,
    rowsPerPage,
    totalCount,
    totalPages,
    handlePageChange,
    handleRowsPerPageChange,
    filteredData,
    displayData,
    filterValues,
    handleFilter,
    handleClearFilters
  } = useTableFilterAndPagination({
    columns: columnsWithActions,
    data: data,
    defaultRowsPerPage: 25,
    hierarchical: false, // 계층 기능 비활성화
    filterOptions: {
      initialFilters: { route: 'all', memberType: '' }
    },
    paginationOptions: {
      initialPage: 0,
      initialRowsPerPage: 25,
      totalItems: data.length,
      onExcelDownload: handleExcelDownload,
      onPrint: handlePrint
    }
  });

  // TableHeader 훅 사용
  const {
    searchText,
    totalItems,
    sequentialPageNumbers,
    hasPinnedColumns,
    isGridReady,
    handleSearchChange,
    handleClearSearch,
    togglePageNumberMode,
    toggleColumnPin: headerToggleColumnPin,
    setGridReady
  } = useTableHeader({
    initialTotalItems: data.length,
    onSearch: (value) => {
      console.log(`머니이동내역 검색: ${value}`);
      if (page !== 0) {
        handlePageChange(0);
      }
    },
    onToggleColumnPin: (hasPinned) => {
      console.log(`컬럼 고정 토글: ${hasPinned}`);
      if (hasPinned) {
        setDefaultPinnedColumns();
      } else {
        clearAllPinnedColumns();
      }
    }
  });

  // 그리드 준비 상태로 설정
  useEffect(() => {
    setGridReady(true);
  }, [setGridReady]);

  // 컬럼 드래그 앤 드롭 관련 훅 사용
  const {
    columns,
    dragInfo,
    pinnedColumns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateColumns,
    isColumnPinned,
    toggleColumnPin,
    clearAllPinnedColumns,
    setDefaultPinnedColumns
  } = useTableColumnDrag({
    initialColumns: columnsWithActions,
    tableId: 'money_transfer_table',
    onColumnOrderChange: (newColumns) => {
      console.log('머니이동내역 테이블 컬럼 순서 변경:', newColumns);
    }
  });

  // 컬럼 표시옵션 관련 훅 사용
  const {
    columnVisibility,
    visibleColumns,
    hiddenColumnsCount,
    toggleableColumns,
    toggleColumnVisibility,
    showAllColumns,
    resetToDefault
  } = useColumnVisibility(columns, {
    defaultHiddenColumns: [],
    alwaysVisibleColumns: [],
    tableId: 'money_transfer_table'
  });

  // 표시옵션 다이얼로그 상태
  const [displayOptionsAnchor, setDisplayOptionsAnchor] = useState(null);
  const isDisplayOptionsOpen = Boolean(displayOptionsAnchor);

  // 표시옵션 버튼 클릭 핸들러
  const handleDisplayOptionsClick = useCallback((anchorElement) => {
    setDisplayOptionsAnchor(anchorElement);
  }, []);

  // 표시옵션 다이얼로그 닫기 핸들러
  const handleDisplayOptionsClose = useCallback(() => {
    setDisplayOptionsAnchor(null);
  }, []);

  // 드래그 앤 드롭 활성화
  const draggableColumns = true;

  // 드래그 관련 핸들러 모음
  const dragHandlers = {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop
  };

  // 행 클릭 핸들러
  const handleRowClick = (row) => {
    console.log('머니이동내역 행 클릭:', row);
  };

  // 필터 콜백 함수
  const filterCallback = useCallback((result, filterId, filterValue) => {
    switch (filterId) {
      case 'route':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          // 경로가 객체 형태인 경우 처리
          const routeLabel = item.route?.label || item.route;
          
          switch (filterValue) {
            case 'deposit':
              return routeLabel === '입금처리';
            case 'withdraw':
              return routeLabel === '출금처리';
            case 'game_to_balance':
              return routeLabel === '게임머니→보유금';
            case 'balance_to_game':
              return routeLabel === '보유금→게임머니';
            case 'bonus':
              return routeLabel === '보너스지급';
            case 'penalty':
              return routeLabel === '차감처리';
            case 'transfer_in':
              return routeLabel === '타회원입금';
            case 'transfer_out':
              return routeLabel === '타회원출금';
            default:
              return true;
          }
        });
        
      case 'memberType':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          const memberTypeLabel = item.memberType?.label || item.memberType;
          const targetType = types[filterValue];
          return memberTypeLabel === (targetType?.label || filterValue);
        });
        
      case 'date':
        let dateFilteredResult = [...result];
        
        if (filterValue.startDate) {
          dateFilteredResult = dateFilteredResult.filter(item => item.id >= 10);
        }
        
        if (filterValue.endDate) {
          dateFilteredResult = dateFilteredResult.filter(item => item.id <= 40);
        }
        
        return dateFilteredResult;
      default:
        return result;
    }
  }, [types]);
  
  // 커스텀 handleFilterChange 함수
  const manualHandleFilterChange = useCallback((filterId, value) => {
    console.log(`머니이동내역 필터 변경: ${filterId} = ${value}`);
    handleFilterChange(filterId, value);
  }, [handleFilterChange]);
  
  // 안전한 필터 값 설정
  const safeActiveFilters = useMemo(() => {
    const result = { ...activeFilters };
    
    Object.keys(result).forEach(key => {
      if (result[key] === 'all') {
        result[key] = '';
      }
    });
    
    return result;
  }, [activeFilters]);
  
  // useTableData 훅을 사용하여 필터링된 데이터 계산
  const computedFilteredData = useTableData({
    data: data,
    activeFilters: safeActiveFilters,
    searchText,
    isDateFilterActive,
    dateRange,
    filterCallback
  });
  
  // 필터링된 데이터의 ID 목록 생성
  const filteredIds = useMemo(() => {
    return computedFilteredData ? computedFilteredData.map(item => item.id) : [];
  }, [computedFilteredData]);
  
  // 필터링된 데이터 처리 (계층 구조 없이 일반 배열로 처리)
  const filteredFlatData = useMemo(() => {
    // 필터가 적용되지 않았거나 검색어가 없는 경우 모든 데이터 반환
    const hasActiveFilters = Object.values(safeActiveFilters).some(value => value && value !== '');
    const hasSearchText = searchText && searchText.trim() !== '';
    
    if (!hasActiveFilters && !hasSearchText) {
      return data;
    }
    
    // 필터가 있는 경우에만 filteredIds로 필터링
    if (!data || !filteredIds || filteredIds.length === 0) {
      return [];
    }
    
    return data.filter(item => filteredIds.includes(item.id));
  }, [data, filteredIds, safeActiveFilters, searchText]);
  
  // 페이지 관련 효과
  useEffect(() => {
    console.log(`머니이동내역 페이지네이션 설정: 페이지=${page}, 행수=${rowsPerPage}`);
  }, [page, rowsPerPage]);

  // 필터링된 데이터 및 표시 데이터 저장
  const safeFilteredData = filteredFlatData || [];
  
  // 실제 전체 항목 수 계산 (일반 배열이므로 단순 길이)
  const totalFlattenedItems = safeFilteredData.length;
  
  const safeDisplayData = safeFilteredData;

  // 필터링된 데이터가 변경될 때 totalItems 값 업데이트
  useEffect(() => {
    if (safeFilteredData.length !== totalItems) {
      console.log(`머니이동내역 검색/필터 결과: ${safeFilteredData.length}개 항목`);
    }
  }, [safeFilteredData.length, totalItems, totalFlattenedItems]);
  
  // 페이지 변경 핸들러
  const handlePageChangeWithLog = useCallback((event, newPageIndex) => {
    let pageIndex = newPageIndex;
    
    if (typeof event === 'number' && newPageIndex === undefined) {
      pageIndex = event;
    }
    
    console.log(`머니이동내역 페이지 변경: ${currentPage} -> ${pageIndex}`);
    
    if (typeof pageIndex !== 'number') {
      console.error('유효하지 않은 페이지 번호:', pageIndex);
      return;
    }
    
    setCurrentPage(pageIndex);
    handlePageChange(pageIndex);
    
    console.log(`머니이동내역 페이지 ${pageIndex + 1} 로드 완료`);
  }, [currentPage, handlePageChange]);

  // 페이지당 행 수 변경 핸들러
  const handleRowsPerPageChangeWithLog = useCallback((event) => {
    if (!event || !event.target || !event.target.value) {
      console.error('머니이동내역 행 수 변경 이벤트 오류:', event);
      return;
    }
    
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log(`머니이동내역 페이지당 행 수 변경: ${currentRowsPerPage} -> ${newRowsPerPage}`);
    
    setCurrentRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
    
    handleRowsPerPageChange(event);
    
    console.log(`머니이동내역 테이블 새 행 수 ${newRowsPerPage}로 업데이트 완료`);
  }, [currentRowsPerPage, handleRowsPerPageChange]);

  // 테이블 강제 리렌더링을 위한 키 값
  const [tableKey, setTableKey] = useState(Date.now());
  
  // 페이지 또는 행 수가 변경될 때마다 테이블 키 업데이트
  useEffect(() => {
    setTableKey(Date.now());
    console.log(`머니이동내역 테이블 키 업데이트: 페이지=${currentPage}, 행수=${currentRowsPerPage}`);
  }, [currentPage, currentRowsPerPage]);
  
  // 현재 페이지와 rowsPerPage를 활용하는 메모이제이션된 표시 데이터
  const visibleData = useMemo(() => {
    if (!safeFilteredData || safeFilteredData.length === 0) return [];
    
    console.log(`머니이동내역 페이지네이션 변수: 페이지=${currentPage}, 행수=${currentRowsPerPage}, 총=${totalFlattenedItems}`);
    return safeFilteredData;
  }, [safeFilteredData, currentPage, currentRowsPerPage, totalFlattenedItems]);

  // visibleColumns에 버튼 핸들러 다시 추가
  const finalColumns = useMemo(() => {
    return visibleColumns.map(column => {
      // userId 컬럼에 클릭 핸들러 추가
      if (column.id === 'userId') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => {
            console.log('아이디 클릭:', row);
            handleMemberDetailOpen(row);
          }
        };
      }
      
      return column;
    });
  }, [visibleColumns, handleMemberDetailOpen]);

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
        <PageHeader
          title="머니이동내역"
          onDisplayOptionsClick={handleDisplayOptionsClick}
          showAddButton={false}
          showRefreshButton={true}
          onRefreshClick={() => alert('머니이동내역 새로고침')}
          sx={{ mb: 2 }}
        />

        {/* 컬럼 표시옵션 다이얼로그 */}
        <ColumnVisibilityDialog
          anchorEl={displayOptionsAnchor}
          open={isDisplayOptionsOpen}
          onClose={handleDisplayOptionsClose}
          toggleableColumns={toggleableColumns}
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumnVisibility}
          onShowAll={showAllColumns}
          onReset={resetToDefault}
          hiddenColumnsCount={hiddenColumnsCount}
          menuWidth="350px"
        />

        <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          
          {/* 테이블 헤더 컴포넌트 */}
          <TableHeader
            title="머니이동내역 목록"
            totalItems={totalFlattenedItems}
            countLabel="총 ##count##건의 내역"
            sequentialPageNumbers={sequentialPageNumbers}
            togglePageNumberMode={togglePageNumberMode}
            hasPinnedColumns={hasPinnedColumns}
            isGridReady={isGridReady}
            toggleColumnPin={headerToggleColumnPin}
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            handleClearSearch={handleClearSearch}
            showIndentToggle={false} // 계층 기능 비활성화
            showPageNumberToggle={true}
            showColumnPinToggle={true}
            showSearch={true}
            searchPlaceholder="머니이동내역 검색..."
            sx={{ mb: 2 }}
          />

          <Box sx={{ width: '100%' }}>
            <TableFilterAndPagination
              filterProps={{
                columns: columns,
                filterValues: filterValues || {},
                activeFilters: safeActiveFilters || {},
                filterOptions: dynamicFilterOptions,
                handleFilterChange: manualHandleFilterChange,
                onFilter: handleFilter,
                onClearFilters: handleClearFilters,
                isDateFilterActive: isDateFilterActive,
                handleOpenDateFilter: handleOpenDateFilter,
                resetDateFilter: resetDateFilter
              }}
              paginationProps={{
                count: totalFlattenedItems,
                page: currentPage,
                rowsPerPage: currentRowsPerPage,
                onPageChange: handlePageChangeWithLog,
                onRowsPerPageChange: handleRowsPerPageChangeWithLog,
                totalCount: totalFlattenedItems,
                onExcelDownload: handleExcelDownload,
                onPrint: handlePrint
              }}
            />
          </Box>
          
          {/* 테이블 콘텐츠 영역 */}
          <Box 
            sx={{ 
              width: '100%', 
              mt: 2
            }} 
            ref={containerRef}
          >
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              현재 페이지: {currentPage + 1} / {Math.ceil(totalFlattenedItems / currentRowsPerPage)} (페이지당 {currentRowsPerPage}행)
              {' - 컬럼을 드래그하여 순서를 변경할 수 있습니다.'}
            </Typography>
            <BaseTable
              key={`money-transfer-table-${tableKey}`}
              columns={finalColumns}
              data={visibleData}
              checkable={false} // 체크박스 기능 비활성화
              hierarchical={false} // 계층 기능 비활성화
              indentMode={false} // 들여쓰기 모드 비활성화
              checkedItems={tableCheckedItems}
              expandedRows={tableExpandedRows}
              allChecked={tableAllChecked}
              onCheck={tableHandleCheck}
              onToggleAll={tableHandleToggleAll}
              onToggleExpand={tableHandleToggleExpand}
              onSort={tableHandleSort}
              sortConfig={tableSortConfig}
              page={currentPage}
              rowsPerPage={currentRowsPerPage}
              totalCount={totalFlattenedItems}
              sequentialPageNumbers={sequentialPageNumbers}
              draggableColumns={draggableColumns}
              onColumnOrderChange={updateColumns}
              dragHandlers={dragHandlers}
              dragInfo={dragInfo}
              fixedHeader={true}
              maxHeight={tableHeight}
              tableHeaderRef={tableHeaderRef}
              headerStyle={getTableHeaderStyles()}
              pinnedColumns={pinnedColumns}
            />
            
            {/* 테이블 리사이즈 핸들 */}
            <TableResizeHandle 
              resizeHandleProps={getResizeHandleProps(parseFloat(tableHeight))}
              showIcon={true}
              isDragging={isDragging}
              sx={{ 
                mt: 1,
                opacity: isDragging ? 1 : 0.7,
                '&:hover': { opacity: 1 }
              }}
            />
          </Box>
        </Paper>

        {/* 회원상세정보 다이얼로그 */}
        <MemberDetailDialog
          open={memberDetailDialogOpen}
          onClose={handleMemberDetailClose}
          onSave={handleMemberDetailSave}
          member={selectedMemberForDetail}
        />
    </PageContainer>
  );
};

export default MoneyTransferPage; 
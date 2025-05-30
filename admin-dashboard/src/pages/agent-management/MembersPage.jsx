import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Paper, Typography, Grid, useTheme } from '@mui/material';
import { 
  TableFilterAndPagination, 
  TableHeader, 
  BaseTable, 
  TypeTreeView, 
  TableHeightSetting, 
  TableResizeHandle, 
  ColumnVisibilityDialog, 
  PageHeader, 
  PageContainer,
  TableDebugInfo 
} from '../../components/baseTemplate/components';
import PaymentDialog from '../../components/dialogs/PaymentDialog';
import MemberDetailDialog from '../../components/dialogs/MemberDetailDialog';
import CreateMemberDialog from '../../components/dialogs/CreateMemberDialog.jsx';
import { 
  useTableFilterAndPagination, 
  useTableHeader, 
  useTableColumnDrag,
  useTableData,
  useTypeHierarchy,
  useTableIndent,
  useTableHeaderFixed,
  useTableAutoHeight,
  useTableResize,
  useColumnVisibility,
  useTable
} from '../../components/baseTemplate/hooks';
import { 
  membersColumns,
  apiOptions,
  bankList
} from './data/membersData';
import useDynamicTypes from '../../hooks/useDynamicTypes';
import usePageData from '../../hooks/usePageData';

/**
 * 회원관리 페이지
 * 회원 목록 조회, 필터링, 페이지네이션 등의 기능을 제공합니다.
 */
const MembersPage = () => {
  const theme = useTheme();

  // 범용 페이지 데이터 훅 사용 (1단계 구조)
  const {
    data,
    types,
    typeHierarchy,
    isLoading,
    error,
    isInitialized: typesInitialized
  } = usePageData({
    pageType: 'members',
    requiresMembersData: false
  });

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

  // 들여쓰기 모드 - useTableIndent 훅 사용
  const { indentMode, toggleIndentMode } = useTableIndent(true);
  
  // 유형 계층 관리 훅 사용 (동적 유형 사용)
  const {
    hierarchicalData,
    expandedTypes,
    toggleTypeExpand,
    setAllExpanded
  } = useTypeHierarchy({
    data: data,
    types: typesInitialized ? types : {},
    typeHierarchy: typesInitialized ? typeHierarchy : {},
    expandAll: true
  });
  
  // 헤더 행 고정 기능 - useTableHeaderFixed 훅 사용
  const {
    tableHeaderRef,
    getTableHeaderStyles
  } = useTableHeaderFixed({
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  });

  // 지급/회수 다이얼로그 상태
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentAction, setPaymentAction] = useState('deposit'); // 'deposit' 또는 'withdraw'
  
  // 회원상세정보 다이얼로그 상태
  const [memberDetailDialogOpen, setMemberDetailDialogOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
  
  // 회원추가 다이얼로그 상태
  const [createMemberDialogOpen, setCreateMemberDialogOpen] = useState(false);

  // 회원관리 액션 핸들러들
  const handlePayment = useCallback((row) => {
    console.log('지급 처리:', row);
    setSelectedMember(row);
    setPaymentAction('deposit');
    setPaymentDialogOpen(true);
  }, []);

  const handleWithdraw = useCallback((row) => {
    console.log('회수 처리:', row);
    setSelectedMember(row);
    setPaymentAction('withdraw');
    setPaymentDialogOpen(true);
  }, []);

  // 지급/회수 확인 핸들러
  const handlePaymentConfirm = useCallback((paymentData) => {
    console.log('지급/회수 확인:', paymentData);
    
    const actionText = paymentData.action === 'deposit' ? '지급' : '회수';
    const memberName = selectedMember?.name || selectedMember?.userId || '회원';
    
    // 실제 API 호출 로직을 여기에 구현
    // 예: await paymentAPI.processPayment(paymentData);
    
    alert(`${memberName}님에게 ${paymentData.amount.toLocaleString()}원 ${actionText} 처리가 완료되었습니다.`);
    
    // 테이블 데이터 새로고침 로직 추가 가능
    // 예: refetchData();
  }, [selectedMember]);

  // 지급/회수 다이얼로그 닫기 핸들러
  const handlePaymentDialogClose = useCallback(() => {
    setPaymentDialogOpen(false);
    setSelectedMember(null);
    setPaymentAction('deposit');
  }, []);

  // 회원상세정보 다이얼로그 핸들러들
  const handleMemberDetailOpen = useCallback((member) => {
    // console.log('🔥 회원상세정보 다이얼로그 열기 요청!');
    // console.log('선택된 회원:', member);
    // console.log('회원 ID:', member?.id);
    // console.log('회원 이름:', member?.username);
    setSelectedMemberForDetail(member);
    setMemberDetailDialogOpen(true);
    // console.log('다이얼로그 상태 변경 완료');
  }, []);

  const handleMemberDetailClose = useCallback(() => {
    setMemberDetailDialogOpen(false);
    setSelectedMemberForDetail(null);
  }, []);

  const handleMemberDetailSave = useCallback((updatedMember) => {
    // console.log('회원정보 저장:', updatedMember);
    // 실제 API 호출 로직을 여기에 구현
    // 예: await memberAPI.updateMember(updatedMember);
    
    alert(`${updatedMember.nickname || updatedMember.username}님의 정보가 저장되었습니다.`);
    
    // 테이블 데이터 새로고침 로직 추가 가능
    // 예: refetchData();
    
    handleMemberDetailClose();
  }, [handleMemberDetailClose]);

  // 회원추가 다이얼로그 핸들러들
  const handleCreateMemberOpen = useCallback(() => {
    // console.log('회원추가 다이얼로그 열기');
    setCreateMemberDialogOpen(true);
  }, []);

  const handleCreateMemberClose = useCallback(() => {
    // console.log('회원추가 다이얼로그 닫기');
    setCreateMemberDialogOpen(false);
  }, []);

  const handleCreateMemberConfirm = useCallback((newMemberData) => {
    // console.log('새 회원 생성:', newMemberData);
    // 실제 API 호출 로직을 여기에 구현
    // 예: await memberAPI.createMember(newMemberData);
    
    alert(`${newMemberData.nickname || newMemberData.username} 회원이 생성되었습니다.`);
    
    // 테이블 데이터 새로고침 로직 추가 가능
    // 예: refetchData();
    
    handleCreateMemberClose();
  }, [handleCreateMemberClose]);

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(() => {
    // console.log('회원 목록 엑셀 다운로드');
    alert('회원 목록을 엑셀로 다운로드합니다.');
  }, []);

  // 인쇄 핸들러
  const handlePrint = useCallback(() => {
    // console.log('회원 목록 인쇄');
    alert('회원 목록을 인쇄합니다.');
  }, []);

  // 페이지네이션 직접 제어 로직
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(25);

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
    data: hierarchicalData,
    initialSort: { key: null, direction: 'asc' },
    initialCheckedItems: {},
    initialExpandedRows: {},
    indentMode: true,
    page: currentPage,
    rowsPerPage: currentRowsPerPage
  });

  // 버튼 액션이 포함된 컬럼 설정
  const columnsWithActions = useMemo(() => {
    return membersColumns.map(column => {
      if (column.id === 'actions' && column.buttons) {
        return {
          ...column,
          buttons: column.buttons.map(button => ({
            ...button,
            onClick: button.label === '지급' ? handlePayment : handleWithdraw
          }))
        };
      }
      
      // 유형 컬럼에 토글 핸들러 추가
      if (column.id === 'type' && column.type === 'hierarchical') {
        return {
          ...column,
          onToggle: (itemId) => {
            console.log('유형 컬럼 토글:', itemId);
            // useTypeHierarchy의 toggleTypeExpand 사용
            const item = hierarchicalData.find(item => item.id === itemId);
            if (item && item.type) {
              const typeId = typeof item.type === 'object' ? item.type.id : item.type;
              toggleTypeExpand(typeId);
            }
          }
        };
      }
      
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
  }, [handlePayment, handleWithdraw, hierarchicalData, toggleTypeExpand, handleMemberDetailOpen]);

  // 동적 필터 옵션 생성
  const dynamicFilterOptions = useMemo(() => {
    const baseOptions = [
      {
        id: 'status',
        label: '상태',
        items: [
          { value: '', label: '전체' },
          { value: 'online', label: '온라인' },
          { value: 'offline', label: '오프라인' },
          { value: 'suspended', label: '정지' }
        ]
      },
      {
        id: 'type',
        label: '회원유형',
        items: [
          { value: '', label: '전체' },
          // 동적 유형 옵션 추가
          ...(typesInitialized && types ? Object.keys(types).map(typeId => ({
            value: typeId,
            label: types[typeId].label || typeId
          })) : [])
        ]
      },
      {
        id: 'api',
        label: 'API',
        items: [
          { value: '', label: '전체' },
          ...apiOptions.map(option => ({
            value: option.value,
            label: option.label
          }))
        ]
      }
    ];
    
    return baseOptions;
  }, [typesInitialized, types, apiOptions]);

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
    data: hierarchicalData,
    defaultRowsPerPage: 25,
    hierarchical: true,
    filterOptions: {
      initialFilters: { status: 'all', type: 'all', api: 'all' }
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
      console.log(`회원 검색: ${value}`);
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
    tableId: 'members_table',
    onColumnOrderChange: (newColumns) => {
      console.log('회원 테이블 컬럼 순서 변경:', newColumns);
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
    alwaysVisibleColumns: ['checkbox'],
    tableId: 'members_table'
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
    console.log('회원 행 클릭:', row);
  };

  // 계층 펼치기/접기 핸들러
  const handleToggleExpand2 = useCallback((id) => {
    console.log(`회원 유형 토글: ${id}`);
    toggleTypeExpand(id);
    
    if (typeof tableHandleToggleExpand === 'function') {
      tableHandleToggleExpand(id);
    }
  }, [toggleTypeExpand, tableHandleToggleExpand]);

  // 필터 콜백 함수
  const filterCallback = useCallback((result, filterId, filterValue) => {
    switch (filterId) {
      case 'status':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          switch (filterValue) {
            case 'online':
              return item.connectionStatus === '온라인';
            case 'offline':
              return item.connectionStatus === '오프라인';
            case 'suspended':
              return item.connectionStatus === '정지';
            default:
              return true;
          }
        });
        
      case 'type':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => 
          item.type && item.type.id === filterValue
        );
        
      case 'api':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => item.api === filterValue);
        
      case 'date':
        let dateFilteredResult = [...result];
        
        if (filterValue.startDate) {
          dateFilteredResult = dateFilteredResult.filter(item => item.id >= 3);
        }
        
        if (filterValue.endDate) {
          dateFilteredResult = dateFilteredResult.filter(item => item.id <= 6);
        }
        
        return dateFilteredResult;
      default:
        return result;
    }
  }, []);
  
  // 커스텀 handleFilterChange 함수
  const manualHandleFilterChange = useCallback((filterId, value) => {
    console.log(`회원 필터 변경: ${filterId} = ${value}`);
    handleFilter({
      [filterId]: value
    });
  }, [handleFilter]);
  
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
  
  // hierarchicalData에서 filteredIds에 포함된 항목만 필터링
  const filteredHierarchicalData = useMemo(() => {
    // hierarchicalData가 비어있으면 원본 데이터 사용
    const dataToUse = hierarchicalData?.length > 0 ? hierarchicalData : data;
    
    // 필터가 적용되지 않았거나 검색어가 없는 경우 모든 데이터 반환
    const hasActiveFilters = Object.values(safeActiveFilters).some(value => value && value !== '');
    const hasSearchText = searchText && searchText.trim() !== '';
    
    if (!hasActiveFilters && !hasSearchText) {
      return dataToUse;
    }
    
    // 필터가 있는 경우에만 filteredIds로 필터링
    if (!dataToUse || !filteredIds || filteredIds.length === 0) {
      return [];
    }
    
    return dataToUse.filter(item => filteredIds.includes(item.id));
  }, [hierarchicalData, filteredIds, safeActiveFilters, searchText, data]);
  
  // 페이지 관련 효과
  useEffect(() => {
    // console.log(`회원 페이지네이션 설정: 페이지=${page}, 행수=${rowsPerPage}`);
  }, [page, rowsPerPage]);

  // 필터링된 데이터 및 표시 데이터 저장
  const safeFilteredData = filteredHierarchicalData || [];
  
  // 실제 전체 항목 수 계산
  const totalFlattenedItems = useMemo(() => {
    const countAllItems = (items) => {
      if (!items || !items.length) return 0;
      
      let count = 0;
      items.forEach(item => {
        count++;
        
        if (item.children && item.children.length > 0) {
          count += countAllItems(item.children);
        }
      });
      
      return count;
    };
    
    return countAllItems(safeFilteredData);
  }, [safeFilteredData]);
  
  const safeDisplayData = safeFilteredData;

  // 필터링된 데이터가 변경될 때 totalItems 값 업데이트
  useEffect(() => {
    if (safeFilteredData.length !== totalItems) {
      // console.log(`회원 검색/필터 결과: ${safeFilteredData.length}개 항목 (평면화: ${totalFlattenedItems}개)`);
    }
  }, [safeFilteredData.length, totalItems, totalFlattenedItems]);
  
  // 페이지 변경 핸들러
  const handlePageChangeWithLog = useCallback((event, newPageIndex) => {
    let pageIndex = newPageIndex;
    
    if (typeof event === 'number' && newPageIndex === undefined) {
      pageIndex = event;
    }
    
    // console.log(`회원 페이지 변경: ${currentPage} -> ${pageIndex}`);
    
    if (typeof pageIndex !== 'number') {
      console.error('유효하지 않은 페이지 번호:', pageIndex);
      return;
    }
    
    setCurrentPage(pageIndex);
    handlePageChange(pageIndex);
    
    // console.log(`회원 페이지 ${pageIndex + 1} 로드 완료`);
  }, [currentPage, handlePageChange]);

  // 페이지당 행 수 변경 핸들러
  const handleRowsPerPageChangeWithLog = useCallback((event) => {
    if (!event || !event.target || !event.target.value) {
      console.error('회원 행 수 변경 이벤트 오류:', event);
      return;
    }
    
    const newRowsPerPage = parseInt(event.target.value, 10);
    // console.log(`회원 페이지당 행 수 변경: ${currentRowsPerPage} -> ${newRowsPerPage}`);
    
    setCurrentRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
    
    handleRowsPerPageChange(event);
    
    // console.log(`회원 테이블 새 행 수 ${newRowsPerPage}로 업데이트 완료`);
  }, [currentRowsPerPage, handleRowsPerPageChange]);

  // 테이블 강제 리렌더링을 위한 키 값
  const [tableKey, setTableKey] = useState(Date.now());
  
  // 페이지 또는 행 수가 변경될 때마다 테이블 키 업데이트
  useEffect(() => {
    setTableKey(Date.now());
    // console.log(`회원 테이블 키 업데이트: 페이지=${currentPage}, 행수=${currentRowsPerPage}`);
  }, [currentPage, currentRowsPerPage]);
  
  // 현재 페이지와 rowsPerPage를 활용하는 메모이제이션된 표시 데이터
  const visibleData = useMemo(() => {
    if (!safeFilteredData || safeFilteredData.length === 0) return [];
    
    // console.log(`회원 페이지네이션 변수: 페이지=${currentPage}, 행수=${currentRowsPerPage}, 총=${totalFlattenedItems}`);
    return safeFilteredData;
  }, [safeFilteredData, currentPage, currentRowsPerPage, totalFlattenedItems]);

  // visibleColumns에 버튼 핸들러 다시 추가
  const finalColumns = useMemo(() => {
    return visibleColumns.map(column => {
      if (column.id === 'actions' && column.buttons) {
        return {
          ...column,
          buttons: column.buttons.map(button => ({
            ...button,
            onClick: button.label === '지급' ? handlePayment : handleWithdraw
          }))
        };
      }
      
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
  }, [visibleColumns, handlePayment, handleWithdraw, handleMemberDetailOpen]);

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
        <PageHeader
          title="회원관리"
          onDisplayOptionsClick={handleDisplayOptionsClick}
          showAddButton={true}
          showRefreshButton={true}
          addButtonText="회원 추가"
          onAddClick={handleCreateMemberOpen}
          onRefreshClick={() => alert('회원 목록 새로고침')}
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

          {/* 회원 유형 계층 트리 뷰 */}
          {/*
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              회원 유형 구조 {typesLoading && '(로딩 중...)'} {typesError && '(오류 발생)'}
            </Typography>
            {typesInitialized && Object.keys(types).length > 0 ? (
              <TypeTreeView 
                types={types}
                typeHierarchy={typeHierarchy}
                expandedTypes={expandedTypes}
                onTypeToggle={toggleTypeExpand}
                onExpandAll={setAllExpanded}
                direction="horizontal"
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                {typesLoading ? '동적 유형을 로드하는 중...' : 
                 typesError ? `오류: ${typesError}` : 
                 '동적 유형이 설정되지 않았습니다.'}
              </Typography>
            )}
          </Box>
          */}
          
          {/* 테이블 설정 옵션 */}
          {/*
          <TableHeightSetting
            tableHeight={tableHeight}
            autoHeight={autoHeight}
            toggleAutoHeight={toggleAutoHeight}
            setManualHeight={setManualHeight}
            minHeight={200}
            maxHeight={1200}
            step={50}
          />*/}

          {/* 테이블 헤더 컴포넌트 */}
          <TableHeader
            title="회원 목록"
            totalItems={totalFlattenedItems}
            countLabel="총 ##count##명의 회원"
            indentMode={indentMode}
            toggleIndentMode={toggleIndentMode}
            sequentialPageNumbers={sequentialPageNumbers}
            togglePageNumberMode={togglePageNumberMode}
            hasPinnedColumns={hasPinnedColumns}
            isGridReady={isGridReady}
            toggleColumnPin={headerToggleColumnPin}
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            handleClearSearch={handleClearSearch}
            showIndentToggle={true}
            showPageNumberToggle={true}
            showColumnPinToggle={true}
            showSearch={true}
            searchPlaceholder="회원 검색..."
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
              key={`members-table-${tableKey}`}
              columns={finalColumns}
              data={visibleData}
              checkable={true}
              hierarchical={true}
              indentMode={indentMode}
              checkedItems={tableCheckedItems}
              expandedRows={tableExpandedRows}
              allChecked={tableAllChecked}
              onCheck={tableHandleCheck}
              onToggleAll={tableHandleToggleAll}
              onToggleExpand={handleToggleExpand2}
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
            
            {/* 디버깅용 정보 */}
            {/*<TableDebugInfo
              totalItems={totalFlattenedItems}
              totalPages={Math.ceil(totalFlattenedItems / currentRowsPerPage)}
              currentPage={currentPage}
              currentRowsPerPage={currentRowsPerPage}
              totalCount={totalFlattenedItems}
              searchText={searchText}
              sequentialPageNumbers={sequentialPageNumbers}
              isDragging={isDragging}
              tableHeight={tableHeight}
              calculateMaxHeight={calculateMaxHeight}
              pinnedColumns={pinnedColumns}
              visibleColumns={visibleColumns}
              hiddenColumnsCount={hiddenColumnsCount}
              columnVisibility={columnVisibility}
            />*/}
          </Box>
        </Paper>

        {/* 지급/회수 다이얼로그 */}
        <PaymentDialog
          open={paymentDialogOpen}
          onClose={handlePaymentDialogClose}
          member={selectedMember}
          action={paymentAction}
          onConfirm={handlePaymentConfirm}
          formatCurrency={(value) => new Intl.NumberFormat('ko-KR').format(value || 0)}
        />

        {/* 회원상세정보 다이얼로그 */}
        <MemberDetailDialog
          open={memberDetailDialogOpen}
          onClose={handleMemberDetailClose}
          member={selectedMemberForDetail}
          onSave={handleMemberDetailSave}
        />

        {/* 회원추가 다이얼로그 */}
        <CreateMemberDialog
          open={createMemberDialogOpen}
          onClose={handleCreateMemberClose}
          members={data}
          onCreateMember={handleCreateMemberConfirm}
        />
    </PageContainer>
  );
};

export default MembersPage; 
import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  slotCasinoColumns,
  gameTypeOptions,
  gameCompanyOptions,
  bettingSectionOptions,
  generateSlotCasinoData,
  getBettingDetailData
} from './data/slotCasinoData';
import { apiOptions, bankList } from '../agent-management/data/membersData';
import MemberDetailDialog from '../../components/dialogs/MemberDetailDialog';
import BettingDetailDialog from '../../components/dialogs/BettingDetailDialog';
import usePageData from '../../hooks/usePageData';

/**
 * 슬롯/카지노 베팅상세내역 페이지
 * 슬롯/카지노 베팅 내역 조회, 필터링, 페이지네이션 등의 기능을 제공합니다.
 */
const SlotCasinoPage = () => {
  const theme = useTheme();

  // 범용 페이지 데이터 훅 사용 (2단계 구조)
  const {
    data,
    membersData,
    types,
    typeHierarchy,
    isLoading,
    error,
    isInitialized: typesInitialized
  } = usePageData({
    pageType: 'slotCasino',
    dataGenerator: generateSlotCasinoData,
    requiresMembersData: true
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
    console.log('슬롯/카지노 베팅내역 엑셀 다운로드');
    alert('슬롯/카지노 베팅내역을 엑셀로 다운로드합니다.');
  }, []);

  // 인쇄 핸들러
  const handlePrint = useCallback(() => {
    console.log('슬롯/카지노 베팅내역 인쇄');
    alert('슬롯/카지노 베팅내역을 인쇄합니다.');
  }, []);

  // 다이얼로그 상태
  const [memberDetailDialogOpen, setMemberDetailDialogOpen] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
  const [bettingDetailDialogOpen, setBettingDetailDialogOpen] = useState(false);
  const [selectedBettingForDetail, setSelectedBettingForDetail] = useState(null);

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

  // 베팅상세정보 다이얼로그 핸들러들
  const handleBettingDetailOpen = useCallback((row) => {
    console.log('베팅상세보기 클릭:', row);
    const detailData = getBettingDetailData(row.id, membersData);
    setSelectedBettingForDetail(detailData);
    setBettingDetailDialogOpen(true);
  }, [membersData]);

  const handleBettingDetailClose = useCallback(() => {
    setBettingDetailDialogOpen(false);
    setSelectedBettingForDetail(null);
  }, []);

  // 공베팅 액션 핸들러들
  const handleVoidApply = useCallback((row) => {
    console.log('공베팅적용:', row);
    alert(`${row.transId} 베팅에 대해 공베팅이 적용되었습니다.`);
    // 실제 API 호출 로직 추가
  }, []);

  const handleVoidCancel = useCallback((row) => {
    console.log('공베팅취소:', row);
    alert(`${row.transId} 베팅에 대해 공베팅이 취소되었습니다.`);
    // 실제 API 호출 로직 추가
  }, []);

  // 페이지 관련 상태 추가 (먼저 정의)
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(25);

  // 테이블 통합 관리 훅
  const {
    // 체크박스 관련
    checkedItems: tableCheckedItems,
    allChecked: tableAllChecked,
    handleCheck: tableHandleCheck,
    handleToggleAll: tableHandleToggleAll,
    
    // 확장/접기 관련
    expandedRows: tableExpandedRows,
    handleToggleExpand: handleToggleExpand2,
    
    // 정렬 관련
    sortConfig: tableSortConfig,
    handleSort: tableHandleSort,
    
    // 테이블 상태 업데이트
    updateTableKey: updateTableKeyFunction
  } = useTable({
    data: data,
    initialSortConfig: { key: 'bettingDate', direction: 'desc' }
  });

  // 버튼 액션이 포함된 컬럼 설정
  const columnsWithActions = useMemo(() => {
    return slotCasinoColumns.map(column => {
      // memberInfo 컬럼에 클릭 핸들러 추가
      if (column.id === 'memberInfo') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => {
            console.log('회원정보 클릭:', row);
            handleMemberDetailOpen(row);
          }
        };
      }
      
      // detailView 컬럼에 클릭 핸들러 추가
      if (column.id === 'detailView') {
        return {
          ...column,
          onClick: (row) => {
            console.log('상세보기 클릭:', row);
            handleBettingDetailOpen(row);
          }
        };
      }

      // remarks 컬럼에 공베팅 액션 핸들러 추가
      if (column.id === 'remarks') {
        return {
          ...column,
          onVoidApply: handleVoidApply,
          onVoidCancel: handleVoidCancel
        };
      }
      
      return column;
    });
  }, [handleMemberDetailOpen, handleBettingDetailOpen, handleVoidApply, handleVoidCancel]);

  // 컬럼 표시/숨김 관련 훅 사용 (순서 중요 - 가장 먼저 호출)
  const {
    columnVisibility,
    toggleableColumns,
    visibleColumns,
    hiddenColumnsCount,
    toggleColumnVisibility,
    showAllColumns,
    resetToDefault
  } = useColumnVisibility(columnsWithActions, {
    defaultHiddenColumns: [],
    tableId: 'slotCasinoPage_columnVisibility'
  });

  // 컬럼 드래그 앤 드롭 관련 훅 사용 (visibleColumns를 입력으로 받음)
  const {
    columns,
    dragInfo,
    pinnedColumns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    updateColumns,
    toggleColumnPin,
    resetColumnOrder,
    setDefaultPinnedColumns,
    clearAllPinnedColumns
  } = useTableColumnDrag({
    initialColumns: visibleColumns,
    onColumnOrderChange: (newColumns) => {
      console.log('슬롯/카지노 컬럼 순서 변경:', newColumns.map(col => col.id));
    }
  });

  // 컬럼 표시/숨김 다이얼로그 상태
  const [displayOptionsAnchor, setDisplayOptionsAnchor] = useState(null);
  const isDisplayOptionsOpen = Boolean(displayOptionsAnchor);

  const handleDisplayOptionsClick = useCallback((anchorElement) => {
    setDisplayOptionsAnchor(anchorElement);
  }, []);

  const handleDisplayOptionsClose = useCallback(() => {
    setDisplayOptionsAnchor(null);
  }, []);

  // 동적 필터 옵션 생성
  const dynamicFilterOptions = useMemo(() => {
    const baseOptions = [
      {
        id: 'gameType',
        label: '게임유형',
        items: [
          { value: '', label: '전체' },
          ...gameTypeOptions.map(option => ({
            value: option.value,
            label: option.label
          }))
        ]
      },
      {
        id: 'gameCompany',
        label: '게임사',
        items: [
          { value: '', label: '전체' },
          ...gameCompanyOptions.map(option => ({
            value: option.value,
            label: option.label
          }))
        ]
      },
      {
        id: 'bettingSection',
        label: '베팅섹션',
        items: [
          { value: '', label: '전체' },
          ...bettingSectionOptions.map(option => ({
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
    hierarchical: false,
    filterOptions: {
      initialFilters: { gameType: '', gameCompany: '', bettingSection: '', memberType: '' }
    },
    paginationOptions: {
      initialPage: 0,
      initialRowsPerPage: 25,
      totalItems: data.length,
      onExcelDownload: handleExcelDownload,
      onPrint: handlePrint
    }
  });

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

  // TableHeader 훅 사용 (searchText를 먼저 정의하기 위해 앞으로 이동)
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
      if (page !== 0) {
        handlePageChange(null, 0);
      }
    },
    onToggleColumnPin: (hasPinned) => {
      if (hasPinned) {
        setDefaultPinnedColumns();
      } else {
        clearAllPinnedColumns();
      }
    }
  });

  // 필터 콜백 함수
  const filterCallback = useCallback((result, filterId, filterValue) => {
    switch (filterId) {
      case 'gameType':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          return item._gameTypeValue === filterValue;
        });
        
      case 'gameCompany':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          return item._gameCompanyValue === filterValue;
        });
        
      case 'bettingSection':
        if (filterValue === 'all' || filterValue === '') return result;
        
        return result.filter(item => {
          return item._bettingSectionValue === filterValue;
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
    handleFilterChange(filterId, value);
  }, [handleFilterChange]);

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

  // 필터링된 데이터 및 표시 데이터 저장
  const safeFilteredData = filteredFlatData || [];
  
  // 실제 전체 항목 수 계산 (일반 배열이므로 단순 길이)
  const totalFlattenedItems = safeFilteredData.length;
  
  const safeDisplayData = safeFilteredData;

  // 페이지 변경 핸들러
  const handlePageChangeWithLog = useCallback((event, newPageIndex) => {
    let pageIndex = newPageIndex;
    
    if (typeof event === 'number' && newPageIndex === undefined) {
      pageIndex = event;
    }
    
    if (typeof pageIndex !== 'number') {
      console.error('유효하지 않은 페이지 번호:', pageIndex);
      return;
    }
    
    setCurrentPage(pageIndex);
    handlePageChange(pageIndex);
  }, [currentPage, handlePageChange]);

  // 페이지당 행 수 변경 핸들러
  const handleRowsPerPageChangeWithLog = useCallback((event) => {
    if (!event || !event.target || !event.target.value) {
      console.error('슬롯/카지노 페이지 행 수 변경 이벤트 오류:', event);
      return;
    }
    
    const newRowsPerPage = parseInt(event.target.value, 10);
    
    setCurrentRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
    
    handleRowsPerPageChange(event);
  }, [currentRowsPerPage, handleRowsPerPageChange]);

  // 테이블 강제 리렌더링을 위한 키 값
  const [tableKey, setTableKey] = useState(Date.now());
  
  // 페이지 또는 행 수가 변경될 때마다 테이블 키 업데이트
  useEffect(() => {
    setTableKey(Date.now());
  }, [currentPage, currentRowsPerPage]);
  
  // 현재 페이지와 rowsPerPage를 활용하는 메모이제이션된 표시 데이터 (전체 데이터를 BaseTable에 전달)
  const visibleData = useMemo(() => {
    if (!safeFilteredData || safeFilteredData.length === 0) return [];
    
    return safeFilteredData;
  }, [safeFilteredData, currentPage, currentRowsPerPage, totalFlattenedItems]);

  // visibleColumns에 버튼 핸들러 다시 추가
  const finalColumns = useMemo(() => {
    return columns.map(column => {
      // memberInfo 컬럼에 클릭 핸들러 추가
      if (column.id === 'memberInfo') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => {
            console.log('회원정보 클릭:', row);
            handleMemberDetailOpen(row);
          }
        };
      }
      
      // detailView 컬럼에 클릭 핸들러 추가
      if (column.id === 'detailView') {
        return {
          ...column,
          onClick: (row) => {
            console.log('상세보기 클릭:', row);
            handleBettingDetailOpen(row);
          }
        };
      }

      // remarks 컬럼에 공베팅 액션 핸들러 추가
      if (column.id === 'remarks') {
        return {
          ...column,
          onVoidApply: handleVoidApply,
          onVoidCancel: handleVoidCancel
        };
      }
      
      return column;
    });
  }, [columns, handleMemberDetailOpen, handleBettingDetailOpen, handleVoidApply, handleVoidCancel]);

  // 그리드 준비 상태로 설정
  useEffect(() => {
    setGridReady(true);
  }, [setGridReady]);

  // 행 클릭 핸들러
  const handleRowClick = (row) => {
    console.log('슬롯/카지노 베팅내역 행 클릭:', row);
  };

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader
        title="슬롯/카지노 베팅상세내역"
        onDisplayOptionsClick={handleDisplayOptionsClick}
        showAddButton={false}
        showRefreshButton={true}
        onRefreshClick={() => alert('슬롯/카지노 베팅내역 새로고침')}
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
          title="슬롯/카지노 베팅내역 목록"
          totalItems={totalFlattenedItems}
          countLabel="총 ##count##건의 베팅내역"
          sequentialPageNumbers={sequentialPageNumbers}
          togglePageNumberMode={togglePageNumberMode}
          hasPinnedColumns={hasPinnedColumns}
          isGridReady={isGridReady}
          toggleColumnPin={headerToggleColumnPin}
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          handleClearSearch={handleClearSearch}
          showIndentToggle={false}
          showPageNumberToggle={true}
          showColumnPinToggle={true}
          showSearch={true}
          searchPlaceholder="베팅내역 검색..."
          sx={{ mb: 2 }}
        />

        <Box sx={{ width: '100%' }}>
          <TableFilterAndPagination
            filterProps={{
              columns: columnsWithActions,
              filterValues: filterValues || {},
              activeFilters: activeFilters || {},
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
            key={`slot-casino-table-${tableKey}`}
            columns={finalColumns}
            data={visibleData}
            checkable={false}
            hierarchical={false}
            indentMode={false}
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
            draggableColumns={true}
            onColumnOrderChange={updateColumns}
            dragHandlers={{
              handleDragStart,
              handleDragEnd,
              handleDragOver,
              handleDrop
            }}
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
          />
        </Box>
      </Paper>

      {/* 회원 상세정보 다이얼로그 */}
      <MemberDetailDialog
        open={memberDetailDialogOpen}
        onClose={handleMemberDetailClose}
        member={selectedMemberForDetail}
        onSave={handleMemberDetailSave}
        title="회원 상세정보"
      />

      {/* 베팅 상세정보 다이얼로그 */}
      <BettingDetailDialog
        open={bettingDetailDialogOpen}
        onClose={handleBettingDetailClose}
        bettingData={selectedBettingForDetail}
      />
    </PageContainer>
  );
};

export default SlotCasinoPage; 
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
  Typography
} from '@mui/material';
import { 
  PageHeader, 
  PageContainer,
  ColumnVisibilityDialog,
  TableFilterAndPagination,
  TableHeader,
  BaseTable,
  TableResizeHandle,
  TableHeightSetting,
  TableDebugInfo
} from '../../components/baseTemplate/components';
import { 
  useColumnVisibility,
  useTableFilterAndPagination,
  useTableHeader,
  useTable,
  useTableAutoHeight,
  useTableColumnDrag,
  useTableData,
  useTableResize
} from '../../components/baseTemplate/hooks';
import { 
  agentLevelColumns, 
  agentLevelFilterOptions as filterOptions 
} from './data';
import { AgentLevelDialog, DeleteConfirmDialog } from './components';
import { agentLevelApi } from '../../services/agentLevelApi';
import { permissionApi } from '../../services/permissionApi';
import socketService from '../../services/socketService';

/**
 * 에이전트 레벨 관리 페이지
 * 에이전트의 레벨 설정 및 관리 기능을 제공합니다.
 */
const AgentLevelPage = () => {
  // React Router 네비게이션
  const navigate = useNavigate();

  // 탭 상태 (0: 단계설정, 1: 권한설정)
  const [currentTab, setCurrentTab] = useState(0);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(10);

  // 필터 상태
  const [filterValues, setFilterValues] = useState({});
  const [activeFilters, setActiveFilters] = useState({ status: 'all', levelType: 'all' });

  // 데이터 상태 (API에서 로드)
  const [localData, setLocalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 권한 목록 상태
  const [availablePermissions, setAvailablePermissions] = useState([]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    if (newValue === 0) {
      // 단계설정 탭 - 현재 페이지 유지
      // 이미 단계설정 페이지이므로 별도 네비게이션 불필요
    } else if (newValue === 1) {
      // 권한설정 탭
      navigate('/site-settings/permission');
    }
  }, [navigate]);

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 단계 데이터와 권한 데이터를 병렬로 로드
      const [agentLevelData, permissionData] = await Promise.all([
        agentLevelApi.getAll(),
        permissionApi.getActivePermissions()
      ]);
      
      setLocalData(agentLevelData);
      setAvailablePermissions(permissionData);
      
      // console.log('단계 데이터가 API에서 로드되었습니다:', agentLevelData);
      // console.log('권한 데이터가 API에서 로드되었습니다:', permissionData);
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError('데이터를 불러오는데 실패했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드 및 Socket.IO 연결
  useEffect(() => {
    loadData();
    
    // Socket.IO 연결 및 실시간 업데이트 리스너 등록
    socketService.connect();
    socketService.joinRoom('agent-levels');
    
    // 실시간 업데이트 이벤트 리스너
    const handleAgentLevelAdded = (newLevel) => {
      // console.log('새 에이전트 레벨 추가됨:', newLevel);
      setLocalData(prevData => [...prevData, newLevel]);
    };
    
    const handleAgentLevelUpdated = (updatedLevel) => {
      // console.log('에이전트 레벨 업데이트됨:', updatedLevel);
      setLocalData(prevData => 
        prevData.map(level => 
          level.id === updatedLevel.id ? updatedLevel : level
        )
      );
    };
    
    const handleAgentLevelDeleted = (deletedData) => {
      // console.log('에이전트 레벨 삭제됨:', deletedData);
      setLocalData(prevData => 
        prevData.filter(level => level.id !== deletedData.id)
      );
    };
    
    // 이벤트 리스너 등록
    socketService.on('agent-level-added', handleAgentLevelAdded);
    socketService.on('agent-level-updated', handleAgentLevelUpdated);
    socketService.on('agent-level-deleted', handleAgentLevelDeleted);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      socketService.off('agent-level-added', handleAgentLevelAdded);
      socketService.off('agent-level-updated', handleAgentLevelUpdated);
      socketService.off('agent-level-deleted', handleAgentLevelDeleted);
      socketService.leaveRoom('agent-levels');
    };
  }, [loadData]);


  // 다이얼로그 상태
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState({
    levelType: '',
    permissions: '',
    hierarchyOrder: 1,
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32'
  });

  // 삭제 확인 다이얼로그 상태
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  // 데이터 처리 (간단한 필터링과 페이지네이션)
  const filteredData = useMemo(() => {
    let result = [...localData];
    
    // 유형별 필터링
    if (activeFilters.levelType && activeFilters.levelType !== 'all') {
      result = result.filter(item => item.levelType === activeFilters.levelType);
    }
    
    return result;
  }, [localData, activeFilters]);

  const displayData = useMemo(() => {
    const startIndex = currentPage * currentRowsPerPage;
    const endIndex = startIndex + currentRowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, currentRowsPerPage]);

  const totalCount = filteredData.length;
  const totalPages = Math.ceil(totalCount / currentRowsPerPage);

  // 컬럼 표시옵션 관련 훅 사용
  const {
    columnVisibility,
    visibleColumns,
    hiddenColumnsCount,
    toggleableColumns,
    toggleColumnVisibility,
    showAllColumns,
    resetToDefault
  } = useColumnVisibility(agentLevelColumns, {
    defaultHiddenColumns: [], // 기본적으로 모든 컬럼 표시
    alwaysVisibleColumns: ['checkbox', 'number', 'levelType'], // 체크박스, No., 유형은 항상 표시
    tableId: 'agent_level_table_v2'
  });

  // 표시옵션 다이얼로그 상태
  const [displayOptionsAnchor, setDisplayOptionsAnchor] = useState(null);
  const isDisplayOptionsOpen = Boolean(displayOptionsAnchor);

  // 테이블 높이 자동 조정
  const {
    containerRef,
    tableHeight,
    autoHeight,
    toggleAutoHeight,
    setManualHeight
  } = useTableAutoHeight({
    defaultHeight: '400px',
    defaultAutoHeight: true,
    minHeight: 300,
    bottomMargin: 100
  });

  // 테이블 리사이즈 기능
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
    data: displayData,
    initialSort: { key: null, direction: 'asc' },
    initialCheckedItems: {},
    initialExpandedRows: {},
    indentMode: false, // 에이전트 레벨은 계층 구조가 아님
    page: currentPage,
    rowsPerPage: currentRowsPerPage
  });

  // 다이얼로그 관련 함수들
  const handleOpenDialog = useCallback((level = null) => {
    if (level) {
      setCurrentLevel({ 
        ...level, 
        backgroundColor: level.backgroundColor || '#e8f5e9',
        borderColor: level.borderColor || '#2e7d32',
        hierarchyOrder: level.hierarchyOrder || 1
      });
      setEditMode(true);
    } else {
      setCurrentLevel({
        levelType: '',
        permissions: '',
        hierarchyOrder: localData.length + 1, // 새 항목은 마지막 순서로
        backgroundColor: '#e8f5e9',
        borderColor: '#2e7d32'
      });
      setEditMode(false);
    }
    setOpenDialog(true);
  }, [localData.length]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // 입력 필드 핸들러
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // permissions 필드의 경우 배열을 문자열로 변환하여 저장
    if (name === 'permissions') {
      const permissionsString = Array.isArray(value) ? value.join(', ') : value;
      setCurrentLevel(prev => ({ ...prev, [name]: permissionsString }));
    } else {
      setCurrentLevel(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  // 저장 핸들러
  const handleSave = useCallback(async () => {
    // 입력 검증
    if (!currentLevel.levelType.trim()) {
      alert('단계 이름을 입력해주세요.');
      return;
    }
    
    if (!currentLevel.permissions || currentLevel.permissions.trim() === '') {
      alert('권한을 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      
      if (editMode) {
        // 수정 모드: API로 데이터 업데이트
        const updatedLevel = await agentLevelApi.update(currentLevel.id, {
          levelType: currentLevel.levelType.trim(),
          permissions: currentLevel.permissions.trim(),
          hierarchyOrder: currentLevel.hierarchyOrder,
          backgroundColor: currentLevel.backgroundColor,
          borderColor: currentLevel.borderColor
        });
        
        console.log('단계 수정 완료:', updatedLevel.levelType);
      } else {
        // 추가 모드: API로 새 데이터 추가
        const newLevel = await agentLevelApi.create({
          levelType: currentLevel.levelType.trim(),
          permissions: currentLevel.permissions.trim(),
          hierarchyOrder: currentLevel.hierarchyOrder,
          backgroundColor: currentLevel.backgroundColor,
          borderColor: currentLevel.borderColor
        });
        
        console.log('새 단계 추가 완료:', newLevel);
      }
      
      // 전체 데이터 새로고침하여 순서 반영
      await loadData();
      
      handleCloseDialog();
    } catch (err) {
      console.error('저장 실패:', err);
      alert(`저장에 실패했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentLevel, editMode, handleCloseDialog, loadData]);

  // 핸들러 함수들
  const handleFilterChange = useCallback((filters) => {
    setActiveFilters(filters);
    setCurrentPage(0); // 필터 변경 시 첫 페이지로 이동
  }, []);

  const handleFilter = useCallback((values) => {
    setFilterValues(values);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({ status: 'all', levelType: 'all' });
    setFilterValues({});
    setCurrentPage(0);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
    setCurrentRowsPerPage(newRowsPerPage);
    setCurrentPage(0);
  }, []);

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(() => {
    console.log('에이전트 레벨 엑셀 다운로드');
    alert('에이전트 레벨 엑셀 다운로드 기능이 호출되었습니다');
  }, []);

  // 인쇄 핸들러
  const handlePrint = useCallback(() => {
    console.log('에이전트 레벨 인쇄');
    alert('에이전트 레벨 인쇄 기능이 호출되었습니다');
  }, []);

  // 표시옵션 버튼 클릭 핸들러
  const handleDisplayOptionsClick = useCallback((anchorElement) => {
    setDisplayOptionsAnchor(anchorElement);
  }, []);

  // 표시옵션 다이얼로그 닫기 핸들러
  const handleDisplayOptionsClose = useCallback(() => {
    setDisplayOptionsAnchor(null);
  }, []);

  // 새로고침 핸들러
  const handleRefresh = useCallback(async () => {
    console.log('에이전트 레벨 데이터 새로고침');
    await loadData();
    console.log('데이터가 새로고침되었습니다.');
  }, [loadData]);

  // 데이터 초기화 핸들러 (개발용) - API 서버 재시작으로 대체
  const handleResetData = useCallback(() => {
    alert('데이터 초기화는 API 서버를 재시작하여 수행할 수 있습니다.');
  }, []);

  // 추가 버튼 핸들러 (단계 추가 다이얼로그 열기)
  const handleAdd = useCallback(() => {
    handleOpenDialog();
  }, [handleOpenDialog]);

  // 액션 버튼 핸들러들
  const handleEdit = useCallback((row) => {
    console.log('=== handleEdit 함수 호출됨 ===');
    console.log('수정 버튼 클릭:', row);
    console.log('handleOpenDialog 함수:', typeof handleOpenDialog);
    try {
      handleOpenDialog(row);
      console.log('handleOpenDialog 호출 완료');
    } catch (error) {
      console.error('handleOpenDialog 호출 중 에러:', error);
    }
  }, [handleOpenDialog]);

  const handleDelete = useCallback((row) => {
    console.log('=== handleDelete 함수 호출됨 ===');
    console.log('삭제 버튼 클릭:', row);
    console.log('setDeleteTargetId:', typeof setDeleteTargetId);
    console.log('setDeleteTargetName:', typeof setDeleteTargetName);
    console.log('setDeleteDialogOpen:', typeof setDeleteDialogOpen);
    try {
      setDeleteTargetId(row.id);
      setDeleteTargetName(row.levelType);
      setDeleteDialogOpen(true);
      console.log('삭제 다이얼로그 상태 설정 완료');
    } catch (error) {
      console.error('삭제 다이얼로그 설정 중 에러:', error);
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteTargetId) {
      try {
        setLoading(true);
        
        // API로 데이터 삭제
        await agentLevelApi.delete(deleteTargetId);
        
        // 로컬 상태 업데이트
        setLocalData(prevData => prevData.filter(item => item.id !== deleteTargetId));
        console.log('단계 삭제 완료:', deleteTargetName);
      } catch (err) {
        console.error('삭제 실패:', err);
        alert(`삭제에 실패했습니다: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName('');
  }, [deleteTargetId, deleteTargetName]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName('');
  }, []);

  // 계층 순서 변경 핸들러
  const handleHierarchyChange = useCallback(async (row, newOrder) => {
    try {
      setLoading(true);
      
      console.log('계층 순서 변경 시작:', row.levelType, '→', newOrder);
      
      // API로 계층 순서 변경
      const updatedLevel = await agentLevelApi.updateHierarchyOrder(row.id, newOrder);
      
      console.log('API 응답:', updatedLevel);
      
      // 전체 데이터 다시 로드하여 순서 반영
      await loadData();
      
      console.log('계층 순서 변경 완료:', row.levelType, '→', newOrder);
    } catch (err) {
      console.error('계층 순서 변경 실패:', err);
      
      // 에러 메시지 개선
      let errorMessage = '계층 순서 변경에 실패했습니다.';
      if (err.message.includes('<!DOCTYPE')) {
        errorMessage = 'API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (err.message) {
        errorMessage = `계층 순서 변경에 실패했습니다: ${err.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  // useTableColumnDrag 훅: 원본 agentLevelColumns를 사용
  const {
    columns: orderedColumnsFromHook,
    pinnedColumns,
    toggleColumnPin,
    clearAllPinnedColumns: resetColumnPin,
    isColumnPinned
  } = useTableColumnDrag({
    initialColumns: agentLevelColumns,
    initialPinnedColumns: ['checkbox', 'number', 'levelType'],
    tableId: 'agent_level_table_v2',
    enableColumnPinning: true
  });

  // orderedColumnsFromHook을 기반으로 최종 테이블 컬럼 생성 (핸들러 재연결)
  const finalColumnsForTable = useMemo(() => {
    return orderedColumnsFromHook.map(column => {
      if (column.id === 'actions' && column.buttons) {
        return {
          ...column,
          buttons: column.buttons.map(button => {
            let newOnClick = button.onClick;
            if (button.label === '수정') {
              newOnClick = handleEdit;
            } else if (button.label === '삭제') {
              newOnClick = handleDelete;
            }
            return {
              ...button,
              onClick: newOnClick,
            };
          })
        };
      } else if (column.id === 'hierarchyOrder' && column.type === 'dropdown') {
        return {
          ...column,
          totalCount: localData.length,
          onHierarchyChange: handleHierarchyChange
        };
      }
      return column;
    });
  }, [orderedColumnsFromHook, handleEdit, handleDelete, handleHierarchyChange, localData.length]);

  // 액션 핸들러가 포함된 컬럼으로 visibleColumns 재계산 (표시 옵션용)
  const finalVisibleColumns = useMemo(() => {
    return finalColumnsForTable.filter(column => 
      columnVisibility[column.id] !== false
    );
  }, [finalColumnsForTable, columnVisibility]);

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
    initialTotalItems: totalCount,
    onSearch: (value) => {
      console.log(`에이전트 레벨 검색어: ${value}`);
      if (currentPage !== 0) {
        setCurrentPage(0);
      }
    },
    onToggleColumnPin: (hasPinned) => {
      if (pinnedColumns.length > 0) {
        resetColumnPin();
      } else {
        if (!isColumnPinned('checkbox')) toggleColumnPin('checkbox');
        if (!isColumnPinned('number')) toggleColumnPin('number');
        if (!isColumnPinned('levelType')) toggleColumnPin('levelType');
      }
    }
  });

  // 행 클릭 핸들러
  const handleRowClick = useCallback((row) => {
    console.log('에이전트 레벨 행 클릭:', row);
    // 필요한 경우 여기에 행 클릭 관련 로직 추가
  }, []);

  // 그리드 준비 상태로 설정
  useEffect(() => {
    setGridReady(true);
  }, [setGridReady]);

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader
        title="단계/권한설정"
        onDisplayOptionsClick={handleDisplayOptionsClick}
        onRefreshClick={handleRefresh}
        onAddClick={handleAdd}
        showAddButton={true}
        showRefreshButton={true}
        addButtonText="단계 추가"
        titleTabs={
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              minHeight: 'auto',
              '& .MuiTabs-indicator': {
                backgroundColor: '#1976d2',
              },
              '& .MuiTab-root': {
                minHeight: 'auto',
                padding: '6px 16px',
                fontSize: '14px',
                fontWeight: 500,
                color: '#666',
                '&.Mui-selected': {
                  color: '#1976d2',
                },
              },
            }}
          >
            <Tab label="단계설정" />
            <Tab label="권한설정" />
          </Tabs>
        }
        sx={{ mb: 3 }}
      />

      {/* 경고 문구 */}
      <Alert severity="warning" sx={{ mb: 3, backgroundColor: '#fff3e0', border: '1px solid #ff9800' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            mb: 0.5,
            fontSize: '14px',
            color: '#e65100'
          }}
        >
          * 단계는 영업에 들어가기 앞서 초기에 설정해주세요!
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 600,
            fontSize: '14px',
            color: '#e65100'
          }}
        >
          * 단계 삭제 및 수정 시 일부 데이터가 변형되거나 삭제가 될 수 있으니 신중해 주세요!
        </Typography>
      </Alert>

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

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 로딩 상태 */}
      {loading && !localData.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        /* 메인 테이블 영역 */
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', p: 2 }}>
          {/* 테이블 헤더 */}
          <TableHeader
            title="에이전트 레벨 목록"
            totalItems={totalCount}
            countLabel="총 ##count##개의 레벨"
            sequentialPageNumbers={sequentialPageNumbers}
            togglePageNumberMode={togglePageNumberMode}
            hasPinnedColumns={pinnedColumns.length > 0}
            isGridReady={isGridReady}
            toggleColumnPin={headerToggleColumnPin}
            searchText={searchText}
            handleSearchChange={handleSearchChange}
            handleClearSearch={handleClearSearch}
            showPageNumberToggle={true}
            showColumnPinToggle={true}
            showSearch={true}
            searchPlaceholder="레벨 검색..."
            sx={{ mb: 2 }}
          />

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
            showAutoHeightToggle={false}
          />
          */}

          {/* 필터 및 페이지네이션 */}
          <TableFilterAndPagination
            filterProps={{
              activeFilters: activeFilters,
              handleFilterChange: (filterId, filterValue) => {
                const newFilters = { ...activeFilters, [filterId]: filterValue };
                handleFilterChange(newFilters);
              },
              filterOptions: filterOptions,
              showDateFilter: false // 날짜 필터는 사용하지 않음
            }}
            paginationProps={{
              count: totalCount,
              page: currentPage,
              rowsPerPage: currentRowsPerPage,
              onPageChange: handlePageChange,
              onRowsPerPageChange: (event) => {
                const newRowsPerPage = parseInt(event.target.value, 10);
                handleRowsPerPageChange(newRowsPerPage);
              },
              onExcelDownload: handleExcelDownload,
              onPrint: handlePrint
            }}
          />

          {/* 테이블 컨테이너 */}
          <Box 
            ref={containerRef}
            sx={{ 
              width: '100%',
              mt: 2,
              pb: 2
            }}
          >
            {/* 테이블 */}
            <BaseTable
              columns={finalColumnsForTable}
              data={displayData}
              checkable={true}
              fixedHeader={true}
              maxHeight={tableHeight}
              checkedItems={tableCheckedItems}
              allChecked={tableAllChecked}
              expandedRows={tableExpandedRows}
              sortConfig={tableSortConfig}
              pinnedColumns={pinnedColumns}
              onCheck={tableHandleCheck}
              onToggleAll={tableHandleToggleAll}
              onSort={tableHandleSort}
              onToggleExpand={tableHandleToggleExpand}
              onRowClick={handleRowClick}
              indentMode={false}
              sequentialPageNumbers={sequentialPageNumbers}
              page={currentPage}
              rowsPerPage={currentRowsPerPage}
              totalCount={totalCount}
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
            <TableDebugInfo
              currentPage={currentPage}
              currentRowsPerPage={currentRowsPerPage}
              dataLength={localData.length}
              filteredDataLength={filteredData.length}
              totalFlattenedItems={totalCount}
              searchText={searchText}
              sequentialPageNumbers={sequentialPageNumbers}
              isDragging={isDragging}
              tableHeight={tableHeight}
              pinnedColumns={pinnedColumns}
              visibleColumnsCount={finalVisibleColumns.length}
              totalColumnsCount={agentLevelColumns.length}
              hiddenColumnsCount={hiddenColumnsCount}
              columnVisibility={columnVisibility}
              autoHeight={autoHeight}
              calculateMaxHeight={calculateMaxHeight}
              show={true}
            />
          </Box>
        </Paper>
      )}

      {/* 단계 추가/수정 다이얼로그 */}
      <AgentLevelDialog
        open={openDialog}
        editMode={editMode}
        currentLevel={currentLevel}
        onClose={handleCloseDialog}
        onSave={handleSave}
        onInputChange={handleInputChange}
        availablePermissions={availablePermissions}
        totalCount={localData.length}
      />

      {/* 삭제 확인 다이얼로그 */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="단계 삭제 확인"
        itemName={deleteTargetName}
        itemType="단계"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </PageContainer>
  );
};

export default AgentLevelPage; 
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Paper, Typography, useTheme, Button, Chip, Tabs, Tab } from '@mui/material';
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
import MessageDetailDialog from '../../components/dialogs/MessageDetailDialog';
import MemberDetailDialog from '../../components/dialogs/MemberDetailDialog';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import { 
  messagesColumns,
  statusOptions,
  messageTypeOptions,
  generateMessagesData
} from './data/messagesData';
import usePageData from '../../hooks/usePageData';
import SentMessages from './components/SentMessages';
import SendMessage from './components/SendMessage';
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

/**
 * 문의관리 페이지
 * 고객 문의 목록 조회, 필터링, 페이지네이션 등의 기능을 제공합니다.
 */
const MessagesPage = () => {
  const theme = useTheme();

  // 탭 상태 (0: 받은문의, 1: 보낸문의, 2: 문의보내기)
  const [currentTab, setCurrentTab] = useState(0);

  // 전역 알림 사용
  const { handleRefresh } = useNotification();

  // 탭 변경 핸들러
  const handleTabChange = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    console.log('탭 변경:', newValue === 0 ? '받은문의' : newValue === 1 ? '보낸문의' : '문의보내기');
  }, []);

  // 새로고침 핸들러
  const handleRefreshClick = useCallback(() => {
    handleRefresh('문의관리');
  }, [handleRefresh]);

  // 범용 페이지 데이터 훅 사용
  const {
    data,
    membersData,
    types,
    typeHierarchy,
    isLoading,
    error,
    isInitialized
  } = usePageData({
    pageType: 'messages',
    dataGenerator: generateMessagesData,
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
  
  // 헤더 행 고정 기능 - useTableHeaderFixed 훅 사용
  const {
    tableHeaderRef,
    getTableHeaderStyles
  } = useTableHeaderFixed({
    zIndex: 10,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  });

  // 컬럼 가시성 관리 - useColumnVisibility 훅 사용
  const {
    visibleColumns,
    toggleColumnVisibility,
    resetToDefault,
    columnVisibility,
    toggleableColumns,
    hiddenColumnsCount,
    showAllColumns
  } = useColumnVisibility(messagesColumns || [], {
    storageKey: 'messages-column-visibility'
  });

  // 다이얼로그 상태
  const [displayOptionsAnchor, setDisplayOptionsAnchor] = useState(null);
  const isDisplayOptionsOpen = Boolean(displayOptionsAnchor);

  // 표시 옵션 다이얼로그 핸들러
  const handleDisplayOptionsClick = useCallback((anchorEl) => {
    setDisplayOptionsAnchor(anchorEl);
  }, []);

  const handleDisplayOptionsClose = useCallback(() => {
    setDisplayOptionsAnchor(null);
  }, []);

  // 로컬 상태로 데이터 관리 (상태 변경을 위해)
  const [localMessagesData, setLocalMessagesData] = useState([]);

  // usePageData의 data를 직접 사용하거나, 없으면 fallback으로 생성
  const finalData = useMemo(() => {
    if (data && data.length > 0) {
      return data;
    }
    
    // fallback: 데이터가 없을 때 직접 생성
    return generateMessagesData();
  }, [data]);

  // finalData가 변경될 때마다 로컬 상태 업데이트
  useEffect(() => {
    // 안전하게 데이터 처리
    const safeData = finalData || [];
    setLocalMessagesData(safeData);
  }, [finalData]);

  // 문의상세정보 다이얼로그 상태
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // 회원상세정보 다이얼로그 상태 (아이디 클릭 시)
  const [selectedMember, setSelectedMember] = useState(null);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  // 상태 변경 핸들러
  const handleStatusChange = useCallback((messageId, newStatus) => {
    console.log(`문의 ${messageId}의 상태를 ${newStatus}로 변경`);
    
    // 상태 옵션에서 라벨과 색상 찾기
    const statusOption = statusOptions.find(opt => opt.value === newStatus);
    const statusLabel = statusOption?.label || newStatus;
    const statusColor = statusOption?.color || 'default';
    
    // 로컬 데이터 업데이트
    setLocalMessagesData(prevData => {
      return prevData.map(message => {
        if (message.id === messageId) {
          const updatedMessage = {
            ...message,
            status: {
              label: statusLabel,
              color: statusColor,
              variant: 'outlined'
            }
          };
          
          // 읽음 처리 시 읽은 날짜 업데이트
          if (newStatus === 'read' || newStatus === 'pending' || newStatus === 'completed') {
            const today = new Date().toISOString().split('T')[0];
            updatedMessage.readDate = today;
            console.log(`문의 ${messageId} 읽음 처리 - 읽은 날짜: ${today}`);
          }
          
          return updatedMessage;
        }
        return message;
      });
    });
    
    console.log(`✅ 문의 상태가 "${statusLabel}"로 변경되었습니다.`);
  }, []);

  // 문의 삭제 핸들러
  const handleDeleteMessage = useCallback((messageId) => {
    console.log('문의 삭제:', messageId);
    if (window.confirm('이 문의를 삭제하시겠습니까?')) {
      setLocalMessagesData(prevData => {
        return prevData.filter(message => message.id !== messageId);
      });
      console.log(`문의 ${messageId} 삭제 완료`);
    }
  }, []);

  // 문의 상세보기 핸들러 (제목 클릭 시)
  const handleViewMessage = useCallback((message) => {
    console.log('문의 상세보기:', message);
    setSelectedMessage(message);
    setOpenDetailDialog(true);
  }, []);

  // 회원 상세보기 핸들러 (아이디 클릭 시)
  const handleMemberDetailOpen = useCallback((member) => {
    console.log('회원 상세보기:', member);
    setSelectedMember(member);
    setOpenMemberDialog(true);
  }, []);

  // 테이블 필터 및 페이지네이션 설정
  const {
    currentPage,
    currentRowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    searchText,
    handleSearchChange,
    handleClearSearch,
    handleFilterChange,
    activeFilters,
    sequentialPageNumbers,
    togglePageNumberMode
  } = useTableFilterAndPagination({
    data: localMessagesData || [],
    storageKey: 'messages-table-pagination',
    searchFields: ['title', 'memberInfo', 'username', 'nickname'],
    defaultRowsPerPage: 25,
    paginationOptions: {
      initialPage: 0,
      initialRowsPerPage: 25
    }
  });

  // 수동으로 데이터 필터링
  const safeFilteredData = useMemo(() => {
    let filtered = [...localMessagesData];
    
    // 검색어 필터링
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(item => 
        item.title?.toLowerCase().includes(searchLower) ||
        item.memberInfo?.toLowerCase().includes(searchLower) ||
        item.username?.toLowerCase().includes(searchLower) ||
        item.nickname?.toLowerCase().includes(searchLower)
      );
    }
    
    // 다른 필터 적용
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(item => {
          if (key === 'memberType' && item.memberType) {
            return item.memberType.id === value;
          }
          if (key === 'status' && item.status) {
            const statusValue = typeof item.status === 'string' ? item.status : item.status.label;
            return statusValue === value || (statusOptions.find(opt => opt.label === statusValue)?.value === value);
          }
          if (key === 'inquiryType' && item.inquiryType) {
            const typeValue = typeof item.inquiryType === 'string' ? item.inquiryType : item.inquiryType.label;
            return typeValue === value || (messageTypeOptions.find(opt => opt.label === typeValue)?.value === value);
          }
          return true;
        });
      }
    });
    
    return filtered;
  }, [localMessagesData, searchText, activeFilters]);

  const totalCount = safeFilteredData.length;

  // 필터 옵션 정의
  const filterOptions = [
    {
      id: 'memberType',
      label: '회원 유형',
      items: [
        { value: '', label: '전체' },
        { value: 'member', label: '회원' },
        { value: 'agent', label: '에이전트' },
        { value: 'dealer', label: '딜러' },
        { value: 'admin', label: '관리자' }
      ]
    },
    {
      id: 'status',
      label: '상태',
      items: [
        { value: '', label: '전체' },
        ...statusOptions.map(option => ({
          value: option.value,
          label: option.label
        }))
      ]
    },
    {
      id: 'inquiryType',
      label: '문의 유형',
      items: [
        { value: '', label: '전체' },
        ...messageTypeOptions.map(option => ({
          value: option.value,
          label: option.label
        }))
      ]
    }
  ];

  // 테이블 컬럼 드래그 훅 사용
  const {
    dragHandlers,
    dragInfo,
    handleColumnOrderChange,
    pinnedColumns,
    toggleColumnPin,
    isColumnPinned,
    clearAllPinnedColumns,
    hasPinnedColumns
  } = useTableColumnDrag({
    initialColumns: visibleColumns,
    tableId: 'messages-table',
    enableColumnPinning: true,
    initialPinnedColumns: ['index', 'memberType', 'memberInfo']
  });

  // 테이블 헤더 설정
  const { 
    isGridReady, 
    setGridReady,
    headerToggleColumnPin
  } = useTableHeader({
    initialTotalItems: totalCount,
    onSearch: (value) => {
      console.log(`문의 검색어: ${value}`);
      if (currentPage !== 0) {
        handlePageChange(0);
      }
    },
    onToggleColumnPin: (hasPinned) => {
      if (pinnedColumns.length > 0) {
        clearAllPinnedColumns();
      } else {
        if (!isColumnPinned('index')) toggleColumnPin('index');
        if (!isColumnPinned('memberType')) toggleColumnPin('memberType');
        if (!isColumnPinned('memberInfo')) toggleColumnPin('memberInfo');
      }
    }
  });

  // 그리드 준비 상태로 설정
  useEffect(() => {
    setGridReady(true);
  }, [setGridReady]);

  // 최종 컬럼 (가시성 적용)
  const finalColumns = useMemo(() => {
    if (!visibleColumns || visibleColumns.length === 0) {
      return [];
    }
    
    return visibleColumns.map(column => {
      if (column.id === 'title') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => handleViewMessage(row)
        };
      }
      
      if (column.id === 'memberInfo') {
        return {
          ...column,
          clickable: true,
          onClick: (row) => handleMemberDetailOpen(row)
        };
      }
      
      if (column.id === 'memberType') {
        return {
          ...column,
          type: 'chip',
          render: (value, row) => {
            if (!row.memberType) return { label: '미분류', color: 'default', variant: 'outlined' };
            return row.memberType;
          }
        };
      }
      
      if (column.id === 'inquiryType') {
        return {
          ...column,
          type: 'chip',
          render: (value, row) => {
            if (!row.inquiryType) return { label: '미분류', color: 'default', variant: 'outlined' };
            return row.inquiryType;
          }
        };
      }
      
      if (column.id === 'actions') {
        return {
          ...column,
          render: (value, row) => {
            // 상태 확인
            let statusLabel = '미읽음';
            if (row.status) {
              if (typeof row.status === 'string') {
                statusLabel = row.status;
              } else if (typeof row.status === 'object' && row.status.label) {
                statusLabel = row.status.label;
              }
            }
            
            const buttons = [];
            
            // 미읽음 상태: 보기, 대기, 삭제
            if (statusLabel === '미읽음') {
              buttons.push(
                {
                  label: '보기',
                  variant: 'outlined',
                  size: 'small',
                  color: 'primary',
                  onClick: () => {
                    handleViewMessage(row);
                    handleStatusChange(row.id, 'read');
                  }
                },
                {
                  label: '대기',
                  variant: 'outlined',
                  size: 'small',
                  color: 'warning',
                  onClick: () => handleStatusChange(row.id, 'pending')
                },
                {
                  label: '삭제',
                  variant: 'outlined',
                  size: 'small',
                  color: 'error',
                  onClick: () => handleDeleteMessage(row.id)
                }
              );
            }
            // 대기 상태: 보기, 삭제
            else if (statusLabel === '대기') {
              buttons.push(
                {
                  label: '보기',
                  variant: 'outlined',
                  size: 'small',
                  color: 'primary',
                  onClick: () => {
                    handleViewMessage(row);
                    handleStatusChange(row.id, 'read');
                  }
                },
                {
                  label: '삭제',
                  variant: 'outlined',
                  size: 'small',
                  color: 'error',
                  onClick: () => handleDeleteMessage(row.id)
                }
              );
            }
            // 읽음 상태: 삭제만
            else if (statusLabel === '읽음') {
              buttons.push({
                label: '삭제',
                variant: 'outlined',
                size: 'small',
                color: 'error',
                onClick: () => handleDeleteMessage(row.id)
              });
            }
            // 완료 상태: 버튼 없음
            
            return { buttons };
          }
        };
      }
      
      return column;
    });
  }, [visibleColumns, handleViewMessage, handleMemberDetailOpen, handleStatusChange, handleDeleteMessage]);

  // 행 클릭 핸들러
  const handleRowClick = useCallback((row) => {
    console.log('문의 행 클릭:', row);
    handleViewMessage(row);
  }, [handleViewMessage]);

  // 체크박스 관련 상태 및 핸들러
  const [selectedItems, setSelectedItems] = useState([]);
  
  // 선택된 아이템 상태를 객체 형태로 변환
  const checkedItems = useMemo(() => {
    const result = {};
    selectedItems.forEach(id => {
      result[id] = true;
    });
    return result;
  }, [selectedItems]);

  // 모든 아이템이 선택되었는지 확인
  const allChecked = useMemo(() => {
    // safeFilteredData가 없거나 길이가 0이면 false 반환
    if (!safeFilteredData || safeFilteredData.length === 0) {
      return false;
    }
    
    const currentPageData = safeFilteredData.slice(
      (currentPage || 0) * (currentRowsPerPage || 25),
      ((currentPage || 0) + 1) * (currentRowsPerPage || 25)
    );
    
    // 현재 페이지에 데이터가 없으면 false 반환
    if (!currentPageData || currentPageData.length === 0) {
      return false;
    }
    
    // 모든 아이템이 선택되었는지 확인
    return currentPageData.every(item => selectedItems.includes(item.id));
  }, [safeFilteredData, currentPage, currentRowsPerPage, selectedItems]);

  // 체크박스 변경 핸들러
  const handleCheck = useCallback((id, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  }, []);

  // 모든 체크박스 토글 핸들러
  const handleToggleAll = useCallback((checked) => {
    // safeFilteredData가 없거나 길이가 0이면 아무 작업도 하지 않음
    if (!safeFilteredData || safeFilteredData.length === 0) {
      return;
    }
    
    if (checked) {
      const currentPageIds = safeFilteredData
        .slice(
          (currentPage || 0) * (currentRowsPerPage || 25),
          ((currentPage || 0) + 1) * (currentRowsPerPage || 25)
        )
        .map(item => item.id);
      
      setSelectedItems(prev => {
        const newItems = [...prev];
        currentPageIds.forEach(id => {
          if (!newItems.includes(id)) {
            newItems.push(id);
          }
        });
        return newItems;
      });
    } else {
      const currentPageIds = safeFilteredData
        .slice(
          (currentPage || 0) * (currentRowsPerPage || 25),
          ((currentPage || 0) + 1) * (currentRowsPerPage || 25)
        )
        .map(item => item.id);
      
      setSelectedItems(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  }, [safeFilteredData, currentPage, currentRowsPerPage]);

  // 정렬 상태
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // 정렬 핸들러
  const handleSort = useCallback((columnId, direction) => {
    setSortConfig({ key: columnId, direction });
  }, []);

  // 액션 버튼들
  const actionButtons = useMemo(() => [
    {
      label: '선택 삭제',
      variant: 'outlined',
      color: 'error',
      disabled: selectedItems.length === 0,
      onClick: () => {
        console.log('선택된 문의 삭제:', selectedItems);
        if (window.confirm(`선택된 ${selectedItems.length}개의 문의를 삭제하시겠습니까?`)) {
          setLocalMessagesData(prevData => {
            return prevData.filter(message => !selectedItems.includes(message.id));
          });
          setSelectedItems([]);
        }
      }
    }
  ], [selectedItems]);

  // 받은문의 탭 렌더링
  const renderReceivedMessages = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* 테이블 헤더 */}
      <TableHeader
        title="받은 문의"
        totalItems={totalCount}
        countLabel="총 ##count##건의 문의"
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
        searchPlaceholder="문의 검색..."
        sx={{ mb: 2 }}
      />

      {/* 테이블 높이 설정 */}
      <TableHeightSetting
        autoHeight={autoHeight}
        tableHeight={tableHeight}
        toggleAutoHeight={toggleAutoHeight}
        setManualHeight={setManualHeight}
      />

      {/* 테이블 필터 및 페이지네이션 */}
      <TableFilterAndPagination
        filterProps={{
          activeFilters: activeFilters,
          handleFilterChange: (filterId, filterValue) => {
            const newFilters = { ...activeFilters, [filterId]: filterValue };
            handleFilterChange(newFilters);
          },
          filterOptions: filterOptions,
          showDateFilter: false
        }}
        paginationProps={{
          count: totalCount || 0,
          page: currentPage || 0,
          rowsPerPage: currentRowsPerPage || 25,
          onPageChange: handlePageChange,
          onRowsPerPageChange: handleRowsPerPageChange
        }}
      />

      {/* 테이블 컨테이너 */}
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <BaseTable
          data={safeFilteredData.slice(
            (currentPage || 0) * (currentRowsPerPage || 25),
            ((currentPage || 0) + 1) * (currentRowsPerPage || 25)
          )}
          columns={finalColumns || []}
          checkable={true}
          checkedItems={checkedItems}
          allChecked={allChecked}
          onCheck={handleCheck}
          onToggleAll={handleToggleAll}
          sortConfig={sortConfig}
          onSort={handleSort}
          onRowClick={handleRowClick}
          page={currentPage || 0}
          rowsPerPage={currentRowsPerPage || 25}
          totalCount={totalCount || 0}
          sequentialPageNumbers={sequentialPageNumbers || false}
          tableHeaderRef={tableHeaderRef}
          headerStyle={getTableHeaderStyles()}
          fixedHeader={true}
          maxHeight={tableHeight}
          draggableColumns={true}
          onColumnOrderChange={handleColumnOrderChange}
          dragHandlers={dragHandlers}
          dragInfo={dragInfo}
          pinnedColumns={pinnedColumns}
        />

        {/* 테이블 리사이즈 핸들 */}
        <TableResizeHandle 
          resizeHandleProps={getResizeHandleProps(parseFloat(tableHeight))}
          isDragging={isDragging}
        />
      </Box>
    </Paper>
  );

  return (
    <PageContainer>
      <PageHeader 
        title="문의관리"
        onDisplayOptionsClick={handleDisplayOptionsClick}
        onRefresh={handleRefreshClick}
        showDisplayOptionsButton={true}
        showRefreshButton={true}
        showAddButton={false}
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
            <Tab label="받은문의" />
            <Tab label="보낸문의" />
            <Tab label="문의보내기" />
          </Tabs>
        }
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

      {/* 탭 내용 */}
      {currentTab === 0 && renderReceivedMessages()}
      {currentTab === 1 && <SentMessages />}
      {currentTab === 2 && <SendMessage />}

      {/* 문의 상세 다이얼로그 */}
      <MessageDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        message={selectedMessage}
        onStatusChange={handleStatusChange}
      />

      {/* 회원 상세 다이얼로그 */}
      <MemberDetailDialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
        member={selectedMember}
      />
    </PageContainer>
  );
};

export default MessagesPage;
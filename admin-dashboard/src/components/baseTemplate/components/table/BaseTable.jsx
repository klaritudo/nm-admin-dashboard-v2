import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableContainer,
  Paper,
  Box,
  useTheme
} from '@mui/material';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

/**
 * 기본 테이블 컴포넌트
 * 다양한 특수 기능을 지원하는 재사용 가능한 테이블 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.columns - 테이블 컬럼 정의
 * @param {Array} props.data - 테이블 데이터
 * @param {boolean} props.checkable - 체크박스 컬럼 사용 여부
 * @param {boolean} props.hierarchical - 계층형 구조 사용 여부
 * @param {Function} props.onRowClick - 행 클릭 이벤트 핸들러
 * @param {Function} props.onSort - 정렬 이벤트 핸들러
 * @param {Function} props.onCheck - 체크박스 클릭 이벤트 핸들러
 * @param {Function} props.onToggleExpand - 계층 펼치기/접기 이벤트 핸들러
 * @param {number} props.page - 현재 페이지 (0부터 시작)
 * @param {number} props.rowsPerPage - 페이지당 행 수
 * @param {number} props.totalCount - 전체 항목 수
 * @param {boolean} props.sequentialPageNumbers - 연속 페이지 번호 사용 여부 (true: 연속 번호, false: 페이지별 번호)
 * @param {boolean} props.draggableColumns - 컬럼 드래그 앤 드롭 사용 여부
 * @param {Function} props.onColumnOrderChange - 컬럼 순서 변경 이벤트 핸들러
 * @param {Object} props.dragHandlers - 드래그 관련 핸들러 모음
 * @param {Object} props.dragInfo - 현재 드래그 중인 컬럼 정보
 * @param {boolean} props.indentMode - 계층형 구조에서 들여쓰기 모드 사용 여부
 * @param {Object} props.sx - 추가 스타일 속성
 * @param {React.RefObject} props.tableHeaderRef - 테이블 헤더 참조 (헤더 행 고정에 사용)
 * @param {Object} props.headerStyle - 테이블 헤더 스타일 (헤더 행 고정에 사용)
 * @param {boolean} props.fixedHeader - 테이블 헤더 행 고정 사용 여부
 * @param {number|string} props.maxHeight - 테이블 최대 높이 (스크롤 가능한 영역 제한)
 * @param {Array} props.pinnedColumns - 고정된 컬럼 ID 배열
 * @param {Object} props.checkedItems - 체크된 아이템 상태
 * @param {Object} props.expandedRows - 확장된 행 상태
 * @param {boolean} props.allChecked - 모든 체크박스 체크 상태
 * @param {Function} props.onToggleAll - 모든 체크박스 토글 핸들러
 * @param {Object} props.sortConfig - 정렬 상태
 * @param {boolean} props.draggableRows - 행 드래그 앤 드롭 사용 여부
 * @param {Object} props.rowDragHandlers - 행 드래그 관련 핸들러 모음
 */
const BaseTable = ({
  columns = [],
  data = [],
  checkable = false,
  hierarchical = false,
  onRowClick,
  onSort,
  onCheck,
  onToggleExpand,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  sequentialPageNumbers = false,
  draggableColumns = false,
  onColumnOrderChange,
  dragHandlers = {},
  dragInfo = { dragging: false, columnId: null },
  indentMode = true,
  sx = {},
  // 헤더 행 고정 관련 props
  tableHeaderRef = null,
  headerStyle = {},
  fixedHeader = false,
  maxHeight = '400px',
  pinnedColumns = [],
  // 외부 상태 props 추가
  checkedItems = {},
  expandedRows = {},
  allChecked = false,
  onToggleAll,
  sortConfig = { key: null, direction: null },
  // 행 드래그 관련 props
  draggableRows = false,
  rowDragHandlers = {}
}) => {
  // props 값 확인 (주석 처리)
  // console.log('🚨 BaseTable props 확인:', {
  //   columnsLength: columns?.length || 0,
  //   dataLength: data?.length || 0,
  //   data: data,
  //   checkable,
  //   page,
  //   rowsPerPage
  // });
  const theme = useTheme();
  const tableRef = useRef(null);
  const [tableKey, setTableKey] = useState(0);
  
  // 정렬 상태 관리
  const [localSortConfig, setLocalSortConfig] = useState({ key: null, direction: null });
  
  // 고정 컬럼 위치 재계산을 위한 강제 리렌더링
  const forceTableUpdate = useCallback(() => {
    setTableKey(prev => prev + 1);
  }, []);
  
  // 컴포넌트 마운트 시 모든 행을 펼친 상태로 초기화
  useEffect(() => {
    if (hierarchical && data && data.length > 0) {
      // 모든 행의 ID를 확장 상태로 설정
      const initialExpandedState = {};
      
      // 재귀적으로 모든 행의 ID를 수집
      const collectAllIds = (items) => {
        if (!items || !items.length) return;
        
        items.forEach(item => {
          if (item.id !== undefined) {
            initialExpandedState[item.id] = true;
          }
          
          if (item.children && item.children.length > 0) {
            collectAllIds(item.children);
          }
        });
      };
      
      collectAllIds(data);
      
      // console.log('초기 확장 상태 설정 완료:', Object.keys(initialExpandedState).length, '개 행');
    }
  }, [hierarchical, data]);
  
  // 페이지네이션 정보 로깅 (주석 처리)
  // useEffect(() => {
  //   console.log(`BaseTable 상태:`, {
  //     page,
  //     rowsPerPage,
  //     totalCount,
  //     sequentialPageNumbers,
  //     dataLength: data?.length || 0,
  //     firstRowData: data?.[0]
  //   });
  // }, [page, rowsPerPage, totalCount, data, sequentialPageNumbers]);
  
  // sequentialPageNumbers 변경 감지 (주석 처리)
  // useEffect(() => {
  //   console.log('BaseTable sequentialPageNumbers 변경됨:', sequentialPageNumbers);
  // }, [sequentialPageNumbers]);
  
  // 확장/접기 상태 변경 시 테이블 업데이트
  useEffect(() => {
    if (hierarchical && pinnedColumns.length > 0) {
      // 약간의 지연 후 테이블 업데이트 (DOM 업데이트 완료 대기)
      const timer = setTimeout(() => {
        forceTableUpdate();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [expandedRows, hierarchical, pinnedColumns.length, forceTableUpdate]);
  
  // 테이블 헤더에 그룹 헤더가 있는지 확인
  const hasGroupHeaders = useMemo(() => {
    return columns.some(column => column.type === 'group' && Array.isArray(column.children));
  }, [columns]);
  
  // 정렬 처리 핸들러
  const handleSort = useCallback((columnId) => {
    let direction = 'asc';
    
    if (localSortConfig.key === columnId) {
      if (localSortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (localSortConfig.direction === 'desc') {
        direction = null; // 세번째 클릭 시 정렬 없음
      } else {
        direction = 'asc'; // null 상태에서 다시 클릭하면 오름차순으로 시작
      }
    }
    
    setLocalSortConfig({ key: columnId, direction });
    
    if (onSort) {
      onSort(columnId, direction);
    }
  }, [localSortConfig, onSort]);
  
  // 체크박스 처리 핸들러
  const handleCheck = useCallback((id, checked) => {
    const newCheckedItems = { ...checkedItems, [id]: checked };
    if (onCheck) {
      onCheck(id, checked, newCheckedItems);
    }
  }, [checkedItems, onCheck]);
  
  // 행 확장/접기 처리 핸들러
  const handleToggleExpand = useCallback((id) => {
    const newExpandedRows = { 
      ...expandedRows, 
      [id]: !expandedRows[id] 
    };
    
    if (onToggleExpand) {
      onToggleExpand(id, newExpandedRows[id]);
    }
  }, [expandedRows, onToggleExpand]);
  
  // 모든 체크박스 토글 핸들러
  const handleToggleAll = useCallback((checked) => {
    // console.log('BaseTable handleToggleAll 호출됨:', { checked, dataLength: data.length, page, rowsPerPage });
    
    // 현재 페이지에 표시되는 데이터만 추출
    const getCurrentPageData = (items) => {
      // 계층 구조를 평면화
      const flattenData = (dataItems) => {
        let result = [];
        dataItems.forEach(item => {
          result.push(item);
          if (item.children && item.children.length > 0) {
            result = [...result, ...flattenData(item.children)];
          }
        });
        return result;
      };
      
      const flatData = flattenData(items);
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      
      // console.log('현재 페이지 데이터 추출:', {
      //   totalItems: flatData.length,
      //   startIndex,
      //   endIndex,
      //   currentPageItems: flatData.slice(startIndex, endIndex).length
      // });
      
      return flatData.slice(startIndex, endIndex);
    };
    
    const currentPageData = getCurrentPageData(data);
    // console.log('BaseTable 현재 페이지 항목 수:', currentPageData.length);
    
    if (checked) {
      // 현재 페이지의 모든 항목 체크
      currentPageData.forEach(item => {
        // console.log('현재 페이지 체크 설정:', item.id, item.userId || item.type?.label);
      });
    } else {
      // console.log('BaseTable 현재 페이지 모든 항목 체크 해제');
    }
    
    // console.log('BaseTable onToggleAll 호출 전:', { checked, onToggleAll: typeof onToggleAll });
    if (onToggleAll) {
      onToggleAll(checked);
    }
  }, [data, onToggleAll, page, rowsPerPage]);
  
  // 테이블 컨테이너 스타일 계산
  const containerStyle = useMemo(() => {
    const baseStyle = {
      boxShadow: theme.shadows[2],
      borderRadius: '10px',
      overflow: 'auto', // 기본적으로 모든 방향 스크롤 허용
      overflowX: 'auto', // 가로 스크롤 명시적 허용
      overflowY: 'auto', // 세로 스크롤 명시적 허용
      overscrollBehavior: 'contain', // 스크롤 경계 제어
      width: '100%', // 부모 컨테이너 너비에 맞춤
      maxWidth: '100%', // 부모를 벗어나지 않음
      // 스크롤바 스타일링 (웹킷 기반 브라우저)
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.grey[400],
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.grey[200],
      },
      ...sx
    };
    
    // 헤더 고정 기능이 활성화된 경우 최대 높이 추가
    if (fixedHeader) {
      return {
        ...baseStyle,
        maxHeight: maxHeight
      };
    }
    
    return baseStyle;
  }, [theme, sx, fixedHeader, maxHeight]);
  
  // 테이블 헤더 스타일 계산
  const headerStickyStyle = useMemo(() => {
    if (!fixedHeader) return {};
    
    return {
      position: 'sticky',
      top: 0,
      zIndex: 25,
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 1px 2px ${theme.palette.grey[300]}`,
      ...headerStyle
    };
  }, [fixedHeader, theme, headerStyle]);
  
  // 테이블 최소 너비 계산
  const calculateTableMinWidth = useMemo(() => {
    if (!columns || columns.length === 0) return 800;
    
    let totalWidth = 0;
    
    // 체크박스 컬럼 너비
    if (checkable) {
      totalWidth += 48;
    }
    
    // 각 컬럼의 너비 합계 계산
    columns.forEach(column => {
      if (column.type === 'group' && column.children) {
        // 그룹 컬럼의 경우 자식 컬럼들의 너비 합계
        column.children.forEach(child => {
          const width = child.width;
          if (typeof width === 'string' && width.includes('px')) {
            totalWidth += parseInt(width.replace('px', ''), 10);
          } else if (typeof width === 'number') {
            totalWidth += width;
          } else {
            totalWidth += 150; // 기본 너비
          }
        });
      } else if (column.type !== 'checkbox') {
        const width = column.width;
        if (typeof width === 'string' && width.includes('px')) {
          totalWidth += parseInt(width.replace('px', ''), 10);
        } else if (typeof width === 'number') {
          totalWidth += width;
        } else {
          totalWidth += 150; // 기본 너비
        }
      }
    });
    
    // 최소 너비 보장 및 여유 공간 추가
    return Math.max(totalWidth + 50, 800); // 여유 공간 50px 추가, 최소 800px 보장
  }, [columns, checkable]);
  
  // 데이터 체크 로그 추가 (주석 처리)
  // useEffect(() => {
  //   console.log('BaseTable 데이터 체크:', {
  //     columns: columns?.length || 0,
  //     data: data?.length || 0,
  //     checkable,
  //     pinnedColumns: pinnedColumns?.length || 0
  //   });
  // }, [columns, data, checkable, pinnedColumns]);
  
  return (
    <TableContainer 
      component={Paper} 
      sx={containerStyle}
    >
      <Table 
        ref={tableRef}
        key={`table-${tableKey}`}
        sx={{ 
          minWidth: calculateTableMinWidth,
          borderCollapse: 'separate',
          borderSpacing: 0,
          tableLayout: 'auto', // 자동 너비 유지
          '& thead': fixedHeader ? {
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backgroundColor: theme.palette.background.paper
          } : {}
        }} 
      >
        <TableHeader 
          columns={columns} 
          hasGroupHeaders={hasGroupHeaders}
          onSort={handleSort}
          sortConfig={localSortConfig}
          checkable={checkable}
          onToggleAll={handleToggleAll}
          allChecked={allChecked}
          draggable={draggableColumns}
          dragHandlers={dragHandlers}
          dragInfo={dragInfo}
          ref={tableHeaderRef}
          pinnedColumns={pinnedColumns}
          tableKey={tableKey}
        />
        <TableBody 
          columns={columns}
          data={data}
          checkable={checkable}
          hierarchical={hierarchical}
          checkedItems={checkedItems}
          expandedRows={expandedRows}
          onCheck={handleCheck}
          onRowClick={onRowClick}
          onToggleExpand={handleToggleExpand}
          sequentialPageNumbers={sequentialPageNumbers}
          page={page}
          rowsPerPage={rowsPerPage}
          indentMode={indentMode}
          pinnedColumns={pinnedColumns}
          tableKey={tableKey}
          draggableRows={draggableRows}
          rowDragHandlers={rowDragHandlers}
        />
      </Table>
    </TableContainer>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  data: PropTypes.arrayOf(PropTypes.object),
  checkable: PropTypes.bool,
  hierarchical: PropTypes.bool,
  onRowClick: PropTypes.func,
  onSort: PropTypes.func,
  onCheck: PropTypes.func,
  onToggleExpand: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  totalCount: PropTypes.number,
  sequentialPageNumbers: PropTypes.bool,
  draggableColumns: PropTypes.bool,
  onColumnOrderChange: PropTypes.func,
  dragHandlers: PropTypes.object,
  dragInfo: PropTypes.object,
  indentMode: PropTypes.bool,
  sx: PropTypes.object,
  tableHeaderRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.any })
  ]),
  headerStyle: PropTypes.object,
  fixedHeader: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pinnedColumns: PropTypes.arrayOf(PropTypes.string),
  checkedItems: PropTypes.object,
  expandedRows: PropTypes.object,
  allChecked: PropTypes.bool,
  onToggleAll: PropTypes.func,
  sortConfig: PropTypes.object,
  draggableRows: PropTypes.bool,
  rowDragHandlers: PropTypes.object
};

export default BaseTable; 
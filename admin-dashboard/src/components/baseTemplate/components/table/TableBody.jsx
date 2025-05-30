import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TableBody as MUITableBody,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CellRenderer from './CellRenderer';
import TypeTree from './TypeTree';

/**
 * 테이블 바디 컴포넌트
 * 다양한 타입의 셀과 계층형 구조를 지원합니다.
 * 
 * @param {Object} props
 * @param {Array} props.columns - 테이블 컬럼 정의
 * @param {Array} props.data - 테이블 데이터
 * @param {boolean} props.checkable - 체크박스 컬럼 사용 여부
 * @param {boolean} props.hierarchical - 계층형 구조 사용 여부
 * @param {Object} props.checkedItems - 체크된 아이템 목록
 * @param {Object} props.expandedRows - 펼쳐진 행 목록
 * @param {Function} props.onCheck - 체크박스 클릭 이벤트 핸들러
 * @param {Function} props.onRowClick - 행 클릭 이벤트 핸들러
 * @param {Function} props.onToggleExpand - 계층 펼치기/접기 이벤트 핸들러
 * @param {boolean} props.sequentialPageNumbers - 연속 페이지 번호 사용 여부
 * @param {number} props.page - 현재 페이지 (0부터 시작)
 * @param {number} props.rowsPerPage - 페이지당 행 수
 * @param {boolean} props.indentMode - 들여쓰기 모드 사용 여부
 * @param {Array} props.pinnedColumns - 고정된 컬럼 ID 배열
 * @param {number} props.tableKey - 테이블 강제 리렌더링 키
 */
const TableBody = ({
  columns,
  data,
  checkable,
  hierarchical,
  checkedItems,
  expandedRows,
  onCheck,
  onRowClick,
  onToggleExpand,
  sequentialPageNumbers = false,
  page = 0,
  rowsPerPage = 10,
  indentMode = true,
  pinnedColumns = [],
  tableKey = 0
}) => {
  const theme = useTheme();
  const [columnWidths, setColumnWidths] = useState({});
  
  // 컬럼 너비 측정 및 업데이트
  const updateColumnWidths = useCallback(() => {
    const newWidths = {};
    const cells = document.querySelectorAll('thead [data-column-id]');
    
    cells.forEach(cell => {
      const columnId = cell.getAttribute('data-column-id');
      if (columnId) {
        newWidths[columnId] = cell.offsetWidth;
      }
    });
    
    setColumnWidths(newWidths);
    // console.log('[TableBody] 컬럼 너비 업데이트:', newWidths);
  }, []);
  
  // 테이블 키 변경 시 컬럼 너비 재측정
  useEffect(() => {
    const timer = setTimeout(() => {
      updateColumnWidths();
    }, 150); // 헤더보다 약간 늦게 측정
    
    return () => clearTimeout(timer);
  }, [tableKey, updateColumnWidths]);
  
  // 고정 컬럼 스타일 계산 - 실제 컬럼 너비 기반
  const getPinnedStyles = (columnId, rowBackgroundColor = theme.palette.background.paper) => {
    if (!pinnedColumns.includes(columnId)) return {};
    
    // 실제 렌더링되는 컬럼 순서를 기준으로 마지막 고정 컬럼 확인
    const flatColumns = getFlatColumns();
    // 체크박스 컬럼 중복 방지: flatColumns에서 체크박스가 아닌 컬럼만 필터링
    const nonCheckboxColumns = flatColumns.filter(col => col.type !== 'checkbox');
    const allRenderColumns = checkable ? ['checkbox', ...nonCheckboxColumns.map(col => col.id)] : nonCheckboxColumns.map(col => col.id);
    const pinnedColumnsInOrder = allRenderColumns.filter(colId => pinnedColumns.includes(colId));
    const isLastPinned = columnId === pinnedColumnsInOrder[pinnedColumnsInOrder.length - 1];
    
    // 현재 컬럼의 left 위치 계산
    let leftPosition = 0;
    const currentColumnIndex = pinnedColumnsInOrder.indexOf(columnId);
    
    // 현재 컬럼보다 앞에 있는 고정 컬럼들의 너비를 합산
    for (let i = 0; i < currentColumnIndex; i++) {
      const prevColumnId = pinnedColumnsInOrder[i];
      
      // 측정된 너비 사용, 없으면 DOM에서 직접 측정
      let width = columnWidths[prevColumnId];
      if (!width) {
        const prevColumnElement = document.querySelector(`thead [data-column-id="${prevColumnId}"]`);
        if (prevColumnElement) {
          width = prevColumnElement.offsetWidth;
        } else {
          // 기본 너비 사용
          width = prevColumnId === 'checkbox' ? 48 : 120;
        }
      }
      
      leftPosition += width;
    }
    
    // console.log(`[TableBody] ${columnId} 고정 스타일 적용 (left: ${leftPosition}px)`);
    
    return {
      position: 'sticky',
      left: `${leftPosition}px`,
      zIndex: 5,
      backgroundColor: rowBackgroundColor,
      boxShadow: isLastPinned ? `2px 0 5px rgba(0, 0, 0, 0.1)` : 'none',
      '&::after': isLastPinned ? {
        content: '""',
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '2px',
        backgroundColor: theme.palette.primary.main,
        opacity: 0.3,
      } : {},
    };
  };
  
  // 체크박스 클릭 핸들러
  const handleCheck = (event, id) => {
    event.stopPropagation();
    if (onCheck) {
      onCheck(id, event.target.checked);
    }
  };
  
  // 행 클릭 핸들러
  const handleRowClick = (event, row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };
  
  // 확장/접기 토글 핸들러
  const handleToggleExpand = (event, id) => {
    event.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand(id);
    }
  };
  
  // 플랫 컬럼 배열 생성 (그룹 컬럼의 자식 컬럼 포함)
  const getFlatColumns = () => {
    const result = [];
    
    columns.forEach(column => {
      if (column.type === 'group' && Array.isArray(column.children)) {
        column.children.forEach(child => {
          result.push(child);
        });
      } else {
        result.push(column);
      }
    });
    
    return result;
  };
  
  // 페이지네이션을 위한 데이터 평면화 및 제한 처리
  const flattenedAndLimitedData = useMemo(() => {
    // 데이터가 없는 경우 빈 배열 반환
    if (!data || data.length === 0) {
      // console.log('[TableBody] 데이터가 없습니다. 빈 배열을 반환합니다.');
      return [];
    }

    // 계층형 데이터의 경우 펼쳐진 상태에 따라 보이는 항목만 포함
    if (hierarchical) {
      // console.log(`[TableBody] 페이지네이션 처리: 페이지=${page}, rowsPerPage=${rowsPerPage}`);
      
      // 1. 먼저 모든 데이터를 평면화
      const allFlattened = [];
      
      // 재귀적으로 데이터를 평면화하는 함수
      const flattenAll = (items, level = 0, isParentVisible = true) => {
        if (!items || !items.length) return;
        
        for (const item of items) {
          // 부모가 보이지 않으면 자식도 보이지 않음
          if (!isParentVisible) continue;
          
          // 현재 항목 추가
          allFlattened.push({
            ...item,
            _displayLevel: level,
            _originalIndex: allFlattened.length // 원래 인덱스 저장
          });
          
          // 확장된 상태이고 자식이 있는 경우 자식도 처리
          const isExpanded = expandedRows[item.id] !== undefined ? expandedRows[item.id] : true;
          if (isExpanded && item.children && item.children.length > 0) {
            flattenAll(item.children, level + 1, true);
          }
        }
      };
      
      // 모든 데이터 평면화
      flattenAll(data);
      
      // 평면화된 데이터가 없는 경우 빈 배열 반환
      if (allFlattened.length === 0) {
        // console.log('[TableBody] 평면화된 데이터가 없습니다. 빈 배열을 반환합니다.');
        return [];
      }
      
      // 2. 페이지네이션 적용 - 현재 페이지에 해당하는 데이터만 추출
      const startIndex = Math.max(0, Math.min(page * rowsPerPage, allFlattened.length));
      const endIndex = Math.min(startIndex + rowsPerPage, allFlattened.length);
      
      // 경계 체크 - 데이터가 있을 때만 경고 출력
      if (allFlattened.length > 0 && startIndex >= allFlattened.length) {
        // console.warn(`[TableBody] 시작 인덱스(${startIndex})가 전체 데이터 수(${allFlattened.length})보다 크거나 같습니다.`);
        return [];
      }
      
      const paginatedData = allFlattened.slice(startIndex, endIndex);
      
      // console.log(`[TableBody] 페이지 ${page + 1}: ${paginatedData.length}개 항목 표시 (총 ${allFlattened.length}개 중) - 인덱스 ${startIndex}~${endIndex - 1}`);
      return paginatedData;
    }
    
    // 일반 데이터의 경우 페이지네이션 적용
    const startIndex = Math.max(0, Math.min(page * rowsPerPage, data.length));
    const endIndex = Math.min(startIndex + rowsPerPage, data.length);
    
    // 경계 체크 - 데이터가 있을 때만 경고 출력
    if (data.length > 0 && startIndex >= data.length) {
      // console.warn(`[TableBody] 일반 데이터 시작 인덱스(${startIndex})가 전체 데이터 수(${data.length})보다 크거나 같습니다.`);
      return [];
    }
    
    // console.log(`[TableBody] 일반 데이터 페이지 ${page + 1}: ${endIndex - startIndex}개 항목 표시 (총 ${data.length}개 중) - 인덱스 ${startIndex}~${endIndex - 1}`);
    return data.slice(startIndex, endIndex);
  }, [data, hierarchical, expandedRows, page, rowsPerPage]);
  
  // 계층형 구조 데이터 렌더링
  const renderHierarchicalData = (items, level = 0, parentVisible = true, rowCountRef = { count: 0 }) => {
    if (!items || !items.length) return null;
    
    return items.map((item, index) => {
      // 이미 평면화된 데이터에서 레벨 정보 가져오기
      const displayLevel = item._displayLevel !== undefined ? item._displayLevel : level;
      const isVisible = parentVisible && (!item.parentId || expandedRows[item.parentId]);
      const hasChildren = item.children && item.children.length > 0;
      // expandedRows에 항목이 없으면 기본적으로 펼쳐진 상태로 간주
      const isExpanded = expandedRows[item.id] !== undefined ? expandedRows[item.id] : true;
      
      // 보이지 않는 행은 건너뜀
      if (!isVisible) return null;
      
      // 행 번호 계산 (순차적으로 증가)
      const currentRowIndex = rowCountRef.count++;
      
      // 홀짝 행 배경색 계산
      const rowBackgroundColor = checkedItems[item.id] 
        ? theme.palette.action.selected 
        : currentRowIndex % 2 === 0 
          ? theme.palette.background.paper 
          : theme.palette.grey[100];
      
      // 고유한 키 생성 (ID + 레벨 + 인덱스)
      const uniqueKey = `row-${item.id}-level-${displayLevel}-idx-${index}`;
      
      return (
        <React.Fragment key={uniqueKey}>
          <TableRow
            hover
            onClick={(e) => handleRowClick(e, item)}
            sx={{
              cursor: onRowClick ? 'pointer' : 'default',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              },
              backgroundColor: rowBackgroundColor
            }}
          >
            {/* 체크박스 열 */}
            {checkable && (
              <TableCell 
                padding="checkbox"
                align="center"
                sx={{
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  ...getPinnedStyles('checkbox', rowBackgroundColor),
                  'tr:hover &': {
                    backgroundColor: theme.palette.grey[100],
                    zIndex: 6,
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Checkbox
                    checked={!!checkedItems[item.id]}
                    onChange={(e) => handleCheck(e, item.id)}
                    onClick={(e) => e.stopPropagation()}
                    color="primary"
                  />
                </Box>
              </TableCell>
            )}
            
            {/* 데이터 셀 */}
            {getFlatColumns().map((column, colIndex) => {
              if (column.type === 'checkbox') return null; // 체크박스 컬럼은 이미 처리됨
              
              return (
                <TableCell 
                  key={`${item.id}-${column.id}`}
                  data-column-id={column.id}
                  align={column.type === 'horizontal' ? 'left' : (column.align || 'center')}
                  onClick={column.clickable && column.onClick ? (e) => {
                    e.stopPropagation(); // 행 클릭 이벤트 차단
                    // console.log('🔥 TableCell 클릭 이벤트 발생!', column.id);
                    column.onClick(item);
                  } : undefined}
                  sx={{
                    borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    whiteSpace: column.type === 'horizontal' ? 'nowrap' : 'nowrap', // 유형2는 확실히 줄바꿈 방지
                    overflow: 'visible', // 클릭 이벤트를 위해 visible로 변경
                    textOverflow: 'ellipsis',
                    cursor: column.clickable ? 'pointer' : 'default',
                    '&:hover': column.clickable ? {
                      backgroundColor: 'action.hover'
                    } : {},
                    ...getPinnedStyles(column.id, rowBackgroundColor),
                    'tr:hover &': {
                      backgroundColor: theme.palette.grey[100],
                      zIndex: 6,
                    }
                  }}
                >
                  {/* 계층형 컬럼의 경우 TypeTree 컴포넌트 사용 */}
                  {column.type === 'hierarchical' ? (
                    <TypeTree
                      item={item}
                      level={displayLevel}
                      expanded={isExpanded}
                      onToggle={onToggleExpand}
                      hasChildren={hasChildren}
                      typeInfo={item[column.id] || {}}
                      indentMode={indentMode}
                      showToggleIcon={hierarchical}
                      />
                  ) : (
                    /* 일반 컬럼은 셀 렌더러 사용 */
                    <CellRenderer
                      column={column}
                      row={item}
                      value={item[column.id]}
                      sequentialPageNumbers={sequentialPageNumbers}
                      page={page}
                      rowsPerPage={rowsPerPage}
                      rowIndex={currentRowIndex}
                    />
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </React.Fragment>
      );
    });
  };
  
  // 일반 데이터 렌더링
  const renderNormalData = () => {
    return flattenedAndLimitedData.map((row, index) => {
      // 홀짝 행 배경색 계산
      const rowBackgroundColor = checkedItems[row.id] 
        ? theme.palette.action.selected 
        : index % 2 === 0 
          ? theme.palette.background.paper 
          : theme.palette.grey[50];
      
      return (
        <TableRow
          key={row.id}
          hover
          onClick={(e) => handleRowClick(e, row)}
          sx={{
            cursor: onRowClick ? 'pointer' : 'default',
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            },
            backgroundColor: rowBackgroundColor
          }}
        >
          {/* 체크박스 열 */}
          {checkable && (
            <TableCell 
              padding="checkbox"
              align="center"
              sx={{
                borderBottom: `1px solid ${theme.palette.grey[200]}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                ...getPinnedStyles('checkbox', rowBackgroundColor),
                'tr:hover &': {
                  backgroundColor: theme.palette.grey[100],
                  zIndex: 6,
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Checkbox
                  checked={!!checkedItems[row.id]}
                  onChange={(e) => handleCheck(e, row.id)}
                  onClick={(e) => e.stopPropagation()}
                  color="primary"
                />
              </Box>
            </TableCell>
          )}
          
          {/* 데이터 셀 */}
          {getFlatColumns().map(column => {
            if (column.type === 'checkbox') return null; // 체크박스 컬럼은 이미 처리됨
            
            return (
              <TableCell 
                key={`${row.id}-${column.id}`}
                data-column-id={column.id}
                align={column.type === 'horizontal' ? 'left' : (column.align || 'center')}
                onClick={column.clickable && column.onClick ? (e) => {
                  e.stopPropagation(); // 행 클릭 이벤트 차단
                  // console.log('🔥 TableCell 클릭 이벤트 발생!', column.id);
                  column.onClick(row);
                } : undefined}
                sx={{
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                  whiteSpace: column.type === 'horizontal' ? 'nowrap' : 'nowrap', // 유형2는 확실히 줄바꿈 방지
                  overflow: 'visible', // 클릭 이벤트를 위해 visible로 변경
                  textOverflow: 'ellipsis',
                  cursor: column.clickable ? 'pointer' : 'default',
                  '&:hover': column.clickable ? {
                    backgroundColor: 'action.hover'
                  } : {},
                  ...getPinnedStyles(column.id, rowBackgroundColor),
                  'tr:hover &': {
                    backgroundColor: theme.palette.grey[100],
                    zIndex: 6,
                  }
                }}
              >
                <CellRenderer
                  column={column}
                  row={row}
                  value={row[column.id]}
                  sequentialPageNumbers={sequentialPageNumbers}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowIndex={index}
                />
              </TableCell>
            );
          })}
        </TableRow>
      );
    });
  };
  
  return (
    <MUITableBody>
      {hierarchical 
        ? renderHierarchicalData(flattenedAndLimitedData)
        : renderNormalData()
      }
    </MUITableBody>
  );
};

TableBody.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  checkable: PropTypes.bool,
  hierarchical: PropTypes.bool,
  checkedItems: PropTypes.object,
  expandedRows: PropTypes.object,
  onCheck: PropTypes.func,
  onRowClick: PropTypes.func,
  onToggleExpand: PropTypes.func,
  sequentialPageNumbers: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  indentMode: PropTypes.bool,
  pinnedColumns: PropTypes.array,
  tableKey: PropTypes.number
};

export default TableBody; 
import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import useTableFilter from './useTableFilter';
import useTablePagination from './useTablePagination';

/**
 * 테이블 필터와 페이지네이션을 통합 관리하는 커스텀 훅
 * useTableFilter와 useTablePagination을 결합하여 필터링과 페이지네이션을 함께 처리합니다.
 * 
 * @param {Object} options - 훅 옵션
 * @param {Object} options.filterOptions - useTableFilter 훅에 전달할 옵션
 * @param {Object} options.paginationOptions - useTablePagination 훅에 전달할 옵션
 * @param {Function} options.onStateChange - 필터 또는 페이지네이션 상태 변경 시 호출될 콜백 함수
 * @param {boolean} options.enableSafeFilters - 안전한 필터 처리 활성화 옵션
 * @returns {Object} 필터와 페이지네이션 관련 상태와 핸들러 함수들
 */
const useTableFilterAndPagination = (options = {}) => {
  const {
    columns = [],
    data = [],
    defaultRowsPerPage = 25,
    hierarchical = false,
    filterOptions = {},
    paginationOptions = {},
    onStateChange,
    enableSafeFilters = true // 안전한 필터 처리 활성화 옵션
  } = options;

  // 각각의 훅의 원래 콜백을 보존
  const originalFilterChange = filterOptions.onFilterChange;
  const originalPageChange = paginationOptions.onPageChange;
  const originalRowsPerPageChange = paginationOptions.onRowsPerPageChange;
  const originalExcelDownload = paginationOptions.onExcelDownload;
  const originalPrint = paginationOptions.onPrint;

  // 초기값 설정
  const initialFilters = filterOptions.initialFilters || {};
  const initialPage = paginationOptions.initialPage || 0;
  
  // 로컬 상태
  const [localPage, setLocalPage] = useState(initialPage);
  const [localFilters, setLocalFilters] = useState(initialFilters);
  
  // 참조값으로 최신 상태 유지
  const localPageRef = useRef(localPage);
  const localFiltersRef = useRef(localFilters);
  const paginationStateRef = useRef(null);
  
  // 상태 업데이트 시 참조값도 함께 업데이트
  useEffect(() => {
    localPageRef.current = localPage;
  }, [localPage]);
  
  useEffect(() => {
    localFiltersRef.current = localFilters;
  }, [localFilters]);
  
  // 통합 상태 변경 핸들러
  const handleStateChange = useCallback((filters, pagination) => {
    if (onStateChange && paginationStateRef.current) {
      onStateChange({
        filters,
        pagination: {
          page: pagination.page,
          rowsPerPage: pagination.rowsPerPage || paginationStateRef.current.rowsPerPage,
          totalCount: paginationStateRef.current.totalCount
        }
      });
    }
  }, [onStateChange]);
  
  // 필터 변경 핸들러
  const handleFilterChange = useCallback((filters) => {
    setLocalFilters(filters);
    
    // 외부에서 제공된 필터 변경 콜백이 있으면 호출
    if (originalFilterChange) {
      originalFilterChange(filters);
    }
    
    // 필터 변경 시 첫 페이지로 이동
    setLocalPage(0);
    
    // 통합 상태 변경 콜백 호출
    handleStateChange(filters, { page: 0 });
  }, [originalFilterChange, handleStateChange]);
  
  // 페이지 변경 핸들러
  const handlePageChange = useCallback((newPage) => {
    // 매개변수 정규화
    let pageIndex = newPage;
    
    // event 객체가 전달된 경우
    if (typeof newPage === 'object' && newPage !== null) {
      console.log('이벤트 객체를 통한 페이지 변경:', newPage);
      pageIndex = 0; // 기본값
    }
    
    console.log(`useTableFilterAndPagination - 페이지 변경: ${localPage} -> ${pageIndex}`);
    
    // 유효한 페이지 번호 확인
    if (pageIndex !== undefined && typeof pageIndex === 'number') {
      setLocalPage(pageIndex);
    
    // 외부에서 제공된 페이지 변경 콜백이 있으면 호출
    if (originalPageChange) {
        originalPageChange(pageIndex);
    }
    
    // 통합 상태 변경 콜백 호출
      handleStateChange(localFiltersRef.current, { page: pageIndex });
    } else {
      console.warn('useTableFilterAndPagination - 잘못된 페이지 번호:', pageIndex);
    }
  }, [localPage, originalPageChange, handleStateChange, localFiltersRef]);
  
  // 행 수 변경 핸들러
  const handleRowsPerPageChange = useCallback((event) => {
    // 직접 숫자 값이 전달된 경우
    if (typeof event === 'number') {
      const newRowsPerPage = event;
      setLocalPage(0);
      
      // 외부에서 제공된 페이지당 행 수 변경 콜백이 있으면 호출
      if (originalRowsPerPageChange) {
        originalRowsPerPageChange(newRowsPerPage);
      }
      
      // 통합 상태 변경 콜백 호출
      handleStateChange(localFiltersRef.current, { page: 0, rowsPerPage: newRowsPerPage });
      return;
    }
    
    // 이벤트 객체에서 추출
    let newRowsPerPage;
    
    if (event && event.target && event.target.value) {
      newRowsPerPage = parseInt(event.target.value, 10);
    } else if (event && typeof event.value === 'number') {
      newRowsPerPage = event.value;
    } else {
      console.warn('useTableFilterAndPagination - 잘못된 행 수 변경 이벤트:', event);
      return;
    }
    
    console.log(`useTableFilterAndPagination - 페이지당 행 수 변경: ${paginationStateRef.current?.rowsPerPage} -> ${newRowsPerPage}`);
    
    setLocalPage(0);
    
    // 외부에서 제공된 페이지당 행 수 변경 콜백이 있으면 호출
    if (originalRowsPerPageChange) {
      originalRowsPerPageChange(newRowsPerPage);
    }
    
    // 통합 상태 변경 콜백 호출
    handleStateChange(localFiltersRef.current, { page: 0, rowsPerPage: newRowsPerPage });
  }, [localFiltersRef, originalRowsPerPageChange, handleStateChange, paginationStateRef]);
  
  // 필터 훅 사용
  const filterState = useTableFilter({
    ...filterOptions,
    initialFilters: localFilters,
    onFilterChange: handleFilterChange
  });
  
  // 페이지네이션 훅 사용
  const paginationState = useTablePagination({
    ...paginationOptions,
    initialPage: localPage,
    initialRowsPerPage: paginationOptions.initialRowsPerPage || defaultRowsPerPage,
    onPageChange: handlePageChange,
    onRowsPerPageChange: handleRowsPerPageChange,
    onExcelDownload: originalExcelDownload,
    onPrint: originalPrint
  });
  
  // 페이지네이션 상태 참조값 업데이트
  useEffect(() => {
    paginationStateRef.current = paginationState;
    
    // 컴포넌트 마운트 시 초기 상태 알림
    if (onStateChange) {
      onStateChange({
        filters: localFilters,
        pagination: {
          page: localPage,
          rowsPerPage: paginationState.rowsPerPage,
          totalCount: paginationState.totalCount
        }
      });
    }
  }, [paginationState, onStateChange, localFilters, localPage]);
  
  // 필터와 페이지네이션 모두 초기화
  const resetAllFiltersAndPagination = useCallback(() => {
    filterState.resetAllFilters();
    paginationState.setPage(0);
    setLocalPage(0);
    setLocalFilters({});
    
    // 초기화 후 상태 변경 알림
    if (onStateChange) {
      onStateChange({
        filters: {},
        pagination: {
          page: 0,
          rowsPerPage: paginationState.rowsPerPage,
          totalCount: paginationState.totalCount
        }
      });
    }
  }, [filterState, paginationState, onStateChange]);

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState(filterOptions.initialFilters || {});
  const [filterValues, setFilterValues] = useState({});
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [isDateFilterActive, setIsDateFilterActive] = useState(false);
  
  // 안전한 필터 값 처리 ('all' 값을 빈 문자열로 변환)
  const safeActiveFilters = useMemo(() => {
    if (!enableSafeFilters) return activeFilters;
    
    const result = { ...activeFilters };
    
    Object.keys(result).forEach(key => {
      if (result[key] === 'all') {
        result[key] = '';
      }
    });
    
    return result;
  }, [activeFilters, enableSafeFilters]);

  return {
    // 필터 관련
    ...filterState,
    activeFilters,
    safeActiveFilters, // 안전한 필터 값 (all -> 빈 문자열 변환)
    filterValues,
    dateRange,
    isDateFilterActive,
    setActiveFilters,
    setFilterValues,
    setDateRange,
    setIsDateFilterActive,
    
    // 페이지네이션 관련
    ...paginationState,
    
    // 데이터
    filteredData: filterState.filteredData,
    displayData: filterState.filteredData,
    
    // 추가 함수
    resetAllFiltersAndPagination
  };
};

export default useTableFilterAndPagination; 
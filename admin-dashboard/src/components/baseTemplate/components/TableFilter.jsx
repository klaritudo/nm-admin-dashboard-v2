import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ClearIcon from '@mui/icons-material/Clear';

/**
 * 테이블 필터 컴포넌트
 * 테이블 데이터를 필터링하기 위한 다양한 옵션을 제공하는 컴포넌트입니다.
 * 
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.activeFilters - 현재 활성화된 필터 값들
 * @param {Function} props.handleFilterChange - 필터 변경 처리 함수
 * @param {boolean} props.isDateFilterActive - 날짜 필터 활성화 여부
 * @param {Function} props.handleOpenDateFilter - 날짜 필터 열기 핸들러
 * @param {Function} props.resetDateFilter - 날짜 필터 초기화 핸들러
 * @param {Array} props.filterOptions - 필터 옵션 배열
 * @param {boolean} props.showDateFilter - 날짜 필터 표시 여부 (기본값: true)
 * @param {string} props.dateFilterLabel - 날짜 필터 라벨 (기본값: '날짜 필터')
 * @param {Object} props.sx - 추가 스타일 (Material-UI sx prop)
 * @returns {JSX.Element}
 */
const TableFilter = ({
  activeFilters = {},
  handleFilterChange,
  isDateFilterActive = false,
  handleOpenDateFilter,
  resetDateFilter,
  filterOptions = [],
  showDateFilter = true,
  dateFilterLabel = '날짜 필터',
  sx = {}
}) => {
  // 기본 스타일
  const baseFilterStyle = {
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  };

  // 텍스트필드 스타일
  const textFieldStyle = {
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiInputBase-root': { height: '32px' },
    '& .MuiSelect-select': {
      minWidth: 'auto',
      paddingLeft: '4px',
      paddingRight: '24px' // 드롭다운 아이콘 공간
    }
  };

  return (
    <Stack 
      direction="row" 
      spacing={1} 
      className="table-filter-container"
      flexWrap="wrap"
      alignItems="center"
      sx={{
        mb: 0,
        mr: 2,
        gap: '8px',
        ...sx
      }}
    >
      {/* 동적으로 생성된 필터 옵션들 */}
      {filterOptions && filterOptions.length > 0 && filterOptions.map((option) => {
        // option.items가 없는 경우 건너뛰기
        if (!option.items || !Array.isArray(option.items)) {
          console.warn(`TableFilter: option.items가 없거나 배열이 아닙니다:`, option);
          return null;
        }
        
        return (
        <Box 
          key={option.id}
          sx={baseFilterStyle}
        >
          <TextField
            select
            size="small"
            value={activeFilters[option.id] || ''}
            onChange={(e) => handleFilterChange(option.id, e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ fontSize: '0.75rem', color: '#757575' }}>
                  {option.label}
                </InputAdornment>
              ),
              sx: { fontSize: '0.75rem' }
            }}
            sx={textFieldStyle}
          >
            {option.items.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        );
      })}

      {/* 날짜 필터 버튼 */}
      {showDateFilter && handleOpenDateFilter && resetDateFilter && (
        <Box sx={{
          backgroundColor: isDateFilterActive ? '#e3f2fd' : '#fff',
          borderRadius: '4px',
          border: `1px solid ${isDateFilterActive ? '#90caf9' : '#e0e0e0'}`
        }}>
          <Button
            startIcon={<CalendarTodayIcon fontSize="small" />}
            onClick={handleOpenDateFilter}
            size="small"
            sx={{
              height: '32px',
              fontSize: '0.75rem',
              color: isDateFilterActive ? '#1976d2' : '#757575',
              '& .MuiButton-startIcon': { marginRight: '4px' }
            }}
          >
            {dateFilterLabel}
            {isDateFilterActive && (
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  resetDateFilter();
                }}
                sx={{ 
                  ml: 0.5, 
                  p: 0.2, 
                  color: '#1976d2',
                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

TableFilter.propTypes = {
  activeFilters: PropTypes.object,
  handleFilterChange: PropTypes.func.isRequired,
  isDateFilterActive: PropTypes.bool,
  handleOpenDateFilter: PropTypes.func,
  resetDateFilter: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ),
  showDateFilter: PropTypes.bool,
  dateFilterLabel: PropTypes.string,
  sx: PropTypes.object
};

export default TableFilter; 
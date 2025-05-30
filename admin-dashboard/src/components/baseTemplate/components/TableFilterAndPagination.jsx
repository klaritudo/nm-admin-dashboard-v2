import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Divider } from '@mui/material';
import TableFilter from './TableFilter';
import TablePagination from './TablePagination';

/**
 * 테이블 필터와 페이지네이션을 결합한 컴포넌트
 * 테이블의 상단 또는 하단에 위치하여 필터링과 페이지 이동 기능을 제공합니다.
 * 
 * @param {Object} props
 * @param {Object} props.filterProps - TableFilter 컴포넌트에 전달할 props
 * @param {Object} props.paginationProps - TablePagination 컴포넌트에 전달할 props
 * @param {Object} props.sx - 추가 스타일 (Material-UI sx prop)
 * @param {boolean} props.showDivider - 하단 구분선 표시 여부
 * @returns {JSX.Element}
 */
const TableFilterAndPagination = ({
  filterProps = {},
  paginationProps = {},
  showDivider = true,
  sx = {}
}) => {
  return (
    <>
      <Paper 
        elevation={1} 
        sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          mb: 2,
          ...sx 
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 2, md: 0 }
          }}
        >
          {/* 필터 부분 */}
          <TableFilter {...filterProps} />
          
          {/* 페이지네이션 부분 */}
          <TablePagination {...paginationProps} />
        </Box>
      </Paper>
      
      {/* 구분선 */}
      {showDivider && (
        <Divider sx={{ mb: 2 }} />
      )}
    </>
  );
};

TableFilterAndPagination.propTypes = {
  filterProps: PropTypes.object,
  paginationProps: PropTypes.object,
  showDivider: PropTypes.bool,
  sx: PropTypes.object
};

export default TableFilterAndPagination; 
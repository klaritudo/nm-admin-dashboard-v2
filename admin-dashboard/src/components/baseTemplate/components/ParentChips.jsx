import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

/**
 * 부모 계층을 칩 스타일로 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.parentTypes - 부모 유형 배열 [{ label, color }, ...]
 * @param {string} props.direction - 배치 방향 ('row' | 'column')
 * @param {number} props.maxChips - 최대 표시할 칩 개수 (사용하지 않음)
 * @param {Object} props.sx - 추가 스타일
 * @returns {JSX.Element}
 */
const ParentChips = ({ 
  parentTypes = [], 
  direction = 'row',
  maxChips = 10, // 사용하지 않지만 호환성을 위해 유지
  sx = {} 
}) => {
  // 부모 유형이 없으면 빈 상태 표시
  if (!parentTypes || parentTypes.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start', // 왼쪽 정렬로 변경
        alignItems: 'center',
        minHeight: '32px',
        color: 'text.secondary',
        fontSize: '0.875rem',
        ...sx 
      }}>
        -
      </Box>
    );
  }

  // 색상 매핑 함수
  const getChipColor = (colorName) => {
    const colorMap = {
      'error': 'error',
      'primary': 'primary', 
      'secondary': 'secondary',
      'info': 'info',
      'warning': 'warning',
      'success': 'success',
      'default': 'default'
    };
    return colorMap[colorName] || 'default';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        flexWrap: 'nowrap', // 줄바꿈 방지
        gap: 0.5,
        alignItems: 'center',
        justifyContent: 'flex-start', // 왼쪽 정렬
        minHeight: '32px',
        width: '100%',
        overflow: 'hidden', // 넘치는 부분 숨김
        position: 'relative',
        ...sx
      }}
    >
      {parentTypes.map((parentType, index) => (
        <React.Fragment key={`${parentType.label}-${index}`}>
          {/* ">" 구분자 추가 (첫 번째 항목 제외) */}
          {index > 0 && (
            <Typography 
              variant="body2" 
              sx={{ 
                mx: 0.5, 
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                flexShrink: 0, // 구분자 크기 고정
                whiteSpace: 'nowrap' // 줄바꿈 방지
              }}
            >
              &gt;
            </Typography>
          )}
          
          <Chip
            label={typeof parentType.label === 'object' ? 
              (parentType.label.name || parentType.label.label || '유형') : 
              (parentType.label || '유형')}
            color={getChipColor(parentType.color)}
            variant="outlined" // 모든 칩을 outlined로 통일
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: '24px',
              flexShrink: 0, // 칩 크기 고정 (줄어들지 않음)
              minWidth: 'auto', // 최소 너비 자동
              maxWidth: '120px', // 최대 너비 제한
              backgroundColor: parentType.backgroundColor || undefined,
              borderColor: parentType.borderColor || undefined,
              color: parentType.borderColor || undefined,
              border: parentType.borderColor ? `1px solid ${parentType.borderColor}` : undefined,
              '& .MuiChip-label': {
                px: 1,
                py: 0.25,
                fontWeight: 500,
                whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
                overflow: 'hidden', // 넘치는 텍스트 숨김
                textOverflow: 'ellipsis', // ... 표시
                color: parentType.borderColor || undefined
              },
            }}
          />
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ParentChips; 
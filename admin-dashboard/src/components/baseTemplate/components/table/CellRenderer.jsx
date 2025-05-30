import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Switch,
  Select,
  MenuItem,
  FormControl,
  useTheme
} from '@mui/material';
import ParentChips from '../ParentChips';
import TypeTree from './TypeTree';

/**
 * 셀 렌더러 컴포넌트
 * 다양한 타입의 셀을 렌더링합니다.
 * 
 * @param {Object} props
 * @param {Object} props.column - 컬럼 정의
 * @param {Object} props.row - 행 데이터
 * @param {any} props.value - 셀 값
 * @param {boolean} props.sequentialPageNumbers - 연속 페이지 번호 사용 여부
 * @param {number} props.page - 현재 페이지 (0부터 시작)
 * @param {number} props.rowsPerPage - 페이지당 행 수
 * @param {number} props.rowIndex - 현재 페이지 내에서의 행 인덱스
 */
const CellRenderer = ({ 
  column, 
  row, 
  value,
  sequentialPageNumbers = false,
  page = 0,
  rowsPerPage = 10,
  rowIndex = 0
}) => {
  const theme = useTheme();
  
  // 클릭 핸들러
  const handleCellClick = (event) => {
    console.log('🔥 CellRenderer 클릭 이벤트 발생!');
    console.log('컬럼 ID:', column.id);
    console.log('클릭 가능:', column.clickable);
    console.log('onClick 핸들러 존재:', !!column.onClick);
    console.log('행 데이터:', row);
    
    if (column.clickable && column.onClick) {
      event.stopPropagation();
      console.log('✅ onClick 핸들러 실행!');
      column.onClick(row);
    } else {
      console.log('❌ 클릭 핸들러가 없거나 클릭 불가능');
    }
  };
  
  // 컬럼 타입에 따라 다른 렌더링 처리
  switch (column.type) {
    // 번호 컬럼 (No.)
    case 'number':
      // 번호 계산 로직 
      let displayNumber;
      
      if (sequentialPageNumbers) {
        // 연속 번호 모드: 페이지에 상관없이 연속된 번호 표시
        // row.index 값은 무시하고 항상 계산된 값 사용
        displayNumber = page * rowsPerPage + rowIndex + 1;
      } else {
        // 페이지별 번호 모드: 각 페이지마다 1부터 시작
        displayNumber = rowIndex + 1;
      }
      
      return (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {displayNumber || '-'}
        </Typography>
      );
    
    // Boolean 컬럼 (활성/비활성 등)
    case 'boolean':
      const booleanLabel = value ? '활성' : '비활성';
      const booleanColor = value ? 'success' : 'default';
      
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Chip
            label={booleanLabel}
            size="small"
            color={booleanColor}
            variant="filled"
            sx={{ maxWidth: '100%' }}
          />
        </Box>
      );
    
    // 토글 스위치 컬럼 (활성/비활성 등)
    case 'toggle':
      // 숫자(0, 1)를 boolean으로 명확하게 변환
      const isChecked = value === 1 || value === true || value === 'true';
      
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Switch
            checked={isChecked}
            size="small"
            color="primary"
            onChange={(event) => {
              // 토글 변경 이벤트 처리
              console.log('토글 변경:', row.id, event.target.checked);
              // 여기서 상위 컴포넌트로 변경 이벤트를 전달할 수 있습니다
              if (column.onToggle) {
                column.onToggle(row, event.target.checked);
              }
            }}
          />
        </Box>
      );
    
    // 멀티라인 텍스트 컬럼 (줄바꿈 지원)
    case 'multiline':
      // 값이 객체인 경우 (userId 컬럼의 특별한 처리)
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (column.id === 'userId' || column.id === 'memberInfo') {
          if (value.id && value.nickname) {
            // 회원관리와 동일한 방식으로 표시
            return (
              <Box 
                onClick={column.clickable ? handleCellClick : undefined}
                sx={{
                  cursor: column.clickable ? 'pointer' : 'default',
                  '&:hover': column.clickable ? {
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  } : {},
                  width: '100%',
                  padding: '4px'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: 1.2
                  }}
                >
                  {value.id}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    color: '#9e9e9e',
                    fontWeight: 'normal',
                    lineHeight: 1.2
                  }}
                >
                  ({value.nickname})
                </Typography>
              </Box>
            );
          } else {
            // 기타 객체인 경우 JSON.stringify 사용
            const displayValue = JSON.stringify(value);
            return (
              <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
                {displayValue}
              </Typography>
            );
          }
        } else {
          // 다른 컬럼의 객체인 경우 안전하게 문자열로 변환
          try {
            const displayValue = value.toString && typeof value.toString === 'function' && value.toString() !== '[object Object]' 
              ? value.toString() 
              : JSON.stringify(value);
            return (
              <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
                {displayValue}
              </Typography>
            );
          } catch (error) {
            console.warn('객체를 문자열로 변환하는 중 오류 발생:', error, value);
            return (
              <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
                [객체]
              </Typography>
            );
          }
        }
      }
      
      // 값이 배열인 경우
      if (Array.isArray(value)) {
        // userId 컬럼의 배열 처리
        if (column.id === 'userId' || column.id === 'memberInfo') {
          if (value.length > 1) {
            // 회원관리와 동일한 방식으로 표시
            return (
              <Box 
                onClick={column.clickable ? handleCellClick : undefined}
                sx={{
                  cursor: column.clickable ? 'pointer' : 'default',
                  '&:hover': column.clickable ? {
                    backgroundColor: 'action.hover',
                    borderRadius: 1
                  } : {},
                  width: '100%',
                  padding: '4px'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: 1.2
                  }}
                >
                  {value[0]}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    color: '#9e9e9e',
                    fontWeight: 'normal',
                    lineHeight: 1.2
                  }}
                >
                  ({value[1]})
                </Typography>
              </Box>
            );
          } else {
            return (
              <Typography variant="body2" sx={{ textAlign: 'center', width: '100%', fontWeight: 'bold', fontSize: '14px' }}>
                {value[0] || ''}
              </Typography>
            );
          }
        }
        
        // 일반 배열 처리
        return (
          <Stack spacing={0.5} alignItems="center">
            {value.map((item, index) => (
              <Typography key={index} variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
                {item}
              </Typography>
            ))}
          </Stack>
        );
      }
      
      // 값이 문자열인 경우 줄바꿈 문자로 분리
      if (typeof value === 'string' && value.includes('\n')) {
        const lines = value.split('\n');
        
        // memberInfo 컬럼인 경우 회원관리와 동일한 방식으로 표시
        if (column.id === 'memberInfo') {
          return (
            <Box 
              onClick={column.clickable ? handleCellClick : undefined}
              sx={{
                cursor: column.clickable ? 'pointer' : 'default',
                '&:hover': column.clickable ? {
                  backgroundColor: 'action.hover',
                  borderRadius: 1
                } : {},
                width: '100%',
                padding: '4px'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: '14px',
                  lineHeight: 1.2
                }}
              >
                {lines[0]}
              </Typography>
              {lines[1] && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: '12px', 
                    color: '#9e9e9e',
                    fontWeight: 'normal',
                    lineHeight: 1.2
                  }}
                >
                  {lines[1]}
                </Typography>
              )}
            </Box>
          );
        }
        
        // 다른 컬럼의 경우 기존 방식
        return (
          <Stack spacing={0.5} alignItems="center">
            {lines.map((line, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                sx={{ 
                  textAlign: 'center !important', 
                  width: '100%',
                  fontWeight: index === 0 ? 'bold' : 'normal', // 첫 번째 줄은 굵게 (아이디)
                  fontSize: index === 0 ? '16px' : '14px', // 첫 번째 줄은 좀 더 크게
                  color: index === 0 ? 'inherit' : '#9e9e9e' // 두 번째 줄은 회색 (닉네임)
                }}
              >
                {line}
              </Typography>
            ))}
          </Stack>
        );
      }
      
      // 기본 렌더링
      const multilineCellContent = (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {value || '-'}
        </Typography>
      );
      
      // 클릭 가능한 경우 클릭 핸들러 추가
      if (column.clickable) {
        return (
          <Box
            onClick={handleCellClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1
              },
              width: '100%',
              padding: '4px'
            }}
          >
            {multilineCellContent}
          </Box>
        );
      }
      
      return multilineCellContent;
    
    // 통화(금액) 컬럼
    case 'currency':
      if (value === undefined || value === null) return '-';
      
      // 숫자가 아닌 경우 그대로 표시
      if (typeof value !== 'number') {
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center !important', 
              width: '100%',
              fontWeight: 500
            }}
          >
            {value}
          </Typography>
        );
      }
      
      // 숫자를 통화 형식으로 포맷
      const formattedValue = value.toLocaleString('ko-KR');
      
      return (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center !important', 
            width: '100%',
            fontWeight: 500,
            color: value < 0 ? 'error.main' : 'inherit'
          }}
        >
          {formattedValue}
        </Typography>
      );
    
    // 칩 스타일 컬럼
    case 'chip':
      if (!value) return '-';
      
      // 접속상태 컬럼인 경우
      if (column.id === 'connectionStatus') {
        let chipColor = 'default';
        let chipVariant = 'outlined';
        
        switch (value) {
          case '온라인':
            chipColor = 'success';
            break;
          case '오프라인':
            chipColor = 'default';
            break;
          case '정지':
            chipColor = 'error';
            break;
          default:
            chipColor = 'default';
        }
        
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Chip
              label={value}
              size="small"
              color={chipColor}
              variant={chipVariant}
              sx={{ 
                maxWidth: '100%',
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }}
            />
          </Box>
        );
      }
      
      // 값이 배열인 경우 여러 칩 렌더링
      if (Array.isArray(value)) {
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center">
            {value.map((item, index) => (
              <Chip
                key={index}
                label={item.label || item}
                size="small"
                color={item.color || 'primary'}
                variant={item.variant || 'filled'}
                sx={{ 
                  margin: '2px', 
                  maxWidth: '100%',
                  backgroundColor: item.backgroundColor || undefined,
                  borderColor: item.borderColor || undefined,
                  color: item.borderColor || undefined,
                  border: item.borderColor ? `1px solid ${item.borderColor}` : undefined,
                  '& .MuiChip-label': {
                    color: item.borderColor || undefined
                  }
                }}
              />
            ))}
          </Stack>
        );
      }
      
      // 단일 칩 렌더링
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Chip
            label={value.label || value}
            size="small"
            color={value.color || 'primary'}
            variant={value.variant || 'filled'}
            sx={{ 
              maxWidth: '100%',
              backgroundColor: value.backgroundColor || undefined,
              borderColor: value.borderColor || undefined,
              color: value.borderColor || undefined,
              border: value.borderColor ? `1px solid ${value.borderColor}` : undefined,
              '& .MuiChip-label': {
                color: value.borderColor || undefined
              }
            }}
          />
        </Box>
      );
    
    // 버튼 컬럼
    case 'button':
      // 단일 버튼인 경우 (buttonText와 onClick이 있는 경우)
      if (!column.buttons && (column.buttonText || column.onClick)) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('CellRenderer 단일 버튼 클릭:', column.buttonText, 'onClick 존재:', !!column.onClick, 'row:', row);
                if (column.onClick) {
                  column.onClick(row);
                } else {
                  console.warn('버튼에 onClick 핸들러가 없습니다:', column.buttonText);
                }
              }}
            >
              {column.buttonText || '버튼'}
            </Button>
          </Box>
        );
      }
      
      // 다중 버튼인 경우
      if (!column.buttons || !column.buttons.length) {
        return null;
      }
      
      return (
        <Stack direction={column.buttonDirection || 'row'} spacing={1} justifyContent="center">
          {column.buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'outlined'}
              color={button.color || 'primary'}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                console.log('CellRenderer 버튼 클릭:', button.label, 'onClick 존재:', !!button.onClick, 'row:', row);
                if (button.onClick) {
                  button.onClick(row);
                } else {
                  console.warn('버튼에 onClick 핸들러가 없습니다:', button.label);
                }
              }}
            >
              {button.label}
            </Button>
          ))}
        </Stack>
      );
    
    // 드롭다운 컬럼
    case 'dropdown':
      // 계층단계 드롭다운인 경우
      if (column.dropdownType === 'hierarchy') {
        // 현재 데이터의 총 개수를 기반으로 옵션 생성
        const totalCount = column.totalCount || 5; // 기본값 5개
        const options = Array.from({ length: totalCount }, (_, i) => i + 1);
        
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={value || 1}
                onChange={(e) => {
                  e.stopPropagation();
                  const newOrder = parseInt(e.target.value, 10);
                  console.log('계층 순서 변경:', row.id, newOrder);
                  
                  // 상위 컴포넌트로 변경 이벤트 전달
                  if (column.onHierarchyChange) {
                    column.onHierarchyChange(row, newOrder);
                  }
                }}
                sx={{
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                    textAlign: 'center'
                  }
                }}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      }
      
      // API 드롭다운인 경우
      if (column.id === 'api') {
        const apiOptions = [
          { value: 'api1', label: 'API 1' },
          { value: 'api2', label: 'API 2' },
          { value: 'api3', label: 'API 3' },
          { value: 'disabled', label: '비활성' }
        ];
        
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select
                value={value || 'api1'}
                onChange={(e) => {
                  e.stopPropagation();
                  const newApi = e.target.value;
                  console.log('API 변경:', row.id, newApi);
                  
                  // 상위 컴포넌트로 변경 이벤트 전달
                  if (column.onApiChange) {
                    column.onApiChange(row, newApi);
                  }
                }}
                sx={{
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                    textAlign: 'center'
                  }
                }}
              >
                {apiOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      }
      
      // 기본 드롭다운 렌더링
      return (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {value || '-'}
        </Typography>
      );
    
    // 계층형 컬럼
    case 'hierarchical':
      // TypeTree 컴포넌트를 사용하여 계층형 렌더링
      if (column.cellRenderer === 'chip' && value) {
        // 행의 계층 정보 추출
        const level = row.level || 0;
        const hasChildren = row.children && row.children.length > 0;
        const expanded = row.expanded !== undefined ? row.expanded : true;
        
        // 유형 정보 추출
        let typeInfo = {};
        if (typeof value === 'object') {
          typeInfo = {
            label: value.label || value.id || '',
            color: value.color || 'primary',
            backgroundColor: value.backgroundColor,
            borderColor: value.borderColor
          };
        } else {
          typeInfo = {
            label: value,
            color: 'primary'
          };
        }
        
        return (
          <TypeTree
            item={row}
            level={level}
            expanded={expanded}
            onToggle={(itemId) => {
              // 확장/축소 토글 이벤트 발생
              console.log('TypeTree 토글:', itemId);
              if (column.onToggle) {
                column.onToggle(itemId);
              }
            }}
            hasChildren={hasChildren}
            typeInfo={typeInfo}
            indentMode={true} // 기본적으로 들여쓰기 모드 활성화
            showToggleIcon={true}
            />
        );
      }
      
      // 기본 텍스트로 렌더링
      return (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {value || '-'}
        </Typography>
      );
    
    // 가로 정렬 컬럼 (상위 계층 목록 등)
    case 'horizontal':
      if (!value) return '-';
      
      // parentTypes 또는 superAgent 데이터인 경우 ParentChips 컴포넌트 사용
      if (column.id === 'parentType' || column.id === 'parentTypes' || column.id === 'superAgent') {
        return (
          <ParentChips 
            parentTypes={value} 
            direction="row"
            maxChips={8}
            sx={{ justifyContent: 'flex-start' }}
          />
        );
      }
      
      // 값이 배열인 경우 가로로 나열
      if (Array.isArray(value)) {
        return (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center">
            {value.map((item, index) => {
              // 칩 스타일로 렌더링
              if (column.cellRenderer === 'chip') {
                return (
                  <Chip
                    key={index}
                    label={item.label || item}
                    size="small"
                    color={item.color || 'primary'}
                    variant={item.variant || 'filled'}
                    sx={{ 
                      margin: '2px',
                      backgroundColor: item.backgroundColor || undefined,
                      borderColor: item.borderColor || undefined,
                      color: item.borderColor || undefined,
                      border: item.borderColor ? `1px solid ${item.borderColor}` : undefined,
                      '& .MuiChip-label': {
                        color: item.borderColor || undefined
                      }
                    }}
                  />
                );
              }
              
              // 구분자로 구분된 텍스트
              return (
                <React.Fragment key={index}>
                  {index > 0 && <Typography variant="body2" sx={{ mx: 0.5, textAlign: 'center !important' }}>•</Typography>}
                  <Typography variant="body2" sx={{ textAlign: 'center !important' }}>
                    {item.label || item}
                  </Typography>
                </React.Fragment>
              );
            })}
          </Stack>
        );
      }
      
      // 단일 값 렌더링
      return (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {value}
        </Typography>
      );
    
    // 커스텀 렌더러
    case 'custom':
      // levelTypeChip 커스텀 렌더러
      if (column.customRenderer === 'levelTypeChip') {
        if (!value) return '-';
        
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Chip
              label={value}
              size="small"
              sx={{
                backgroundColor: row.backgroundColor || '#e8f5e9',
                color: row.borderColor || '#2e7d32',
                border: `1px solid ${row.borderColor || '#2e7d32'}`,
                fontWeight: 400,
                borderRadius: '50px',
                padding: '0 8px',
                height: '28px',
                fontSize: '0.8rem',
                maxWidth: '100%'
              }}
            />
          </Box>
        );
      }
      
      // 기본 커스텀 렌더링
      return (
        <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
          {value || '-'}
        </Typography>
      );

    // 베팅일자 컬럼 (베팅과 처리 라벨은 칩 스타일, 일시는 한 줄로 표시)
    case 'betting_date':
      if (!value || typeof value !== 'object') {
        return (
          <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
            -
          </Typography>
        );
      }
      
      const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\./g, '.').replace(/\s/g, '') + ' ' + 
        date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
      };
      
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: '100%' }}>
          {/* 베팅 일시 - 칩과 일시를 한 줄로 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="베팅"
              size="small"
              sx={{
                backgroundColor: 'info.light',
                color: 'info.contrastText',
                fontWeight: 'bold',
                fontSize: '11px',
                height: '22px',
                minWidth: '40px',
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '11px',
                  fontWeight: 'bold'
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '16px', 
                fontWeight: 'medium',
                whiteSpace: 'nowrap'
              }}
            >
              {formatDateTime(value.betting)}
            </Typography>
          </Box>
          
          {/* 처리 일시 - 칩과 일시를 한 줄로 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label="처리"
              size="small"
              sx={{
                backgroundColor: 'success.light',
                color: 'success.contrastText',
                fontWeight: 'bold',
                fontSize: '11px',
                height: '22px',
                minWidth: '40px',
                '& .MuiChip-label': {
                  px: 1,
                  fontSize: '11px',
                  fontWeight: 'bold'
                }
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '16px', 
                fontWeight: 'medium',
                whiteSpace: 'nowrap'
              }}
            >
              {formatDateTime(value.process)}
            </Typography>
          </Box>
        </Box>
      );

    // 베팅정보 컬럼 (각 항목을 칩 스타일로 표시)
    case 'betting_info':
      if (!value || typeof value !== 'object') {
        return (
          <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%' }}>
            -
          </Typography>
        );
      }
      
      const formatAmount = (amount) => {
        return typeof amount === 'number' ? amount.toLocaleString() : '-';
      };
      
      return (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 1,
          width: '100%',
          padding: '4px'
        }}>
          {/* 첫 번째 행 */}
          <Chip
            label={`베팅전 ${formatAmount(value.before)}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 152, 0, 0.15)', // 오렌지 반투명
              color: '#e65100',
              border: '1px solid rgba(255, 152, 0, 0.4)',
              fontSize: '13px',
              fontWeight: 'medium',
              height: '32px',
              '& .MuiChip-label': {
                fontSize: '13px',
                fontWeight: 'medium'
              }
            }}
          />
          <Chip
            label={`베팅금 ${formatAmount(value.betAmount)}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.15)', // 파랑 반투명
              color: '#1565c0',
              border: '1px solid rgba(33, 150, 243, 0.4)',
              fontSize: '13px',
              fontWeight: 'medium',
              height: '32px',
              '& .MuiChip-label': {
                fontSize: '13px',
                fontWeight: 'medium'
              }
            }}
          />
          {/* 두 번째 행 */}
          <Chip
            label={`당첨금 ${formatAmount(value.winAmount)}`}
            size="small"
            sx={{
              backgroundColor: value.winAmount > 0 ? 'rgba(76, 175, 80, 0.15)' : 'rgba(158, 158, 158, 0.15)', // 초록/회색 반투명
              color: value.winAmount > 0 ? '#2e7d32' : '#616161',
              border: value.winAmount > 0 ? '1px solid rgba(76, 175, 80, 0.4)' : '1px solid rgba(158, 158, 158, 0.4)',
              fontSize: '13px',
              fontWeight: 'medium',
              height: '32px',
              '& .MuiChip-label': {
                fontSize: '13px',
                fontWeight: 'medium'
              }
            }}
          />
          <Chip
            label={`베팅후 ${formatAmount(value.after)}`}
            size="small"
            sx={{
              backgroundColor: 'rgba(156, 39, 176, 0.15)', // 보라 반투명
              color: '#7b1fa2',
              border: '1px solid rgba(156, 39, 176, 0.4)',
              fontSize: '13px',
              fontWeight: 'medium',
              height: '32px',
              '& .MuiChip-label': {
                fontSize: '13px',
                fontWeight: 'medium'
              }
            }}
          />
        </Box>
      );

    // 베팅 액션 컬럼 (공베팅 버튼들)
    case 'betting_action':
      // value가 'applied', 'cancelled', null 중 하나
      if (!value) {
        return (
          <Typography variant="body2" sx={{ textAlign: 'center !important', width: '100%', color: 'text.disabled' }}>
            -
          </Typography>
        );
      }
      
      if (value === 'applied') {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                console.log('공베팅취소 클릭:', row);
                if (column.onVoidCancel) {
                  column.onVoidCancel(row);
                }
              }}
            >
              공베팅취소
            </Button>
          </Box>
        );
      } else if (value === 'cancelled') {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                console.log('공베팅적용 클릭:', row);
                if (column.onVoidApply) {
                  column.onVoidApply(row);
                }
              }}
            >
              공베팅적용
            </Button>
          </Box>
        );
      }
      
      // 기본적으로 공베팅적용 버튼 표시
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={(event) => {
              event.stopPropagation();
              console.log('공베팅적용 클릭:', row);
              if (column.onVoidApply) {
                column.onVoidApply(row);
              }
            }}
          >
            공베팅적용
          </Button>
        </Box>
      );
    
    // 기본 텍스트 컬럼
    default:
      // value가 객체인 경우 문자열로 변환
      let displayValue = value;
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          // userId 컬럼의 특별한 처리
          if (column.id === 'userId') {
            if (Array.isArray(value)) {
              // 배열인 경우: ['user002', '박영희'] -> "user002 (박영희)"
              displayValue = value.length > 1 ? `${value[0]} (${value[1]})` : value[0] || '';
            } else if (value.id && value.nickname) {
              // 객체인 경우: {id: 'user003', nickname: '이민수'} -> "user003 (이민수)"
              displayValue = `${value.id} (${value.nickname})`;
            } else {
              // 기타 객체인 경우 JSON.stringify 사용
              displayValue = JSON.stringify(value);
            }
          } else {
            // 그룹 컬럼의 중첩된 값인 경우 (예: profitLoss.slot)
            if (column.id && column.id.includes('.')) {
              const keys = column.id.split('.');
              let nestedValue = row;
              for (const key of keys) {
                nestedValue = nestedValue?.[key];
              }
              
              if (nestedValue !== undefined && nestedValue !== null) {
                // 숫자인 경우 포맷팅
                if (typeof nestedValue === 'number') {
                  displayValue = nestedValue.toLocaleString();
                  // 음수인 경우 빨간색으로 표시
                  if (nestedValue < 0) {
                    return (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textAlign: 'center !important', 
                          width: '100%',
                          color: 'error.main',
                          fontWeight: 500
                        }}
                      >
                        {displayValue}
                      </Typography>
                    );
                  }
                } else {
                  displayValue = String(nestedValue);
                }
              } else {
                displayValue = '-';
              }
            } else {
              // 일반 객체인 경우 안전하게 문자열로 변환
              try {
                if (value.toString && typeof value.toString === 'function' && value.toString() !== '[object Object]') {
                  displayValue = value.toString();
                } else {
                  displayValue = JSON.stringify(value);
                }
              } catch (error) {
                console.warn('객체를 문자열로 변환하는 중 오류 발생:', error, value);
                displayValue = '[객체]';
              }
            }
          }
        } else {
          // 숫자인 경우 포맷팅
          if (typeof value === 'number') {
            displayValue = value.toLocaleString();
          } else {
            displayValue = String(value);
          }
        }
      } else {
        displayValue = '-';
      }
      
      const defaultCellContent = (
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center !important', 
            width: '100%',
            whiteSpace: 'nowrap', // 줄바꿈 방지
            overflow: 'hidden', // 넘치는 텍스트 숨김
            textOverflow: 'ellipsis' // 넘치는 텍스트를 ... 으로 표시
          }}
        >
          {displayValue}
        </Typography>
      );
      
      // 클릭 가능한 경우 클릭 핸들러 추가
      if (column.clickable) {
        return (
          <Box
            onClick={handleCellClick}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1
              },
              width: '100%',
              padding: '4px'
            }}
          >
            {defaultCellContent}
          </Box>
        );
      }
      
      return defaultCellContent;
  }
};

CellRenderer.propTypes = {
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  value: PropTypes.any,
  sequentialPageNumbers: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  rowIndex: PropTypes.number
};

export default CellRenderer; 
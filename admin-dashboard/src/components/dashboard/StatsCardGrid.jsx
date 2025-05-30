import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, useTheme, useMediaQuery, CircularProgress, Typography, Button, FormControl, Select, MenuItem, InputLabel, IconButton, Tooltip } from '@mui/material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useSelector, useDispatch } from 'react-redux';
import StatsCardItem from './StatsCardItem';
import DisplayOptionsPanel from './DisplayOptionsPanel';
import { 
  selectStatsCards, 
  selectStatsLayouts, 
  setStatsLayouts,
  selectPeriod,
  setPeriod
} from '../../features/dashboard/dashboardSlice';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Info as InfoIcon } from '@mui/icons-material';
import '../../styles/react-grid-layout.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DragIndicator as DragIndicatorIcon } from '@mui/icons-material';

// 반응형 그리드 레이아웃 설정
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * 통계 카드 그리드 컴포넌트
 * 반응형 그리드 레이아웃으로 통계 카드를 표시합니다.
 * 
 * @param {boolean} loading - 로딩 상태
 * @param {function} onRefresh - 새로고침 핸들러
 * @param {function} onResetLayout - 레이아웃 초기화 핸들러
 * @returns {JSX.Element} 통계 카드 그리드 컴포넌트
 */
const StatsCardGrid = ({ loading, onRefresh, onResetLayout }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const cards = useSelector(selectStatsCards);
  const layouts = useSelector(selectStatsLayouts);
  const period = useSelector(selectPeriod);
  const containerRef = useRef(null);
  
  // 미디어 쿼리
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // 600px 이하
  const isSm = useMediaQuery('(max-width:800px)'); // 800px 이하
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  // 700px 미만에서는 드래그 비활성화
  const isDraggableScreen = useMediaQuery('(min-width:700px)');
  
  // 현재 표시할 카드 필터링
  const visibleCards = useMemo(() => 
    cards.filter(card => card.visible),
  [cards]);
  
  // 카드 ID 문자열 - 의존성 배열에 사용
  const visibleCardIds = useMemo(() => 
    visibleCards.map(card => card.id).join(','),
  [visibleCards]);
  
  // xs 레이아웃 생성 (2개의 카드를 한 줄에 표시)
  const generateXsLayout = () => {
    return visibleCards.map((card, index) => ({
      i: card.id,
      x: (index % 2) * 6,
      y: Math.floor(index / 2),
      w: 6,
      h: 1,
    }));
  };

  // 레이아웃 설정
  const layoutsConfig = useMemo(() => {
    return {
      lg: visibleCards.map((card, index) => ({
        i: card.id,
        x: (index % 6) * 2,  // 한 줄에 6개씩
        y: Math.floor(index / 6),
        w: 2,
        h: 1,
        static: false
      })),
      md: visibleCards.map((card, index) => ({
        i: card.id,
        x: (index % 4) * 3,  // 한 줄에 4개씩
        y: Math.floor(index / 4),
        w: 3,
        h: 1,
        static: false
      })),
      sm: visibleCards.map((card, index) => ({
        i: card.id,
        x: (index % 4) * 3,
        y: Math.floor(index / 4),
        w: 3,
        h: 1,
        static: false
      })),
      xs: generateXsLayout(),
    };
  }, [visibleCards]);
  
  // 카드 선택이 변경될 때 레이아웃 재생성
  useEffect(() => {
    if (visibleCards.length > 0) {
      dispatch(setStatsLayouts(layoutsConfig));
    }
  }, [visibleCardIds, dispatch, layoutsConfig]);
  
  // localStorage에서 저장된 레이아웃 초기화
  useEffect(() => {
    localStorage.removeItem('statsLayouts');
  }, []);
  
  // 레이아웃 변경 핸들러
  const onLayoutChange = (currentLayout, allLayouts) => {
    if (visibleCards.length > 0) {
      dispatch(setStatsLayouts(allLayouts));
    }
  };

  // 기간 변경 핸들러
  const handlePeriodChange = (event) => {
    dispatch(setPeriod(event.target.value));
  };
  
  return (
    <Box 
      className="stats-grid-container" 
      sx={{ 
        mb: 3,
        padding: isXs || isSm ? 0 : undefined // 800px 이하에서 패딩 제거
      }} 
      ref={containerRef}
    >
      {/* 현황판 타이틀과 필터, 버튼들 */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: { xs: 2, sm: 0 },
        px: isXs || isSm ? 1 : 2 // 작은 화면에서 좌우 패딩 조정
      }}>
        <Typography variant="h5" color="text.primary" fontWeight={600} sx={{ 
          display: 'flex', 
          alignItems: 'center',
          whiteSpace: 'nowrap'
        }}>
          현황판
          <Tooltip 
            title="현황판에서는 주요 통계 지표를 카드 형태로 확인할 수 있습니다. 각 카드는 선택한 기간에 따라 데이터가 업데이트됩니다. 기본은 데이터는 당일이며 24시간 00시 이후 리셋됩니다."
            arrow
            placement="right"
          >
            <IconButton size="small" sx={{ ml: 0.5, color: '#5E6278', padding: '2px' }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1, sm: 2 },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <FormControl size="small" sx={{ 
            minWidth: { xs: '60px', sm: '100px' },
            flex: { xs: '1 1 auto', sm: '0 0 auto' }
          }}>
            <InputLabel id="period-select-label">기간</InputLabel>
            <Select
              labelId="period-select-label"
              id="period-select"
              value={period}
              label="기간"
              onChange={handlePeriodChange}
            >
              <MenuItem value="daily">일별</MenuItem>
              <MenuItem value="weekly">주별</MenuItem>
              <MenuItem value="monthly">월별</MenuItem>
            </Select>
          </FormControl>
          {onRefresh && (
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={loading}
              sx={{ 
                borderRadius: '10px',
                whiteSpace: 'nowrap',
                minWidth: { xs: '100px', sm: 'auto' },
                flex: { xs: '1 1 auto', sm: '0 0 auto' }
              }}
            >
              새로고침
            </Button>
          )}
          <DisplayOptionsPanel buttonVariant="text" containerRef={containerRef} />
        </Box>
      </Box>

      {/* 카드 그리드 컨테이너 */}
      <Box 
        className="stats-card-grid-container" 
        sx={{ 
          width: '100%', 
          position: 'relative',
        }}
      >
        {/* 로딩 인디케이터 */}
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* 그리드 레이아웃 */}
        <ResponsiveGridLayout
          className="layout"
          layouts={layoutsConfig}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
          rowHeight={130}
          margin={{ xs: [10, 10], sm: [15, 15], md: [20, 20], lg: [20, 20] }}
          containerPadding={{ xs: [5, 5], sm: [8, 8], md: [10, 10], lg: [10, 10] }}
          onLayoutChange={onLayoutChange}
          isDraggable={isDraggableScreen}
          isResizable={false}
          useCSSTransforms={true}
          draggableHandle=".card-drag-handle"
          draggableCancel=".stats-card-content"
          isBounded={true}
        >
          {visibleCards.map((card, index) => (
            <Box 
              key={card.id} 
              className="stats-card"
            >
              <div className="card-drag-handle" style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '24px',
                height: '24px',
                cursor: 'move',
                zIndex: 10,
                display: isDraggableScreen ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a1a5b7',
                opacity: 0,
                transition: 'opacity 0.2s',
                backgroundColor: 'transparent'
              }} onMouseOver={(e) => {
                e.currentTarget.style.opacity = 1;
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.opacity = 0;
                e.currentTarget.style.backgroundColor = 'transparent';
              }}>
                <DragIndicatorIcon fontSize="small" style={{
                  opacity: 1
                }} />
              </div>
              <StatsCardItem
                id={card.id}
                title={card.title}
                value={card.value}
                previousValue={card.previousValue}
                suffix={card.suffix}
                loading={loading}
                icon={card.icon}
                color={card.color}
                type={card.type}
                info={card.info || '지난 30일 대비'}
                draggableProps={{
                  className: 'stats-card-header'
                }}
                dragHandleProps={{}}
              />
            </Box>
          ))}
        </ResponsiveGridLayout>
      </Box>
    </Box>
  );
};

export default StatsCardGrid;
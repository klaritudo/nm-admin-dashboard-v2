import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Typography, 
  Checkbox, 
  FormControlLabel, 
  Divider, 
  IconButton,
  Tooltip,
  Grid,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  Settings as SettingsIcon,
  RestartAlt as ResetIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { 
  selectStatsCards, 
  selectDashboardItems,
  setCardVisibility,
  setDashboardItemVisibility,
  resetStatsLayout,
  resetDashboardLayout
} from '../../features/dashboard/dashboardSlice';

/**
 * 대시보드 표시 옵션 컨트롤 패널 컴포넌트
 * 대시보드에 표시할 항목을 선택할 수 있는 체크박스 패널을 제공합니다.
 * 
 * @param {string} buttonVariant - 버튼 표시 방식 ('icon' 또는 'text')
 * @param {React.RefObject} containerRef - 컨테이너 요소의 ref
 * @returns {JSX.Element} 표시 옵션 컨트롤 패널 컴포넌트
 */
const DisplayOptionsPanel = ({ buttonVariant = 'icon', containerRef }) => {
  const dispatch = useDispatch();
  const cards = useSelector(selectStatsCards);
  const dashboardItems = useSelector(selectDashboardItems);
  const [tabValue, setTabValue] = useState(0);
  const [menuWidth, setMenuWidth] = useState('100%');
  
  // 메뉴 상태
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  // 컨테이너 너비 계산
  useEffect(() => {
    if (containerRef && containerRef.current && open) {
      const width = containerRef.current.offsetWidth;
      setMenuWidth(`${width}px`);
    }
  }, [containerRef, open]);
  
  // 표시 옵션 변경 핸들러 (통계 카드)
  const handleStatsOptionChange = (event) => {
    const { name, checked } = event.target;
    dispatch(setCardVisibility({ cardId: name, visible: checked }));
  };
  
  // 표시 옵션 변경 핸들러 (대시보드 항목)
  const handleDashboardOptionChange = (event) => {
    const { name, checked } = event.target;
    dispatch(setDashboardItemVisibility({ itemId: name, visible: checked }));
  };
  
  // 메뉴 열기 핸들러
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    
    // 컨테이너 너비 계산
    if (containerRef && containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setMenuWidth(`${width}px`);
    }
  };
  
  // 메뉴 닫기 핸들러
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  // 레이아웃 초기화 핸들러
  const handleResetLayout = () => {
    // 모든 그리드 레이아웃 관련 로컬 스토리지 데이터 삭제
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('rgl-') || key.includes('Layout'))) {
        localStorage.removeItem(key);
      }
    }
    
    dispatch(resetStatsLayout());
    dispatch(resetDashboardLayout());
    handleCloseMenu();
    
    // 페이지 새로고침으로 모든 레이아웃 초기화
    window.location.reload();
  };
  
  // 카드 타입별 그룹화
  const cardGroups = {
    personal: cards.filter(card => card.type === 'personal'),
    sub1: cards.filter(card => card.type === 'sub1'),
    master: cards.filter(card => card.type === 'master'),
    agent: cards.filter(card => card.type === 'agent'),
    store: cards.filter(card => card.type === 'store'),
    member: cards.filter(card => card.type === 'member')
  };
  
  // 표시되지 않는 카드/항목 개수 계산
  const invisibleCount = React.useMemo(() => {
    const invisibleCards = cards.filter(card => !card.visible).length;
    const invisibleItems = dashboardItems.filter(item => !item.visible).length;
    return invisibleCards + invisibleItems;
  }, [cards, dashboardItems]);
  
  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 탭 패널 렌더링 함수
  const renderTabPanel = (index, cardGroup, handler) => {
    if (tabValue !== index) return null;
    
    return (
      <Grid container spacing={1}>
        {cardGroup.map(item => (
          <Grid item xs={6} key={item.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.visible}
                  onChange={handler}
                  name={item.id}
                  size="small"
                />
              }
              label={item.title}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
  
  return (
    <Box>
      {buttonVariant === 'icon' ? (
        <Tooltip title="표시 옵션">
          <IconButton 
            onClick={handleOpenMenu} 
            size="small" 
            color="primary"
            sx={{ ml: 1, zIndex: 20 }}
          >
            <TuneIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          startIcon={<TuneIcon />}
          onClick={handleOpenMenu}
          sx={{ 
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            minWidth: { xs: '100px', sm: 'auto' },
            flex: { xs: '1 1 auto', sm: '0 0 auto' }
          }}
        >
          표시 옵션
        </Button>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { 
            width: menuWidth,
            maxWidth: menuWidth,
            maxHeight: '80vh', 
            zIndex: 1400
          }
        }}
        sx={{ zIndex: 1400 }}
        MenuListProps={{
          sx: { width: '100%' }
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem sx={{ display: 'block', p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              표시 옵션
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ minHeight: 40, mb: 2 }}
            >
              <Tab label="본인" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="부본사" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="마스터" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="총판" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="매장" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="회원" sx={{ minHeight: 40, py: 0 }} />
              <Tab label="대시보드" sx={{ minHeight: 40, py: 0 }} />
            </Tabs>
            
            <Box sx={{ mb: 2, minHeight: '200px' }}>
              {renderTabPanel(0, cardGroups.personal, handleStatsOptionChange)}
              {renderTabPanel(1, cardGroups.sub1, handleStatsOptionChange)}
              {renderTabPanel(2, cardGroups.master, handleStatsOptionChange)}
              {renderTabPanel(3, cardGroups.agent, handleStatsOptionChange)}
              {renderTabPanel(4, cardGroups.store, handleStatsOptionChange)}
              {renderTabPanel(5, cardGroups.member, handleStatsOptionChange)}
              {tabValue === 6 && (
                <Grid container spacing={1}>
                  {dashboardItems.map(item => (
                    <Grid item xs={6} key={item.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.visible}
                            onChange={handleDashboardOptionChange}
                            name={item.id}
                            size="small"
                          />
                        }
                        label={item.title}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<ResetIcon />}
                onClick={handleResetLayout}
                sx={{ fontWeight: 500 }}
              >
                레이아웃 초기화
              </Button>
            </Box>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DisplayOptionsPanel; 
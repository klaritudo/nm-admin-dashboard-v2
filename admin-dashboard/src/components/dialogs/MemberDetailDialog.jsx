import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Close,
  Info,
  AccountTree,
  Payment,
  Casino,
  CreditCard,
  BarChart,
  Settings,
  Email,
  Save,
  Public
} from '@mui/icons-material';
import useDynamicTypes from '../../hooks/useDynamicTypes';

// 탭 컴포넌트 import
import BasicInfoTab from './tabs/BasicInfoTab';
import TreeViewTab from './tabs/TreeViewTab';
import RollingPaymentTab from './tabs/RollingPaymentTab';
import BettingHistoryTab from './tabs/BettingHistoryTab';
import DepositWithdrawalTab from './tabs/DepositWithdrawalTab';
import StatisticsTab from './tabs/StatisticsTab';
import LineSettingsTab from './tabs/LineSettingsTab';
import MessageTab from './tabs/MessageTab';
import VoidBettingTab from './tabs/VoidBettingTab';

// 접근성을 위한 탭 속성 설정 함수
function a11yProps(index) {
  return {
    id: `member-tab-${index}`,
    'aria-controls': `member-tabpanel-${index}`,
  };
}

// TabPanel 컴포넌트
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      className={`member-tab-panel member-tab-panel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%', p: { xs: 1, sm: 2 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MemberDetailDialog = ({ open, onClose, member, onSave }) => {
  const theme = useTheme();
  
  // 동적 유형 관리 훅 사용
  const {
    types,
    typeHierarchy,
    isLoading: typesLoading,
    error: typesError,
    isInitialized: typesInitialized,
    getTypeInfo,
    getAgentLevelByTypeId,
    getTypeIdByLevelName
  } = useDynamicTypes();
  
  // 상태 관리
  const [activeTab, setActiveTab] = useState(0);
  const [editedMember, setEditedMember] = useState(member || {});
  const [siteUrls, setSiteUrls] = useState(member?.siteUrls || []);
  const [newSiteUrl, setNewSiteUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 트리뷰 관련 상태 추가
  const [treeData, setTreeData] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  
  // 접근성을 위한 초기 포커스 요소 참조
  const initialFocusRef = useRef(null);

  // 컴포넌트가 마운트되거나 member prop이 변경될 때 editedMember 상태 업데이트
  useEffect(() => {
    if (member) {
      // 닉네임이 없는 경우 기본값 추가
      const updatedMember = {
        ...member,
        nickname: member.nickname || '닉네임없음',
        password: member.password || ''
      };
      
      setEditedMember(updatedMember);
      setSiteUrls(member.siteUrls || []);
      setShowPassword(false); // 다이얼로그가 열릴 때마다 비밀번호 숨김 상태로 초기화
      
      // selectedAgent가 아직 설정되지 않았다면 member로 초기화
      if (!selectedAgent) {
        setSelectedAgent(updatedMember);
      }
    }
  }, [member]);
  
  // 다이얼로그가 열릴 때 초기 포커스 설정
  useEffect(() => {
    if (open && initialFocusRef.current) {
      // 짧은 지연 후 포커스 설정 (DOM 업데이트 후)
      setTimeout(() => {
        initialFocusRef.current.focus();
      }, 50);
    }
  }, [open]);

  // 트리 데이터 생성 함수
  useEffect(() => {
    if (member && open && activeTab === 1) {
      // 실제 구현에서는 API에서 데이터를 가져와야 함
      // 여기서는 샘플 데이터 생성
      const generateTreeData = () => {
        // 상위 계층 구성
        const upperHierarchy = member.hierarchy || [];
        
        // 현재 회원
        const currentMember = {
          id: member.id,
          username: member.username,
          nickname: member.nickname || '닉네임없음', // 닉네임이 없는 경우 기본값 설정
          balance: member.balance,
          rate: member.rate,
          phone: member.phone,
          accountNumber: member.accountNumber,
          accountHolder: member.accountHolder,
          bank: member.bank,
          createdAt: member.createdAt,
          status: member.status || '정상',
          levelName: member.levelName,
          rollingAmount: member.rollingAmount,
          sharedBetting: member.sharedBetting || { slot: { percentage: '5.00' }, casino: { percentage: '5.00' } },
          playerStats: '4 / 4 / 0 / 0 : 0 (전체/일반/중지/차단 · 대기)',
          children: []
        };
        
        // 하위 회원 데이터
        // 실제 구현에서는 API에서 하위 회원 데이터를 가져와야 합니다.
        
        // 현재는 window 객체에서 members 데이터를 가져와 사용합니다.
        // 이는 임시 방편이며, 실제 구현에서는 API 호출로 대체되어야 합니다.
        if (window.members && member.hasChildren) {
          const childMembers = window.members.filter(m => m.parentId === member.id);
          
          // 하위 회원 추가
          currentMember.children = childMembers.map(child => {
            const childData = {
              ...child,
              children: []
            };
            
            // 하위 회원의 하위 회원 추가
            const subChildMembers = window.members.filter(m => m.parentId === child.id);
            if (subChildMembers.length > 0) {
              childData.children = subChildMembers;
            }
            
            return childData;
          });
        }
        
        // 계층 구조 생성
        const hierarchyData = {
          id: 'root',
          username: 'Root',
          nickname: 'Root',
          levelName: 'Root',
          children: []
        };
        
        // 상위 계층 추가
        if (upperHierarchy.length > 0) {
          let currentLevel = hierarchyData;
          for (const agent of upperHierarchy) {
            const agentNode = {
              ...agent,
              children: []
            };
            currentLevel.children.push(agentNode);
            currentLevel = agentNode;
          }
          
          // 현재 회원 추가
          currentLevel.children.push(currentMember);
        } else {
          // 상위 계층이 없는 경우 바로 현재 회원 추가
          hierarchyData.children.push(currentMember);
        }
        
        return hierarchyData;
      };
      
      const treeData = generateTreeData();
      setTreeData(treeData);
      setSelectedAgent(member);
    }
  }, [member, open, activeTab]);

  // 에이전트 선택 핸들러
  const handleSelectAgent = (agent) => {
    // 닉네임이 없는 경우 기본값 추가
    if (agent && !agent.nickname) {
      agent.nickname = '닉네임없음';
    }
    setSelectedAgent(agent);
  };

  // 비밀번호 표시/숨김 토글
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // 탭 변경 핸들러
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setEditedMember({
      ...editedMember,
      [field]: value
    });
  };

  // 중첩 필드 변경 핸들러
  const handleNestedInputChange = (field, subField, value) => {
    setEditedMember({
      ...editedMember,
      [field]: {
        ...editedMember[field],
        [subField]: value
      }
    });
  };

  // 사이트 URL 추가 핸들러
  const handleAddSiteUrl = () => {
    if (newSiteUrl.trim()) {
      setSiteUrls([...siteUrls, newSiteUrl.trim()]);
      setNewSiteUrl('');
    }
  };

  // 사이트 URL 삭제 핸들러
  const handleDeleteSiteUrl = (index) => {
    const updatedUrls = [...siteUrls];
    updatedUrls.splice(index, 1);
    setSiteUrls(updatedUrls);
  };

  // 저장 핸들러
  const handleSave = () => {
    const updatedMember = {
      ...editedMember,
      siteUrls
    };
    onSave(updatedMember);
  };

  // 폼 제출 핸들러
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  // 통화 형식 포맷팅
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ko-KR', { 
      style: 'decimal',
      maximumFractionDigits: 0 
    }).format(amount || 0);
  };

  // 상위 계층 렌더링
  const renderHierarchy = () => {
    if (!member?.hierarchy) return null;
    
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {member.hierarchy.map((agent, index) => {
            // 단계 스타일 적용
            const levelStyle = {
              backgroundColor: agent.backgroundColor || '#e3f2fd',
              color: agent.textColor || '#1565c0',
              borderColor: agent.borderColor || '#1565c0'
            };
            
            return (
              <React.Fragment key={agent.id}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 1,
                  minWidth: '100px'
                }}>
                  <Chip 
                    label={typeof agent.levelName === 'object' ? agent.levelName.name || '관리자' : agent.levelName || '관리자'}
                    size="small"
                    sx={{ 
                      mb: 0.5,
                      backgroundColor: levelStyle.backgroundColor,
                      color: levelStyle.color,
                      border: `1px solid ${levelStyle.borderColor}`,
                      fontWeight: 'medium'
                    }}
                  />
                  <Typography variant="caption" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                    {typeof agent.username === 'object' ? agent.username.id || '' : agent.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    {typeof agent.nickname === 'object' ? agent.nickname.value || "닉네임없음" : agent.nickname || "닉네임없음"}
                  </Typography>
                </Box>
                {index < member.hierarchy.length - 1 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mx: 1, mb: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      &gt;
                    </Typography>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
          
          {/* 현재 회원 칩 */}
          {member && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 1,
              minWidth: '100px'
            }}>
              <Chip 
                label={typeof member.levelName === 'object' ? member.levelName.name || '회원' : member.levelName || '회원'}
                size="small"
                sx={{ 
                  mb: 0.5,
                  backgroundColor: member.backgroundColor || '#f3e5f5',
                  color: member.textColor || '#7b1fa2',
                  border: `1px solid ${member.borderColor || '#7b1fa2'}`,
                  fontWeight: 'medium'
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                {typeof member.username === 'object' ? member.username.id || '' : member.username}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                {typeof member.nickname === 'object' ? member.nickname.value || "닉네임없음" : member.nickname || "닉네임없음"}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // 레벨 칩 스타일 함수
  const getLevelChipStyle = useCallback((item) => {
    console.log('💄 getLevelChipStyle 호출:', item);
    console.log('💄 getTypeIdByLevelName 함수 존재:', typeof getTypeIdByLevelName);
    console.log('💄 getTypeInfo 함수 존재:', typeof getTypeInfo);
    console.log('💄 types 상태:', types);
    console.log('💄 typesInitialized:', typesInitialized);

    // useDynamicTypes 훅이 아직 초기화되지 않은 경우 기본값 반환
    if (!typesInitialized || typeof getTypeIdByLevelName !== 'function' || typeof getTypeInfo !== 'function') {
      console.log('⚠️ useDynamicTypes가 아직 초기화되지 않음, 기본값 반환');
      return {
        backgroundColor: '#e0e0e0',
        borderColor: '#424242',
        name: typeof item.levelName === 'object' ? 
          (item.levelName.name || item.levelName.label || '회원') : 
          (item.levelName || '회원')
      };
    }

    // 아이템에서 유형 정보 추출
    let typeInfo = null;
    
    if (item.type && typeof item.type === 'object') {
      // type이 객체인 경우 (예: { label: '슈퍼관리자', color: 'error', ... })
      const typeId = getTypeIdByLevelName(item.type.label);
      typeInfo = getTypeInfo(typeId);
    } else if (item.type && typeof item.type === 'string') {
      // type이 문자열인 경우
      const typeId = getTypeIdByLevelName(item.type);
      typeInfo = getTypeInfo(typeId);
    } else if (item.levelName) {
      // levelName으로 찾기
      const typeId = getTypeIdByLevelName(item.levelName);
      typeInfo = getTypeInfo(typeId);
    }

    // 동적 유형 정보가 있으면 사용, 없으면 기본값
    if (typeInfo) {
      return {
        backgroundColor: typeInfo.backgroundColor || '#f5f5f5',
        textColor: typeInfo.borderColor || '#424242',
        borderColor: typeInfo.borderColor || '#424242',
        name: typeof typeInfo.label === 'object' ? 
          (typeInfo.label.name || typeInfo.label.label || '회원') : 
          (typeInfo.label || item.levelName || '회원')
      };
    }

    // 기본값
    return {
      backgroundColor: '#f5f5f5',
      textColor: '#424242',
      borderColor: '#424242',
      name: typeof item.levelName === 'object' ? 
        (item.levelName.name || item.levelName.label || '회원') : 
        (item.levelName || '회원')
    };
  }, [types, typesInitialized, getTypeIdByLevelName, getTypeInfo]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          backgroundImage: `linear-gradient(to bottom, ${alpha(theme.palette.background.paper, 0.9)}, ${theme.palette.background.paper})`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }
      }}
    >
      <DialogTitle 
        id="member-detail-dialog-title" 
        sx={{ 
          minHeight: '64px',
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          py: 1.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            회원 상세 정보
          </Typography>
          {member && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Chip 
                label={typeof member.username === 'object' ? member.username.id || '' : member.username || ''} 
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  fontWeight: 500,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  '& .MuiChip-label': { px: 1 }
                }} 
              />
              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                {typeof member.nickname === 'object' ? member.nickname.value || '닉네임없음' : member.nickname || "닉네임없음"}
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={onClose} 
          aria-label="close"
          sx={{ 
            color: theme.palette.text.secondary,
            transition: 'all 0.2s',
            '&:hover': { 
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)', overflow: 'hidden' }}>
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          bgcolor: alpha(theme.palette.background.default, 0.5), 
          zIndex: 10, 
          position: 'relative' 
        }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="member detail tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minHeight: '54px',
                textTransform: 'none',
                minWidth: 130,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: theme.palette.text.secondary,
                py: 1.5,
                transition: 'all 0.2s',
                '&:hover': {
                  color: theme.palette.text.primary,
                  backgroundColor: alpha(theme.palette.action.hover, 0.7)
                }
              },
              '& .Mui-selected': {
                color: theme.palette.primary.main,
                fontWeight: 600,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderTopLeftRadius: 3,
                borderTopRightRadius: 3,
              }
            }}
          >
            <Tab 
              icon={<Info fontSize="small" />} 
              iconPosition="start" 
              label="기본정보" 
              ref={initialFocusRef} 
              {...a11yProps(0)} 
            />
            <Tab 
              icon={<AccountTree fontSize="small" />} 
              iconPosition="start" 
              label="트리뷰" 
              {...a11yProps(1)} 
            />
            <Tab 
              icon={<Payment fontSize="small" />} 
              iconPosition="start" 
              label="롤링/정산" 
              {...a11yProps(2)} 
            />
            <Tab 
              icon={<Casino fontSize="small" />} 
              iconPosition="start" 
              label="베팅내역" 
              {...a11yProps(3)} 
            />
            <Tab 
              icon={<CreditCard fontSize="small" />} 
              iconPosition="start" 
              label="입/출금" 
              {...a11yProps(4)} 
            />
            <Tab 
              icon={<BarChart fontSize="small" />} 
              iconPosition="start" 
              label="통계" 
              {...a11yProps(5)} 
            />
            <Tab 
              icon={<Public fontSize="small" />} 
              iconPosition="start" 
              label="공베팅" 
              {...a11yProps(6)} 
            />
            <Tab 
              icon={<Settings fontSize="small" />} 
              iconPosition="start" 
              label="라인설정" 
              {...a11yProps(7)} 
            />
            <Tab 
              icon={<Email fontSize="small" />} 
              iconPosition="start" 
              label="쪽지" 
              {...a11yProps(8)} 
            />
          </Tabs>
        </Box>
        
        <DialogContent 
          sx={{ 
            padding: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            flex: '1 1 auto',
            overflow: 'hidden'
          }}
          className="member-detail-content"
        >
          <TabPanel value={activeTab} index={0}>
            <BasicInfoTab 
              editedMember={editedMember}
              handleInputChange={handleInputChange}
              handleNestedInputChange={handleNestedInputChange}
              showPassword={showPassword}
              toggleShowPassword={toggleShowPassword}
              siteUrls={siteUrls}
              newSiteUrl={newSiteUrl}
              setNewSiteUrl={setNewSiteUrl}
              handleAddSiteUrl={handleAddSiteUrl}
              handleDeleteSiteUrl={handleDeleteSiteUrl}
              renderHierarchy={renderHierarchy}
              formatCurrency={formatCurrency}
              getLevelChipStyle={getLevelChipStyle}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={1}>
            <TreeViewTab 
              treeData={treeData} 
              selectedAgent={selectedAgent}
              onSelectAgent={handleSelectAgent}
              formatCurrency={formatCurrency}
              getLevelChipStyle={getLevelChipStyle}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={2}>
            <RollingPaymentTab 
              selectedAgent={selectedAgent} 
              formatCurrency={formatCurrency}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={3}>
            <BettingHistoryTab 
              selectedAgent={selectedAgent}
              formatCurrency={formatCurrency}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={4}>
            <DepositWithdrawalTab 
              selectedAgent={selectedAgent}
              formatCurrency={formatCurrency}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={5}>
            <StatisticsTab 
              selectedAgent={selectedAgent}
              formatCurrency={formatCurrency}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={6}>
            <VoidBettingTab 
              editedMember={editedMember}
              handleInputChange={handleInputChange}
              handleNestedInputChange={handleNestedInputChange}
            />
          </TabPanel>
          
          <TabPanel value={activeTab} index={7}>
            <LineSettingsTab selectedAgent={selectedAgent} />
          </TabPanel>
          
          <TabPanel value={activeTab} index={8}>
            <MessageTab selectedAgent={selectedAgent} />
          </TabPanel>
        </DialogContent>
      </Box>

      <Divider />

      <DialogActions sx={{ 
        p: 2.5, 
        backgroundColor: alpha(theme.palette.background.default, 0.6), 
        justifyContent: 'flex-end',
        gap: 1.5
      }}>
        <Button 
          variant="outlined" 
          onClick={onClose}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 500,
            borderRadius: '8px',
            px: 2.5,
            borderColor: alpha(theme.palette.text.secondary, 0.3),
            color: theme.palette.text.secondary,
            '&:hover': {
              borderColor: theme.palette.text.primary,
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.action.hover, 0.8)
            }
          }}
        >
          닫기
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          startIcon={<Save />}
          sx={{ 
            textTransform: 'none', 
            fontWeight: 500,
            borderRadius: '8px',
            px: 2.5,
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.07)',
            '&:hover': {
              boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
            }
          }}
          color="primary"
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MemberDetailDialog; 
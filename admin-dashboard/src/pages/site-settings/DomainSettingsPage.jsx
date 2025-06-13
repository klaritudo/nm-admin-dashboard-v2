import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tabs,
  Tab,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Language as DomainIcon,
  SupervisorAccount as SupervisorIcon,
  Business as BusinessIcon,
  Support as AgentIcon,
  People as MemberIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageHeader, 
  TableHeader,
  BaseTable
} from '../../components/baseTemplate/components';
import { 
  useTableHeader,
  useTable
} from '../../components/baseTemplate/hooks';

/**
 * 도메인 타입 정의
 */
const domainTypes = [
  { value: 'distributor', label: '분양관리자', color: 'error', icon: <SupervisorIcon /> },
  { value: 'operator', label: '운영관리자', color: 'warning', icon: <BusinessIcon /> },
  { value: 'agent', label: '에이전트관리자', color: 'info', icon: <AgentIcon /> },
  { value: 'member', label: '회원페이지', color: 'success', icon: <MemberIcon /> }
];

/**
 * 도메인 설정 페이지
 * 분양관리자, 운영관리자, 에이전트관리자, 회원페이지 도메인을 관리
 */
const DomainSettingsPage = () => {
  // 현재 선택된 탭
  const [currentTab, setCurrentTab] = useState(0);
  
  // 도메인 데이터
  const [domains, setDomains] = useState([
    { id: 1, type: 'distributor', url: 'https://distributor.example.com', createdAt: '2024-01-15', updatedAt: '2024-01-15', active: true },
    { id: 2, type: 'operator', url: 'https://operator.example.com', createdAt: '2024-01-16', updatedAt: '2024-01-16', active: true },
    { id: 3, type: 'agent', url: 'https://agent.example.com', createdAt: '2024-01-17', updatedAt: '2024-01-17', active: true },
    { id: 4, type: 'member', url: 'https://www.example.com', createdAt: '2024-01-18', updatedAt: '2024-01-20', active: true },
    { id: 5, type: 'member', url: 'https://m.example.com', createdAt: '2024-01-19', updatedAt: '2024-01-19', active: true }
  ]);

  // 추가 폼 상태
  const [newDomain, setNewDomain] = useState({ url: '' });
  const [isAdding, setIsAdding] = useState(false);

  // 수정 상태
  const [editingId, setEditingId] = useState(null);
  const [editingDomain, setEditingDomain] = useState(null);

  // 삭제 확인 다이얼로그
  const [deleteDialog, setDeleteDialog] = useState({ open: false, domain: null });

  // 알림 상태
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 테이블 헤더 훅
  const {
    searchText,
    handleSearchChange,
    handleClearSearch,
  } = useTableHeader({
    initialTotalItems: domains.length,
    tableId: 'domainSettings',
    showSearch: true,
  });

  // 테이블 훅
  const {
    checkedItems,
    sortConfig,
    allChecked,
    handleSort,
    handleCheck,
    handleToggleAll,
  } = useTable({
    data: domains,
    initialSort: { key: null, direction: 'asc' },
    initialCheckedItems: {},
  });

  // 알림 표시
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // 현재 탭의 타입 가져오기
  const getCurrentType = useCallback(() => {
    return domainTypes[currentTab].value;
  }, [currentTab]);

  // 도메인 추가
  const handleAddDomain = useCallback(() => {
    if (!newDomain.url.trim()) {
      showNotification('도메인 URL을 입력해주세요.', 'error');
      return;
    }

    // URL 형식 검증
    try {
      new URL(newDomain.url);
    } catch {
      showNotification('올바른 URL 형식이 아닙니다.', 'error');
      return;
    }

    const newId = Math.max(...domains.map(d => d.id), 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const currentType = getCurrentType();
    
    setDomains(prev => [...prev, {
      id: newId,
      type: currentType,
      url: newDomain.url.trim(),
      createdAt: today,
      updatedAt: today,
      active: true
    }]);

    setNewDomain({ url: '' });
    setIsAdding(false);
    showNotification('도메인이 추가되었습니다.');
  }, [domains, newDomain, getCurrentType]);

  // 도메인 수정 시작
  const handleEditStart = useCallback((domain) => {
    setEditingId(domain.id);
    setEditingDomain({ ...domain });
  }, []);

  // 도메인 수정 저장
  const handleEditSave = useCallback(() => {
    if (!editingDomain.url.trim()) {
      showNotification('도메인 URL을 입력해주세요.', 'error');
      return;
    }

    // URL 형식 검증
    try {
      new URL(editingDomain.url);
    } catch {
      showNotification('올바른 URL 형식이 아닙니다.', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    setDomains(prev => prev.map(domain =>
      domain.id === editingId ? { ...editingDomain, updatedAt: today } : domain
    ));

    setEditingId(null);
    setEditingDomain(null);
    showNotification('도메인이 수정되었습니다.');
  }, [editingId, editingDomain]);

  // 도메인 수정 취소
  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditingDomain(null);
  }, []);

  // 도메인 삭제
  const handleDelete = useCallback((domain) => {
    setDeleteDialog({ open: true, domain });
  }, []);

  // 도메인 삭제 확인
  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.domain) {
      setDomains(prev => prev.filter(d => d.id !== deleteDialog.domain.id));
      showNotification('도메인이 삭제되었습니다.');
    }
    setDeleteDialog({ open: false, domain: null });
  }, [deleteDialog.domain]);

  // 활성/비활성 토글
  const handleToggleActive = useCallback((domain) => {
    setDomains(prev => prev.map(d =>
      d.id === domain.id ? { ...d, active: !d.active } : d
    ));
    showNotification(`도메인이 ${domain.active ? '비활성화' : '활성화'}되었습니다.`);
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    showNotification('도메인 목록을 새로고침했습니다.');
  }, []);

  // URL 복사
  const handleCopyUrl = useCallback((url) => {
    navigator.clipboard.writeText(url);
    showNotification('URL이 클립보드에 복사되었습니다.');
  }, []);

  // URL 새창에서 열기
  const handleOpenUrl = useCallback((url) => {
    window.open(url, '_blank');
  }, []);

  // 필터링된 도메인 (현재 탭 기준)
  const filteredDomains = useMemo(() => {
    let result = [...domains];
    
    // 현재 탭의 타입으로 필터링
    const currentType = getCurrentType();
    result = result.filter(domain => domain.type === currentType);

    // 검색 필터
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(domain =>
        domain.url.toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [domains, searchText, getCurrentType]);

  // 탭 변경 시 검색어 초기화
  useEffect(() => {
    if (handleClearSearch) {
      handleClearSearch();
    }
  }, [currentTab]);

  // 테이블 컬럼 정의
  const columns = [
    {
      id: 'no',
      label: 'No.',
      width: 70,
      align: 'center',
      type: 'number'
    },
    {
      id: 'url',
      label: '도메인 URL',
      width: 450,
      align: 'left',
      type: 'custom',
      render: (row) => {
        if (editingId === row.id) {
          return (
            <TextField
              value={editingDomain.url}
              onChange={(e) => setEditingDomain({ ...editingDomain, url: e.target.value })}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DomainIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          );
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DomainIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ flex: 1 }}>{row.url}</Typography>
            <IconButton 
              size="small" 
              onClick={() => handleOpenUrl(row.url)}
              title="새창에서 열기"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleCopyUrl(row.url)}
              title="URL 복사"
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Box>
        );
      }
    },
    {
      id: 'createdAt',
      label: '등록일',
      width: 120,
      align: 'center',
      type: 'text'
    },
    {
      id: 'updatedAt',
      label: '수정일',
      width: 120,
      align: 'center',
      type: 'text'
    },
    {
      id: 'active',
      label: '상태',
      width: 100,
      align: 'center',
      type: 'custom',
      render: (row) => (
        <Switch
          checked={row.active}
          onChange={() => handleToggleActive(row)}
          size="small"
          color="primary"
        />
      )
    },
    {
      id: 'actions',
      label: '액션',
      width: 150,
      align: 'center',
      type: 'custom',
      render: (row) => {
        if (editingId === row.id) {
          return (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Chip
                label="저장"
                color="primary"
                size="small"
                onClick={handleEditSave}
                sx={{ cursor: 'pointer' }}
              />
              <Chip
                label="취소"
                color="default"
                size="small"
                onClick={handleEditCancel}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
          );
        }
        return (
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Chip
              label="수정"
              color="primary"
              size="small"
              variant="outlined"
              onClick={() => handleEditStart(row)}
              sx={{ cursor: 'pointer' }}
            />
            <Chip
              label="삭제"
              color="error"
              size="small"
              variant="outlined"
              onClick={() => handleDelete(row)}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        );
      }
    }
  ];

  // 번호를 포함한 표시 데이터
  const displayData = useMemo(() => {
    return filteredDomains.map((domain, index) => ({
      ...domain,
      no: index + 1
    }));
  }, [filteredDomains]);

  return (
    <PageContainer>
      <PageHeader
        title="도메인 설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={handleRefresh}
        sx={{ mb: 2 }}
      />

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <TableHeader
          title="도메인 관리"
          totalItems={domains.length}
          countLabel="총 ##count##개의 도메인"
          searchText={searchText}
          handleSearchChange={handleSearchChange}
          handleClearSearch={handleClearSearch}
          showSearch={true}
          searchPlaceholder="도메인 검색..."
          showIndentToggle={false}
          showPageNumberToggle={false}
          showColumnPinToggle={false}
          sx={{ mb: 2 }}
        />

        {/* 탭 메뉴 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            aria-label="도메인 타입 탭"
          >
            {domainTypes.map((type, index) => (
              <Tab 
                key={type.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.icon}
                    {type.label}
                    <Chip 
                      label={domains.filter(d => d.type === type.value).length} 
                      size="small" 
                      color={type.color}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Box>

        {/* 도메인 추가 폼 */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          {!isAdding ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAdding(true)}
              sx={{ minWidth: 150 }}
              color={domainTypes[currentTab].color}
            >
              {domainTypes[currentTab].label} 도메인 추가
            </Button>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 150 }}>
                <Chip
                  icon={domainTypes[currentTab].icon}
                  label={domainTypes[currentTab].label}
                  color={domainTypes[currentTab].color}
                  size="small"
                />
              </Box>
              
              <TextField
                placeholder="https://example.com"
                value={newDomain.url}
                onChange={(e) => setNewDomain({ ...newDomain, url: e.target.value })}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DomainIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddDomain();
                  }
                }}
              />
              
              <IconButton
                color="primary"
                onClick={handleAddDomain}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                <AddIcon />
              </IconButton>
              
              <Button
                variant="outlined"
                onClick={() => {
                  setIsAdding(false);
                  setNewDomain({ url: '' });
                }}
              >
                취소
              </Button>
            </>
          )}
        </Box>

        {/* 도메인 테이블 */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            overflow: 'hidden'
          }}
        >
          <BaseTable
            columns={columns}
            data={displayData}
            checkable={true}
            checkedItems={checkedItems}
            allChecked={allChecked}
            onCheck={handleCheck}
            onToggleAll={handleToggleAll}
            onSort={handleSort}
            sortConfig={sortConfig}
            sx={{
              '& .MuiTableCell-root': {
                borderBottom: '1px solid',
                borderColor: 'divider'
              }
            }}
          />
        </Box>

        {/* 도메인이 없을 때 */}
        {filteredDomains.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              color: 'text.secondary'
            }}
          >
            <Typography variant="body1">
              {searchText ? '검색 결과가 없습니다.' : '등록된 도메인이 없습니다.'}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, domain: null })}
      >
        <DialogTitle>도메인 삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>
            "{deleteDialog.domain?.url}" 도메인을 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, domain: null })}>
            취소
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 스낵바 */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default DomainSettingsPage;
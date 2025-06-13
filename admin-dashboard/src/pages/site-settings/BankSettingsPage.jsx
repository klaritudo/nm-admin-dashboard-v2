import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AccountBalance as BankIcon,
  ContentCopy as CopyIcon,
  AutoAwesome as AutoIcon
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
import usePageData from '../../hooks/usePageData';
import QuillEditor from '../../components/common/QuillEditor';

/**
 * 은행 목록
 */
const bankList = [
  '국민은행', '신한은행', '우리은행', '하나은행', 'SC제일은행',
  '농협은행', '기업은행', '카카오뱅크', '케이뱅크', '토스뱅크',
  '새마을금고', '신협', '우체국', '수협', '산업은행',
  '씨티은행', '부산은행', '경남은행', '대구은행', '광주은행',
  '전북은행', '제주은행'
];

/**
 * 계좌/은행 설정 페이지
 */
const BankSettingsPage = () => {
  // usePageData로 동적 타입 데이터 가져오기
  const {
    data: accountData,
    types,
    typeHierarchy,
    isLoading,
    error,
    isInitialized
  } = usePageData({
    pageType: 'bankSettings',
    dataGenerator: (dynamicTypes, dynamicTypeHierarchy) => {
      if (!dynamicTypes || Object.keys(dynamicTypes).length === 0) {
        return [];
      }
      
      // 각 타입별로 계좌 설정 데이터 생성
      const generatedData = Object.entries(dynamicTypes).map(([typeKey, type], index) => ({
        id: type.id || `account_${index}`,
        type: typeKey,
        levelType: type.label,
        backgroundColor: type.backgroundColor,
        borderColor: type.borderColor,
        bank: '',
        accountNumber: '',
        accountHolder: '',
        autoReply: `<p>${type.label} 계좌입니다.</p>`,
        active: true,
        no: index + 1
      }));
      
      return generatedData;
    }
  });
  
  
  // 현재 탭
  const [currentTab, setCurrentTab] = useState(0);

  // 은행 설정 데이터
  const [bankSettings, setBankSettings] = useState([
    {
      id: 1,
      bankName: '국민은행',
      maintenanceTime: '00:00~00:30',
      useName: 'KB',
      active: true
    },
    {
      id: 2,
      bankName: '신한은행',
      maintenanceTime: '00:00~00:30',
      useName: 'SH',
      active: true
    }
  ]);

  // 추가/수정 폼 상태
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  
  // 새 은행 추가 폼 상태
  const [newBank, setNewBank] = useState({
    bankName: '',
    maintenanceTime: '00:00~00:30',
    useName: ''
  });

  // 자동답변 편집 다이얼로그
  const [autoReplyDialog, setAutoReplyDialog] = useState({
    open: false,
    type: null,
    content: ''
  });

  // 일괄 적용 상태
  const [bulkApply, setBulkApply] = useState({
    open: false,
    content: ''
  });

  // 삭제 확인 다이얼로그
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null, type: null });

  // 알림 상태
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });



  // 데이터가 없을 때 기본값 설정
  const safeAccountData = accountData || [];

  // 테이블 헤더 훅 - 계좌설정
  const accountTableHeader = useTableHeader({
    initialTotalItems: safeAccountData.length,
    tableId: 'accountSettings',
    showSearch: true,
  });

  // 테이블 헤더 훅 - 은행설정
  const bankTableHeader = useTableHeader({
    initialTotalItems: bankSettings.length,
    tableId: 'bankSettings',
    showSearch: true,
  });

  // 계좌 설정 상태 관리 - localStorage에서 불러오기
  const [accountSettings, setAccountSettings] = useState(() => {
    const saved = localStorage.getItem('accountSettings');
    return saved ? JSON.parse(saved) : {};
  });

  // 테이블 훅 - 계좌설정
  const accountTable = useTable({
    data: safeAccountData,
    initialSort: { key: null, direction: 'asc' },
  });

  // 테이블 훅 - 은행설정
  const bankTable = useTable({
    data: bankSettings,
    initialSort: { key: null, direction: 'asc' },
  });

  // 알림 표시
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // 계좌 정보 업데이트
  const handleAccountUpdate = useCallback((id, field, value) => {
    setAccountSettings(prev => {
      const updated = {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value
        }
      };
      // localStorage에 저장
      localStorage.setItem('accountSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 계좌 복사
  const handleCopyAccount = useCallback((account) => {
    const settings = accountSettings[account.id] || {};
    const bank = settings.bank || account.bank || '';
    const accountNumber = settings.accountNumber || account.accountNumber || '';
    const accountHolder = settings.accountHolder || account.accountHolder || '';
    
    const text = `${bank} ${accountNumber} ${accountHolder}`.trim();
    if (!text) {
      showNotification('복사할 계좌정보가 없습니다.', 'warning');
      return;
    }
    
    navigator.clipboard.writeText(text);
    showNotification('계좌정보가 클립보드에 복사되었습니다.');
  }, [accountSettings]);

  // 자동답변 편집 열기
  const handleOpenAutoReply = useCallback((type) => {
    const account = safeAccountData.find(a => a.type === type);
    const settings = accountSettings[account?.id] || {};
    const bank = settings.bank || account?.bank || '';
    const accountNumber = settings.accountNumber || account?.accountNumber || '';
    const accountHolder = settings.accountHolder || account?.accountHolder || '';
    
    // 계좌 정보가 있으면 자동답변에 포함
    let autoReplyContent = account?.autoReply || `<p>${account?.levelType} 계좌입니다.</p>`;
    
    if (bank && accountNumber && accountHolder) {
      autoReplyContent = `<p>${account?.levelType} 계좌입니다.</p>
<p>은행: ${bank}</p>
<p>계좌번호: ${accountNumber}</p>
<p>예금주: ${accountHolder}</p>`;
    }
    
    setAutoReplyDialog({
      open: true,
      type: type,
      content: autoReplyContent
    });
  }, [safeAccountData, accountSettings]);

  // 자동답변 저장
  const handleSaveAutoReply = useCallback(() => {
    // TODO: API를 통해 저장
    console.log('자동답변 저장:', autoReplyDialog);
    setAutoReplyDialog({ open: false, type: null, content: '' });
    showNotification('자동답변이 저장되었습니다.');
  }, [autoReplyDialog]);

  // 일괄 적용 열기
  const handleOpenBulkApply = useCallback(() => {
    setBulkApply({ open: true, content: '' });
  }, []);

  // 일괄 적용 저장
  const handleSaveBulkApply = useCallback(() => {
    // TODO: API를 통해 일괄 저장
    console.log('일괄 적용:', bulkApply.content);
    setBulkApply({ open: false, content: '' });
    showNotification('모든 유형에 자동답변이 적용되었습니다.');
  }, [bulkApply.content]);

  // 은행 추가
  const handleAddBank = useCallback(() => {
    if (!newBank.bankName.trim()) {
      showNotification('은행명을 입력해주세요.', 'error');
      return;
    }

    const newId = Math.max(...bankSettings.map(b => b.id), 0) + 1;
    setBankSettings(prev => [...prev, {
      id: newId,
      ...newBank,
      active: true
    }]);

    setNewBank({ bankName: '', maintenanceTime: '00:00~00:30', useName: '' });
    setIsAdding(false);
    showNotification('은행이 추가되었습니다.');
  }, [bankSettings, newBank]);

  // 은행 수정 시작
  const handleEditStart = useCallback((bank) => {
    setEditingId(bank.id);
    setEditingData({ ...bank });
  }, []);

  // 은행 수정 저장
  const handleEditSave = useCallback(() => {
    setBankSettings(prev => prev.map(bank =>
      bank.id === editingId ? editingData : bank
    ));
    setEditingId(null);
    setEditingData(null);
    showNotification('은행정보가 수정되었습니다.');
  }, [editingId, editingData]);

  // 은행 수정 취소
  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditingData(null);
  }, []);

  // 삭제
  const handleDelete = useCallback((item, type) => {
    setDeleteDialog({ open: true, item, type });
  }, []);

  // 삭제 확인
  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.type === 'bank' && deleteDialog.item) {
      setBankSettings(prev => prev.filter(b => b.id !== deleteDialog.item.id));
      showNotification('은행이 삭제되었습니다.');
    }
    setDeleteDialog({ open: false, item: null, type: null });
  }, [deleteDialog]);

  // 활성/비활성 토글
  const handleToggleActive = useCallback((item, type) => {
    if (type === 'bank') {
      setBankSettings(prev => prev.map(bank =>
        bank.id === item.id ? { ...bank, active: !bank.active } : bank
      ));
    } else if (type === 'account') {
      // 계좌 상태 토글
      const currentActive = accountSettings[item.id]?.active ?? item.active ?? true;
      handleAccountUpdate(item.id, 'active', !currentActive);
    }
    const wasActive = type === 'account' ? (accountSettings[item.id]?.active ?? item.active ?? true) : item.active;
    showNotification(`${type === 'bank' ? '은행' : '계좌'}이 ${wasActive ? '비활성화' : '활성화'}되었습니다.`);
  }, [accountSettings, handleAccountUpdate]);

  // 새로고침
  const handleRefresh = useCallback(() => {
    showNotification('데이터를 새로고침했습니다.');
  }, []);

  // 계좌설정 테이블 컬럼
  const accountColumns = useMemo(() => [
    {
      id: 'no',
      label: 'No.',
      width: 70,
      align: 'center',
      type: 'number'
    },
    {
      id: 'levelType',
      label: '유형',
      width: 150,
      align: 'center',
      type: 'custom',
      customRenderer: 'levelTypeChip'
    },
    {
      id: 'bank',
      label: '은행',
      width: 150,
      align: 'center',
      type: 'custom',
      render: (row) => {
        const currentValue = accountSettings[row.id]?.bank || row.bank || '';
        return (
          <FormControl size="small" fullWidth>
            <Select
              value={currentValue}
              onChange={(e) => handleAccountUpdate(row.id, 'bank', e.target.value)}
              displayEmpty
              sx={{ 
                fontSize: '14px',
                '& .MuiSelect-select': {
                  padding: '4px 8px',
                }
              }}
            >
              <MenuItem value="">
                <em>선택하세요</em>
              </MenuItem>
              {bankList.map((bank) => (
                <MenuItem key={bank} value={bank}>
                  {bank}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
    },
    {
      id: 'accountNumber',
      label: '계좌번호',
      width: 200,
      align: 'center',
      type: 'custom',
      render: (row) => {
        const currentValue = accountSettings[row.id]?.accountNumber || row.accountNumber || '';
        return (
          <TextField
            value={currentValue}
            onChange={(e) => handleAccountUpdate(row.id, 'accountNumber', e.target.value)}
            size="small"
            fullWidth
            placeholder="계좌번호 입력"
            sx={{
              '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontSize: '14px',
                textAlign: 'center'
              }
            }}
          />
        );
      }
    },
    {
      id: 'accountHolder',
      label: '예금주',
      width: 150,
      align: 'center',
      type: 'custom',
      render: (row) => {
        const currentValue = accountSettings[row.id]?.accountHolder || row.accountHolder || '';
        return (
          <TextField
            value={currentValue}
            onChange={(e) => handleAccountUpdate(row.id, 'accountHolder', e.target.value)}
            size="small"
            fullWidth
            placeholder="예금주 입력"
            sx={{
              '& .MuiInputBase-input': {
                padding: '4px 8px',
                fontSize: '14px',
                textAlign: 'center'
              }
            }}
          />
        );
      }
    },
    {
      id: 'copyButton',
      label: '복사',
      width: 80,
      align: 'center',
      type: 'custom',
      render: (row) => (
        <IconButton 
          size="small" 
          onClick={() => handleCopyAccount(row)}
          title="계좌정보 복사"
          disabled={!accountSettings[row.id]?.bank && !accountSettings[row.id]?.accountNumber && !accountSettings[row.id]?.accountHolder}
        >
          <CopyIcon fontSize="small" />
        </IconButton>
      )
    },
    {
      id: 'autoReply',
      label: '자동답변',
      width: 150,
      align: 'center',
      type: 'custom',
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => handleOpenAutoReply(row.type)}
        >
          편집
        </Button>
      )
    },
    {
      id: 'active',
      label: '상태',
      width: 100,
      align: 'center',
      type: 'custom',
      render: (row) => {
        const currentActive = accountSettings[row.id]?.active ?? row.active ?? true;
        return (
          <Switch
            checked={currentActive}
            onChange={() => handleToggleActive(row, 'account')}
            size="small"
            color="primary"
          />
        );
      }
    }
  ], [accountSettings, handleCopyAccount, handleOpenAutoReply, handleToggleActive, handleAccountUpdate]);

  // 은행설정 테이블 컬럼
  const bankColumns = [
    {
      id: 'no',
      label: 'No.',
      width: 70,
      align: 'center',
      type: 'number'
    },
    {
      id: 'bankName',
      label: '은행명',
      width: 200,
      align: 'left',
      type: 'custom',
      render: (row) => {
        if (editingId === row.id) {
          return (
            <TextField
              value={editingData.bankName}
              onChange={(e) => setEditingData({ ...editingData, bankName: e.target.value })}
              size="small"
              fullWidth
            />
          );
        }
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BankIcon fontSize="small" color="action" />
            <Typography variant="body2">{row.bankName}</Typography>
          </Box>
        );
      }
    },
    {
      id: 'maintenanceTime',
      label: '점검시간',
      width: 200,
      align: 'center',
      type: 'custom',
      render: (row) => {
        if (editingId === row.id) {
          return (
            <TextField
              value={editingData.maintenanceTime}
              onChange={(e) => setEditingData({ ...editingData, maintenanceTime: e.target.value })}
              size="small"
              fullWidth
            />
          );
        }
        return row.maintenanceTime;
      }
    },
    {
      id: 'useName',
      label: '사용명',
      width: 150,
      align: 'center',
      type: 'custom',
      render: (row) => {
        if (editingId === row.id) {
          return (
            <TextField
              value={editingData.useName}
              onChange={(e) => setEditingData({ ...editingData, useName: e.target.value })}
              size="small"
              fullWidth
            />
          );
        }
        return row.useName;
      }
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
          onChange={() => handleToggleActive(row, 'bank')}
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
              onClick={() => handleDelete(row, 'bank')}
              sx={{ cursor: 'pointer' }}
            />
          </Box>
        );
      }
    }
  ];

  // 필터링된 계좌 데이터
  const filteredAccounts = useMemo(() => {
    if (!safeAccountData || safeAccountData.length === 0) {
      return [];
    }
    
    let result = [...safeAccountData];
    
    if (accountTableHeader.searchText) {
      const searchLower = accountTableHeader.searchText.toLowerCase();
      result = result.filter(account => {
        const typeLabel = account.levelType || account.type || '';
        const settings = accountSettings[account.id] || {};
        const bank = settings.bank || account.bank || '';
        const accountNumber = settings.accountNumber || account.accountNumber || '';
        const accountHolder = settings.accountHolder || account.accountHolder || '';
        
        return bank.toLowerCase().includes(searchLower) ||
          accountNumber.toLowerCase().includes(searchLower) ||
          accountHolder.toLowerCase().includes(searchLower) ||
          typeLabel.toLowerCase().includes(searchLower);
      });
    }
    
    return result;
  }, [safeAccountData, accountTableHeader.searchText, accountSettings]);

  // 필터링된 은행 데이터
  const filteredBanks = useMemo(() => {
    let result = [...bankSettings];
    
    if (bankTableHeader.searchText) {
      const searchLower = bankTableHeader.searchText.toLowerCase();
      result = result.filter(bank =>
        bank.bankName.toLowerCase().includes(searchLower) ||
        bank.useName.toLowerCase().includes(searchLower)
      );
    }
    
    return result;
  }, [bankSettings, bankTableHeader.searchText]);

  // 표시 데이터 (번호 추가)
  const accountDisplayData = useMemo(() => {
    if (!filteredAccounts || filteredAccounts.length === 0) {
      return [];
    }
    
    const displayData = filteredAccounts.map((account, index) => ({
      ...account,
      no: index + 1
    }));
    
    return displayData;
  }, [filteredAccounts]);

  const bankDisplayData = useMemo(() => {
    return filteredBanks.map((bank, index) => ({
      ...bank,
      no: index + 1
    }));
  }, [filteredBanks]);

  return (
    <PageContainer>
      <PageHeader
        title="계좌/은행 설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={handleRefresh}
        sx={{ mb: 2 }}
      />

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        {/* 탭 메뉴 */}
        <Tabs 
          value={currentTab} 
          onChange={(e, newValue) => setCurrentTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        >
          <Tab label="계좌설정" />
          <Tab label="은행설정" />
        </Tabs>

        {/* 계좌설정 탭 */}
        {currentTab === 0 && (
          <>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
            <TableHeader
              title="계좌 관리"
              totalItems={filteredAccounts.length}
              countLabel="총 ##count##개의 계좌"
              searchText={accountTableHeader.searchText}
              handleSearchChange={accountTableHeader.handleSearchChange}
              handleClearSearch={accountTableHeader.handleClearSearch}
              showSearch={true}
              searchPlaceholder="계좌정보 검색..."
              showIndentToggle={false}
              showPageNumberToggle={false}
              showColumnPinToggle={false}
              sx={{ mb: 3 }}
            />

            {/* 버튼 그룹 */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    // 현재 상태는 이미 localStorage에 저장되어 있음
                    showNotification('계좌 정보가 저장되었습니다.');
                  }}
                  color="primary"
                >
                  저장
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (window.confirm('모든 계좌 정보를 초기화하시겠습니까?')) {
                      localStorage.removeItem('accountSettings');
                      setAccountSettings({});
                      showNotification('계좌 정보가 초기화되었습니다.');
                    }
                  }}
                  color="error"
                >
                  초기화
                </Button>
              </Box>
              <Button
                variant="contained"
                startIcon={<AutoIcon />}
                onClick={handleOpenBulkApply}
                color="secondary"
              >
                자동답변 일괄 적용
              </Button>
            </Box>

            {/* 계좌 테이블 */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              {accountDisplayData && accountDisplayData.length > 0 ? (
                <BaseTable
                  columns={accountColumns}
                  data={accountDisplayData}
                  sortConfig={accountTable.sortConfig}
                  onSort={accountTable.handleSort}
                  page={0}
                  rowsPerPage={25}
                  totalCount={accountDisplayData.length}
                  sx={{
                    '& .MuiTableCell-root': {
                      borderBottom: '1px solid',
                      borderColor: 'divider'
                    }
                  }}
                />
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    데이터가 없습니다.
                  </Typography>
                </Box>
              )}
            </Box>
              </>
            )}
          </>
        )}

        {/* 은행설정 탭 */}
        {currentTab === 1 && (
          <>
            <TableHeader
              title="은행 관리"
              totalItems={filteredBanks.length}
              countLabel="총 ##count##개의 은행"
              searchText={bankTableHeader.searchText}
              handleSearchChange={bankTableHeader.handleSearchChange}
              handleClearSearch={bankTableHeader.handleClearSearch}
              showSearch={true}
              searchPlaceholder="은행 검색..."
              showIndentToggle={false}
              showPageNumberToggle={false}
              showColumnPinToggle={false}
              sx={{ mb: 3 }}
            />

            {/* 은행 추가 폼 */}
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
                >
                  은행 추가
                </Button>
              ) : (
                <>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>은행명</InputLabel>
                    <Select
                      value={newBank.bankName}
                      onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                      label="은행명"
                    >
                      {bankList.map(bank => (
                        <MenuItem key={bank} value={bank}>{bank}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    placeholder="00:00~00:30"
                    label="점검시간"
                    value={newBank.maintenanceTime}
                    onChange={(e) => setNewBank({ ...newBank, maintenanceTime: e.target.value })}
                    size="small"
                    sx={{ width: 200 }}
                  />
                  
                  <TextField
                    placeholder="사용명"
                    label="사용명"
                    value={newBank.useName}
                    onChange={(e) => setNewBank({ ...newBank, useName: e.target.value })}
                    size="small"
                    sx={{ width: 150 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={handleAddBank}
                  >
                    추가
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsAdding(false);
                      setNewBank({ bankName: '', maintenanceTime: '00:00~00:30', useName: '' });
                    }}
                  >
                    취소
                  </Button>
                </>
              )}
            </Box>

            {/* 은행 테이블 */}
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden'
              }}
            >
              <BaseTable
                columns={bankColumns}
                data={bankDisplayData}
                sortConfig={bankTable.sortConfig}
                onSort={bankTable.handleSort}
                sx={{
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      {/* 자동답변 편집 다이얼로그 */}
      <Dialog
        open={autoReplyDialog.open}
        onClose={() => setAutoReplyDialog({ open: false, type: null, content: '' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          자동답변 편집 - {safeAccountData.find(a => a.type === autoReplyDialog.type)?.levelType || autoReplyDialog.type}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <QuillEditor
              value={autoReplyDialog.content}
              onChange={(content) => setAutoReplyDialog({ ...autoReplyDialog, content })}
              placeholder="자동답변 내용을 입력하세요..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAutoReplyDialog({ open: false, type: null, content: '' })}>
            취소
          </Button>
          <Button onClick={handleSaveAutoReply} variant="contained">
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 일괄 적용 다이얼로그 */}
      <Dialog
        open={bulkApply.open}
        onClose={() => setBulkApply({ open: false, content: '' })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>자동답변 일괄 적용</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            입력한 내용이 모든 유형의 자동답변에 적용됩니다.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <QuillEditor
              value={bulkApply.content}
              onChange={(content) => setBulkApply({ ...bulkApply, content })}
              placeholder="일괄 적용할 자동답변 내용을 입력하세요..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkApply({ open: false, content: '' })}>
            취소
          </Button>
          <Button onClick={handleSaveBulkApply} variant="contained" color="secondary">
            일괄 적용
          </Button>
        </DialogActions>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, item: null, type: null })}
      >
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteDialog.type === 'bank' && deleteDialog.item && 
              `"${deleteDialog.item.bankName}"을(를) 삭제하시겠습니까?`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            이 작업은 되돌릴 수 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null, type: null })}>
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

export default BankSettingsPage;
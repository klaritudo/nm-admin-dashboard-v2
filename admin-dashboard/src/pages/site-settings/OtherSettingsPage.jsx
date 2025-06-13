import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageHeader, 
  TableHeader
} from '../../components/baseTemplate/components';

/**
 * 기타설정 페이지
 */
const OtherSettingsPage = () => {
  // 입금/출금 금액 설정
  const [amountSettings, setAmountSettings] = useState({
    depositMin: 10000,
    depositMax: 10000000,
    withdrawalMin: 10000,
    withdrawalMax: 5000000,
    rollingMin: 100000,
    rollingMax: 10000000
  });

  // API 모듈 설정
  const [apiModules, setApiModules] = useState({
    slotApi: true,
    casinoApi: true,
    sportsApi: false,
    lotteryApi: false,
    virtualApi: false
  });

  // 알림음 설정 - 회원 관련
  const [memberNotifications, setMemberNotifications] = useState({
    registration: { enabled: true, soundFile: null, interval: 5 },
    depositInquiry: { enabled: true, soundFile: null, interval: 3 },
    withdrawalInquiry: { enabled: true, soundFile: null, interval: 3 },
    customerService: { enabled: true, soundFile: null, interval: 10 },
    agentInquiry: { enabled: true, soundFile: null, interval: 5 }
  });

  // 알림음 설정 - 하부에이전트 관리자
  const [agentNotifications, setAgentNotifications] = useState({
    inquiry: { enabled: true, soundFile: null, interval: 5 },
    message: { enabled: true, soundFile: null, interval: 2 },
    notice: { enabled: true, soundFile: null, interval: 10 }
  });

  // 알림음 설정 - 유저페이지
  const [userPageNotifications, setUserPageNotifications] = useState({
    inquiry: { enabled: true, soundFile: null, interval: 5 },
    notice: { enabled: true, soundFile: null, interval: 15 }
  });



  // 알림 상태
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 페이지 초기화
  useEffect(() => {
    // localStorage에서 설정 불러오기
    const savedSettings = localStorage.getItem('otherSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.amountSettings) setAmountSettings(settings.amountSettings);
        if (settings.apiModules) setApiModules(settings.apiModules);
        if (settings.memberNotifications) setMemberNotifications(settings.memberNotifications);
        if (settings.agentNotifications) setAgentNotifications(settings.agentNotifications);
        if (settings.userPageNotifications) setUserPageNotifications(settings.userPageNotifications);

      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    }
  }, []);

  // 알림 표시
  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  // 금액 설정 변경
  const handleAmountChange = useCallback((field, value) => {
    const numValue = parseInt(value) || 0;
    setAmountSettings(prev => ({
      ...prev,
      [field]: numValue
    }));
  }, []);

  // API 모듈 토글
  const handleApiToggle = useCallback((module) => {
    setApiModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  }, []);

  // 알림음 토글
  const handleNotificationToggle = useCallback((category, type) => {
    const setters = {
      member: setMemberNotifications,
      agent: setAgentNotifications,
      userPage: setUserPageNotifications
    };
    
    const setter = setters[category];
    if (setter) {
      setter(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          enabled: !prev[type].enabled
        }
      }));
    }
  }, []);

  // 알림음 파일 업로드
  const handleSoundUpload = useCallback((category, type, file) => {
    if (!file) return;
    
    const setters = {
      member: setMemberNotifications,
      agent: setAgentNotifications,
      userPage: setUserPageNotifications
    };
    
    const setter = setters[category];
    if (setter) {
      setter(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          soundFile: file.name
        }
      }));
      showNotification(`${file.name} 알림음이 업로드되었습니다.`);
    }
  }, [showNotification]);

  // 알림 간격 변경
  const handleIntervalChange = useCallback((category, type, interval) => {
    const numValue = parseInt(interval) || 1;
    const setters = {
      member: setMemberNotifications,
      agent: setAgentNotifications,
      userPage: setUserPageNotifications
    };
    
    const setter = setters[category];
    if (setter) {
      setter(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          interval: numValue
        }
      }));
    }
  }, []);



  // 저장
  const handleSave = useCallback(() => {
    try {
      const settings = {
        amountSettings,
        apiModules,
        memberNotifications,
        agentNotifications,
        userPageNotifications
      };
      
      localStorage.setItem('otherSettings', JSON.stringify(settings));
      showNotification('설정이 저장되었습니다.');
    } catch (error) {
      console.error('설정 저장 실패:', error);
      showNotification('설정 저장에 실패했습니다.', 'error');
    }
  }, [amountSettings, apiModules, memberNotifications, agentNotifications, userPageNotifications, showNotification]);

  // 새로고침
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // 알림음 설정 렌더링 함수
  const renderNotificationSetting = (label, category, type, enabled, soundFile, interval) => (
    <Grid item xs={12} sm={6} md={4} key={`${category}-${type}`}>
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" fontWeight="medium">
              {label}
            </Typography>
            <Switch
              checked={enabled}
              onChange={() => handleNotificationToggle(category, type)}
              size="small"
            />
          </Box>
          
          {/* 알림 간격 설정 */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="알림 간격"
              type="number"
              value={interval}
              onChange={(e) => handleIntervalChange(category, type, e.target.value)}
              disabled={!enabled}
              InputProps={{
                endAdornment: <InputAdornment position="end">초</InputAdornment>,
                inputProps: { min: 1, max: 300 }
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: '0.875rem'
                }
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<UploadIcon />}
              component="label"
              disabled={!enabled}
              sx={{ flexGrow: 1 }}
            >
              {soundFile ? '변경' : '업로드'}
              <input
                type="file"
                accept="audio/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleSoundUpload(category, type, file);
                  }
                }}
              />
            </Button>
            
            <IconButton
              size="small"
              disabled={!enabled || !soundFile}
              title="재생"
            >
              {enabled && soundFile ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Box>
          
          {soundFile && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {soundFile}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <PageContainer>
      <PageHeader
        title="기타설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={handleRefresh}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 입금/출금 금액 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="입금/출금 금액 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최소 입금 금액"
                type="number"
                value={amountSettings.depositMin}
                onChange={(e) => handleAmountChange('depositMin', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최대 입금 금액"
                type="number"
                value={amountSettings.depositMax}
                onChange={(e) => handleAmountChange('depositMax', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최소 출금 금액"
                type="number"
                value={amountSettings.withdrawalMin}
                onChange={(e) => handleAmountChange('withdrawalMin', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최대 출금 금액"
                type="number"
                value={amountSettings.withdrawalMax}
                onChange={(e) => handleAmountChange('withdrawalMax', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* 롤링금전환 금액 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="롤링금전환 금액 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최소 롤링금전환 금액"
                type="number"
                value={amountSettings.rollingMin}
                onChange={(e) => handleAmountChange('rollingMin', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최대 롤링금전환 금액"
                type="number"
                value={amountSettings.rollingMax}
                onChange={(e) => handleAmountChange('rollingMax', e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* API 모듈 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="API 모듈 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={2}>
            {Object.entries(apiModules).map(([module, enabled]) => {
              const labels = {
                slotApi: '슬롯 API',
                casinoApi: '카지노 API',
                sportsApi: '스포츠 API',
                lotteryApi: '복권 API',
                virtualApi: '가상게임 API'
              };
              
              return (
                <Grid item xs={12} sm={6} md={4} key={module}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="medium">
                          {labels[module]}
                        </Typography>
                        <Switch
                          checked={enabled}
                          onChange={() => handleApiToggle(module)}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* 회원 관련 알림음 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="회원 관련 알림음 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={2}>
            {renderNotificationSetting('회원가입', 'member', 'registration', memberNotifications.registration.enabled, memberNotifications.registration.soundFile, memberNotifications.registration.interval)}
            {renderNotificationSetting('입금문의', 'member', 'depositInquiry', memberNotifications.depositInquiry.enabled, memberNotifications.depositInquiry.soundFile, memberNotifications.depositInquiry.interval)}
            {renderNotificationSetting('출금문의', 'member', 'withdrawalInquiry', memberNotifications.withdrawalInquiry.enabled, memberNotifications.withdrawalInquiry.soundFile, memberNotifications.withdrawalInquiry.interval)}
            {renderNotificationSetting('고객센터', 'member', 'customerService', memberNotifications.customerService.enabled, memberNotifications.customerService.soundFile, memberNotifications.customerService.interval)}
            {renderNotificationSetting('에이전트문의', 'member', 'agentInquiry', memberNotifications.agentInquiry.enabled, memberNotifications.agentInquiry.soundFile, memberNotifications.agentInquiry.interval)}
          </Grid>
        </Paper>

        {/* 하부에이전트 관리자 알림음 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="하부에이전트 관리자 알림음 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={2}>
            {renderNotificationSetting('문의', 'agent', 'inquiry', agentNotifications.inquiry.enabled, agentNotifications.inquiry.soundFile, agentNotifications.inquiry.interval)}
            {renderNotificationSetting('쪽지', 'agent', 'message', agentNotifications.message.enabled, agentNotifications.message.soundFile, agentNotifications.message.interval)}
            {renderNotificationSetting('공지', 'agent', 'notice', agentNotifications.notice.enabled, agentNotifications.notice.soundFile, agentNotifications.notice.interval)}
          </Grid>
        </Paper>

        {/* 유저페이지 알림음 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="유저페이지 알림음 설정"
            showSearch={false}
            showIndentToggle={false}
            showPageNumberToggle={false}
            showColumnPinToggle={false}
            sx={{ mb: 3 }}
          />
          
          <Grid container spacing={2}>
            {renderNotificationSetting('문의', 'userPage', 'inquiry', userPageNotifications.inquiry.enabled, userPageNotifications.inquiry.soundFile, userPageNotifications.inquiry.interval)}
            {renderNotificationSetting('공지사항', 'userPage', 'notice', userPageNotifications.notice.enabled, userPageNotifications.notice.soundFile, userPageNotifications.notice.interval)}
          </Grid>
        </Paper>



        {/* 저장 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ minWidth: 200 }}
          >
            설정 저장
          </Button>
        </Box>
      </Box>

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

export default OtherSettingsPage; 
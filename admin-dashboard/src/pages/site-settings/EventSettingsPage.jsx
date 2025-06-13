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
  Grid,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageHeader, 
  TableHeader
} from '../../components/baseTemplate/components';

/**
 * 이벤트설정 페이지
 */
const EventSettingsPage = () => {
  // 쿠폰 입력 필드 설정
  const [couponSettings, setCouponSettings] = useState({
    enabled: true,
    placeholder: '쿠폰 코드를 입력하세요',
    buttonText: '쿠폰 사용',
    successMessage: '쿠폰이 성공적으로 적용되었습니다',
    errorMessage: '유효하지 않은 쿠폰 코드입니다',
    maxLength: 20
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
    const savedSettings = localStorage.getItem('eventSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.couponSettings) setCouponSettings(settings.couponSettings);
      } catch (error) {
        console.error('이벤트 설정 로드 실패:', error);
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

  // 쿠폰 설정 변경
  const handleCouponChange = useCallback((field, value) => {
    setCouponSettings(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 저장
  const handleSave = useCallback(() => {
    try {
      const settings = {
        couponSettings
      };
      
      localStorage.setItem('eventSettings', JSON.stringify(settings));
      showNotification('이벤트 설정이 저장되었습니다.');
    } catch (error) {
      console.error('이벤트 설정 저장 실패:', error);
      showNotification('이벤트 설정 저장에 실패했습니다.', 'error');
    }
  }, [couponSettings, showNotification]);

  // 새로고침
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="이벤트설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={handleRefresh}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* 쿠폰입력 필드 설정 */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <TableHeader
            title="쿠폰입력 필드 설정"
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
                label="쿠폰 코드 입력 플레이스홀더"
                value={couponSettings.placeholder}
                onChange={(e) => handleCouponChange('placeholder', e.target.value)}
                placeholder="쿠폰 코드를 입력하세요"
                helperText="사용자에게 표시될 입력 안내 텍스트"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="버튼 텍스트"
                value={couponSettings.buttonText}
                onChange={(e) => handleCouponChange('buttonText', e.target.value)}
                placeholder="쿠폰 사용"
                helperText="쿠폰 적용 버튼에 표시될 텍스트"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="성공 메시지"
                value={couponSettings.successMessage}
                onChange={(e) => handleCouponChange('successMessage', e.target.value)}
                placeholder="쿠폰이 성공적으로 적용되었습니다"
                helperText="쿠폰 적용 성공 시 표시될 메시지"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="실패 메시지"
                value={couponSettings.errorMessage}
                onChange={(e) => handleCouponChange('errorMessage', e.target.value)}
                placeholder="유효하지 않은 쿠폰 코드입니다"
                helperText="쿠폰 적용 실패 시 표시될 메시지"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="최대 입력 길이"
                type="number"
                value={couponSettings.maxLength}
                onChange={(e) => handleCouponChange('maxLength', parseInt(e.target.value) || 1)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">자</InputAdornment>,
                  inputProps: { min: 1, max: 50 }
                }}
                helperText="쿠폰 코드 입력 가능한 최대 길이 (1-50자)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    쿠폰 입력 필드 활성화
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    쿠폰 기능 사용 여부를 설정합니다
                  </Typography>
                </Box>
                <Switch
                  checked={couponSettings.enabled}
                  onChange={(e) => handleCouponChange('enabled', e.target.checked)}
                  color="primary"
                />
              </Box>
            </Grid>
          </Grid>

          {/* 미리보기 섹션 */}
          <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
              미리보기
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, maxWidth: 400 }}>
              <TextField
                size="small"
                placeholder={couponSettings.placeholder}
                disabled={!couponSettings.enabled}
                inputProps={{ maxLength: couponSettings.maxLength }}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={!couponSettings.enabled}
                sx={{ minWidth: 100 }}
              >
                {couponSettings.buttonText}
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="success.main" sx={{ display: 'block', mb: 0.5 }}>
                ✓ {couponSettings.successMessage}
              </Typography>
              <Typography variant="caption" color="error.main" sx={{ display: 'block' }}>
                ✗ {couponSettings.errorMessage}
              </Typography>
            </Box>
          </Box>
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

export default EventSettingsPage; 
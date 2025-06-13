import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Stack,
  Slider
} from '@mui/material';
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  ColorLens as ColorIcon,
  Image as ImageIcon,
  LocationOn as LocationIcon,
  AspectRatio as SizeIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { 
  PageContainer, 
  PageHeader,
  TableHeader
} from '../../components/baseTemplate/components';
import QuillEditor from '../../components/common/QuillEditor';

/**
 * 점검설정 페이지
 */
const MaintenancePage = () => {
  // 점검 설정 상태
  const [maintenanceSettings, setMaintenanceSettings] = useState(() => {
    const saved = localStorage.getItem('maintenanceSettings');
    return saved ? JSON.parse(saved) : {
      target: 'none', // none, all, admin, member
      backgroundColor: '#1a1a1a',
      backgroundImage: null,
      mainLogo: null,
      mainLogoPosition: { x: 50, y: 20 }, // 백분율
      mainLogoSize: 200, // px
      mainText: '<h1 style="text-align: center; color: #ffffff;">시스템 점검 중입니다</h1><p style="text-align: center; color: #cccccc;">더 나은 서비스 제공을 위해 시스템 점검을 진행하고 있습니다.<br>점검이 완료되는 대로 정상 서비스하겠습니다.</p>',
      footerLogo: null,
      footerText: '© 2024 Your Company. All rights reserved.',
      socialLinks: [
        { platform: 'facebook', icon: null, url: '' },
        { platform: 'twitter', icon: null, url: '' },
        { platform: 'instagram', icon: null, url: '' },
        { platform: 'youtube', icon: null, url: '' }
      ]
    };
  });

  // 알림 상태
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // 미리보기 다이얼로그 상태
  const [previewOpen, setPreviewOpen] = useState(false);

  // 설정 저장
  const saveSettings = useCallback(() => {
    localStorage.setItem('maintenanceSettings', JSON.stringify(maintenanceSettings));
    setNotification({
      open: true,
      message: '점검 설정이 저장되었습니다.',
      severity: 'success'
    });
  }, [maintenanceSettings]);

  // 설정 업데이트
  const updateSettings = useCallback((field, value) => {
    setMaintenanceSettings(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback((field, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateSettings(field, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }, [updateSettings]);

  // 로고 위치 업데이트
  const updateLogoPosition = useCallback((axis, value) => {
    setMaintenanceSettings(prev => ({
      ...prev,
      mainLogoPosition: {
        ...prev.mainLogoPosition,
        [axis]: value
      }
    }));
  }, []);

  // SNS 링크 업데이트
  const updateSocialLink = useCallback((index, field, value) => {
    setMaintenanceSettings(prev => {
      const newLinks = [...prev.socialLinks];
      if (field === 'icon' && value) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newLinks[index].icon = e.target.result;
          setMaintenanceSettings(prevState => ({
            ...prevState,
            socialLinks: newLinks
          }));
        };
        reader.readAsDataURL(value);
      } else {
        newLinks[index][field] = value;
        return {
          ...prev,
          socialLinks: newLinks
        };
      }
      return prev;
    });
  }, []);

  // 미리보기 렌더링
  const renderPreview = useMemo(() => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          backgroundColor: maintenanceSettings.backgroundColor,
          backgroundImage: maintenanceSettings.backgroundImage ? `url(${maintenanceSettings.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 메인 로고 */}
        {maintenanceSettings.mainLogo && (
          <Box
            sx={{
              position: 'absolute',
              left: `${maintenanceSettings.mainLogoPosition.x}%`,
              top: `${maintenanceSettings.mainLogoPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: maintenanceSettings.mainLogoSize,
              height: 'auto'
            }}
          >
            <img 
              src={maintenanceSettings.mainLogo} 
              alt="Logo" 
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
        )}

        {/* 메인 텍스트 */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4
          }}
        >
          <Box
            dangerouslySetInnerHTML={{ __html: maintenanceSettings.mainText }}
            sx={{
              maxWidth: '800px',
              '& h1': { mb: 2 },
              '& p': { mb: 1 }
            }}
          />
        </Box>

        {/* 푸터 */}
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          {maintenanceSettings.footerLogo && (
            <Box sx={{ mb: 2 }}>
              <img 
                src={maintenanceSettings.footerLogo} 
                alt="Footer Logo" 
                style={{ height: '40px' }}
              />
            </Box>
          )}
          
          {/* SNS 아이콘 */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            {maintenanceSettings.socialLinks.map((link, index) => (
              link.icon && link.url && (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={link.icon} 
                    alt={link.platform} 
                    style={{ width: '30px', height: '30px' }}
                  />
                </a>
              )
            ))}
          </Box>

          <Typography variant="body2" sx={{ color: '#ccc' }}>
            {maintenanceSettings.footerText}
          </Typography>
        </Box>
      </Box>
    );
  }, [maintenanceSettings]);

  return (
    <PageContainer>
      <PageHeader
        title="점검설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={() => window.location.reload()}
        sx={{ mb: 2 }}
      />

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <TableHeader
          title="점검 페이지 설정"
          totalItems={0}
          showSearch={false}
          showIndentToggle={false}
          showPageNumberToggle={false}
          showColumnPinToggle={false}
          sx={{ mb: 3 }}
        />

        <Grid container spacing={3}>
          {/* 점검 대상 선택 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  점검 대상
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>점검 대상 선택</InputLabel>
                  <Select
                    value={maintenanceSettings.target}
                    onChange={(e) => updateSettings('target', e.target.value)}
                    label="점검 대상 선택"
                  >
                    <MenuItem value="none">점검 안함</MenuItem>
                    <MenuItem value="all">전체 (관리자 + 회원페이지)</MenuItem>
                    <MenuItem value="admin">관리자 페이지만</MenuItem>
                    <MenuItem value="member">회원 페이지만</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>

          {/* 배경 설정 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  배경 설정
                </Typography>
                
                {/* 배경색 */}
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="배경색"
                    value={maintenanceSettings.backgroundColor}
                    onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <input
                            type="color"
                            value={maintenanceSettings.backgroundColor}
                            onChange={(e) => updateSettings('backgroundColor', e.target.value)}
                            style={{ 
                              width: 30, 
                              height: 30, 
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer'
                            }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>

                {/* 배경 이미지 */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    배경 이미지
                  </Typography>
                  {maintenanceSettings.backgroundImage ? (
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <img 
                        src={maintenanceSettings.backgroundImage} 
                        alt="Background" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover',
                          borderRadius: 8
                        }}
                      />
                      <IconButton
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                          }
                        }}
                        onClick={() => updateSettings('backgroundImage', null)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                      sx={{ mt: 1 }}
                    >
                      배경 이미지 업로드
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*"
                        onChange={(e) => handleFileUpload('backgroundImage', e)}
                      />
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 메인 로고 설정 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  메인 로고 설정
                </Typography>

                {/* 로고 업로드 */}
                {maintenanceSettings.mainLogo ? (
                  <Box sx={{ position: 'relative', mt: 2 }}>
                    <img 
                      src={maintenanceSettings.mainLogo} 
                      alt="Main Logo" 
                      style={{ 
                        width: '100%', 
                        maxHeight: '150px', 
                        objectFit: 'contain',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 8,
                        padding: 16
                      }}
                    />
                    <IconButton
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }
                      }}
                      onClick={() => updateSettings('mainLogo', null)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    로고 업로드
                    <input 
                      type="file" 
                      hidden 
                      accept="image/*"
                      onChange={(e) => handleFileUpload('mainLogo', e)}
                    />
                  </Button>
                )}

                {/* 위치 조정 */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    위치 조정
                  </Typography>
                  <Box sx={{ px: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ width: 80 }}>가로: {maintenanceSettings.mainLogoPosition.x}%</Typography>
                      <Slider
                        value={maintenanceSettings.mainLogoPosition.x}
                        onChange={(e, value) => updateLogoPosition('x', value)}
                        min={0}
                        max={100}
                        sx={{ ml: 2 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ width: 80 }}>세로: {maintenanceSettings.mainLogoPosition.y}%</Typography>
                      <Slider
                        value={maintenanceSettings.mainLogoPosition.y}
                        onChange={(e, value) => updateLogoPosition('y', value)}
                        min={0}
                        max={100}
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* 크기 조정 */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    크기 조정
                  </Typography>
                  <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ width: 80 }}>크기: {maintenanceSettings.mainLogoSize}px</Typography>
                    <Slider
                      value={maintenanceSettings.mainLogoSize}
                      onChange={(e, value) => updateSettings('mainLogoSize', value)}
                      min={50}
                      max={500}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 메인 안내 텍스트 */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  메인 안내 텍스트
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <QuillEditor
                    value={maintenanceSettings.mainText}
                    onChange={(content) => updateSettings('mainText', content)}
                    placeholder="점검 안내 메시지를 입력하세요..."
                    label=""
                    height={400}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 푸터 설정 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  푸터 설정
                </Typography>

                {/* 푸터 로고 */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    푸터 로고
                  </Typography>
                  {maintenanceSettings.footerLogo ? (
                    <Box sx={{ position: 'relative', mt: 1 }}>
                      <img 
                        src={maintenanceSettings.footerLogo} 
                        alt="Footer Logo" 
                        style={{ 
                          height: '60px',
                          backgroundColor: '#f5f5f5',
                          borderRadius: 8,
                          padding: 8
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => updateSettings('footerLogo', null)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      로고 업로드
                      <input 
                        type="file" 
                        hidden 
                        accept="image/*"
                        onChange={(e) => handleFileUpload('footerLogo', e)}
                      />
                    </Button>
                  )}
                </Box>

                {/* 푸터 텍스트 */}
                <TextField
                  label="푸터 텍스트"
                  value={maintenanceSettings.footerText}
                  onChange={(e) => updateSettings('footerText', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ mt: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* SNS 설정 */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  SNS 설정
                </Typography>

                <Stack spacing={2} sx={{ mt: 2 }}>
                  {maintenanceSettings.socialLinks.map((link, index) => (
                    <Box key={index}>
                      <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                        {link.platform}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {link.icon ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <img 
                              src={link.icon} 
                              alt={link.platform} 
                              style={{ width: 30, height: 30 }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => updateSocialLink(index, 'icon', null)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Button
                            variant="outlined"
                            component="label"
                            size="small"
                          >
                            아이콘
                            <input 
                              type="file" 
                              hidden 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  updateSocialLink(index, 'icon', file);
                                }
                              }}
                            />
                          </Button>
                        )}
                        <TextField
                          placeholder={`${link.platform} URL`}
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* 액션 버튼 */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={() => setPreviewOpen(true)}
              >
                미리보기
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={saveSettings}
              >
                저장
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 미리보기 다이얼로그 */}
      {previewOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
          }}
          onClick={() => setPreviewOpen(false)}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10000,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
            onClick={() => setPreviewOpen(false)}
          >
            <DeleteIcon />
          </IconButton>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              height: '90%',
              backgroundColor: 'white',
              borderRadius: 2,
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderPreview}
          </Box>
        </Box>
      )}

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

export default MaintenancePage;
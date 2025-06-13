import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Snackbar,
  Alert,
  useTheme,
  Stack,
  Divider,
  Tooltip,
  Tabs,
  Tab,
  InputAdornment
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ImageIcon from '@mui/icons-material/Image';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import { PageContainer, PageHeader } from '../../components/baseTemplate/components';

/**
 * 디자인설정 페이지
 * 관리자 및 유저페이지의 로고, 슬라이드, 백그라운드 등을 관리
 */
const DesignSettingsPage = () => {
  const theme = useTheme();
  
  // 현재 선택된 디자인 탭
  const [currentDesignTab, setCurrentDesignTab] = useState(0);
  
  // 알림 상태
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // 각 디자인별 설정 상태 (5개 디자인)
  const [designs, setDesigns] = useState([
    {
      id: 1,
      name: '디자인1',
      adminLogo: { file: null, preview: null, width: 200, height: 60 },
      userLogos: {
        main: { file: null, preview: null, width: 180, height: 50 },
        footer: { file: null, preview: null, width: 150, height: 40 }
      },
      mainSlides: [
        { id: 1, file: null, preview: null, title: '슬라이드 1' },
        { id: 2, file: null, preview: null, title: '슬라이드 2' },
        { id: 3, file: null, preview: null, title: '슬라이드 3' }
      ],
      backgroundSettings: {
        type: 'color',
        color: '#f5f5f5',
        image: { file: null, preview: null }
      },
      snsSettings: {
        facebook: { icon: null, preview: null, url: '' },
        twitter: { icon: null, preview: null, url: '' },
        instagram: { icon: null, preview: null, url: '' },
        youtube: { icon: null, preview: null, url: '' },
        telegram: { icon: null, preview: null, url: '' },
        kakao: { icon: null, preview: null, url: '' }
      }
    },
    {
      id: 2,
      name: '디자인2',
      adminLogo: { file: null, preview: null, width: 200, height: 60 },
      userLogos: {
        main: { file: null, preview: null, width: 180, height: 50 },
        footer: { file: null, preview: null, width: 150, height: 40 }
      },
      mainSlides: [
        { id: 1, file: null, preview: null, title: '슬라이드 1' },
        { id: 2, file: null, preview: null, title: '슬라이드 2' },
        { id: 3, file: null, preview: null, title: '슬라이드 3' }
      ],
      backgroundSettings: {
        type: 'color',
        color: '#f5f5f5',
        image: { file: null, preview: null }
      },
      snsSettings: {
        facebook: { icon: null, preview: null, url: '' },
        twitter: { icon: null, preview: null, url: '' },
        instagram: { icon: null, preview: null, url: '' },
        youtube: { icon: null, preview: null, url: '' },
        telegram: { icon: null, preview: null, url: '' },
        kakao: { icon: null, preview: null, url: '' }
      }
    },
    {
      id: 3,
      name: '디자인3',
      adminLogo: { file: null, preview: null, width: 200, height: 60 },
      userLogos: {
        main: { file: null, preview: null, width: 180, height: 50 },
        footer: { file: null, preview: null, width: 150, height: 40 }
      },
      mainSlides: [
        { id: 1, file: null, preview: null, title: '슬라이드 1' },
        { id: 2, file: null, preview: null, title: '슬라이드 2' },
        { id: 3, file: null, preview: null, title: '슬라이드 3' }
      ],
      backgroundSettings: {
        type: 'color',
        color: '#f5f5f5',
        image: { file: null, preview: null }
      },
      snsSettings: {
        facebook: { icon: null, preview: null, url: '' },
        twitter: { icon: null, preview: null, url: '' },
        instagram: { icon: null, preview: null, url: '' },
        youtube: { icon: null, preview: null, url: '' },
        telegram: { icon: null, preview: null, url: '' },
        kakao: { icon: null, preview: null, url: '' }
      }
    },
    {
      id: 4,
      name: '디자인4',
      adminLogo: { file: null, preview: null, width: 200, height: 60 },
      userLogos: {
        main: { file: null, preview: null, width: 180, height: 50 },
        footer: { file: null, preview: null, width: 150, height: 40 }
      },
      mainSlides: [
        { id: 1, file: null, preview: null, title: '슬라이드 1' },
        { id: 2, file: null, preview: null, title: '슬라이드 2' },
        { id: 3, file: null, preview: null, title: '슬라이드 3' }
      ],
      backgroundSettings: {
        type: 'color',
        color: '#f5f5f5',
        image: { file: null, preview: null }
      },
      snsSettings: {
        facebook: { icon: null, preview: null, url: '' },
        twitter: { icon: null, preview: null, url: '' },
        instagram: { icon: null, preview: null, url: '' },
        youtube: { icon: null, preview: null, url: '' },
        telegram: { icon: null, preview: null, url: '' },
        kakao: { icon: null, preview: null, url: '' }
      }
    },
    {
      id: 5,
      name: '디자인5',
      adminLogo: { file: null, preview: null, width: 200, height: 60 },
      userLogos: {
        main: { file: null, preview: null, width: 180, height: 50 },
        footer: { file: null, preview: null, width: 150, height: 40 }
      },
      mainSlides: [
        { id: 1, file: null, preview: null, title: '슬라이드 1' },
        { id: 2, file: null, preview: null, title: '슬라이드 2' },
        { id: 3, file: null, preview: null, title: '슬라이드 3' }
      ],
      backgroundSettings: {
        type: 'color',
        color: '#f5f5f5',
        image: { file: null, preview: null }
      },
      snsSettings: {
        facebook: { icon: null, preview: null, url: '' },
        twitter: { icon: null, preview: null, url: '' },
        instagram: { icon: null, preview: null, url: '' },
        youtube: { icon: null, preview: null, url: '' },
        telegram: { icon: null, preview: null, url: '' },
        kakao: { icon: null, preview: null, url: '' }
      }
    }
  ]);
  
  // 현재 선택된 디자인 가져오기
  const currentDesign = designs[currentDesignTab];
  
  // 파일 입력 참조
  const adminLogoInputRef = useRef(null);
  const userMainLogoInputRef = useRef(null);
  const userFooterLogoInputRef = useRef(null);
  const slideInputRefs = useRef({});
  const backgroundImageInputRef = useRef(null);
  const snsInputRefs = useRef({});
  
  // 알림 표시
  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };
  
  // 새로고침 핸들러
  const handleRefresh = useCallback(() => {
    showNotification(`${currentDesign.name}의 설정을 새로고침했습니다.`);
  }, [currentDesign]);
  
  // 디자인별로 상태 업데이트하는 헬퍼 함수
  const updateCurrentDesign = (updates) => {
    setDesigns(prev => prev.map((design, index) => 
      index === currentDesignTab ? { ...design, ...updates } : design
    ));
  };
  
  // 파일 업로드 핸들러
  const handleFileUpload = useCallback((event, type, slideId = null) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // 파일 타입 검증
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      showNotification('JPG, PNG, GIF, SVG 파일만 업로드 가능합니다.', 'error');
      return;
    }
    
    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('파일 크기는 5MB 이하여야 합니다.', 'error');
      return;
    }
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result;
      
      switch (type) {
        case 'adminLogo':
          updateCurrentDesign({
            adminLogo: { ...currentDesign.adminLogo, file, preview }
          });
          showNotification('관리자 로고가 업로드되었습니다.');
          break;
          
        case 'userMainLogo':
          updateCurrentDesign({
            userLogos: {
              ...currentDesign.userLogos,
              main: { ...currentDesign.userLogos.main, file, preview }
            }
          });
          showNotification('유저페이지 메인 로고가 업로드되었습니다.');
          break;
          
        case 'userFooterLogo':
          updateCurrentDesign({
            userLogos: {
              ...currentDesign.userLogos,
              footer: { ...currentDesign.userLogos.footer, file, preview }
            }
          });
          showNotification('유저페이지 푸터 로고가 업로드되었습니다.');
          break;
          
        case 'slide':
          updateCurrentDesign({
            mainSlides: currentDesign.mainSlides.map(slide => 
              slide.id === slideId 
                ? { ...slide, file, preview }
                : slide
            )
          });
          showNotification(`${currentDesign.mainSlides.find(s => s.id === slideId)?.title}이 업로드되었습니다.`);
          break;
          
        case 'background':
          updateCurrentDesign({
            backgroundSettings: {
              ...currentDesign.backgroundSettings,
              image: { file, preview }
            }
          });
          showNotification('백그라운드 이미지가 업로드되었습니다.');
          break;
          
        case 'sns':
          const platform = slideId; // slideId를 platform으로 사용
          updateCurrentDesign({
            snsSettings: {
              ...currentDesign.snsSettings,
              [platform]: { 
                ...currentDesign.snsSettings[platform], 
                file, 
                preview 
              }
            }
          });
          showNotification(`${platform} 아이콘이 업로드되었습니다.`);
          break;
          
        default:
          break;
      }
    };
    
    reader.readAsDataURL(file);
  }, [currentDesign, updateCurrentDesign]);
  
  // 파일 삭제 핸들러
  const handleFileDelete = useCallback((type, slideId = null) => {
    switch (type) {
      case 'adminLogo':
        updateCurrentDesign({
          adminLogo: { ...currentDesign.adminLogo, file: null, preview: null }
        });
        showNotification('관리자 로고가 삭제되었습니다.');
        break;
        
      case 'userMainLogo':
        updateCurrentDesign({
          userLogos: {
            ...currentDesign.userLogos,
            main: { ...currentDesign.userLogos.main, file: null, preview: null }
          }
        });
        showNotification('유저페이지 메인 로고가 삭제되었습니다.');
        break;
        
      case 'userFooterLogo':
        updateCurrentDesign({
          userLogos: {
            ...currentDesign.userLogos,
            footer: { ...currentDesign.userLogos.footer, file: null, preview: null }
          }
        });
        showNotification('유저페이지 푸터 로고가 삭제되었습니다.');
        break;
        
      case 'slide':
        updateCurrentDesign({
          mainSlides: currentDesign.mainSlides.map(slide => 
            slide.id === slideId 
              ? { ...slide, file: null, preview: null }
              : slide
          )
        });
        showNotification(`슬라이드가 삭제되었습니다.`);
        break;
        
      case 'background':
        updateCurrentDesign({
          backgroundSettings: {
            ...currentDesign.backgroundSettings,
            image: { file: null, preview: null }
          }
        });
        showNotification('백그라운드 이미지가 삭제되었습니다.');
        break;
        
      case 'sns':
        const platform = slideId; // slideId를 platform으로 사용
        updateCurrentDesign({
          snsSettings: {
            ...currentDesign.snsSettings,
            [platform]: { 
              ...currentDesign.snsSettings[platform], 
              file: null, 
              preview: null 
            }
          }
        });
        showNotification(`${platform} 아이콘이 삭제되었습니다.`);
        break;
        
      default:
        break;
    }
  }, [currentDesign, updateCurrentDesign]);
  
  // 크기 조정 핸들러 (슬라이더 드래그 중 스크롤 방지)
  const handleSizeChange = useCallback((type, dimension, value) => {
    setDesigns(prev => {
      const newDesigns = [...prev];
      const design = newDesigns[currentDesignTab];
      
      switch (type) {
        case 'adminLogo':
          design.adminLogo = { ...design.adminLogo, [dimension]: value };
          break;
          
        case 'userMainLogo':
          design.userLogos.main = { ...design.userLogos.main, [dimension]: value };
          break;
          
        case 'userFooterLogo':
          design.userLogos.footer = { ...design.userLogos.footer, [dimension]: value };
          break;
      }
      
      return newDesigns;
    });
  }, [currentDesignTab]);
  
  
  // SNS URL 업데이트 핸들러
  const handleSnsUrlChange = useCallback((platform, url) => {
    updateCurrentDesign({
      snsSettings: {
        ...currentDesign.snsSettings,
        [platform]: {
          ...currentDesign.snsSettings[platform],
          url
        }
      }
    });
  }, [currentDesign, updateCurrentDesign]);
  
  // 저장 핸들러
  const handleSave = useCallback(() => {
    // 실제로는 API 호출하여 저장
    console.log('저장할 데이터:', designs[currentDesignTab]);
    
    showNotification(`${currentDesign.name} 설정이 저장되었습니다.`);
  }, [designs, currentDesignTab, currentDesign]);
  
  // 초기화 핸들러
  const handleReset = useCallback(() => {
    if (window.confirm(`${currentDesign.name} 설정을 초기화하시겠습니까?`)) {
      updateCurrentDesign({
        adminLogo: { file: null, preview: null, width: 200, height: 60 },
        userLogos: {
          main: { file: null, preview: null, width: 180, height: 50 },
          footer: { file: null, preview: null, width: 150, height: 40 }
        },
        mainSlides: [
          { id: 1, file: null, preview: null, title: '슬라이드 1' },
          { id: 2, file: null, preview: null, title: '슬라이드 2' },
          { id: 3, file: null, preview: null, title: '슬라이드 3' }
        ],
        backgroundSettings: {
          type: 'color',
          color: '#f5f5f5',
          image: { file: null, preview: null }
        },
        snsSettings: {
          facebook: { icon: null, preview: null, url: '' },
          twitter: { icon: null, preview: null, url: '' },
          instagram: { icon: null, preview: null, url: '' },
          youtube: { icon: null, preview: null, url: '' },
          telegram: { icon: null, preview: null, url: '' },
          kakao: { icon: null, preview: null, url: '' }
        }
      });
      
      showNotification(`${currentDesign.name} 설정이 초기화되었습니다.`);
    }
  }, [currentDesign, updateCurrentDesign]);
  
  // 로고 업로드 카드 컴포넌트
  const LogoUploadCard = ({ title, logo, type, inputRef, onUpload, onDelete, onSizeChange }) => {
    // 입력 필드 핸들러
    const handleInputChange = (dimension) => (e) => {
      const value = e.target.value;
      if (value === '') {
        onSizeChange(type, dimension, 0);
      } else {
        const numValue = parseInt(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 2000) {
          onSizeChange(type, dimension, numValue);
        }
      }
    };
    
    return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        
        <Box
          sx={{
            mt: 2,
            p: 3,
            border: '2px dashed',
            borderColor: logo.preview ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: 'grey.50',
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {logo.preview ? (
            <Box>
              <img
                src={logo.preview}
                alt={title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 150,
                  width: logo.width,
                  height: logo.height,
                  objectFit: 'contain'
                }}
              />
              <IconButton
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' }
                }}
                size="small"
                onClick={() => onDelete(type)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                클릭하여 로고 업로드
              </Typography>
              <Typography variant="caption" color="text.secondary">
                JPG, PNG, GIF, SVG (최대 5MB)
              </Typography>
            </Box>
          )}
          
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
            onChange={(e) => onUpload(e, type)}
          />
        </Box>
        
        {/* 크기 조정 */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" gutterBottom>
            크기 조정
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  너비
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={logo.width}
                  onChange={handleInputChange('width')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                    inputProps: { min: 0, max: 2000 }
                  }}
                  fullWidth
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  높이
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={logo.height}
                  onChange={handleInputChange('height')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                    inputProps: { min: 0, max: 2000 }
                  }}
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
    );
  };
  
  return (
    <PageContainer>
      <PageHeader
        title="디자인설정"
        showAddButton={false}
        showDisplayOptionsButton={false}
        showRefreshButton={true}
        onRefreshClick={handleRefresh}
        sx={{ mb: 1 }}
      />
      
      {/* 디자인 탭 선택 */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={currentDesignTab}
          onChange={(e, newValue) => setCurrentDesignTab(newValue)}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 48,
              fontWeight: 600
            }
          }}
        >
          {designs.map((design, index) => (
            <Tab key={design.id} label={design.name} />
          ))}
        </Tabs>
      </Paper>
      
      {/* 관리자 로고 관리 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            backgroundColor: '#f5f7fa',
            borderRadius: 1.5,
            p: 2.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            관리자 로고 관리
          </Typography>
        </Box>
        <LogoUploadCard
          title="관리자 페이지 로고"
          logo={currentDesign.adminLogo}
          type="adminLogo"
          inputRef={adminLogoInputRef}
          onUpload={handleFileUpload}
          onDelete={handleFileDelete}
          onSizeChange={handleSizeChange}
        />
      </Paper>
      
      {/* 유저페이지 로고 관리 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            backgroundColor: '#f5f7fa',
            borderRadius: 1.5,
            p: 2.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            유저페이지 로고 관리
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LogoUploadCard
              title="메인 로고"
              logo={currentDesign.userLogos.main}
              type="userMainLogo"
              inputRef={userMainLogoInputRef}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
              onSizeChange={handleSizeChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LogoUploadCard
              title="푸터 로고"
              logo={currentDesign.userLogos.footer}
              type="userFooterLogo"
              inputRef={userFooterLogoInputRef}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
              onSizeChange={handleSizeChange}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* 메인 슬라이드 관리 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            backgroundColor: '#f5f7fa',
            borderRadius: 1.5,
            p: 2.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            유저페이지 메인 슬라이드 관리
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {currentDesign.mainSlides.map((slide) => (
            <Grid item xs={12} md={4} key={slide.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    {slide.title}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      border: '2px dashed',
                      borderColor: slide.preview ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                      textAlign: 'center',
                      bgcolor: 'grey.50',
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {slide.preview ? (
                      <>
                        <img
                          src={slide.preview}
                          alt={slide.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' }
                          }}
                          size="small"
                          onClick={() => handleFileDelete('slide', slide.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Box>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          클릭하여 이미지 업로드
                        </Typography>
                      </Box>
                    )}
                    
                    <input
                      ref={el => slideInputRefs.current[slide.id] = el}
                      type="file"
                      accept="image/*"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                      onChange={(e) => handleFileUpload(e, 'slide', slide.id)}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* 백그라운드 설정 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            backgroundColor: '#f5f7fa',
            borderRadius: 1.5,
            p: 2.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            유저페이지 백그라운드 관리
          </Typography>
        </Box>
        
          <FormControl component="fieldset">
            <FormLabel component="legend">백그라운드 타입</FormLabel>
            <RadioGroup
              row
              value={currentDesign.backgroundSettings.type}
              onChange={(e) => updateCurrentDesign({
                backgroundSettings: { ...currentDesign.backgroundSettings, type: e.target.value }
              })}
            >
              <FormControlLabel value="color" control={<Radio />} label="색상" />
              <FormControlLabel value="image" control={<Radio />} label="이미지" />
            </RadioGroup>
          </FormControl>
        
          <Box sx={{ mt: 3 }}>
            {currentDesign.backgroundSettings.type === 'color' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">배경 색상:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: currentDesign.backgroundSettings.color,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1
                  }}
                />
                <TextField
                  type="color"
                  value={currentDesign.backgroundSettings.color}
                  onChange={(e) => updateCurrentDesign({
                    backgroundSettings: { ...currentDesign.backgroundSettings, color: e.target.value }
                  })}
                  sx={{ width: 100 }}
                />
                <TextField
                  value={currentDesign.backgroundSettings.color}
                  onChange={(e) => updateCurrentDesign({
                    backgroundSettings: { ...currentDesign.backgroundSettings, color: e.target.value }
                  })}
                  sx={{ width: 120 }}
                  size="small"
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                p: 3,
                border: '2px dashed',
                borderColor: currentDesign.backgroundSettings.image.preview ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
                bgcolor: 'grey.50',
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                maxWidth: 600
              }}
            >
              {currentDesign.backgroundSettings.image.preview ? (
                <>
                  <img
                    src={currentDesign.backgroundSettings.image.preview}
                    alt="백그라운드"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 300,
                      objectFit: 'contain'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'error.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'error.dark' }
                    }}
                    size="small"
                    onClick={() => handleFileDelete('background')}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    클릭하여 백그라운드 이미지 업로드
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    권장 크기: 1920x1080
                  </Typography>
                </Box>
              )}
              
              <input
                ref={backgroundImageInputRef}
                type="file"
                accept="image/*"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
                onChange={(e) => handleFileUpload(e, 'background')}
              />
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* SNS 설정 */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2.5,
            backgroundColor: '#f5f7fa',
            borderRadius: 1.5,
            p: 2.5,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 600,
            color: '#2c3e50',
            fontSize: '1.1rem'
          }}>
            SNS 설정
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {Object.entries(currentDesign.snsSettings).map(([platform, sns]) => (
            <Grid item xs={12} md={6} lg={4} key={platform}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                    {platform}
                  </Typography>
                  
                  {/* 아이콘 업로드 */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      border: '2px dashed',
                      borderColor: sns.preview ? 'primary.main' : 'grey.300',
                      borderRadius: 2,
                      textAlign: 'center',
                      bgcolor: 'grey.50',
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {sns.preview ? (
                      <>
                        <img
                          src={sns.preview}
                          alt={`${platform} icon`}
                          style={{
                            maxWidth: '80%',
                            maxHeight: '80%',
                            objectFit: 'contain'
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            bgcolor: 'error.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'error.dark' }
                          }}
                          size="small"
                          onClick={() => handleFileDelete('sns', platform)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Box>
                        <ImageIcon sx={{ fontSize: 32, color: 'grey.400' }} />
                        <Typography variant="caption" color="text.secondary" display="block">
                          아이콘 업로드
                        </Typography>
                      </Box>
                    )}
                    
                    <input
                      ref={el => snsInputRefs.current[platform] = el}
                      type="file"
                      accept="image/*"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                      onChange={(e) => handleFileUpload(e, 'sns', platform)}
                    />
                  </Box>
                  
                  {/* URL 입력 */}
                  <TextField
                    fullWidth
                    size="small"
                    placeholder={`${platform} URL`}
                    value={sns.url}
                    onChange={(e) => handleSnsUrlChange(platform, e.target.value)}
                    sx={{ mt: 2 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Typography variant="caption" color="text.secondary">
                            URL:
                          </Typography>
                        </InputAdornment>
                      )
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* 액션 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
        >
          초기화
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ minWidth: 120 }}
        >
          저장
        </Button>
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

export default DesignSettingsPage;
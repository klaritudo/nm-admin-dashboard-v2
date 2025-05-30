import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  MenuItem, 
  FormControlLabel, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  Grid,
  Switch,
  Autocomplete,
  Chip,
  InputAdornment,
  Tooltip,
  Paper,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox
} from '@mui/material';
import { 
  Close,
  Person,
  AccountCircle,
  Lock,
  Phone,
  AccountBalance,
  CreditCard,
  Person as PersonIcon,
  Settings,
  Casino,
  Language,
  Link,
  Add,
  TrendingDown,
  MonetizationOn,
  SportsEsports,
  Games,
  VideogameAsset,
  PercentOutlined,
  RemoveCircleOutline,
  RequestQuote
} from '@mui/icons-material';
import '../../styles/createMemberDialog.css';
import { 
  initialMemberData, 
  banks, 
  handleNewMemberChange, 
  handleSubmit, 
  handleAddUrl, 
  resetForm 
} from './CreateMemberDialog.js';

// 공통 스타일을 정의
const commonStyles = {
  '& .MuiInputBase-root': {
    height: '48px'  // 입력 필드 높이 증가
  },
  '& .MuiInputBase-inputMultiline': {
    height: 'auto !important'  // 메모 필드는 자동 높이 유지
  }
};

/**
 * 회원 생성 다이얼로그 컴포넌트
 */
const CreateMemberDialog = ({ open, onClose, members, onCreateMember }) => {
  // 상태 - 안전한 초기값 보장
  const [newMemberData, setNewMemberData] = useState(() => ({ ...initialMemberData }));
  const [formErrors, setFormErrors] = useState({});
  
  // 다이얼로그가 닫힐 때 폼 초기화
  useEffect(() => {
    if (!open) {
      resetForm(setNewMemberData, setFormErrors);
    }
  }, [open]);

  // 상부 선택 시 본사 여부 확인
  useEffect(() => {
    if (newMemberData.parentId && members) {
      const selectedParent = members.find(m => m.id === newMemberData.parentId);
      if (selectedParent && selectedParent.type === '본사') {
        setNewMemberData(prev => ({
          ...prev,
          isHeadquarters: true
        }));
      } else {
        setNewMemberData(prev => ({
          ...prev,
          isHeadquarters: false,
          memberPageUrlStandard: '',
          bettingStandard: '',
          agentManagerUrl: '',
          memberPageUrl: ''
        }));
      }
    }
  }, [newMemberData.parentId, members]);
  
  // 폼 제출 핸들러
  const onSubmit = () => {
    handleSubmit(newMemberData, onCreateMember, onClose, setFormErrors);
  };
  
  return (
    <Dialog 
      open={Boolean(open)} 
      onClose={typeof onClose === 'function' ? onClose : () => {}}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '12px', overflow: 'hidden' }
      }}
    >
      <DialogTitle 
        className="dialog-title"
        sx={{
          backgroundColor: '#3699FF !important',
          padding: '16px 24px',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Box className="section-title">
          <PersonIcon fontSize="small" />
          <Typography variant="h6" className="dialog-title-text">회원생성</Typography>
        </Box>
        <IconButton 
          edge="end" 
          color="inherit" 
          onClick={typeof onClose === 'function' ? onClose : () => {}}
          aria-label="close"
          className="close-button"
        >
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent className="dialog-content">
        {/* 헤더 섹션 */}
        <Box className="section-header">
          <Box className="section-title">
            <Settings fontSize="small" color="primary" />
            <Typography variant="h6" className="section-title-text">회원생성</Typography>
          </Box>
          <Box className="bulk-creation-toggle">
            <Typography variant="body1" className="bulk-creation-label">일괄생성</Typography>
            <Switch
              checked={Boolean(newMemberData?.bulkCreation)}
              onChange={(e, checked) => handleNewMemberChange({
                target: {
                  name: 'bulkCreation',
                  type: 'checkbox',
                  checked: checked
                }
              }, newMemberData, setNewMemberData, formErrors, setFormErrors)}
              color="primary"
            />
          </Box>
        </Box>
        
        {/* 필수 항목 섹션 */}
        <Box className="form-section">
          <Box className="form-section-header">
            <Box className="form-section-title">
              <AccountCircle className="field-icon" />
              <Typography variant="subtitle1" className="form-section-title-text">필수항목</Typography>
            </Box>
            {members && newMemberData.parentId && (
              <Chip
                label={(() => {
                  const parent = members.find(m => m.id === newMemberData.parentId);
                  if (!parent || !parent.level) return '';
                  
                  // 상부의 레벨에 따른 하위 레벨 결정
                  switch (parent.level) {
                    case 1: // 슈퍼
                      return '본사';
                    case 2: // 본사
                      return '부본사';
                    case 3: // 부본사
                      return '마스터총판';
                    case 4: // 마스터총판
                      return '총판';
                    case 5: // 총판
                      return '매장';
                    case 6: // 매장
                      return '회원Lv1';
                    default:
                      return '';
                  }
                })()}
                className="parent-chip"
                sx={{
                  backgroundColor: (() => {
                    const parent = members.find(m => m.id === newMemberData.parentId);
                    if (!parent || !parent.level) return '#e8f5e9';
                    
                    // 하위 레벨의 배경색 결정
                    switch (parent.level) {
                      case 1: // 슈퍼 -> 본사
                        return '#e3f2fd';
                      case 2: // 본사 -> 부본사
                        return '#f1f8e9';
                      case 3: // 부본사 -> 마스터총판
                        return '#e8f5e9';
                      case 4: // 마스터총판 -> 총판
                        return '#e3f2fd';
                      case 5: // 총판 -> 매장
                        return '#fff3e0';
                      case 6: // 매장 -> 회원Lv1
                        return '#f3e5f5';
                      default:
                        return '#e8f5e9';
                    }
                  })(),
                  color: (() => {
                    const parent = members.find(m => m.id === newMemberData.parentId);
                    if (!parent || !parent.level) return '#2e7d32';
                    
                    // 하위 레벨의 색상 결정
                    switch (parent.level) {
                      case 1: // 슈퍼 -> 본사
                        return '#1565c0';
                      case 2: // 본사 -> 부본사
                        return '#558b2f';
                      case 3: // 부본사 -> 마스터총판
                        return '#2e7d32';
                      case 4: // 마스터총판 -> 총판
                        return '#1565c0';
                      case 5: // 총판 -> 매장
                        return '#e65100';
                      case 6: // 매장 -> 회원Lv1
                        return '#7b1fa2';
                      default:
                        return '#2e7d32';
                    }
                  })(),
                  border: `1px solid ${(() => {
                    const parent = members.find(m => m.id === newMemberData.parentId);
                    if (!parent || !parent.level) return '#2e7d32';
                    
                    // 하위 레벨의 테두리색 결정
                    switch (parent.level) {
                      case 1: // 슈퍼 -> 본사
                        return '#1565c0';
                      case 2: // 본사 -> 부본사
                        return '#558b2f';
                      case 3: // 부본사 -> 마스터총판
                        return '#2e7d32';
                      case 4: // 마스터총판 -> 총판
                        return '#1565c0';
                      case 5: // 총판 -> 매장
                        return '#e65100';
                      case 6: // 매장 -> 회원Lv1
                        return '#7b1fa2';
                      default:
                        return '#2e7d32';
                    }
                  })()}`,
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  height: '24px'
                }}
              />
            )}
          </Box>
          
          <Grid container spacing={2}>
            {/* 상부 선택 */}
            <Grid item xs={12}>
              <Autocomplete
                options={members ? members.filter(m => m && (m.type === '에이전트' || m.type === '관리자' || m.type === '슈퍼관리자' || m.type === '본사')) : []}
                getOptionLabel={(option) => option ? `${option.username}${option.nickname ? ` (${option.nickname})` : ''}` : ''}
                renderOption={(props, option) => (
                  <Paper {...props} elevation={0} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{option.username}{option.nickname ? ` (${option.nickname})` : ''}</span>
                    {option.levelName && (
                      <Box component="span" sx={{ ml: 1 }}>
                        <Chip
                          label={option.levelName}
                          size="small"
                          sx={{
                            backgroundColor: option.backgroundColor || '#e8f5e9',
                            color: option.color || '#2e7d32',
                            border: `1px solid ${option.borderColor || '#2e7d32'}`,
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: '24px'
                          }}
                        />
                      </Box>
                    )}
                  </Paper>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="상부"
                    required
                    variant="outlined"
                    size="small"
                    error={!!formErrors.parentId}
                    helperText={formErrors.parentId}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <PersonIcon className="field-icon" />
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />
                )}
                value={members && newMemberData.parentId ? members.find(m => m.id === newMemberData.parentId) || null : null}
                onChange={(event, newValue) => {
                  handleNewMemberChange({
                    target: {
                      name: 'parentId',
                      value: newValue ? newValue.id : ''
                    }
                  }, newMemberData, setNewMemberData, formErrors, setFormErrors);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            </Grid>
            
            {/* 본사 선택 시 추가 필드 */}
            {newMemberData.isHeadquarters && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>기준 에이전트</Typography>
                </Grid>
                
                {/* 회원페이지 URL 적용기준 */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!formErrors.memberPageUrlStandard}>
                    <InputLabel id="member-page-url-standard-label">회원페이지 URL 적용기준</InputLabel>
                    <Select
                      labelId="member-page-url-standard-label"
                      name="memberPageUrlStandard"
                      value={newMemberData.memberPageUrlStandard}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      label="회원페이지 URL 적용기준"
                      startAdornment={
                        <InputAdornment position="start">
                          <Language className="field-icon" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>선택하세요</em>
                      </MenuItem>
                      {members && members
                        .filter(m => m.type === '부본사' || m.id === newMemberData.parentId)
                        .map(agent => (
                          <MenuItem key={agent.id} value={agent.id}>
                            {agent.username}
                          </MenuItem>
                        ))}
                    </Select>
                    {formErrors.memberPageUrlStandard && (
                      <FormHelperText>{formErrors.memberPageUrlStandard}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                {/* 공베팅적용기준 */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!formErrors.bettingStandard}>
                    <InputLabel id="betting-standard-label">공베팅적용기준</InputLabel>
                    <Select
                      labelId="betting-standard-label"
                      name="bettingStandard"
                      value={newMemberData.bettingStandard}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      label="공베팅적용기준"
                      startAdornment={
                        <InputAdornment position="start">
                          <Casino className="field-icon" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>선택하세요</em>
                      </MenuItem>
                      {members && members
                        .filter(m => m.type === '부본사' || m.id === newMemberData.parentId)
                        .map(agent => (
                          <MenuItem key={agent.id} value={agent.id}>
                            {agent.username}
                          </MenuItem>
                        ))}
                    </Select>
                    {formErrors.bettingStandard && (
                      <FormHelperText>{formErrors.bettingStandard}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                
                {/* 에이전트 관리자 URL */}
                <Grid item xs={12}>
                  <Box className="url-input-container">
                    <TextField
                      fullWidth
                      label="에이전트 관리자 URL"
                      name="agentManagerUrl"
                      value={newMemberData.agentManagerUrl}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      placeholder="관리자 URL 입력"
                      InputProps={{
                        startAdornment: <Link className="field-icon" />
                      }}
                    />
                    <Tooltip title="URL 추가">
                      <IconButton 
                        color="primary" 
                        onClick={() => handleAddUrl()}
                        className="url-add-button"
                      >
                        <Add />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                
                {/* 회원페이지 URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="회원페이지 URL"
                    name="memberPageUrl"
                    value={newMemberData.memberPageUrl}
                    onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                    variant="outlined"
                    size="small"
                    placeholder="회원페이지 URL 입력"
                    InputProps={{
                      startAdornment: <Language className="field-icon" />
                    }}
                  />
                </Grid>
              </>
            )}

            {/* 기본 입력 필드들 */}
            <Grid item xs={12} sm={6}>
              {!newMemberData.bulkCreation ? (
                <TextField
                  fullWidth
                  label="아이디"
                  name="username"
                  value={newMemberData.username}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  required
                  variant="outlined"
                  size="small"
                  placeholder="3~7글자 한글/영문"
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  InputProps={{
                    startAdornment: <AccountCircle className="field-icon" />
                  }}
                  autoComplete="off"
                  sx={commonStyles}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="아이디"
                      name="username"
                      value={newMemberData.username}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      required
                      variant="outlined"
                      size="small"
                      placeholder="2~5글자"
                      error={!!formErrors.username}
                      helperText={formErrors.username}
                      InputProps={{
                        startAdornment: <AccountCircle className="field-icon" />
                      }}
                      autoComplete="off"
                      sx={commonStyles}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="시작"
                      name="usernamePattern.start"
                      value={newMemberData.usernamePattern.start}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      required
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder="시작 번호"
                      sx={commonStyles}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      label="끝"
                      name="usernamePattern.end"
                      value={newMemberData.usernamePattern.end}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      required
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder="끝 번호"
                      sx={commonStyles}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              {!newMemberData.bulkCreation ? (
                <TextField
                  fullWidth
                  label="닉네임"
                  name="nickname"
                  value={newMemberData.nickname}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  required
                  variant="outlined"
                  size="small"
                  placeholder="2~7글자 한글/영문"
                  error={!!formErrors.nickname}
                  helperText={formErrors.nickname}
                  InputProps={{
                    startAdornment: <Person className="field-icon" />
                  }}
                  autoComplete="off"
                  sx={commonStyles}
                />
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="닉네임"
                      name="nickname"
                      value={newMemberData.nickname}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      required
                      variant="outlined"
                      size="small"
                      placeholder="2~5글자, 아이디 패턴을 따름"
                      error={!!formErrors.nickname}
                      helperText={formErrors.nickname}
                      InputProps={{
                        startAdornment: <Person className="field-icon" />
                      }}
                      autoComplete="off"
                      sx={commonStyles}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호"
                name="password"
                value={newMemberData.password}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                placeholder="5글자 이상 영문/숫자/특수문자"
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  startAdornment: <Lock className="field-icon" />
                }}
                autoComplete="new-password"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호 확인"
                name="passwordConfirm"
                value={newMemberData.passwordConfirm}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                error={!!formErrors.passwordConfirm}
                helperText={formErrors.passwordConfirm}
                InputProps={{
                  startAdornment: <Lock className="field-icon" />
                }}
                autoComplete="new-password"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="이름"
                name="name"
                value={newMemberData.name}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                placeholder="예금주와 불일치 시 출금 불가"
                error={!!formErrors.name}
                helperText={formErrors.name}
                InputProps={{
                  startAdornment: <Person className="field-icon" />
                }}
                autoComplete="off"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="전화번호"
                name="phone"
                value={newMemberData.phone}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                placeholder="전화번호 형식에 맞게 입력"
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                InputProps={{
                  startAdornment: <Phone className="field-icon" />
                }}
                autoComplete="off"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" error={!!formErrors.bank}>
                <InputLabel id="bank-label">은행</InputLabel>
                <Select
                  labelId="bank-label"
                  name="bank"
                  value={newMemberData.bank}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  label="은행"
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountBalance className="field-icon" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">
                    <em>선택하세요</em>
                  </MenuItem>
                  {banks.map((bank, index) => (
                    <MenuItem key={index} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.bank && (
                  <FormHelperText>{formErrors.bank}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="계좌번호"
                name="accountNumber"
                value={newMemberData.accountNumber}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                placeholder="'-' 없이 입력"
                error={!!formErrors.accountNumber}
                helperText={formErrors.accountNumber}
                InputProps={{
                  startAdornment: <CreditCard className="field-icon" />
                }}
                autoComplete="off"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="예금주"
                name="accountHolder"
                value={newMemberData.accountHolder}
                onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                required
                variant="outlined"
                size="small"
                placeholder="이름과 불일치 시 출금 불가"
                error={!!formErrors.accountHolder}
                helperText={formErrors.accountHolder}
                InputProps={{
                  startAdornment: <Person className="field-icon" />
                }}
                autoComplete="off"
                sx={commonStyles}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="recommendation-label">추천인 사용</InputLabel>
                <Select
                  labelId="recommendation-label"
                  name="recommendation"
                  value={newMemberData.recommendation || '미사용'}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  label="추천인 사용"
                  startAdornment={
                    <InputAdornment position="start">
                      <Person className="field-icon" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="미사용">미사용</MenuItem>
                  <MenuItem value="사용">사용</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {newMemberData.recommendation === '사용' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="추천인 아이디"
                  name="recommenderId"
                  value={newMemberData.recommenderId}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  required
                  variant="outlined"
                  size="small"
                  error={!!formErrors.recommenderId}
                  helperText={formErrors.recommenderId}
                  InputProps={{
                    startAdornment: <Person className="field-icon" />
                  }}
                  autoComplete="off"
                  sx={commonStyles}
                />
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-label">언어</InputLabel>
                <Select
                  labelId="language-label"
                  name="language"
                  value={newMemberData.language || '한국어'}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  label="언어"
                  startAdornment={
                    <InputAdornment position="start">
                      <Language className="field-icon" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="한국어">한국어</MenuItem>
                  <MenuItem value="영어">영어</MenuItem>
                  <MenuItem value="중국어">중국어</MenuItem>
                  <MenuItem value="일본어">일본어</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* 롤링 설정 섹션 */}
        <Grid item xs={12}>
          <Box className="form-section">
            <Box className="form-section-header">
              <Box className="form-section-title">
                <PercentOutlined className="field-icon" />
                <Typography variant="subtitle1" className="form-section-title-text">
                  롤링 설정
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(newMemberData?.bulkRollingRate?.enabled)}
                        onChange={(e, checked) => handleNewMemberChange({
                          target: {
                            name: 'bulkRollingRate.enabled',
                            type: 'checkbox',
                            checked: checked
                          }
                        }, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">일괄 롤링</Typography>
                    }
                  />
                  {newMemberData?.bulkRollingRate?.enabled && (
                    <TextField
                      label="일괄 롤링 %"
                      name="bulkRollingRate.value"
                      value={newMemberData?.bulkRollingRate?.value || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`${newMemberData.parentId ? '상부의 %이하 설정' : ''}`}
                      sx={{ ...commonStyles, width: '200px', mr: '15px' }}
                      InputProps={{
                        startAdornment: <PercentOutlined className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  )}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(newMemberData?.laterRollingInput)}
                        onChange={(e, checked) => handleNewMemberChange({
                          target: {
                            name: 'laterRollingInput',
                            type: 'checkbox',
                            checked: checked
                          }
                        }, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">나중에 기입하기</Typography>
                    }
                  />
                </Box>
              </Grid>
              
              {!newMemberData?.laterRollingInput && !newMemberData?.bulkRollingRate?.enabled && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="슬롯 롤링 %"
                      name="rollingRates.slot"
                      value={newMemberData?.rollingRates?.slot || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <SportsEsports className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="카지노 롤링 %"
                      name="rollingRates.casino"
                      value={newMemberData?.rollingRates?.casino || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <Casino className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="미니게임 롤링 %"
                      name="rollingRates.minigame"
                      value={newMemberData?.rollingRates?.minigame || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <Games className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>

        {/* 루징 설정 섹션 */}
        <Grid item xs={12}>
          <Box className="form-section">
            <Box className="form-section-header">
              <Box className="form-section-title">
                <PercentOutlined className="field-icon" />
                <Typography variant="subtitle1" className="form-section-title-text">
                  루징 설정
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(newMemberData?.bulkLosingRate?.enabled)}
                        onChange={(e, checked) => handleNewMemberChange({
                          target: {
                            name: 'bulkLosingRate.enabled',
                            type: 'checkbox',
                            checked: checked
                          }
                        }, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">일괄 루징</Typography>
                    }
                  />
                  {newMemberData?.bulkLosingRate?.enabled && (
                    <TextField
                      label="일괄 루징 %"
                      name="bulkLosingRate.value"
                      value={newMemberData?.bulkLosingRate?.value || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`${newMemberData.parentId ? '상부의 %이하 설정' : ''}`}
                      sx={{ ...commonStyles, width: '200px', mr: '15px' }}
                      InputProps={{
                        startAdornment: <PercentOutlined className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  )}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(newMemberData?.laterLosingInput)}
                        onChange={(e, checked) => handleNewMemberChange({
                          target: {
                            name: 'laterLosingInput',
                            type: 'checkbox',
                            checked: checked
                          }
                        }, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2">나중에 기입하기</Typography>
                    }
                  />
                </Box>
              </Grid>
              
              {!newMemberData?.laterLosingInput && !newMemberData?.bulkLosingRate?.enabled && (
                <>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="슬롯 루징 %"
                      name="losingRates.slot"
                      value={newMemberData?.losingRates?.slot || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <SportsEsports className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="카지노 루징 %"
                      name="losingRates.casino"
                      value={newMemberData?.losingRates?.casino || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <Casino className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="미니게임 루징 %"
                      name="losingRates.minigame"
                      value={newMemberData?.losingRates?.minigame || ''}
                      onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder={`상부 ${newMemberData.parentId ? '~% 이하 설정' : ''}`}
                      InputProps={{
                        startAdornment: <Games className="field-icon" />,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                      sx={commonStyles}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>

        {/* 베팅 제한액 섹션 */}
        <Grid item xs={12}>
          <Box className="form-section">
            <Box className="form-section-header">
              <Box className="form-section-title">
                <TrendingDown className="field-icon" />
                <Typography variant="subtitle1" className="form-section-title-text">
                  베팅 제한액
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="슬롯 베팅 제한액"
                  name="slotBettingLimit"
                  value={newMemberData.slotBettingLimit}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={commonStyles}
                  InputProps={{
                    startAdornment: <TrendingDown className="field-icon" />,
                    endAdornment: <InputAdornment position="end">원</InputAdornment>
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="카지노 베팅 제한액"
                  name="casinoBettingLimit"
                  value={newMemberData.casinoBettingLimit}
                  onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
                  variant="outlined"
                  size="small"
                  type="number"
                  sx={commonStyles}
                  InputProps={{
                    startAdornment: <TrendingDown className="field-icon" />,
                    endAdornment: <InputAdornment position="end">원</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* 메모 필드 */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="메모"
            name="memo"
            value={newMemberData.memo}
            onChange={(e) => handleNewMemberChange(e, newMemberData, setNewMemberData, formErrors, setFormErrors)}
            variant="outlined"
            size="small"
            multiline
            rows={4}
            sx={commonStyles}
          />
        </Grid>
      </DialogContent>
      
      {/* 액션 버튼 */}
      <DialogActions className="action-buttons">
        <Button 
          onClick={typeof onClose === 'function' ? onClose : () => {}} 
          color="inherit"
          className="cancel-button"
        >
          취소
        </Button>
        <Button 
          onClick={onSubmit} 
          color="primary" 
          variant="contained"
          className="submit-button"
        >
          생성
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMemberDialog;

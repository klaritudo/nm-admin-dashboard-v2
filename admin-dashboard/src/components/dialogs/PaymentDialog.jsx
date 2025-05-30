import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  InputAdornment,
  Divider,
  Grid,
  Chip,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

/**
 * 지급/회수 다이얼로그 컴포넌트
 * 회원에게 금액을 지급하거나 회수하는 기능을 제공합니다.
 * 
 * @param {Object} props
 * @param {boolean} props.open 다이얼로그 열림 상태
 * @param {Function} props.onClose 다이얼로그 닫기 핸들러
 * @param {Object} props.member 선택된 회원 정보
 * @param {string} props.action 'deposit'(지급) 또는 'withdraw'(회수)
 * @param {Function} props.onConfirm 확인 버튼 클릭 시 콜백 함수
 * @param {Function} props.formatCurrency 금액 포맷팅 함수 (선택적)
 */
const PaymentDialog = ({ open, onClose, member, action, onConfirm, formatCurrency }) => {
  // 상태 관리
  const [amount, setAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [paymentType, setPaymentType] = useState('일반');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  
  // 입력 필드 참조
  const amountInputRef = React.useRef(null);

  // 다이얼로그 제목 및 버튼 텍스트 설정
  const dialogTitle = action === 'deposit' ? '회원 머니 지급' : '회원 머니 회수';
  const confirmButtonText = action === 'deposit' ? '지급하기' : '회수하기';
  const confirmButtonColor = action === 'deposit' ? 'primary' : 'error';

  // 기본 포맷팅 함수 (props로 제공되지 않은 경우 사용)
  const defaultFormatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR').format(value || 0);
  };

  // 실제 사용할 포맷팅 함수
  const formatCurrencyFn = formatCurrency || defaultFormatCurrency;

  // 다이얼로그가 열릴 때마다 폼 초기화 및 포커스 설정
  useEffect(() => {
    if (open) {
      setAmount('');
      setFormattedAmount('');
      setPaymentType('일반');
      setNote('');
      setErrors({});
      
      // 금액 입력 필드에 자동 포커스
      setTimeout(() => {
        if (amountInputRef.current) {
          amountInputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  // 금액 입력 핸들러 - 숫자만 허용
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, ''); // 숫자만 추출
    
    if (value === '' || /^\d+$/.test(value)) {
      setAmount(value);
      
      // 포맷된 금액 설정 (천 단위 구분자)
      if (value) {
        setFormattedAmount(Intl.NumberFormat('ko-KR').format(parseInt(value)));
      } else {
        setFormattedAmount('');
      }
      
      // 에러 메시지 초기화
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
    }
  };

  // 금액 추가 핸들러 추가
  const handleAddAmount = (additionalAmount) => {
    const currentAmount = amount === '' ? 0 : parseInt(amount);
    const newAmount = currentAmount + parseInt(additionalAmount);
    setAmount(newAmount.toString());
    setFormattedAmount(Intl.NumberFormat('ko-KR').format(newAmount));
    
    // 에러 메시지 초기화
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  // 키 이벤트 핸들러 - 엔터 키 처리
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!amount) {
      newErrors.amount = '금액을 입력해주세요';
    } else if (isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = '유효한 금액을 입력해주세요';
    }

    if (!paymentType) {
      newErrors.paymentType = '지급 유형을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    if (validateForm()) {
      // 다양한 ID 필드 지원
      const memberId = member?.id || member?.ID || member?.userId || member?.memberId || member?.username;
      
      /*console.log('지급/회수 확인, 회원 정보:', member);*/
      
      onConfirm({
        memberId: memberId,
        action,
        amount: parseFloat(amount),
        paymentType,
        note
      });
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}
    >
      {/* 다이얼로그 헤더 */}
      <DialogTitle sx={{ 
        bgcolor: action === 'deposit' ? 'primary.main' : 'error.main', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {action === 'deposit' ? 
            <AccountBalanceWalletIcon sx={{ mr: 1 }} /> : 
            <ReceiptIcon sx={{ mr: 1 }} />
          }
          {dialogTitle}
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small" 
          sx={{ color: 'white' }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* 회원 정보 섹션 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              회원 정보
            </Typography>
            <Chip 
              label={member?.type?.label || member?.type || '-'} 
              size="small" 
              color={member?.type?.color || 'default'}
              sx={{ 
                height: '24px', 
                fontSize: '0.8125rem',
                backgroundColor: member?.type?.backgroundColor,
                borderColor: member?.type?.borderColor,
                border: member?.type?.borderColor ? `1px solid ${member?.type?.borderColor}` : undefined
              }} 
            />
          </Box>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: '8px', 
            border: '1px solid', 
            borderColor: 'divider' 
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary">
                    아이디
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {member?.username || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary">
                    닉네임
                  </Typography>
                  <Typography variant="body1">
                    {member?.nickname || '-'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary">
                    보유머니
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatCurrencyFn(member?.balance || 0)} 원
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2.5 }}>
                    롤링금
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatCurrencyFn(member?.rollingAmount || 0)} 원
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="caption" color="text.secondary">
                    게임머니
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {formatCurrencyFn(member?.gameMoney || 0)} 원
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 지급/회수 정보 입력 폼 */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            {action === 'deposit' ? '지급 정보' : '회수 정보'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={action === 'deposit' ? '지급 금액' : '회수 금액'}
                variant="outlined"
                size="small"
                value={formattedAmount}
                onChange={handleAmountChange}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                }}
                autoFocus
                inputRef={amountInputRef}
                onKeyDown={handleKeyDown}
              />
              
              {/* 빠른 금액 선택 버튼 추가 */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                {['10000', '50000', '100000', '500000', '1000000', '5000000', '10000000', '100000000'].map((quickAmount) => (
                  <Button 
                    key={quickAmount}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleAddAmount(quickAmount)}
                    sx={{ 
                      minWidth: 'auto', 
                      py: 0.5,
                      fontSize: '0.75rem'
                    }}
                  >
                    {Intl.NumberFormat('ko-KR').format(parseInt(quickAmount))}
                  </Button>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                size="small" 
                variant="outlined" 
                error={!!errors.paymentType}
              >
                <InputLabel id="payment-type-label">지급 유형</InputLabel>
                <Select
                  labelId="payment-type-label"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  label="지급 유형"
                  onKeyDown={handleKeyDown}
                >
                  <MenuItem value="일반">일반</MenuItem>
                  <MenuItem value="보너스">보너스</MenuItem>
                  <MenuItem value="이벤트">이벤트</MenuItem>
                  <MenuItem value="보너스">기타</MenuItem>

                </Select>
                {errors.paymentType && (
                  <FormHelperText>{errors.paymentType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="메모"
                multiline
                rows={2}
                variant="outlined"
                size="small"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="필요시 메모를 입력하세요"
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', pt: 1 }}>
                      <NoteAltIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* 주의사항 */}
        <Box sx={{ 
          mt: 2, 
          p: 1.5, 
          bgcolor: '#fff3e0', 
          borderRadius: '4px',
          border: '1px solid #ff9800'
        }}>
          <Typography variant="caption" sx={{ 
            color: '#e65100',
            fontWeight: 'medium',
            fontSize: '0.8rem'
          }}>
            {action === 'deposit' 
              ? '회원에게 머니를 지급하면 해당 금액만큼 회원의 보유머니가 증가합니다.'
              : '회원의 머니를 회수하면 해당 금액만큼 회원의 보유머니가 차감됩니다.'}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          color="inherit"
          sx={{ 
            borderRadius: '4px',
            px: 2 
          }}
        >
          취소
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={confirmButtonColor}
          sx={{ 
            borderRadius: '4px',
            px: 3,
            fontWeight: 'medium' 
          }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
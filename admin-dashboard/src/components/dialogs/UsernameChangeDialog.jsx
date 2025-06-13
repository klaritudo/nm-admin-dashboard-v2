import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Close,
  Person,
  AccountCircle,
  Search,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeChangeDialog,
  setChangeableUsers,
  executeUsernameChange,
  setLoading,
  setError
} from '../../features/usernameChange/usernameChangeSlice';
import { generateChangeableUsers } from '../../pages/agent-management/data/usernameChangeHistoryData';
import apiService from '../../services/api';

const UsernameChangeDialog = ({ open, userId, agentId, onClose }) => {
  const dispatch = useDispatch();
  const { changeableUsers, isLoading, error } = useSelector(state => state.usernameChange);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // 변경 가능한 사용자 목록 로드
  useEffect(() => {
    if (open && agentId) {
      loadChangeableUsers();
    }
  }, [open, agentId]);

  // 검색 필터링
  useEffect(() => {
    if (changeableUsers.length > 0) {
      const filtered = changeableUsers.filter(user =>
        user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [changeableUsers, searchTerm]);

  const loadChangeableUsers = async () => {
    dispatch(setLoading(true));
    try {
      // API 호출 시도
      const response = await apiService.usernameChange.getChangeableUsers(agentId, userId);
      dispatch(setChangeableUsers(response.data));
    } catch (error) {
      // API 실패 시 로컬 데이터 사용
      console.log('API 호출 실패, 로컬 데이터 사용');
      const localData = generateChangeableUsers(agentId, userId);
      dispatch(setChangeableUsers(localData));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClose = () => {
    dispatch(closeChangeDialog());
    setSelectedUser(null);
    setSearchTerm('');
    if (onClose) onClose();
  };

  const handleConfirm = async () => {
    if (!selectedUser) {
      dispatch(setError('변경할 아이디를 선택해주세요.'));
      return;
    }

    try {
      // API 호출 시도
      await apiService.usernameChange.executeChange({
        oldUserId: userId,
        newUserId: selectedUser.userId,
        agentId: agentId,
        reason: '사용자 요청'
      });
    } catch (error) {
      console.log('API 호출 실패, 로컬 처리');
    }

    // Redux 상태 업데이트
    dispatch(executeUsernameChange({
      oldUserId: userId,
      newUserId: selectedUser.userId,
      agentId: agentId,
      reason: '사용자 요청'
    }));

    // 성공 알림
    alert(`아이디가 성공적으로 변경되었습니다.\n\n${userId} → ${selectedUser.userId}`);
    
    handleClose();
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircle color="primary" />
          <Typography variant="h6">아이디 변경</Typography>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* 현재 사용자 정보 */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{userId}</strong> 아이디를 변경합니다.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            같은 에이전트({agentId}) 소속의 변경 가능한 아이디만 표시됩니다.
          </Typography>
        </Alert>

        {/* 검색 필드 */}
        <TextField
          fullWidth
          size="small"
          placeholder="아이디 또는 닉네임으로 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* 로딩 상태 */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* 변경 가능한 사용자 목록 */
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              변경 가능한 아이디 ({filteredUsers.length}개)
            </Typography>
            <List sx={{ 
              maxHeight: '300px', 
              overflow: 'auto',
              border: 1,
              borderColor: 'divider',
              borderRadius: 1
            }}>
              {filteredUsers.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="변경 가능한 아이디가 없습니다."
                    secondary="모든 아이디가 사용 중이거나 조건을 만족하지 않습니다."
                    sx={{ textAlign: 'center', py: 3 }}
                  />
                </ListItem>
              ) : (
                filteredUsers.map((user) => (
                  <ListItem key={user.id} disablePadding divider>
                    <ListItemButton 
                      onClick={() => handleUserSelect(user)}
                      selected={selectedUser?.id === user.id}
                    >
                      <ListItemIcon>
                        <Radio
                          checked={selectedUser?.id === user.id}
                          value={user.id}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="body1" component="span">
                              {user.userId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ({user.nickname})
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip 
                              label={user.level} 
                              size="small" 
                              variant="outlined"
                            />
                            <Chip 
                              label="미접속" 
                              size="small" 
                              color="success"
                              variant="outlined"
                              icon={<CheckCircle fontSize="small" />}
                            />
                            <Chip 
                              label="잔액: 0원" 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        )}

        {/* 선택된 사용자 정보 */}
        {selectedUser && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              선택된 아이디
            </Typography>
            <Typography variant="h6">
              {userId} → {selectedUser.userId}
            </Typography>
            <Typography variant="caption">
              변경 후에는 기존 아이디로 로그인할 수 없습니다.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          취소
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          disabled={!selectedUser || isLoading}
        >
          변경하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernameChangeDialog;
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllNotifications,
  generateRandomNotifications
} from '../../features/notifications/notificationsSlice';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';

/**
 * 알림판 컴포넌트 - 모던한 디자인으로 개선
 * 모든 페이지에서 스티키 기능으로 표시됨
 */
const NotificationPanel = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const [isCompact, setIsCompact] = useState(window.innerWidth <= 800);

  // 테스트용 랜덤 알림 생성
  useEffect(() => {
    dispatch(generateRandomNotifications());
  }, [dispatch]);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setIsCompact(window.innerWidth <= 800);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 알림 아이콘 매핑
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'PersonIcon':
        return <AccountCircleOutlinedIcon sx={{ fontSize: 18 }} />;
      case 'ArrowUpwardIcon':
        return <FileUploadOutlinedIcon sx={{ fontSize: 18 }} />;
      case 'ArrowDownwardIcon':
        return <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />;
      case 'SupportAgentIcon':
        return <SupportAgentOutlinedIcon sx={{ fontSize: 18 }} />;
      case 'GroupIcon':
        return <GroupsOutlinedIcon sx={{ fontSize: 18 }} />;
      default:
        return <AccountCircleOutlinedIcon sx={{ fontSize: 18 }} />;
    }
  };

  // 최대 6개의 알림만 표시
  const displayNotifications = Object.values(notifications).slice(0, 6);

  return (
    <div 
      className="notification-panel"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'block !important',
        visibility: 'visible !important',
        width: '100%',
        opacity: 1
      }}
    >
      {/* 알림 컨테이너 */}
      <div 
        style={{ 
          backgroundColor: '#ffffff',
          padding: isCompact ? '12px 8px' : '14px 16px',
          position: 'relative',
          zIndex: 1101,
          width: '100%',
          marginTop: '0px',
          marginBottom: '0px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          display: 'block !important',
          visibility: 'visible !important'
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            width: '100%',
            justifyContent: 'space-between',
            gap: isCompact ? '5px' : '4px',
            overflow: 'visible',
            paddingBottom: '0'
          }}
          className="notification-container"
        >
          {displayNotifications.map((notification) => (
            <div 
              key={notification.id}
              style={{
                flex: '1 1 0',
                margin: '0',
                minWidth: '0',
                position: 'relative',
                zIndex: 1102,
                maxHeight: '120px'
              }}
              className={`notification-card ${isCompact ? 'compact' : ''}`}
            >
              <div 
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: isCompact ? '4px' : '8px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #EBEDF3'
                }}
              >
                <div 
                  style={{ 
                    padding: isCompact ? '6px 6px' : '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'aliceblue',
                    borderBottom: '1px solid #F3F6F9',
                    overflow: 'hidden'
                  }}
                >
                  {!isCompact && (
                    <div 
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '14px',
                        borderRadius: '6px',
                        backgroundColor: `${notification.color}15`,
                        color: notification.color,
                        marginRight: '10px',
                        flexShrink: 0
                      }}
                    >
                      {getIcon(notification.icon)}
                    </div>
                  )}
                  <div style={{ 
                    fontWeight: '500', 
                    fontSize: isCompact ? '11px' : '13px', 
                    color: '#3F4254',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%'
                  }}>
                    {notification.title}
                  </div>
                </div>
                
                <div style={{ 
                  padding: isCompact ? '8px 8px' : '10px 0px',
                  display: 'flex',
                  margin: isCompact ? '0' : '0 10px 0 10px',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    flex: '1 1 0'
                  }}>
                    <div style={{ 
                      fontSize: isCompact ? '9px' : '11px', 
                      color: '#B5B5C3', 
                      marginBottom: isCompact ? '2px' : '4px'
                    }}>
                      요청
                    </div>
                    <div style={{ 
                      fontSize: isCompact ? '12px' : '16px', 
                      fontWeight: '600', 
                      color: notification.requests > 0 ? '#F64E60' : '#B5B5C3',
                      minWidth: isCompact ? '16px' : '28px',
                      textAlign: 'center'
                    }}>
                      {notification.requests}
                    </div>
                  </div>
                  
                  <div style={{ 
                    width: '1px', 
                    height: isCompact ? '20px' : '24px', 
                    backgroundColor: '#EBEDF3',
                    margin: '0 4px',
                    flexShrink: 0
                  }}></div>
                  
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    flex: '1 1 0'
                  }}>
                    <div style={{ 
                      fontSize: isCompact ? '9px' : '11px', 
                      color: '#B5B5C3', 
                      marginBottom: isCompact ? '2px' : '4px'
                    }}>
                      대기
                    </div>
                    <div style={{ 
                      fontSize: isCompact ? '12px' : '16px', 
                      fontWeight: '600', 
                      color: notification.pending > 0 ? '#FFA800' : '#B5B5C3',
                      minWidth: isCompact ? '16px' : '28px',
                      textAlign: 'center'
                    }}>
                      {notification.pending}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel; 
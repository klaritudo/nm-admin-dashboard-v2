import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.connectionPromise = null;
    this.isConnecting = false;
    this.connectionCount = 0; // 연결 시도 카운터
  }

  // Socket.IO 연결 초기화 (중복 연결 방지)
  connect() {
    // 이미 연결되어 있으면 기존 소켓 반환
    if (this.socket && this.isConnected) {
      console.log('기존 Socket 연결 재사용:', this.socket.id);
      return Promise.resolve(this.socket);
    }

    // 연결 시도 중이면 기존 Promise 반환
    if (this.isConnecting && this.connectionPromise) {
      console.log('Socket 연결 시도 중, 기존 Promise 반환');
      return this.connectionPromise;
    }

    // 기존 소켓이 있지만 연결되지 않은 경우 정리
    if (this.socket && !this.isConnected) {
      console.log('기존 Socket 정리 중...');
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = true;
    this.connectionCount++;
    
    console.log(`Socket 연결 시도 #${this.connectionCount}`);
    
    this.connectionPromise = new Promise((resolve, reject) => {
      this.socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        forceNew: false,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 3, // 재연결 시도 횟수 감소
        reconnectionDelay: 2000,
        reconnectionDelayMax: 5000
      });

      const connectTimeout = setTimeout(() => {
        console.warn('Socket 연결 타임아웃');
        this.isConnecting = false;
        reject(new Error('Socket 연결 타임아웃'));
      }, 15000);

      this.socket.on('connect', () => {
        clearTimeout(connectTimeout);
        console.log('✅ Socket.IO 연결 성공:', this.socket.id);
        this.isConnected = true;
        this.isConnecting = false;
        this.emitToListeners('connect');
        resolve(this.socket);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO 연결 해제:', reason);
        this.isConnected = false;
        this.isConnecting = false;
        this.emitToListeners('disconnect', reason);
      });

      this.socket.on('connect_error', (error) => {
        clearTimeout(connectTimeout);
        console.error('❌ Socket.IO 연결 오류:', error.message);
        this.isConnected = false;
        this.isConnecting = false;
        this.emitToListeners('connect_error', error);
        reject(error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket.IO 재연결 성공:', attemptNumber);
        this.isConnected = true;
        this.emitToListeners('reconnect', attemptNumber);
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('❌ Socket.IO 재연결 오류:', error.message);
        this.emitToListeners('reconnect_error', error);
      });
    });

    return this.connectionPromise;
  }

  // 특정 룸에 참가
  joinRoom(roomName) {
    if (this.socket && this.isConnected) {
      this.socket.emit(`join-${roomName}`);
      // console.log(`${roomName} 룸에 참가했습니다.`);
    }
  }

  // 특정 룸에서 나가기
  leaveRoom(roomName) {
    if (this.socket && this.isConnected) {
      this.socket.emit(`leave-${roomName}`);
      // console.log(`${roomName} 룸에서 나갔습니다.`);
    }
  }

  // 이벤트 발송
  emit(eventName, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
      // console.log(`이벤트 발송: ${eventName}`, data);
    } else {
      console.warn(`Socket이 연결되지 않아 이벤트를 발송할 수 없습니다: ${eventName}`);
    }
  }

  // 이벤트 리스너 등록
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
      
      // 리스너 추적을 위해 저장
      if (!this.listeners.has(eventName)) {
        this.listeners.set(eventName, []);
      }
      this.listeners.get(eventName).push(callback);
    }
  }

  // 이벤트 리스너 제거
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
      
      // 리스너 추적에서 제거
      if (this.listeners.has(eventName)) {
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  // 모든 이벤트 리스너 제거
  removeAllListeners(eventName) {
    if (this.socket) {
      this.socket.removeAllListeners(eventName);
      this.listeners.delete(eventName);
    }
  }

  // 연결 해제
  disconnect() {
    if (this.socket) {
      // 모든 리스너 제거
      this.listeners.forEach((callbacks, eventName) => {
        this.socket.removeAllListeners(eventName);
      });
      this.listeners.clear();
      
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isConnecting = false;
      this.connectionPromise = null;
      console.log('Socket.IO 연결이 해제되었습니다.');
    }
  }

  // 연결 상태 확인
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isConnecting: this.isConnecting,
      socketId: this.socket?.id || null
    };
  }

  // 등록된 리스너들에게 이벤트 전달
  emitToListeners(eventName, data) {
    if (this.listeners.has(eventName)) {
      const callbacks = this.listeners.get(eventName);
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`리스너 호출 중 오류 (${eventName}):`, error);
        }
      });
    }
  }
}

// 싱글톤 인스턴스 생성
const socketService = new SocketService();

export default socketService;
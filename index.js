/*eslint-disable*/

// 페이지 로드 시 실행되는 함수
function start() {
  // 기본 메시지 표시
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.innerHTML = '<p style="padding: 20px; text-align: center;">RealGrid 관련 코드가 제거되었습니다.</p>';
  }
}

// 버튼 클릭 이벤트 - 기능 제거됨
function btnVindex() {
  alert('이 기능은 더 이상 사용할 수 없습니다.');
}

function btnHeaderText() {
  alert('이 기능은 더 이상 사용할 수 없습니다.');
}

function btnDirection() {
  alert('이 기능은 더 이상 사용할 수 없습니다.');
}

function btnVindex1() {
  alert('이 기능은 더 이상 사용할 수 없습니다.');
}

// 페이지 로드 시 start 함수 실행
window.onload = start;
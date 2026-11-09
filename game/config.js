// EIGHT 성수 게임센터 공통 설정
// room: 이 매장 전용 채널 이름. 다른 매장/테스트와 섞이지 않게 고유한 값이면 됩니다.
// broker: 폰과 TV를 이어 주는 인터넷 중계 서버(MQTT). 무료 공개 서버를 쓰고 있어요.
window.EIGHT = {
  room: 'eightss-b3e0dd33aa',
  broker: 'wss://broker.emqx.io:8084/mqtt',
  // GitHub 등에 올린 뒤 컨트롤러 주소를 고정하고 싶으면 입력 (비우면 자동)
  playUrl: '',
};

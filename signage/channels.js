// 디지털 사이니지 채널 목록 — 마케팅 대시보드에서 자동 저장
// 채널마다 재생 목록 파일이 따로 있고, TV 링크 끝의 ?playlist= 로 어느 채널을 틀지 정해요.
window.SIGNAGE_CHANNELS = {
  "base": "",
  "list": [
    {
      "id": "main",
      "name": "기본 채널",
      "file": "playlist.js"
    },
    {
      "id": "kp886sc",
      "name": "2층",
      "file": "playlist-2.js"
    }
  ]
};

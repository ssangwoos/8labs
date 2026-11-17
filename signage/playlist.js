// 재생 목록 — 위에서부터 순서대로 반복 재생합니다.
// type: "image" 또는 "video" / src: 파일 경로 / duration: 표시 시간(초)
// 영상은 duration을 영상 실제 길이와 똑같이 적어 주세요.
// "fit": "cover" 를 넣으면 여백 없이 화면을 꽉 채웁니다.
window.PLAYLIST = {
  items: [
    { type: "image", src: "media/sample1.jpg",       duration: 6 },
    { type: "video", src: "media/sample-video.mp4",  duration: 10 },
    { type: "image", src: "media/sample2.jpg",       duration: 6 }
  ]
};

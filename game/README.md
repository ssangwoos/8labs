# EIGHT 성수 게임센터

서버 없이 HTML만으로 동작합니다. 폰과 TV는 인터넷 중계(MQTT)로 연결되므로
**GitHub Pages에 올리면 손님 폰은 LTE든 와이파이든 상관없이** QR만 찍으면 됩니다.

## 구조
- `public/` ← **GitHub에 이 폴더 내용만 올리면 됩니다**
  - `index.html` 게임 대시보드
  - `claw/tv.html` TV 화면 (게임 진행·확률·재고·당첨기록을 TV가 직접 관리)
  - `claw/play.html` 손님 폰 조이스틱
  - `claw/admin.html` 관리자 (어느 기기에서든 열 수 있음, 처음 PIN 8888)
  - `config.js` 매장 채널 이름(room)·중계 서버 주소
- `server.js`, `게임서버_시작.bat` ← 로컬 테스트용 (GitHub에 올리면 필요 없음)

## 지금 로컬에서 테스트
1. `게임서버_시작.bat` 실행 → 대시보드 열림
2. TV 화면 열기 → QR
3. 로컬 테스트 동안은 폰이 페이지를 PC에서 받아와야 해서 **같은 와이파이**가 필요합니다
   (GitHub에 올리면 이 제한이 없어집니다)

## GitHub Pages에 올릴 때
1. GitHub에 새 저장소 생성 → `public` 폴더 안의 파일들을 그대로 업로드
2. Settings → Pages → Branch: main / (root) → Save
3. `https://아이디.github.io/저장소/` 가 대시보드, TV는 `.../claw/tv.html`

## 참고
- 중계 서버는 무료 공개 서버(EMQX)를 씁니다. 정식 운영 때는 전용 중계(무료 플랜 있음)나 Firebase로 바꾸는 걸 권장 — `lib/net.js`만 교체하면 됩니다.
- 당첨 기록·플레이 횟수는 TV 브라우저에 저장되고, 관리자 화면에는 중계로 동기화됩니다.

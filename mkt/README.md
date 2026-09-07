# 8labs.kr/mkt/ — 메인페이지 · 문의 게시판

## 파일별 역할과 GitHub 업로드 여부

| 파일 | 서버에 필요 | GitHub | 설명 |
|---|:--:|:--:|---|
| `index.html` | ✅ | ✅ | 페이지 전체. 이미지 · 지도 내장, 키 없음 |
| `firebase-config.js` | ✅ | ❌ | 실제 Firebase 키. `.gitignore` 로 제외됨 |
| `firebase-config.example.js` | — | ✅ | 키 없는 샘플 |
| `firestore.rules` | — | ✅ | 보안 규칙 원본 |
| `firebase.json` | — | ✅ | 규칙 배포 설정 |
| `.firebaserc` | — | ✅ | 프로젝트 지정 |
| `.gitignore` | — | ✅ | 키 파일 제외 규칙 |
| `README.md` | — | ✅ | 이 문서 |
| `.github/workflows/pages.yml` | — | ✅ | Pages 자동 배포 (저장소 루트) |

**웹서버에 올릴 건 `index.html` 과 `firebase-config.js` 두 개뿐입니다.**
나머지는 소스 관리용이라 서버에 없어도 페이지는 정상 동작합니다.

`git add .` 만 하면 `.gitignore` 가 `firebase-config.js` 를 알아서 빼줍니다.
커밋 전에 `git status` 에 `firebase-config.js` 가 안 보이는지만 확인해주세요.

### GitHub Pages 로 배포하는 경우

Pages 는 **저장소에 있는 파일만** 서비스합니다. `firebase-config.js` 를 커밋에서 뺐으므로
그대로 두면 사이트에 그 파일이 없어 게시판이 뜨지 않습니다.
그래서 `.github/workflows/pages.yml` 이 **배포 직전에 GitHub Secret 에서 파일을 만들어 넣습니다.**
키는 저장소 히스토리에 남지 않고, 서비스되는 사이트에만 들어갑니다.

최초 1회 설정 (README 안쪽 워크플로 파일 주석에도 같은 내용이 있습니다)

1. 저장소 **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `FIREBASE_CONFIG_JS`
   - Secret: 로컬 `firebase-config.js` 내용을 **통째로** 붙여넣기
2. 저장소 **Settings → Pages → Source** 를 `Deploy from a branch` → **`GitHub Actions`** 로 변경
3. **Settings → Pages → Custom domain** 에 `8labs.kr` 이 그대로 있는지 확인
   저장소 루트의 `CNAME` 파일도 지우지 마세요 (워크플로가 통째로 배포하므로 함께 올라갑니다)

이후에는 `git push` 만 하면 Actions 가 config 를 주입해 자동 배포합니다.
워크플로 파일 상단의 `CONFIG_DEST` 는 `mkt/firebase-config.js` 로 잡혀 있습니다.
저장소 안에서 `index.html` 이 다른 폴더에 있다면 그 경로로 바꿔주세요.

> **참고 — 그냥 커밋해도 되는 이유**
> `apiKey` 는 원래 공개되는 값입니다 (아래 5번 참고). 위 방식이 번거로우면
> `.gitignore` 에서 `firebase-config.js` 를 빼고 그냥 커밋해도 보안상 손해는 없습니다.
> 실제 방어선은 Firestore 규칙과 승인된 도메인이기 때문입니다.

---

## 1. Firestore 규칙 적용 — 두 가지 방법

규칙을 적용하지 않으면 **비공개가 아닙니다.** 반드시 한 번은 해야 합니다.

### 방법 A — 명령어 한 줄 (권장, 이후 수정도 자동)

Node.js 가 설치돼 있으면 이게 편합니다. PowerShell 에서:

```powershell
cd "C:\Users\ssang\OneDrive\Desktop\에이트랩스\홈페이지\mkt"

npx firebase-tools login          # 최초 1회만. 브라우저에서 구글 로그인
npx firebase-tools deploy --only firestore:rules
```

`firebase.json` 과 `.firebaserc` 가 이미 있으므로 추가 설정은 없습니다.
앞으로 규칙을 바꿀 일이 생기면 `firestore.rules` 파일만 갱신하고
위 `deploy` 한 줄만 다시 실행하면 됩니다. 복붙할 일이 없습니다.

### 방법 B — 콘솔에 붙여넣기

Node.js 가 없거나 한 번만 하고 말 거라면 이쪽이 빠릅니다.

1. [Firestore 규칙 페이지](https://console.firebase.google.com/project/promptmarket-c3c3a/firestore/rules)
2. `firestore.rules` 내용을 전부 복사해 붙여넣기
3. **게시**

## 2. Firestore 준비 (한 번만)

프로젝트: `promptmarket-c3c3a`

1. 콘솔 → **Firestore Database** → 데이터베이스 만들기 → **프로덕션 모드**
   (규칙을 위에서 따로 넣으므로 시작 모드는 프로덕션으로)
2. 위 1번 방법으로 규칙 적용
3. **Authentication → Settings → 승인된 도메인** 에 `8labs.kr` 추가
   여기 없는 도메인에서는 이 키로 요청이 나가지 않습니다

## 3. 데이터 구조

```
board/{postId}                 createdAt · status · secret     ← 공개. 내용 없음
board/{postId}/private/detail  company · name · email
                               phone · message · agree         ← 공개 읽기 차단
```

게시판 목록은 위쪽 `board` 문서만 읽습니다. 거기엔 **접수 여부와 날짜밖에** 없어서
목록이 공개돼도 문의 내용은 노출되지 않습니다.
Firestore 는 필드 단위 읽기 제어가 없기 때문에, 문서를 아예 둘로 나눈 구조입니다.
하위 컬렉션은 상위 문서의 규칙을 물려받지 않아서 이 분리가 유효합니다.

## 4. 문의 확인하는 법

콘솔 → Firestore Database → `board` → 문서 선택 → `private` → `detail`

답변이 끝난 건은 상위 `board` 문서의 `status` 를 `received` → `answered` 로 바꾸면
게시판에 **답변 완료** 로 표시됩니다.

> 콘솔 로그인 계정은 규칙을 우회하므로 그대로 열람됩니다.
> 나중에 관리자 페이지를 붙일 경우, 규칙의 `isAdmin()` 이 `request.auth != null` 이라
> Firebase Auth 로그인만 연결하면 읽을 수 있습니다.

## 5. apiKey 에 대해 — 오해하기 쉬운 부분

`firebase-config.js` 의 `apiKey` 는 **비밀번호가 아닙니다.**
브라우저가 읽어야 동작하므로 사이트 접속자는 개발자도구로 볼 수 있습니다.
GitHub 에 올리지 않는 건 위생 차원이고, 실제 보안은 다음 둘이 담당합니다.

1. **Firestore 규칙** — 문의 내용은 로그인 없이 읽을 수 없습니다
2. **승인된 도메인** — 다른 사이트에 키를 복사해도 요청이 거부됩니다

반대로 **서비스 계정 JSON** 은 진짜 비밀키입니다. 절대 이 폴더에 두지 마세요.

## 6. 문구를 고칠 때

`index.html` 은 이미지가 base64 로 들어있어 파일이 큽니다.
텍스트만 고칠 때는 편집기에서 해당 문장을 찾아 바꾸면 됩니다.
레이아웃이나 이미지를 바꿔야 하면 원본에서 다시 빌드하는 게 안전합니다.

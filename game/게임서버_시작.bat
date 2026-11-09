@echo off
chcp 65001 >nul
title EIGHT 성수 게임 서버
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js가 설치되어 있지 않습니다.
  echo  https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행해 주세요.
  echo.
  start https://nodejs.org/ko
  pause
  exit /b
)
netsh advfirewall firewall show rule name="EIGHT Game 8080" >nul 2>&1
if errorlevel 1 (
  echo  폰 접속을 위해 방화벽을 엽니다. 관리자 권한 창에서 [예]를 눌러 주세요.
  call "%~dp0방화벽_열기.bat"
)
start "" http://localhost:8080/
node server.js
pause

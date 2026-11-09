@echo off
chcp 65001 >nul
net session >nul 2>&1
if errorlevel 1 (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)
netsh advfirewall firewall delete rule name="EIGHT Game 8080" >nul 2>&1
netsh advfirewall firewall add rule name="EIGHT Game 8080" dir=in action=allow protocol=TCP localport=8080 profile=any
echo.
echo  방화벽에 8080 포트를 열었습니다. 이제 폰에서 QR을 다시 찍어 보세요.
echo.
pause

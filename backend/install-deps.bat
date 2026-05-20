@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo BeautyBook - bagimlilik kurulumu
echo.

set NODE_OPTIONS=--use-system-ca

echo [1/3] npmjs.org (resmi)...
call npm install
if %ERRORLEVEL% EQU 0 goto ok

echo.
echo [2/3] Ayna: registry.npmmirror.com (403 / ag engeli icin)...
call npm install --registry https://registry.npmmirror.com
if %ERRORLEVEL% EQU 0 goto ok

echo.
echo [3/3] Tekrar resmi registry...
call npm install --registry https://registry.npmjs.org/
if %ERRORLEVEL% EQU 0 goto ok

goto fail

:ok
echo.
echo Kurulum tamamlandi.
echo Sunucu: npm run dev
goto end

:fail
echo.
echo Kurulum basarisiz. Deneyin:
echo   1) Telefon hotspot ile internet
echo   2) Antivirus / VPN kapat
echo   3) npm config get registry   (https://registry.npmjs.org/ olmali)
echo   4) Node 22 LTS: https://nodejs.org
pause
exit /b 1

:end
pause

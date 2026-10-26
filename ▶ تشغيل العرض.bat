@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set "PORT=5173"
set "URL=http://localhost:%PORT%/s/arood-basics-safiya"
if "%~1"==":openbrowser" goto :openbrowser
title أساسيات في علم العروض - تشغيل العرض

echo.
echo  ==================================================
echo     أساسيات في علم العروض  -  أ. صفية الحارثية
echo  ==================================================
echo.

rem --- هل العرض يعمل مسبقا؟ افتحه فقط ---
curl.exe -s -o nul http://localhost:%PORT%/ >nul 2>nul
if not errorlevel 1 goto :already

rem --- التحقق من وجود Node.js ---
where node >nul 2>nul
if errorlevel 1 if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if not errorlevel 1 goto :have_node

echo  [!] برنامج Node.js غير مثبت على هذا الجهاز.
where winget >nul 2>nul
if errorlevel 1 goto :manual_node
echo  [1/3] جار تثبيت Node.js تلقائيا - يحتاج إنترنت وقد يطلب موافقتك...
echo.
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
set "PATH=%ProgramFiles%\nodejs;%PATH%"
where node >nul 2>nul
if not errorlevel 1 goto :have_node

:manual_node
echo.
echo  [x] تعذر التثبيت التلقائي.
echo      سيفتح الآن موقع Node.js: نزلي نسخة LTS وثبتيها،
echo      ثم شغلي هذا الملف مرة أخرى.
start "" https://nodejs.org/ar/download
echo.
pause
exit /b 1

:have_node
if exist "node_modules\@open-slide\core\package.json" goto :run
echo  [2/3] أول تشغيل على هذا الجهاز: جار تنزيل ملفات العرض...
echo        قد يستغرق ذلك بضع دقائق، لا تغلقي النافذة.
echo.
call npm install
if errorlevel 1 goto :install_failed

:run
echo.
echo  [3/3] جار تشغيل العرض... سيفتح المتصفح تلقائيا.
echo.
echo  رابط العرض:  %URL%
echo  لإيقاف العرض: أغلقي هذه النافذة.
echo.
start "" /min "%~f0" :openbrowser
call npm run dev
pause
exit /b

:already
echo  العرض يعمل مسبقا، جار فتحه في المتصفح...
start "" "%URL%"
timeout /t 3 /nobreak >nul
exit /b

:install_failed
echo.
echo  [x] فشل تنزيل الملفات. تأكدي من الاتصال بالإنترنت ثم أعيدي المحاولة.
pause
exit /b 1

:openbrowser
for /l %%i in (1,1,120) do (
  curl.exe -s -o nul http://localhost:%PORT%/ >nul 2>nul && (start "" "%URL%" & exit)
  timeout /t 1 /nobreak >nul
)
exit

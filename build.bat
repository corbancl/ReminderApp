@echo off
echo ========================================
echo 智能提醒应用 - 快速打包工具
echo ========================================
echo.

echo 请选择要打包的平台:
echo [1] Android APK (推荐用于测试和分发)
echo [2] Android AAB (用于Google Play发布)
echo [3] iOS IPA (需要在macOS上运行)
echo.
set /p choice="请输入选项 (1-3): "

if "%choice%"=="1" goto android_apk
if "%choice%"=="2" goto android_aab
if "%choice%"=="3" goto ios_ipa

echo 无效的选项!
goto end

:android_apk
echo.
echo ========================================
echo 构建 Android APK
echo ========================================
echo.
cd android
call build-apk.bat
cd ..
goto end

:android_aab
echo.
echo ========================================
echo 构建 Android AAB (用于 Google Play)
echo ========================================
echo.
cd android

REM 清理
call gradlew clean

REM 构建 AAB
call gradlew bundleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo AAB build completed successfully!
    echo ========================================
    echo.
    echo AAB location: android\app\build\outputs\bundle\release\app-release.aab
    echo.
) else (
    echo.
    echo AAB build failed!
)

cd ..
goto end

:ios_ipa
echo.
echo ========================================
echo 构建 iOS IPA
echo ========================================
echo.
echo 注意: iOS打包需要在 macOS 上运行
echo.
if not exist "ios/build-ipa.sh" (
    echo Error: build-ipa.sh not found in ios directory
    goto end
)

cd ios
bash build-ipa.sh
cd ..
goto end

:end
echo.
echo ========================================
echo 打包完成!
echo ========================================
echo.
echo 查看详细文档: BUILD.md
echo.
pause

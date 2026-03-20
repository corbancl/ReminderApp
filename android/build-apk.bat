@echo off
echo Building Android APK...
echo.

cd android

REM 检查keystore是否存在
if not exist "app\debug.keystore" (
    echo Generating debug keystore...
    call "app\generate-keystore.bat"
    echo.
)

REM 清理之前的构建
echo Cleaning previous build...
call gradlew clean
echo.

REM 构建 Release APK
echo Building Release APK...
call gradlew assembleRelease

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo APK build completed successfully!
    echo ========================================
    echo.
    echo APK location: android\app\build\outputs\apk\release\app-release.apk
    echo.

    REM 检查文件是否存在
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo File size:
        dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
        echo.
        echo You can now install the APK on your device using:
        echo adb install app\build\outputs\apk\release\app-release.apk
    )
) else (
    echo.
    echo ========================================
    echo APK build failed!
    echo ========================================
    echo.
    echo Please check the error messages above.
)

cd ..
pause

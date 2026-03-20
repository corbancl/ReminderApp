@echo off
echo Generating debug keystore...

REM 尝试使用Android Studio自带的keytool
if exist "%LOCALAPPDATA%\Android\Sdk\build-tools\34.0.0\lib\apksigner.jar" (
    set "KEYTOOL=%LOCALAPPDATA%\Android\Sdk\build-tools\34.0.0\..\..\jre\bin\keytool.exe"
)

if exist "%LOCALAPPDATA%\Android\Sdk\jre\bin\keytool.exe" (
    set "KEYTOOL=%LOCALAPPDATA%\Android\Sdk\jre\bin\keytool.exe"
)

REM 如果还是找不到,尝试使用JAVA_HOME
if not defined KEYTOOL (
    if defined JAVA_HOME (
        set "KEYTOOL=%JAVA_HOME%\bin\keytool.exe"
    )
)

REM 如果还是找不到,直接在PATH中查找
if not defined KEYTOOL (
    set "KEYTOOL=keytool.exe"
)

"%KEYTOOL%" -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"

if %ERRORLEVEL% EQU 0 (
    echo Keystore generated successfully!
) else (
    echo Failed to generate keystore. Please ensure Java JDK is installed and keytool is in your PATH.
    echo Or manually generate keystore with:
    echo keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
)

pause

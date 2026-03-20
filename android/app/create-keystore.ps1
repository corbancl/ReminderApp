# PowerShell脚本: 创建debug keystore

$ErrorActionPreference = "Continue"

Write-Host "Generating debug keystore..." -ForegroundColor Yellow

# 尝试找到keytool
$keytoolPath = $null

# 方法1: JAVA_HOME
if ($env:JAVA_HOME) {
    $potentialPath = Join-Path $env:JAVA_HOME "bin\keytool.exe"
    if (Test-Path $potentialPath) {
        $keytoolPath = $potentialPath
    }
}

# 方法2: Android SDK
if (-not $keytoolPath) {
    $androidSdkPath = $env:LOCALAPPDATA + "\Android\Sdk"
    if (Test-Path $androidSdkPath) {
        $keytoolPath = Get-ChildItem $androidSdkPath -Filter "keytool.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    }
}

# 方法3: PATH
if (-not $keytoolPath) {
    try {
        $keytoolPath = Get-Command keytool.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
    } catch {
        # 忽略错误
    }
}

if (-not $keytoolPath) {
    Write-Host "Error: keytool.exe not found!" -ForegroundColor Red
    Write-Host "Please ensure Java JDK is installed and JAVA_HOME is set." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found keytool at: $keytoolPath" -ForegroundColor Green

# 生成keystore
& $keytoolPath -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US" 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Keystore generated successfully!" -ForegroundColor Green

    if (Test-Path "debug.keystore") {
        $size = (Get-Item "debug.keystore").Length / 1KB
        Write-Host "File size: $([math]::Round($size, 2)) KB" -ForegroundColor Cyan
    }
} else {
    Write-Host "Failed to generate keystore!" -ForegroundColor Red
    Write-Host "Error code: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

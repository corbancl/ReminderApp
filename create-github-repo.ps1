# Create GitHub Repository Script (Interactive)
# Run this script, it will prompt for your token

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GitHub Repository Creator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will:"
Write-Host "  1. Create a GitHub repository"
Write-Host "  2. Push your code to GitHub"
Write-Host "  3. Trigger automatic APK build"
Write-Host ""

# Get token from user
$token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$username = "corbancl"
$repoName = "ReminderApp"

Write-Host ""
Write-Host "[1/3] Creating repository..." -ForegroundColor Yellow

$headers = @{
    "Authorization" = "token $tokenPlain"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = $repoName
    description = "Smart Reminder App - Lunar calendar and periodic reminders"
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "    Repository created!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "[2/3] Configuring Git..." -ForegroundColor Yellow
    
    Set-Location "c:\Users\Administrator\WorkBuddy\20260320143335\ReminderApp"
    
    git remote add origin "https://$username`:$tokenPlain@github.com/$username/$repoName.git"
    git branch -M main
    
    Write-Host "    Git configured!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "[3/3] Pushing code..." -ForegroundColor Yellow
    
    $pushOutput = git push -u origin main 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    Code pushed!" -ForegroundColor Green
    } else {
        throw $pushOutput
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
    Write-Host "Actions:    https://github.com/$username/$repoName/actions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "  1. Visit the Actions page above" -ForegroundColor White
    Write-Host "  2. Wait for the build to complete (10-15 minutes)" -ForegroundColor White
    Write-Host "  3. Download the APK from the build artifacts" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERROR" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "The repository 'ReminderApp' already exists." -ForegroundColor Yellow
        Write-Host "Please delete it first or use a different name." -ForegroundColor Yellow
    }
    
} finally {
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    $tokenPlain = $null
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Trigger Debug Build Workflow
# This script manually triggers the debug build workflow

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "Triggering Debug Build Workflow" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Get token from user
$token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$username = "corbancl"
$repoName = "ReminderApp"
$workflowId = "build-debug-apk.yml"

Write-Host "Triggering workflow..." -ForegroundColor Yellow

# Create trigger request
$body = @{
    ref = "main"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/repos/$username/$repoName/actions/workflows/$workflowId/dispatches" `
        -Method POST `
        -Headers @{
            "Authorization" = "token $tokenPlain"
            "Accept" = "application/vnd.github.v3+json"
        } `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host "✅ Workflow triggered successfully!" -ForegroundColor Green
    Write-Host "==============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "View progress: https://github.com/$username/$repoName/actions" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The debug build should start in a few seconds..." -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "==============================================" -ForegroundColor Red
    Write-Host "❌ Failed to trigger workflow!" -ForegroundColor Red
    Write-Host "==============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

finally {
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    $tokenPlain = $null
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

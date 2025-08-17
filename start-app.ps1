Write-Host "Starting Phoolse Fayda App..." -ForegroundColor Green
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

Write-Host "Waiting 5 seconds for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# PowerShell script to set up and start the Phoolse Fayda backend
# Run this script in your backend directory

Write-Host "Setting up Phoolse Fayda Backend..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    
    # Copy template to .env
    if (Test-Path "env.template") {
        Copy-Item "env.template" ".env"
        Write-Host "✅ .env file created from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env file with your actual values before starting the server" -ForegroundColor Yellow
    } else {
        Write-Host "❌ env.template not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check MongoDB connection
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host "Make sure MongoDB is running on your system or update MONGODB_URI in .env file" -ForegroundColor Cyan

# Start the server
Write-Host "Starting the backend server..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:4000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

npm run dev

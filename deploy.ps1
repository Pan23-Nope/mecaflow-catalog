param (
    [string]$Message = "Auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "[*] Starting deployment..." -ForegroundColor Cyan

# Check for changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "[OK] No changes to deploy." -ForegroundColor Yellow
    exit
}

Write-Host "[BOX] Staging changes..."
git add .

Write-Host "[DISK] Committing changes with message: '$Message'..."
git commit -m "$Message"

Write-Host "[UP] Pushing to GitHub..."
git push origin main

Write-Host "[DONE] Deployment complete! GitHub Pages will update shortly." -ForegroundColor Green

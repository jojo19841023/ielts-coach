#!/usr/bin/env bash
set -euo pipefail

cd "/Users/jojo/Documents/Codex/2026-05-08/daily-work-dashboard/雅思教练"

echo "Running verification..."
node --check app.js
node scripts/daily_health_check.js >/tmp/ielts-coach-daily-health-check.log

echo "Staging today's work..."
git add \
  README.md \
  app.js \
  docs/DAILY_CHECKLIST.md \
  scripts/daily_health_check.js \
  .automation-reports

echo "Committing..."
git commit -m "Improve IELTS Coach feedback and automation checks"

echo "Pushing to origin..."
git push origin "$(git branch --show-current)"

echo "Done."

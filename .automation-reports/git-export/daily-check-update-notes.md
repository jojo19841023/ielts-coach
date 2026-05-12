# Commit message

Update daily IELTS Coach health checks

# Summary

- Expanded daily health check automation to cover today's new regression risks.
- Added checks for writing completion gate, reading evidence hints, dashboard module coverage, phonetics no-recording fallback, weekly/monthly module history, and inline sync errors.
- Updated the manual daily checklist to match the stricter automated checks.

# Verification

- node --check scripts/daily_health_check.js
- node scripts/daily_health_check.js

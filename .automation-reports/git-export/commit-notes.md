# Commit message

Improve IELTS Coach feedback and automation checks

# Summary

- Added sandbox-safe daily health check automation and local reports.
- Improved writing completion, prompt-fit checks, rubric feedback, and conservative rewrite logic.
- Added reading evidence hints and inline sync status errors.
- Added module-level activity logging and wired weekly/monthly/dashboard history insights.
- Added phonetics fallback completion for no-recording flows.

# Verification

- node --check app.js
- node scripts/daily_health_check.js

# Push blocker

Current Codex sandbox can write project files but cannot write .git/index.lock, so git add/commit/push cannot run in this session.

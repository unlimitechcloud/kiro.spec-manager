# Initial Configuration Setup

## Overview

Before using the Spec Manager Power, verify that `.kiro/spec-manager.json` exists. If missing or invalid, guide the user through interactive setup to establish tracking system preferences.

## Configuration Detection

**Check for config file:**
```bash
if [ -f .kiro/spec-manager.json ]; then
  # Validate JSON structure
  # Check required fields: trackingSystem, lastUpdated
  # If valid: proceed with operation
  # If invalid: start setup wizard
else
  # Start setup wizard
fi
```

**Validation rules:**
- File must be valid JSON
- Must contain `trackingSystem` field ("github", "jira", or "none")
- Must contain `lastUpdated` field (ISO 8601 format)
- If `trackingSystem` is "github": must have `githubRepository`
- If `trackingSystem` is "jira": must have `jiraBaseUrl` and `jiraProject`
- If `usePrefix` is true: must have `projectPrefix`

## Interactive Setup Workflow

### Step 1: Select Tracking System

**Prompt:** "Which tracking system do you use?"

**Options:**
1. GitHub
2. Jira  
3. None (manual tracking)

### Step 2: System-Specific Configuration

**If GitHub selected:**
- Prompt: "GitHub repository URL (e.g., https://github.com/owner/repo):"
- Validate: Must match `https://{domain}/{owner}/{repo}`
- Reject if contains `/issues/` or issue numbers
- Example valid: `https://github.com/unlimitechcloud/kiro.spec-manager`
- Example invalid: `https://github.com/owner/repo/issues/1`

**If Jira selected:**
- Prompt 1: "Jira base URL (e.g., https://company.atlassian.net):"
  - Validate: Must match `https://{domain}`
  - Reject if contains `/browse/` or issue keys
  - Example valid: `https://company.atlassian.net`
  - Example invalid: `https://company.atlassian.net/browse/PROJECT-1`

- Prompt 2: "Jira project key (e.g., PROJECT):"
  - Validate: Uppercase letters and numbers only, must start with letter
  - Pattern: `^[A-Z][A-Z0-9]*$`
  - Example valid: `PROJECT`, `FEAT`, `BUG123`
  - Example invalid: `project`, `PROJECT-`, `123`

**If None selected:**
- Skip to prefix configuration

### Step 3: Prefix Configuration

**Prompt:** "Enable prefix-aware input? (Allows typing '7' instead of 'GITHUB-7')"

**Default suggestions:**
- GitHub: Suggest "yes" with prefix "GITHUB-"
- Jira: Suggest "yes" with prefix "{PROJECT_KEY}-"
- None: Suggest "no"

**If enabled, prompt for prefix:**
- Prompt: "Project prefix (e.g., GITHUB-, PROJECT-):"
- Show default based on tracking system
- Validate: Must end with `-` or `_`
- Validate: Only alphanumeric characters and separators
- Pattern: `^[A-Za-z0-9]+[-_]$`
- Example valid: `GITHUB-`, `PROJECT-`, `FEAT_`
- Example invalid: `GITHUB`, `PROJECT_-`, `PRO@ECT-`

### Step 4: Configuration Summary

**Display summary:**
```
Configuration Summary:
- Tracking System: {trackingSystem}
- Repository/Base URL: {url}
- Project Key: {key} (if Jira)
- Prefix Mode: {enabled/disabled}
- Project Prefix: {prefix} (if enabled)

Is this correct? (y/n/edit)
```

**Actions:**
- `y`: Create configuration file
- `n`: Cancel setup
- `edit`: Allow editing specific fields

### Step 5: Create Configuration File

**Ensure `.kiro/` directory exists:**
```bash
mkdir -p .kiro
```

**Write configuration:**
```json
{
  "trackingSystem": "{selected}",
  "githubRepository": "{url}",  // if GitHub
  "jiraBaseUrl": "{url}",       // if Jira
  "jiraProject": "{key}",       // if Jira
  "usePrefix": true,            // if enabled
  "projectPrefix": "{prefix}",  // if enabled
  "lastUpdated": "{ISO 8601 timestamp}"
}
```

**Confirm to user:**
```
✅ Configuration saved to .kiro/spec-manager.json
```

## Validation Patterns

**GitHub URL:**
```regex
^https://[^/]+/[^/]+/[^/]+$
```
Must NOT contain: `/issues/`, `/pull/`, `/tree/`, `/blob/`

**Jira Base URL:**
```regex
^https://[^/]+$
```
Must NOT contain: `/browse/`, `/projects/`, `/issues/`

**Jira Project Key:**
```regex
^[A-Z][A-Z0-9]*$
```

**Project Prefix:**
```regex
^[A-Za-z0-9]+[-_]$
```

## Error Handling

**File system errors:**
- Cannot create `.kiro/` directory → Display: "Cannot create .kiro/ directory. Check file permissions."
- Cannot write config file → Display: "Cannot write configuration file. Check file permissions for .kiro/spec-manager.json"

**Validation errors:**
- Invalid URL format → Display specific error with example
- Invalid project key → Display: "Project key must be uppercase letters and numbers only. Examples: PROJECT, FEAT, BUG123"
- Invalid prefix → Display: "Prefix must end with - or _. Examples: GITHUB-, PROJECT-, FEAT_"
- Re-prompt for the invalid field only, preserve other values

**User cancellation:**
- Ctrl+C or explicit cancel → Display: "Setup cancelled. No configuration was saved."
- Exit gracefully without creating files

**Invalid existing config:**
- Backup to `.kiro/spec-manager.json.backup`
- Display: "Found invalid configuration. Starting fresh setup."
- Proceed with setup wizard

## Default Values

| Tracking System | Default Prefix | Default usePrefix |
|----------------|----------------|-------------------|
| GitHub         | `GITHUB-`      | `true`            |
| Jira           | `{PROJECT}-`   | `true`            |
| None           | `FEAT-`        | `false`           |

## Example Configurations

**GitHub:**
```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": true,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**Jira:**
```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "usePrefix": true,
  "projectPrefix": "PROJECT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**None with custom prefix:**
```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

## Reconfiguration

To trigger setup again:
1. Delete `.kiro/spec-manager.json`
2. Run any Spec Manager command
3. Setup wizard will start automatically

Or manually edit `.kiro/spec-manager.json` following the schema in `spec-manager-schema.md`.

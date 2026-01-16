# spec-manager.json Configuration Schema

This document describes the structure and fields of the `spec-manager.json` configuration file that stores tracking system preferences and defaults for the Spec Manager Power.

## Overview

The `spec-manager.json` file is automatically created in `.kiro/spec-manager.json` when you first create a spec with an external tracking system URL (GitHub or Jira). This file stores your preferences so Kiro can:

- Auto-detect which tracking system you're using
- Reconstruct URLs for new specs automatically
- Suggest appropriate identifier formats
- Provide system-specific guidance

## File Location

```
.kiro/spec-manager.json
```

**Important**: If you have multiple `.kiro/` directories in parent paths (e.g., in a monorepo), Kiro uses the config file from the **closest** `.kiro/` directory.

## Schema Structure

```json
{
  "trackingSystem": "string",
  "githubRepository": "string (optional)",
  "jiraBaseUrl": "string (optional)",
  "jiraProject": "string (optional)",
  "usePrefix": "boolean (optional)",
  "projectPrefix": "string (optional)",
  "lastUpdated": "string (ISO 8601 datetime)"
}
```

## Field Descriptions

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `trackingSystem` | string | The tracking system in use: `"github"`, `"jira"`, or `"none"` | `"github"` |
| `lastUpdated` | string | ISO 8601 timestamp of last config update | `"2026-01-16T10:30:00Z"` |

### Optional Fields (System-Specific)

#### For GitHub

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `githubRepository` | string | Base repository URL (without `/issues/{number}`) | `"https://github.com/owner/repo"` |

#### For Jira

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `jiraBaseUrl` | string | Jira instance base URL | `"https://company.atlassian.net"` |
| `jiraProject` | string | Jira project key (uppercase) | `"PROJECT"` |

#### For Prefix-Aware Input

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `usePrefix` | boolean | Whether prefix-aware input mode is enabled | `true` |
| `projectPrefix` | string | The prefix to prepend to numeric identifiers | `"GITHUB-"` |

## Validation Rules

### trackingSystem
- Must be one of: `"github"`, `"jira"`, `"none"`
- Required field

### githubRepository
- Required when `trackingSystem` is `"github"`
- Must be a valid HTTPS URL
- Pattern: `https://{domain}/{owner}/{repo}`
- Examples:
  - ✅ `https://github.com/owner/repo`
  - ✅ `https://github.enterprise.com/owner/repo`
  - ❌ `https://github.com/owner/repo/issues/1` (includes issue number)

### jiraBaseUrl
- Required when `trackingSystem` is `"jira"`
- Must be a valid HTTPS URL
- Pattern: `https://{domain}`
- Examples:
  - ✅ `https://company.atlassian.net`
  - ✅ `https://jira.company.com`
  - ❌ `https://company.atlassian.net/browse/PROJECT-1` (includes issue key)

### jiraProject
- Required when `trackingSystem` is `"jira"`
- Must be uppercase letters and numbers only
- Pattern: `^[A-Z][A-Z0-9]*$`
- Examples:
  - ✅ `PROJECT`
  - ✅ `FEAT`
  - ✅ `BUG123`
  - ❌ `project` (lowercase)
  - ❌ `PROJECT-` (contains hyphen)

### lastUpdated
- Must be ISO 8601 format
- Pattern: `YYYY-MM-DDTHH:MM:SSZ`
- Automatically updated by Kiro

### usePrefix
- Optional boolean field (default: `false`)
- When `true`, enables prefix-aware input mode
- Automatically set to `true` when GitHub or Jira is detected
- Can be manually enabled or disabled

### projectPrefix
- Optional string field
- Required when `usePrefix` is `true`
- Must end with a separator character (`-` or `_`)
- Must contain only alphanumeric characters and separators
- Pattern: `^[A-Za-z0-9]+[-_]$`
- Examples:
  - ✅ `GITHUB-`
  - ✅ `PROJECT-`
  - ✅ `FEAT_`
  - ✅ `BUG-`
  - ❌ `GITHUB` (missing separator)
  - ❌ `PROJECT_-` (multiple separators)
  - ❌ `project-` (lowercase, should be uppercase)
  - ❌ `PRO@ECT-` (invalid character)

## Complete Examples

### GitHub Configuration

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/unlimitechcloud/kiro.spec-manager",
  "usePrefix": true,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**What this enables**:
- Kiro suggests identifiers like `GITHUB-1`, `GITHUB-2`, etc.
- URLs are reconstructed as `https://github.com/unlimitechcloud/kiro.spec-manager/issues/{number}`
- Auto-increment finds the last GitHub issue number and suggests the next one
- **Prefix-aware input**: You can type just `7` instead of `GITHUB-7` when prompted for an identifier

### Jira Configuration

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

**What this enables**:
- Kiro uses Jira keys directly as identifiers: `PROJECT-1`, `PROJECT-2`, etc.
- URLs are reconstructed as `https://company.atlassian.net/browse/{key}`
- Auto-increment finds the last issue for the project and suggests the next one
- **Prefix-aware input**: You can type just `7` instead of `PROJECT-7` when prompted for an identifier

### No Tracking System

```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**What this means**:
- No automatic URL reconstruction
- No system-specific identifier suggestions
- You provide identifiers and URLs manually
- Prefix mode is disabled by default

### Custom Prefix (No Tracking System)

```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

**What this enables**:
- **Prefix-aware input**: You can type just `7` instead of `FEAT-7` when prompted for an identifier
- No URL reconstruction (no tracking system configured)
- Custom identifier format for your project

## How Kiro Uses This File

### Automatic Creation

When you create your first spec with a GitHub or Jira URL, Kiro:

1. Detects the tracking system from the URL pattern
2. Extracts the repository URL or Jira base URL
3. Creates `.kiro/spec-manager.json` with the detected values
4. Asks for your confirmation

### URL Reconstruction

When creating subsequent specs:

```
You: "Create a new spec for feature X"

Kiro: "Identifier (GITHUB-): [Press Enter for GITHUB-6, or type '7' for GITHUB-7]"
You: "7"

Kiro: "Use identifier 'GITHUB-7'? (y/n)"
You: "y"

Kiro: "External URL? (Press Enter to auto-detect)"
You: [Enter]

Kiro: "Detected: https://github.com/owner/repo/issues/7. Correct?"
You: "yes"
```

Kiro reconstructed the URL using:
- `githubRepository` from config: `https://github.com/owner/repo`
- New issue number: `7` (from your numeric input)
- Result: `https://github.com/owner/repo/issues/7`

**Prefix-aware input**: When `usePrefix` is enabled, you can provide just the number (`7`) instead of the full identifier (`GITHUB-7`). Kiro automatically combines it with the configured prefix.

### Identifier Suggestions

Based on `trackingSystem`:

- **GitHub**: Suggests `GITHUB-{number}` format
- **Jira**: Suggests `{PROJECT}-{number}` format
- **None**: Uses your project's existing pattern

### Fallback Behavior

When you don't provide a URL:

1. Kiro checks if `trackingSystem` is configured
2. If yes, uses the config to reconstruct the URL
3. If no, prompts you to provide the URL manually

## Manual Editing

You can manually edit `.kiro/spec-manager.json` if needed:

### Changing Tracking Systems

To switch from GitHub to Jira:

```json
{
  "trackingSystem": "jira",
  "jiraBaseUrl": "https://company.atlassian.net",
  "jiraProject": "PROJECT",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

Remove the `githubRepository` field and add Jira fields.

### Updating Repository URL

If your repository moves:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/new-owner/new-repo",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

### Disabling Tracking System

To stop using external tracking:

```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

### Enabling Prefix Mode

To enable prefix-aware input with a custom prefix:

```json
{
  "trackingSystem": "none",
  "usePrefix": true,
  "projectPrefix": "FEAT-",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

### Disabling Prefix Mode

To disable prefix-aware input while preserving the prefix configuration:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "usePrefix": false,
  "projectPrefix": "GITHUB-",
  "lastUpdated": "2026-01-16T12:00:00Z"
}
```

**Note**: The `projectPrefix` is preserved even when `usePrefix` is `false`, so you can easily re-enable it later.

## Custom Fields

You can add custom fields to the config file. Kiro preserves them when updating:

```json
{
  "trackingSystem": "github",
  "githubRepository": "https://github.com/owner/repo",
  "lastUpdated": "2026-01-16T10:30:00Z",
  "customField": "my custom value",
  "team": "backend"
}
```

When Kiro updates the config, it only modifies the standard fields and preserves `customField` and `team`.

## Error Handling

### Invalid Config File

If the config file is corrupted or invalid:

1. Kiro logs a warning
2. Creates a new config with default values
3. Continues operation normally

**Default config**:
```json
{
  "trackingSystem": "none",
  "lastUpdated": "2026-01-16T10:30:00Z"
}
```

### Missing Config File

If no config file exists:

1. Kiro creates one silently when you first use a tracking system URL
2. No user action required

### Multiple .kiro/ Directories

In a monorepo with multiple `.kiro/` directories:

```
/project-root/
  .kiro/
    spec-manager.json          # Root config
  packages/
    package-a/
      .kiro/
        spec-manager.json      # Package A config (used when in package-a/)
    package-b/
      .kiro/
        spec-manager.json      # Package B config (used when in package-b/)
```

Kiro uses the config from the **closest** `.kiro/` directory to your current location.

## Troubleshooting

### "Config file validation failed"

**Cause**: Invalid field values or missing required fields

**Solution**:
1. Check that `trackingSystem` is one of: `"github"`, `"jira"`, `"none"`
2. Verify GitHub repository URL doesn't include `/issues/`
3. Verify Jira base URL doesn't include `/browse/`
4. Ensure Jira project key is uppercase
5. Delete the file and let Kiro recreate it

### "Cannot reconstruct URL"

**Cause**: Missing repository URL or Jira base URL in config

**Solution**:
1. Check that `githubRepository` or `jiraBaseUrl` is present
2. Verify the URL is valid
3. Manually add the missing field
4. Or provide the URL manually when creating the spec

### "Wrong tracking system detected"

**Cause**: Config has wrong `trackingSystem` value

**Solution**:
1. Manually edit `.kiro/spec-manager.json`
2. Change `trackingSystem` to the correct value
3. Add/remove system-specific fields as needed
4. Update `lastUpdated` timestamp

### "Invalid prefix format"

**Cause**: `projectPrefix` doesn't end with a separator or contains invalid characters

**Solution**:
1. Check that `projectPrefix` ends with `-` or `_`
2. Ensure it contains only alphanumeric characters and separators
3. Examples of valid prefixes: `GITHUB-`, `PROJECT-`, `FEAT_`
4. Examples of invalid prefixes: `GITHUB`, `PROJECT_-`, `PRO@ECT-`

### "Prefix required when usePrefix is true"

**Cause**: `usePrefix` is `true` but `projectPrefix` is missing

**Solution**:
1. Add a `projectPrefix` field with a valid prefix
2. Or set `usePrefix` to `false`
3. Example: `"projectPrefix": "FEAT-"`

## Best Practices

1. **Let Kiro manage it**: Don't manually edit unless necessary
2. **One system per project**: Stick to either GitHub or Jira, not both
3. **Commit to git**: Include `.kiro/spec-manager.json` in version control
4. **Team consistency**: Ensure all team members use the same config
5. **Validate after editing**: If you manually edit, create a test spec to verify it works
6. **Use prefix mode**: Enable `usePrefix` for faster identifier input (type `7` instead of `GITHUB-7`)
7. **Consistent prefix format**: Always use uppercase for prefixes and end with `-` or `_`

## See Also

- **steering/prefix-aware-input.md**: Detailed guide on prefix-aware input mode
- **steering/github-integration.md**: Detailed GitHub workflow
- **steering/jira-integration.md**: Detailed Jira workflow
- **steering/config-management.md**: Advanced config management
- **README.md**: General Spec Manager documentation
